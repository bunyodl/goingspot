# Deferred work

Items left out on purpose until a real failure or missing behavior unlocks them. Prefer the cheapest fix that removes the pain.

## Event list `goingCount` (N+1)

`GET /events` and `GET /events/me/attendance` currently run one `COUNT` query per event after the list fetch. Fine for small pages; painful at ~100–200 rows.

| When it hurts | Do this next |
| --- | --- |
| List/detail feels slow with many events | One SQL: `LEFT JOIN` / subquery that returns `going_count` with each event row (same pattern on my-attendance) |
| Counts still dominate after that | Index on `event_attendees (event_id, status)` if not already useful for the plan |
| Hot public lists, repeated identical reads | Cache (e.g. Redis) for list payloads or per-event counts — unlock when measured, not by default |
| Not for this read path | Queues / BullMQ — those help background jobs, not “return 200 events faster” |

## Soft delete for events

Hard `DELETE` cascades to `event_attendees`, so attendance history disappears with the event. `DELETE` currently returns `204` with no body.

| When it hurts | Do this next |
| --- | --- |
| Need undo, audit, or “who was going” after cancel | Soft delete: `deleted_at` (or status) on `events`; list/get exclude soft-deleted by default |
| Organizers cancel often but want the record | Same — keep attendees; public hub hides the event |
| Stay on hard delete | Keep `204`; do not invent a body or a denormalized `going_count` just for delete |
