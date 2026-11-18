SELECT COUNT(*)::text AS count
FROM event_attendees
WHERE user_id = $1
  AND ($2::event_attendance_status IS NULL OR status = $2);
