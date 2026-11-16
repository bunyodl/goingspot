SELECT *
FROM refresh_tokens
WHERE token_hash = $1;
