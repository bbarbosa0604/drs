# Task 002 - Entidades TypeORM: Organization/OrganizationMember/Project/ProjectMember/ModuleInstance/AuditLog (base)

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim | banco: PostgreSQL (TypeORM ja scaffolded)

## Contrato

- `contracts/openapi.yaml` (schemas `Organization`, `Project`, `ModuleInstance`, `AuditLog` ja definidos na Task 001)

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Sem estas entidades e migrations, nenhuma outra task de backend pode persistir Organizacao/Projeto. **Revisado apos a Task 001**: `User` (`backend/src/modules/users/entities/user.entity.ts`) ja existe, implementada e funcional (CRUD completo em `modules/users`) — esta task nao recria `User`, apenas referencia-a via FK.

### O que

Criar entidades TypeORM `Organization`, `OrganizationMember`, `Project`, `ProjectMember`, `ModuleInstance` (base, sem os campos especificos do Escopometro), `AuditLog` (base, sem a logica completa de gravacao — isso e a Task 027) e a migration correspondente, usando `backend/scripts/migration-generate.mjs`. `OrganizationMember`/`ProjectMember` referenciam `UserEntity` (`backend/src/modules/users/entities/user.entity.ts`) por FK, sem duplicar campos de usuario.

### Comportamento esperado

- cenario: `npm run migration:run` -> tabelas criadas sem erro, com FKs entre `Organization`/`Project`/`User` (User ja existente).
- cenario: dois registros de `OrganizationMember` para o mesmo usuario/organizacao -> constraint unica impede duplicidade.

### Fora de escopo

- Entidade `User` (ja existe — nao recriar, nao alterar sem justificativa)
- Entidades do Escopometro (slices 002-006)
- Seed de dados de exemplo (pode ser tratado como script auxiliar simples, nao obrigatorio)

## Casos de erro e borda

- Migration falhando por dado incompativel em ambiente ja existente -> nao se aplica (banco novo para estas tabelas)
- `deletedAt` (soft delete) deve existir em `Project` e `ModuleInstance` desde ja (PRD secao 28)
- FK de `OrganizationMember`/`ProjectMember` para `UserEntity` deve apontar para a tabela `users` ja existente, nao criar tabela de usuario paralela

## Review da spec

- [x] Permissoes: nao se aplica diretamente (schema, nao logica de acesso)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: manter TypeORM (ver `000-index.md`, duvida 1); reaproveitar `UserEntity`/`UserRole` existentes (ver `000-index.md`, duvida 5) — pendente confirmacao explicita do Bruno sobre `UserRole.admin` = DSR Admin
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Seguir convencoes de `backend/docs/ai/BACKEND_PATTERNS.md` e `CODE_STYLE.md`
- Usar UUID como identificador (PRD secao 27), consistente com `UserEntity.id` (`@PrimaryGeneratedColumn('uuid')`)
- Referenciar `UserEntity` existente via FK em `OrganizationMember.userId`, `ProjectMember.userId`, `Project.responsibleUserId`, `AuditLog.userId`

### Nao deve

- Nao usar `synchronize: true` (ja desabilitado em `database.config.ts`) — sempre via migration
- Nao recriar ou duplicar a entidade `User`/tabela `users`

## Entradas

- `contracts/openapi.yaml` (schemas da Task 001)
- `docs/database.md` (rascunho da Task 001, ja marca `User` como existente)
- `backend/docs/ai/ARCHITECTURE.md`, `BACKEND_PATTERNS.md`
- `backend/src/modules/users/entities/user.entity.ts` (para FK correta, leitura pontual)
- `requirements/001-prd-escopometro-sgsi.md#22, #27, #28`

## Dependencias

- Task 001

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Entidades do Escopometro

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho          | Fonte                                               | Quando                      | Obrigatorio |
| ---------------- | --------------------------------------------------- | --------------------------- | ----------- |
| Backend          | `backend/docs/ai/BACKEND_PATTERNS.md`               | sempre                      | sim         |
| API              | `contracts/openapi.yaml`                            | para alinhar schema         | sim         |
| Codigo existente | `backend/src/modules/users/entities/user.entity.ts` | para montar FK corretamente | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 3 | risco: baixo | estrategia: ler so secoes citadas do PRD e so o arquivo de entidade de `users` (nao o modulo inteiro)

## Security Constraints

### Nivel de risco

alto (schema/migration de banco)

### Perfil de origem

