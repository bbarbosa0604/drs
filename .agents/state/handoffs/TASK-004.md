# Handoff - Task 004

## Identificador da task

Task 004 - Autorizacao multitenancy + RBAC (DSR Admin, Consultor)

## Slice vertical

Slice 001 - Fundacao da plataforma (`tasks/slices/001-fundacao-plataforma.md`)

## Status final

done

## Decisoes preservadas

- Padrao de resposta: 404 quando `organizationId`/`projectId` nao existe, 403 quando existe mas o usuario nao tem vinculo (`OrganizationMember`/`ProjectMember`). `UserRole.ADMIN` (DSR Admin) sempre tem acesso, sem checagem de vinculo.
- Vinculo e recarregado do banco a cada request (guard chama o access service, que consulta o repositorio TypeORM), nunca confiando apenas no `role`/`sub` do payload do JWT.
- RBAC administrativo (DSR Admin vs Consultor) para acoes de plataforma reaproveita o `RolesGuard`/`@Roles(UserRole.ADMIN)` da Task 003; nao foi recriado.
- `OrganizationsModule`/`ProjectsModule` criados apenas com entidades + access service (sem controllers) porque o CRUD de Organizacao/Projeto e escopo das Tasks 005/006.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 003.
- Leitura de `backend/src/modules/auth/**`, `backend/src/common/guards/roles.guard.ts`, `backend/src/modules/{organizations,projects,module-instances}/entities/**` e `backend/docs/ai/SECURITY.md` para desenhar os guards.

## Compliance de Security Constraints

- Risco alto / perfil `auth-sensitive`. Nenhuma dependencia nova instalada. Nenhum human approval necessario. Teste automatizado cobre IDOR cross-organization e cross-project (`organizations-access.service.spec.ts`, `projects-access.service.spec.ts`, `organization-access.guard.spec.ts`, `project-access.guard.spec.ts`).

## Arquivos alterados

- Criados: `modules/organizations/organizations-access.service.ts` (+spec), `modules/organizations/organizations.module.ts`, `modules/projects/projects-access.service.ts` (+spec), `modules/projects/projects.module.ts`, `common/guards/organization-access.guard.ts` (+spec), `common/guards/project-access.guard.ts` (+spec).
- Modificado: `app.module.ts` (registro dos dois modulos novos).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK, `npm run test` OK (6 suites / 19 testes).

## Pendencias ou bloqueios

- Aplicar `OrganizationAccessGuard`/`ProjectAccessGuard` nos controllers reais quando as Tasks 005/006 criarem as rotas de Organizacao/Projeto (`@UseGuards(JwtAuthGuard, OrganizationAccessGuard)` apos a rota declarar `:organizationId`).
- Portar a decisao 404 vs 403 para `backend/docs/ai/SECURITY.md` (fora do escopo de escrita desta task; recomenda-se uma task pequena de docs/governanca).

## Proximo contexto recomendado

Para a Task 005 (CRUD Organizacao): implementar o controller/service de Organizacao usando `OrganizationsModule` ja existente, aplicando `JwtAuthGuard` + `OrganizationAccessGuard` (ja prontos) nas rotas que recebem `:organizationId`.
