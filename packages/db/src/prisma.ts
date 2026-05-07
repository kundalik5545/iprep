import { mkdirSync } from 'node:fs';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { IprepPaths } from '@iprep/shared/utils';
import { PrismaClient } from './generated/prisma/client.js';

function createClient(): PrismaClient {
  // Ensure ~/.iprep/database/ exists before better-sqlite3 opens the file
  mkdirSync(IprepPaths.database, { recursive: true });

  // Prisma 7 driver-adapter pattern: pass url to the factory, not to PrismaClient env
  const adapter = new PrismaBetterSqlite3({ url: IprepPaths.dbFile });
  return new PrismaClient({ adapter });
}

// Singleton — imported by query modules and repositories
export const prisma = createClient();
