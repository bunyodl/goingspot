import type { Request, Response } from 'express-serve-static-core';

import { authService } from '@/modules/auth/auth.service';
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
}

export const authController = new AuthController();
