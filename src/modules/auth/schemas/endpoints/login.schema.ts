import { accessTokenSchema } from '@/modules/auth/schemas/resources/auth-tokens.schema';
import { loginPasswordSchema } from '@/modules/auth/schemas/resources/password.schema';
import { userSchema } from '@/modules/user/schemas/resources/user.schema';

import { z } from '@/openapi/zod-openapi';

export const loginRequestBodySchema = z
  .object({
    email: z.email().openapi({ example: 'john.doe@example.com' }),
    password: loginPasswordSchema,
  })
  .openapi('LoginRequestBody');

export type LoginRequestBody = z.infer<typeof loginRequestBodySchema>;

export const loginResponseSchema = z
  .object({
    user: userSchema,
  })
  .extend(accessTokenSchema.shape)
  .openapi('LoginResponse');

export type LoginResponse = z.infer<typeof loginResponseSchema>;
