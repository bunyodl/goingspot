WHERE ($1::text IS NULL OR (
  title ILIKE $1
  OR description ILIKE $1
  OR EXISTS (
    SELECT 1
    FROM unnest(tags) AS tag
    WHERE tag ILIKE $1
  )
))
AND ($2::uuid IS NULL OR organizer_id = $2)
