import type { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';

import {
  USER_ROLE_VALUES,
  type UserRole,
} from '@/modules/user/constants/user.constants';

import { env } from '@/config/env';

import { UnauthorizedException } from '@/common/exceptions';
import { exists } from '@/common/libs/exists';

function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (USER_ROLE_VALUES as readonly string[]).includes(value)
  );
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  const [scheme, token] = header?.split(' ') ?? [];
  const isMissingBearer =
    !exists(header) || scheme !== 'Bearer' || !exists(token);

  if (isMissingBearer) {
    throw new UnauthorizedException('Authorization token is missing');
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(env.JWT_SECRET),
    );
    const userId = payload.sub;
    const role = payload.role;
    const isInvalidPayload = !exists(userId) || !isUserRole(role);

    if (isInvalidPayload) {
      throw new UnauthorizedException('Invalid access token');
    }

    req.user = { id: userId, role };
    next();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    throw new UnauthorizedException('Invalid access token');
  }
}
