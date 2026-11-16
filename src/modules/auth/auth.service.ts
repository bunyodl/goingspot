import { hash, verify } from 'argon2';
import { SignJWT } from 'jose';
import { createHash, randomBytes } from 'node:crypto';

import { authRepository } from '@/modules/auth/auth.repository';
import type { LoginRequestBody } from '@/modules/auth/schemas/endpoints/login.schema';
import type { LogoutResponse } from '@/modules/auth/schemas/endpoints/logout.schema';
import type { RegisterRequestBody } from '@/modules/auth/schemas/endpoints/register.schema';
import type { AuthTokenPair } from '@/modules/auth/schemas/resources/auth-tokens.schema';
import type { AuthSessionResult } from '@/modules/auth/types/auth-session-result.type';
import {
  USER_ROLES,
  type UserRole,
} from '@/modules/user/constants/user.constants';
import { mapUserRowToDto } from '@/modules/user/helpers/map-user-row';
import type { UserDto } from '@/modules/user/schemas/resources/user.schema';
import { userRepository } from '@/modules/user/user.repository';

import { env } from '@/config/env';

import { ConflictException, UnauthorizedException } from '@/common/exceptions';
import { durationToMs } from '@/common/libs/duration-to-ms';
import { exists } from '@/common/libs/exists';

class AuthService {
  private readonly DUMMY_PASSWORD_HASH =
    '$argon2id$v=19$m=65536,p=4,t=3$aT9vjxBA8VSGbOaX8SXjIA$9Hs3r5zI0ms37URrihyj5NRDDAlRrwRBDbeRPWGrrMw';

  async hash(password: string): Promise<string> {
    return await hash(password);
  }

  async register(body: RegisterRequestBody): Promise<UserDto> {
    const existingUser = await userRepository.getByEmail(body.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hash(body.password);
    const userRow = await userRepository.create(
      {
        ...body,
        role: USER_ROLES.USER,
      },
      hashedPassword,
    );

    return mapUserRowToDto(userRow);
  }

  async login(body: LoginRequestBody): Promise<AuthSessionResult> {
    const user = await userRepository.getByEmailWithPassword(body.email);

    const passwordHash = user?.password_hash ?? this.DUMMY_PASSWORD_HASH;
    const isPasswordValid = await verify(passwordHash, body.password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: mapUserRowToDto(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string | undefined): Promise<AuthTokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const tokenHash = this.hashRefreshToken(refreshToken);
    const row = await authRepository.findByTokenHash(tokenHash);
    const isMissing = !exists(row);
    const isRevoked = exists(row?.revoked_at);
    const isExpired = exists(row) && row.expires_at.getTime() <= Date.now();

    if (isMissing || isRevoked || isExpired) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await userRepository.getById(row.user_id);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await authRepository.revokeByTokenHash(tokenHash);

    return await this.generateTokens(user.id, user.role);
  }

  async logout(refreshToken: string | undefined): Promise<LogoutResponse> {
    if (!refreshToken) {
      return { loggedOut: true };
    }

    const tokenHash = this.hashRefreshToken(refreshToken);
    await authRepository.revokeByTokenHash(tokenHash);

    return { loggedOut: true };
  }

  async generateTokens(userId: string, role: UserRole): Promise<AuthTokenPair> {
    const accessToken = await new SignJWT({ role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(env.JWT_ACCESS_TOKEN_EXPIRES_IN)
      .sign(new TextEncoder().encode(env.JWT_SECRET));

    const refreshToken = randomBytes(32).toString('base64url');
    const tokenHash = this.hashRefreshToken(refreshToken);
    const expiresAt = new Date(
      Date.now() + durationToMs(env.JWT_REFRESH_TOKEN_EXPIRES_IN),
    );

    await authRepository.createRefreshToken({ userId, tokenHash, expiresAt });

    return { accessToken, refreshToken };
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }
}

export const authService = new AuthService();
