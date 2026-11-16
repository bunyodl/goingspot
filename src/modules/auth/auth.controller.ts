import type { Request, Response } from 'express-serve-static-core';

import { authService } from '@/modules/auth/auth.service';
import { AUTH_REFRESH_COOKIE } from '@/modules/auth/constants/auth.constants';
import type {
  LoginRequestBody,
  LoginResponse,
} from '@/modules/auth/schemas/endpoints/login.schema';
import type {
  RegisterRequestBody,
  RegisterResponse,
} from '@/modules/auth/schemas/endpoints/register.schema';

import { env } from '@/config/env';

import { HTTP_STATUS } from '@/common/constants/http-codes';
import { durationToMs } from '@/common/libs/duration-to-ms';
import { sendSuccess } from '@/common/libs/send-success';
import type { ApiResponse } from '@/common/types/api-response.type';

export class AuthController {
  async register(
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response<ApiResponse<RegisterResponse>>,
  ) {
    const user = await authService.register(req.body);

    return sendSuccess(res, {
      data: { user },
      code: HTTP_STATUS.CREATED,
    });
  }

  async login(
    req: Request<{}, {}, LoginRequestBody>,
    res: Response<ApiResponse<LoginResponse>>,
  ) {
    const session = await authService.login(req.body);

    // Set the refresh token in a cookie
    res.cookie(AUTH_REFRESH_COOKIE, session.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: durationToMs(env.JWT_REFRESH_TOKEN_EXPIRES_IN),
    });

    return sendSuccess(res, {
      data: {
        user: session.user,
        accessToken: session.accessToken,
      },
    });
  }
}

export const authController = new AuthController();
