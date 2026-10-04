import express, { type Request } from 'express';

import { authController } from '@/modules/auth/auth.controller';
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
