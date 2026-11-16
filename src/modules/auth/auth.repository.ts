import type { RefreshTokenRow } from '@/modules/auth/types/refresh-token-row.type';

import { fetchFromDb } from '@/common/libs/fetch-from-db';
import { readSqlQuery } from '@/common/libs/read-sql-query';

type CreateRefreshTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

async function readSql(path: string) {
  return await readSqlQuery(path, import.meta.url);
}

class AuthRepository {
  async createRefreshToken(
    input: CreateRefreshTokenInput,
  ): Promise<RefreshTokenRow> {
    const query = await readSql('./queries/create-refresh-token.sql');
    const rows = await fetchFromDb<RefreshTokenRow[]>(query, [
      input.userId,
      input.tokenHash,
      input.expiresAt,
    ]);

    return rows[0]!;
  }
}

export const authRepository = new AuthRepository();
