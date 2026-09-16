import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'backend',
  port: Number(process.env.APP_PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'local-development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
}));
