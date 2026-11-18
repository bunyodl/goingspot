import type { EventAttendanceStatus } from '@/modules/event/constants/event.constants';

import type { RowTimestamps } from '@/db/types/row-timestamps.type';

export interface EventAttendeeRow extends RowTimestamps {
  event_id: string;
  user_id: string;
  status: EventAttendanceStatus;
}
