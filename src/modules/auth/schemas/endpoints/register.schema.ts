import { passwordSchema } from '@/modules/auth/schemas/resources/password.schema';
import { userSchema } from '@/modules/user/schemas/resources/user.schema';

import { z } from '@/openapi/zod-openapi';

export const registerRequestBodySchema = z
  .object({
    firstName: z.string().openapi({ example: 'John' }),
    lastName: z.string().openapi({ example: 'Doe' }),
    email: z.email().openapi({ example: 'john.doe@example.com' }),
    password: passwordSchema,
    imageUrl: z
      .string()
      .nullable()
      .openapi({ example: 'https://example.com/avatar.jpg' }),
  })
  .openapi('RegisterRequestBody');

export type RegisterRequestBody = z.infer<typeof registerRequestBodySchema>;

export const registerResponseSchema = z
  .object({
    user: userSchema,
  })
  .openapi('RegisterResponse');

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
