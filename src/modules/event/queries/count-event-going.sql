SELECT COUNT(*)::text AS count
FROM event_attendees
WHERE event_id = $1
  AND status = 'going';
