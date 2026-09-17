import 'dotenv/config';

import { hashPassword } from '../../common/utils/password.util';
import { UserEntity, UserRole } from '../../modules/users/entities/user.entity';
import dataSource from '../typeorm.datasource';

/**
 * Provisiona o primeiro DSR Admin de um ambiente. Nao ha auto-cadastro
 * publico (Task 003) — este script e o unico caminho para criar o
 * primeiro usuario administrador antes de qualquer outro usuario existir.
 *
 * Uso: ADMIN_NAME=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:admin
 * Idempotente: se ja existir um usuario com o email informado, nao faz nada.
 */
async function run() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error(
      'Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD (env vars) antes de rodar este seed.',
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('ADMIN_PASSWORD precisa ter pelo menos 8 caracteres.');
    process.exit(1);
  }

  await dataSource.initialize();

  try {
    const repository = dataSource.getRepository(UserEntity);
    const existing = await repository.findOne({ where: { email } });

    if (existing) {
      console.log(
        `Usuario com email ${email} ja existe (role atual: ${existing.role}). Nada a fazer.`,
      );
      return;
    }

    const passwordHash = await hashPassword(password);
    const admin = repository.create({
      name,
      email,
      phone: null,
      passwordHash,
      role: UserRole.ADMIN,
    });

    await repository.save(admin);
    console.log(`DSR Admin criado com sucesso: ${email}`);
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Falha ao criar o DSR Admin inicial:', error);
  process.exit(1);
});
