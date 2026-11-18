import { userSchema } from '@/modules/user/schemas/resources/user.schema';

import { paginationQuerySchema } from '@/openapi/schemas/pagination.schema';
import { z } from '@/openapi/zod-openapi';

export const getUsersQuerySchema = z
  .object({
    search: z.string().optional().openapi({
      description:
        'Search term to filter users by first name, last name, or email',
    }),
    sort: z
      .enum(['asc', 'desc'])
      .optional()
      .openapi({ example: 'asc', description: 'Sort order' }),
    sortBy: z
      .enum(['firstName', 'lastName', 'email', 'role', 'createdAt'])
      .optional()
      .openapi({ example: 'firstName', description: 'Field to sort by' }),
  })
  .extend(paginationQuerySchema.shape)
  .openapi('GetUsersQuery');

export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;

export const getUsersResponseSchema = z
  .object({
    users: z.array(userSchema),
    usersCount: z.number().openapi({ example: 15 }),
  })
  .openapi('GetUsersResponse');

export type GetUsersResponse = z.infer<typeof getUsersResponseSchema>;
