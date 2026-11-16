import express, { type Request } from 'express';

import { USER_ROLES } from '@/modules/user/constants/user.constants';
import { userController } from '@/modules/user/user.controller';

import { authenticate } from '@/common/middlewares/authenticate.middleware';
import { requirePlatformRole } from '@/common/middlewares/require-platform-role.middleware';
import { validate } from '@/common/middlewares/validate.middleware';

import {
  type CreateUserRequestBody,
  createUserRequestBodySchema,
} from './schemas/endpoints/create-user.schema';
import {
  type GetUserParams,
  getUserParamsSchema,
} from './schemas/endpoints/get-user.schema';
import { getUsersQuerySchema } from './schemas/endpoints/get-users.schema';

export const usersRouter = express.Router();

const requireAdmin = [
  authenticate,
  requirePlatformRole(USER_ROLES.ADMIN),
] as const;

usersRouter.get(
  '/',
  ...requireAdmin,
  validate({ query: getUsersQuerySchema }),
  async (req, res) => {
    await userController.getMany(req, res);
  },
);

usersRouter.get(
  '/:userId',
  ...requireAdmin,
  validate({ params: getUserParamsSchema }),
  async (req: Request<GetUserParams>, res) => {
    await userController.getById(req, res);
  },
);

usersRouter.post(
  '/',
  ...requireAdmin,
  validate({ body: createUserRequestBodySchema }),
  async (req: Request<{}, {}, CreateUserRequestBody>, res) => {
    await userController.create(req, res);
  },
);

usersRouter.delete(
  '/:userId',
  ...requireAdmin,
  validate({ params: getUserParamsSchema }),
  async (req: Request<GetUserParams>, res) => {
    await userController.delete(req, res);
  },
);
