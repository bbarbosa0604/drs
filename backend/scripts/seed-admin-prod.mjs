import { spawnSync } from 'node:child_process';

// Versao para producao (container Docker): roda o seed ja compilado em
// dist/, sem depender de ts-node. Uso: dentro do container ->
// ADMIN_NAME=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:admin:prod
const result = spawnSync(
  process.execPath,
  ['dist/database/seeds/create-admin.seed.js'],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
