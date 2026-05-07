import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IprepPaths } from '@iprep/shared/utils';

const _require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve prisma CLI from node_modules — works in monorepo and when installed globally
const PRISMA_PKG_DIR = dirname(_require.resolve('prisma/package.json'));
const PRISMA_BIN = join(PRISMA_PKG_DIR, 'build', 'index.js');

// prisma.config.ts at the package root supplies the adapter + schema path to the CLI
// so no --datasource-url or --schema flags are needed here
const CONFIG = join(__dirname, '..', 'prisma.config.ts');

/**
 * Apply all pending Prisma migrations.
 * Called once at server startup and by `iprep init`.
 */
export function runMigrations(): void {
  mkdirSync(IprepPaths.database, { recursive: true });

  execFileSync(
    process.execPath,
    [PRISMA_BIN, 'migrate', 'deploy', '--config', CONFIG],
    { stdio: 'inherit' },
  );
}
