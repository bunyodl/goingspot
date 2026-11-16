UPDATE refresh_tokens
SET
  revoked_at = now(),
  updated_at = now()
WHERE token_hash = $1
  AND revoked_at IS NULL
RETURNING *;
