import { hash } from 'argon2';

import type { RegisterRequestBody } from '@/modules/auth/schemas/endpoints/register.schema';
import { USER_ROLES } from '@/modules/user/constants/user.constants';
import { mapUserRowToDto } from '@/modules/user/helpers/map-user-row';
import type { UserDto } from '@/modules/user/schemas/resources/user.schema';
import { userRepository } from '@/modules/user/user.repository';

import { ConflictException } from '@/common/exceptions';

class AuthService {
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
}

export const authService = new AuthService();
