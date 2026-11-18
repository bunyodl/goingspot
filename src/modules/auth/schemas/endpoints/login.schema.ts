import {
  type AccessTokenDto,
  accessTokenSchema,
} from '@/modules/auth/schemas/resources/auth-tokens.schema';
import { loginPasswordSchema } from '@/modules/auth/schemas/resources/password.schema';

import { z } from '@/openapi/zod-openapi';

export const loginRequestBodySchema = z
  .object({
    email: z.email().openapi({ example: 'john.doe@example.com' }),
    password: loginPasswordSchema,
  })
  .openapi('LoginRequestBody');

export type LoginRequestBody = z.infer<typeof loginRequestBodySchema>;

/** Same JSON shape as AccessToken — refresh cookie is not in the body. */
export const loginResponseSchema =
  accessTokenSchema.openapi('LoginResponse');

export type LoginResponse = AccessTokenDto;
