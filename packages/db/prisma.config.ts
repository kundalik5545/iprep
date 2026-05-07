import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { IprepPaths } from '@iprep/shared/utils';

const databaseUrl = `file:${IprepPaths.dbFile}`;

export default defineConfig({
  schema: path.join(import.meta.dirname, 'prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  datasource: {
    url: databaseUrl,
  },
  adapter: () =>
    Promise.resolve(
      new PrismaBetterSqlite3({
        url: databaseUrl,
      }),
    ),
});
