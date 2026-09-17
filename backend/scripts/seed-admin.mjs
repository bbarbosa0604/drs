import { spawnSync } from 'node:child_process';

const result = spawnSync(
  process.execPath,
  [
    '--require',
    'ts-node/register',
    '--require',
    'dotenv/config',
    'src/database/seeds/create-admin.seed.ts',
  ],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