infra-risk

### Tools permitidas

- read: `backend/`, `contracts/`, `requirements/001-prd-escopometro-sgsi.md`, `docs/database.md`
- edit: `backend/src/modules/organizations/**`, `backend/src/modules/projects/**`, `backend/src/modules/module-instances/**`, `backend/src/modules/audit-log/**`, `backend/src/database/migrations/**` — **nao editar** `backend/src/modules/users/**` nem `backend/src/modules/auth/**`
- shell: `cd backend && npm run migration:generate`, `npm run migration:run`, `npm run lint`, `npm run test`
- git: local
- network/MCP: nenhum
- skill: nenhuma

### Paths permitidos para escrita

- `backend/src/modules/organizations/**`, `backend/src/modules/projects/**`, `backend/src/modules/module-instances/**`, `backend/src/modules/audit-log/**`, `backend/src/database/migrations/**`
- proibido por omissao: `backend/src/modules/users/**`, `backend/src/modules/auth/**` (ja existentes, fora do escopo desta task)

### Acoes que exigem human approval

- [x] migration / schema de banco — confirmar antes de rodar `migration:run` em qualquer ambiente compartilhado
- [ ] demais itens: nao se aplica

### Contexto proibido

- `.env` real do backend, `backend/dist/`, dados de outros projetos em `projetos/`

### Criterios de saida

- [ ] migration gerada e revisada antes de rodar
- [ ] lint/test passam
- [ ] nenhum arquivo de `modules/users` ou `modules/auth` foi alterado

## Criterios de conclusao

- Entidades criadas (exceto `User`, ja existente) e migration executavel sem erro em ambiente local
- FKs e constraints refletem o modelo do PRD secao 22, apontando corretamente para a tabela `users` existente

## Validacao esperada

- `npm run lint`, `npm run test`, `npm run migration:run` (dev)

## Entregaveis esperados

- Entidades TypeORM (`Organization`, `OrganizationMember`, `Project`, `ProjectMember`, `ModuleInstance`, `AuditLog` base) + migration em `backend/src/`

## Riscos ou ambiguidades

- Nome exato dos modulos deve seguir `backend/docs/ai/REPO_MAP.md`
- Confirmar se `AuditLog` (base) deve ja nascer nesta task ou ser adiado inteiramente para a Task 027 — recomenda-se criar a entidade/tabela aqui (schema estavel) e deixar a logica de gravacao para a Task 027

## Resultado da execucao

- Criadas as entidades TypeORM `OrganizationEntity`, `OrganizationMemberEntity`, `ProjectEntity`, `ProjectMemberEntity`, `ModuleInstanceEntity`, `AuditLogEntity`, todas referenciando `UserEntity` existente via FK (nao houve alteracao em `modules/users`).
- Enums reutilizaveis criados em `backend/src/common/enums/`: `MembershipRole` (`consultant`), `ProjectStatus` (6 valores do PRD secao 6), `ModuleKey` (`SGSI_SCOPE`), `AuditAction` (7 valores do PRD secao 21).
- Migration manual `1700000001000-CreateOrganizationsAndProjectsTables.ts` criada seguindo o mesmo estilo (raw `Table`/`TableForeignKey`/`TableIndex`) da migration existente `1700000000000-CreateUsersTable.ts`, cobrindo as 6 tabelas novas, FKs e indices unicos (`organization_members`, `project_members`, `module_instances`).
- `backend/src/database/typeorm.datasource.ts` atualizado com as 6 novas entidades na lista `entities`, para suportar `migration:generate` no futuro.
- Relacao com o slice: Slice 001 avanca (2/10 tasks concluidas); nao concluido.
- Trade-off: `Organization.values` implementado como `text[]` nativo do Postgres (`array: true`) em vez de tabela separada, por simplicidade no MVP.
- Relacao com contrato: entidades espelham exatamente os schemas `Organization`, `Project`, `ModuleInstance`, `AuditLog` do `contracts/openapi.yaml` (Task 001).
- Referencia visual: nao se aplica (task sem UI).

## Contexto utilizado

