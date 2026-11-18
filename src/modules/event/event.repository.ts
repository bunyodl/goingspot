import type { GetMyAttendanceQuery } from '@/modules/event/schemas/endpoints/get-my-attendance.schema';
import type { EventAttendanceStatus } from '@/modules/event/constants/event.constants';
import type { CreateEventRequestBody } from '@/modules/event/schemas/endpoints/create-event.schema';
import type { GetEventsQuery } from '@/modules/event/schemas/endpoints/get-events.schema';
import type { PatchEventRequestBody } from '@/modules/event/schemas/endpoints/patch-event.schema';
import type { EventAttendeeRow } from '@/modules/event/types/event-attendee-row.type';
import type { EventRow } from '@/modules/event/types/event-row.type';

import { fetchFromDb } from '@/common/libs/fetch-from-db';
import { readSqlQuery } from '@/common/libs/read-sql-query';

const EVENT_SORT_COLUMNS = {
  title: 'title',
  description: 'description',
  date: 'date',
  createdAt: 'created_at',
} satisfies Record<NonNullable<GetEventsQuery['sortBy']>, keyof EventRow>;

export type EventAttendanceJoinRow = EventRow & {
  attendance_status: EventAttendanceStatus;
};

async function readSql(path: string) {
  return await readSqlQuery(path, import.meta.url);
}

class EventRepository {
  async getMany(params: GetEventsQuery): Promise<Array<EventRow>> {
    const sortColumn =
      EVENT_SORT_COLUMNS[params.sortBy ?? 'date'] ?? EVENT_SORT_COLUMNS.date;
    const sortOrder = params.sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const { limit, offset } = params;
    const whereClause = await readSql('./queries/event-list-where.sql');
    const [searchPattern, organizerId] = this.eventListFilterParams(params);

    const query = `
      SELECT * FROM events
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $3 OFFSET $4
    `;

    return fetchFromDb<Array<EventRow>>(query, [
      searchPattern,
      organizerId,
      limit,
      offset,
    ]);
  }

  async getTotalCount(params: GetEventsQuery): Promise<number> {
    const whereClause = await readSql('./queries/event-list-where.sql');
    const [searchPattern, organizerId] = this.eventListFilterParams(params);
    const query = `SELECT COUNT(*)::text AS count FROM events ${whereClause}`;
    const result = await fetchFromDb<Array<{ count: string }>>(query, [
      searchPattern,
      organizerId,
    ]);

    return Number(result[0]?.count ?? 0);
  }

  async getById(eventId: string): Promise<EventRow | null> {
    const query = await readSql('./queries/get-event-by-id.sql');
    const rows = await fetchFromDb<Array<EventRow>>(query, [eventId]);

    return rows[0] ?? null;
  }

  async create(
    body: CreateEventRequestBody,
    organizerId: string,
  ): Promise<EventRow> {
    const query = await readSql('./queries/create-event.sql');

    const rows = await fetchFromDb<Array<EventRow>>(query, [
      body.title,
      body.description,
      body.type,
      body.status,
      body.venueId,
      organizerId,
      body.date,
      body.tags,
    ]);

    return rows[0]!;
  }

  async patch(
    eventId: string,
    body: PatchEventRequestBody,
  ): Promise<EventRow | null> {
    const query = await readSql('./queries/patch-event.sql');
    const rows = await fetchFromDb<Array<EventRow>>(query, [
      eventId,
      body.title,
      body.description,
      body.type,
      body.status,
      body.venueId,
      body.date,
      body.tags,
    ]);

    return rows[0] ?? null;
  }

  async delete(eventId: string): Promise<EventRow | null> {
    const query = await readSql('./queries/delete-event.sql');
    const rows = await fetchFromDb<Array<EventRow>>(query, [eventId]);

    return rows[0] ?? null;
  }

  async upsertAttendance(
    eventId: string,
    userId: string,
    status: EventAttendanceStatus,
  ): Promise<EventAttendeeRow> {
    const query = await readSql('./queries/upsert-event-attendance.sql');
    const rows = await fetchFromDb<Array<EventAttendeeRow>>(query, [
      eventId,
      userId,
      status,
    ]);

    return rows[0]!;
  }

  async countGoing(eventId: string): Promise<number> {
    const query = await readSql('./queries/count-event-going.sql');
    const rows = await fetchFromDb<Array<{ count: string }>>(query, [eventId]);

    return Number(rows[0]?.count ?? 0);
  }

  async countGoingExcludingUser(
    eventId: string,
    userId: string,
  ): Promise<number> {
    const query = await readSql(
      './queries/count-event-going-excluding-user.sql',
    );
    const rows = await fetchFromDb<Array<{ count: string }>>(query, [
      eventId,
      userId,
    ]);

    return Number(rows[0]?.count ?? 0);
  }

  async getMyAttendance(
    userId: string,
    params: GetMyAttendanceQuery,
  ): Promise<Array<EventAttendanceJoinRow>> {
    const query = await readSql('./queries/get-my-attendance.sql');

    return fetchFromDb<Array<EventAttendanceJoinRow>>(query, [
      userId,
      params.status ?? null,
      params.limit,
      params.offset,
    ]);
  }

  async getMyAttendanceCount(
    userId: string,
    status?: EventAttendanceStatus,
  ): Promise<number> {
    const query = await readSql('./queries/get-my-attendance-count.sql');
    const rows = await fetchFromDb<Array<{ count: string }>>(query, [
      userId,
      status ?? null,
    ]);

    return Number(rows[0]?.count ?? 0);
  }

  private eventListFilterParams(
    params: GetEventsQuery,
  ): [string | null, string | null] {
    const searchPattern = params.search ? `%${params.search}%` : null;
    const organizerId = params.organizerId ?? null;

    return [searchPattern, organizerId];
  }
}

export const eventRepository = new EventRepository();
