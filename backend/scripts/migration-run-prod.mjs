import { spawnSync } from 'node:child_process';

// Versao para producao (container Docker): roda contra o dist/ ja
// compilado, sem depender de ts-node (devDependency, ausente no
// runtime image). Uso: dentro do container -> npm run migration:run:prod
const result = spawnSync(
  process.execPath,
  [
    './node_modules/typeorm/cli.js',
    'migration:run',
    '-d',
    'dist/database/typeorm.datasource.js',
  ],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
