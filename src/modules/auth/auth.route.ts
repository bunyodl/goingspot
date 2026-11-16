import express, { type Request } from 'express';

import { authController } from '@/modules/auth/auth.controller';
import {
  type LoginRequestBody,
  loginRequestBodySchema,
} from '@/modules/auth/schemas/endpoints/login.schema';
import {
  type RegisterRequestBody,
  registerRequestBodySchema,
} from '@/modules/auth/schemas/endpoints/register.schema';

import { validate } from '@/common/middlewares/validate.middleware';

export const authRouter = express.Router();

authRouter.post(
  '/register',
  validate({ body: registerRequestBodySchema }),
  async (req: Request<{}, {}, RegisterRequestBody>, res) => {
    await authController.register(req, res);
  },
);

authRouter.post(
  '/login',
  validate({ body: loginRequestBodySchema }),
  async (req: Request<{}, {}, LoginRequestBody>, res) => {
    await authController.login(req, res);
  },
);
