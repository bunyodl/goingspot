SELECT
  e.*,
  ea.status AS attendance_status
FROM event_attendees ea
INNER JOIN events e ON e.id = ea.event_id
WHERE ea.user_id = $1
  AND ($2::event_attendance_status IS NULL OR ea.status = $2)
ORDER BY e.date ASC
LIMIT $3 OFFSET $4;
