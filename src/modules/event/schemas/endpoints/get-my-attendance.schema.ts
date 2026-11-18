import { eventAttendanceStatusSchema } from '@/modules/event/schemas/endpoints/upsert-attendance.schema';
import { eventSchema } from '@/modules/event/schemas/resources/event.schema';

import { paginationQuerySchema } from '@/openapi/schemas/pagination.schema';
import { z } from '@/openapi/zod-openapi';

export const getMyAttendanceQuerySchema = z
  .object({
    status: eventAttendanceStatusSchema.optional().openapi({
      description: 'Filter by attendance status',
    }),
  })
  .extend(paginationQuerySchema.shape)
  .openapi('GetMyAttendanceQuery');

export type GetMyAttendanceQuery = z.infer<typeof getMyAttendanceQuerySchema>;

export const myAttendanceItemSchema = z
  .object({
    event: eventSchema,
    status: eventAttendanceStatusSchema,
  })
  .openapi('MyAttendanceItem');

export const getMyAttendanceResponseSchema = z
  .object({
    attendance: z.array(myAttendanceItemSchema),
    attendanceCount: z.number().openapi({ example: 12 }),
  })
  .openapi('GetMyAttendanceResponse');

export type GetMyAttendanceResponse = z.infer<
  typeof getMyAttendanceResponseSchema
>;
