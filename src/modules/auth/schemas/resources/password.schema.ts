import { z } from '@/openapi/zod-openapi';

/** Login only — do not leak composition rules to attackers. */
export const loginPasswordSchema = z
  .string()
  .min(8)
  .openapi({ example: 'securePassword1' });

/**
 * Strong password for register.
 * Min 8 chars, ≥1 upper, ≥1 lower, ≥1 digit, ≥1 symbol.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one symbol')
  .openapi({ example: 'SecurePass1!' });
