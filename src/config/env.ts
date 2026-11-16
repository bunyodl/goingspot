import 'dotenv/config';
import { z } from 'zod';

const jwtDurationSchema = z.string().regex(/^\d+[smhd]$/);

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  API_URL: z.url(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_TOKEN_EXPIRES_IN: jwtDurationSchema,
  JWT_REFRESH_TOKEN_EXPIRES_IN: jwtDurationSchema,
});

export const env = envSchema.parse({ ...process.env });
