import type { EventAttendanceStatus } from '@/modules/event/constants/event.constants';
import type { EventAttendeeRow } from '@/modules/event/types/event-attendee-row.type';

import type { Timestamps } from '@/openapi/schemas/timestamps.schema';

import { toIsoString } from '@/common/libs/to-iso-string';

export interface EventAttendeeDto extends Timestamps {
  eventId: string;
  userId: string;
  status: EventAttendanceStatus;
}

export function mapEventAttendeeRowToDto(
  row: EventAttendeeRow,
): EventAttendeeDto {
  return {
    eventId: row.event_id,
    userId: row.user_id,
    status: row.status,
    createdAt: toIsoString(row.created_at),
    updatedAt: row.updated_at ? toIsoString(row.updated_at) : null,
  };
}
