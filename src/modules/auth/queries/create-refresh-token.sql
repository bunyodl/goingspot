INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
VALUES ($1, $2, $3)
RETURNING
  id,
  user_id,
  token_hash,
  expires_at,
  revoked_at,
  created_at,
  updated_at;