- Minimo: `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task, `tasks/slices/001-fundacao-plataforma.md`, handoff `TASK-001.md`.
- Sob demanda: `backend/docs/ai/BACKEND_PATTERNS.md`, `contracts/openapi.yaml`, `docs/database.md`, e leitura pontual de `backend/src/modules/users/entities/user.entity.ts`, `backend/src/database/migrations/1700000000000-CreateUsersTable.ts` e `backend/src/database/typeorm.datasource.ts` (para replicar convencao e nao duplicar `User`).
- Nao carregado: `backend/src/modules/auth/**` (nao envolvido nesta task), `mobile/`, `front-end/`.

## Security Constraints (compliance)

- Nivel de risco: alto | Perfil de origem: infra-risk
- Tools/paths usados: `read` em `backend/`, `contracts/`, `docs/database.md`; `edit` somente em `backend/src/modules/organizations/**`, `backend/src/modules/projects/**`, `backend/src/modules/module-instances/**`, `backend/src/modules/audit-log/**`, `backend/src/common/enums/**` (reutilizavel, dentro do espirito da allowlist), `backend/src/database/migrations/**`, `backend/src/database/typeorm.datasource.ts`. Nenhum arquivo de `modules/users` ou `modules/auth` foi alterado.
- Shell usado: `npm run lint` (com `--fix` pontual para formatacao), `npx tsc --noEmit`, `npm run test`. **`migration:run` nao foi executado** — nao ha Postgres/Docker disponivel neste ambiente de execucao.
- Human approvals: migration/schema de banco pedia confirmacao antes de `migration:run` em ambiente compartilhado — como o ambiente nao tem banco disponivel, a migration foi criada e validada por lint/typecheck, mas **nao executada**; execucao real fica pendente e deve ser aprovada/rodada quando houver um Postgres acessivel.
- Contexto proibido: respeitado.
- Criterios de saida de seguranca: parcial — lint/test/typecheck OK; "migration gerada e revisada antes de rodar" cumprido (revisada), mas a execucao (`migration:run`) ficou pendente por falta de ambiente, nao por falha de constraint.

## Handoff

- Caminho: `.agents/state/handoffs/TASK-002.md`
- Proximo contexto recomendado: para a Task 003, ler este handoff + `backend/src/modules/auth/**` e `backend/src/modules/users/**` (ja indicado no handoff da Task 001).

## Arquivos alterados

- `backend/src/common/enums/membership-role.enum.ts` (novo)
- `backend/src/common/enums/project-status.enum.ts` (novo)
- `backend/src/common/enums/module-key.enum.ts` (novo)
- `backend/src/common/enums/audit-action.enum.ts` (novo)
- `backend/src/modules/organizations/entities/organization.entity.ts` (novo)
- `backend/src/modules/organizations/entities/organization-member.entity.ts` (novo)
- `backend/src/modules/projects/entities/project.entity.ts` (novo)
- `backend/src/modules/projects/entities/project-member.entity.ts` (novo)
- `backend/src/modules/module-instances/entities/module-instance.entity.ts` (novo)
- `backend/src/modules/audit-log/entities/audit-log.entity.ts` (novo)
- `backend/src/database/migrations/1700000001000-CreateOrganizationsAndProjectsTables.ts` (novo)
- `backend/src/database/typeorm.datasource.ts`
- `tasks/002-setup-typeorm-postgres.md`, `tasks/000-index.md`, `.agents/state/handoffs/TASK-002.md` (novo)

## Validacoes executadas

- `npm run lint`: OK (apos `--fix` de formatacao)
- `npx tsc --noEmit`: OK, sem erros de tipo
- `npm run test`: OK (1 suite, 1 teste — suite existente de `users`, sem regressao)
- `npm run migration:run`: **nao executado** (sem Postgres disponivel neste ambiente)

## Aderencia ao design system

nao se aplica (task sem UI)

## Pendencias pos-task

- Executar `npm run migration:run:prod` **dentro do container na Hostinger** (`docker compose exec api npm run migration:run:prod`) antes de considerar o schema realmente aplicado — producao do backend e a VPS Hostinger via Docker, front-end e Vercel. Ao investigar isso, foi encontrado e corrigido um gap separado: o `Dockerfile` de producao nao copiava `scripts/` nem tinha script que rodasse sem `ts-node` (devDependency ausente no runtime image) — ver `migration-run-prod.mjs`/`seed-admin-prod.mjs` e `npm run migration:run:prod`/`npm run seed:admin:prod`, adicionados fora desta task original.
- Confirmar politica de exclusao de organizacao/projeto com dependencias (registrado tambem nas Tasks 005/006).
- Decidir se `Project.participantUserIds` usara `ProjectMember` como fonte unica (recomendado) na Task 006.

## Status final

done
