import type { Request, Response } from 'express-serve-static-core';

import { authService } from '@/modules/auth/auth.service';
import {
  AUTH_REFRESH_COOKIE,
  getClearRefreshCookieOptions,
  getRefreshCookieOptions,
} from '@/modules/auth/constants/auth.constants';
import type { GetMeResponse } from '@/modules/auth/schemas/endpoints/get-me.schema';
import type {
  LoginRequestBody,
  LoginResponse,
} from '@/modules/auth/schemas/endpoints/login.schema';
import type { LogoutResponse } from '@/modules/auth/schemas/endpoints/logout.schema';
import type { RefreshResponse } from '@/modules/auth/schemas/endpoints/refresh.schema';
import type {
  RegisterRequestBody,
  RegisterResponse,
} from '@/modules/auth/schemas/endpoints/register.schema';

import { HTTP_STATUS } from '@/common/constants/http-codes';
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
    const tokens = await authService.login(req.body);

    res.cookie(
      AUTH_REFRESH_COOKIE,
      tokens.refreshToken,
      getRefreshCookieOptions(),
    );

    return sendSuccess(res, {
      data: {
        accessToken: tokens.accessToken,
      },
    });
  }

  async refresh(
    req: Request,
    res: Response<ApiResponse<RefreshResponse>>,
  ) {
    const refreshToken = req.cookies?.[AUTH_REFRESH_COOKIE] as
      | string
      | undefined;
    const tokens = await authService.refresh(refreshToken);

    res.cookie(
      AUTH_REFRESH_COOKIE,
      tokens.refreshToken,
      getRefreshCookieOptions(),
    );

    return sendSuccess(res, {
      data: { accessToken: tokens.accessToken },
    });
  }

  async logout(req: Request, res: Response<ApiResponse<LogoutResponse>>) {
    const refreshToken = req.cookies?.[AUTH_REFRESH_COOKIE] as
      | string
      | undefined;
    const data = await authService.logout(refreshToken);

    res.clearCookie(AUTH_REFRESH_COOKIE, getClearRefreshCookieOptions());

    return sendSuccess(res, { data });
  }

  async getMe(req: Request, res: Response<ApiResponse<GetMeResponse>>) {
    const user = await authService.getMe(req.user!.id);

    return sendSuccess(res, { data: { user } });
  }
}

export const authController = new AuthController();
