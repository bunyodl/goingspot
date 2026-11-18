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

import { authenticate } from '@/common/middlewares/authenticate.middleware';
import { validate } from '@/common/middlewares/validate.middleware';

export const authRouter = express.Router();

authRouter.get('/me', authenticate, async (req, res) => {
  await authController.getMe(req, res);
});

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

authRouter.post('/refresh', async (req, res) => {
  await authController.refresh(req, res);
});

authRouter.post('/logout', async (req, res) => {
  await authController.logout(req, res);
});
