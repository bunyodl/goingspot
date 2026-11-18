import {
  EVENT_ATTENDANCE_STATUS_VALUES,
  type EventAttendanceStatus,
} from '@/modules/event/constants/event.constants';
import { eventSchema } from '@/modules/event/schemas/resources/event.schema';

import { uuidV7Schema } from '@/openapi/schemas/uuid.schema';
import { z } from '@/openapi/zod-openapi';

export const eventAttendanceStatusSchema = z
  .enum(EVENT_ATTENDANCE_STATUS_VALUES)
  .openapi({ example: 'going' });

export const upsertAttendanceParamsSchema = z.object({
  eventId: uuidV7Schema.openapi({
    param: { name: 'eventId', in: 'path' },
    description: 'Unique identifier of the event',
  }),
});

export type UpsertAttendanceParams = z.infer<
  typeof upsertAttendanceParamsSchema
>;

export const upsertAttendanceRequestBodySchema = z
  .object({
    status: eventAttendanceStatusSchema,
  })
  .openapi('UpsertAttendanceRequestBody');

export type UpsertAttendanceRequestBody = z.infer<
  typeof upsertAttendanceRequestBodySchema
>;

export const upsertAttendanceResponseSchema = z
  .object({
    event: eventSchema,
    myAttendance: eventAttendanceStatusSchema,
  })
  .openapi('UpsertAttendanceResponse');

export type UpsertAttendanceResponse = z.infer<
  typeof upsertAttendanceResponseSchema
>;

export type { EventAttendanceStatus };
