# Handoff - Task 003

## Identificador da task

Task 003 - Auditar e ajustar o modulo de autenticacao existente (Passport JWT)

## Slice vertical

Slice 001 - Fundacao da plataforma (`tasks/slices/001-fundacao-plataforma.md`)

## Status final

done

## Decisoes preservadas

- Criacao de usuario e exclusiva do DSR Admin (`UserRole.ADMIN`), sem auto-cadastro publico — decisao confirmada pelo Bruno.
- `UsersController` inteiro (create/findAll/findOne/update/remove) agora exige `JwtAuthGuard` + `RolesGuard` + `@Roles(UserRole.ADMIN)`.
- `AuthService`/`JwtStrategy`/`UsersService` nao foram reescritos, apenas o controller ganhou guards.
- Primeiro DSR Admin de um ambiente e provisionado via `npm run seed:admin` (variaveis de ambiente), nunca via API publica.
- Rate limiting de login ficou como pendencia (exigiria nova dependencia).

## Contexto efetivamente usado

- Minimo padrao + handoffs das Tasks 001/002.
- Leitura integral de `backend/src/modules/auth/**` e `backend/src/modules/users/**` para a auditoria de seguranca.

## Compliance de Security Constraints

- Risco alto / perfil `auth-sensitive`. Nenhuma dependencia nova instalada. Nenhum human approval necessario (decisao de produto ja dada antes da execucao). Vulnerabilidade de escalacao de privilegio corrigida e coberta por teste automatizado (`roles.guard.spec.ts`).

## Arquivos alterados

- `common/decorators/roles.decorator.ts`, `common/guards/roles.guard.ts` (+ spec), `modules/users/users.controller.ts`, `database/seeds/create-admin.seed.ts`, `scripts/seed-admin.mjs`, `package.json`.

## Validacoes executadas

- lint OK, `tsc --noEmit` OK, `npm run test` OK (5/5 testes). Seed nao executado contra banco real (sem Postgres no ambiente).

## Pendencias ou bloqueios

- Rodar `npm run seed:admin` num ambiente com Postgres real.
- Implementar rate limiting em `/auth/login` (nova dependencia, human approval futuro).

## Proximo contexto recomendado

Para a Task 004 (autorizacao multitenancy): reaproveitar `RolesGuard`/`Roles` desta task e compor com checagem de vinculo a organizacao/projeto (`OrganizationMember`/`ProjectMember` da Task 002).
