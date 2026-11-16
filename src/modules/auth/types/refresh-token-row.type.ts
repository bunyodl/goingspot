import type { RowTimestamps } from '@/db/types/row-timestamps.type';

export interface RefreshTokenRow extends RowTimestamps {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  revoked_at: Date | null;
}
