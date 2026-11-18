INSERT INTO event_attendees (event_id, user_id, status, updated_at)
VALUES ($1, $2, $3, NOW())
ON CONFLICT (event_id, user_id) DO UPDATE
SET
  status = EXCLUDED.status,
  updated_at = NOW()
RETURNING *;
