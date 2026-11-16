SELECT
  id,
  first_name,
  last_name,
  email,
  image_url,
  role,
  password_hash,
  created_at,
  updated_at
FROM users
WHERE email = $1;
