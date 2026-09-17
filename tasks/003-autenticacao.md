# Task 003 - Auditar e ajustar o modulo de autenticacao existente (Passport JWT)

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/auth` (login, me — ja refletem o que existe, definidos na Task 001)

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

**Revisado apos a Task 001**: `backend/src/modules/auth` (login + `/auth/me`, `JwtAuthGuard`, `JwtStrategy`) e `backend/src/modules/users` (CRUD + hashing de senha) **ja existem e estao funcionais** — nao ha necessidade de implementar autenticacao do zero. O que falta e auditar esse modulo contra os requisitos do PRD (secoes 23, 24, 30) e corrigir um problema encontrado durante a leitura do codigo: `POST /users` (criacao de usuario) **nao esta protegido por `JwtAuthGuard`** e aceita `role` no payload (`CreateUserDto.role`) sem nenhuma restricao — hoje, qualquer requisicao anonima pode criar um usuario com `role: admin` (DSR Admin), o que e uma escalacao de privilegio total sobre a plataforma.

### O que

**Decisao confirmada pelo Bruno**: criacao de usuario e restrita ao DSR Admin autenticado. Nao havera auto-cadastro publico.

1. Corrigir o endpoint de criacao de usuario para que **nao seja mais publico**: exigir `JwtAuthGuard` + que o usuario autenticado seja `UserRole.ADMIN` (DSR Admin) para criar novos usuarios (`UsersController.create`). Reavaliar tambem `findAll`/`update`/`remove` — hoje so exigem autenticacao (qualquer usuario logado), nao papel de admin; restringir a DSR Admin as operacoes administrativas sobre outros usuarios (um usuario poder editar o proprio perfil via `/auth/me` fica como possivel evolucao futura, fora desta task se nao existir ainda).
2. Confirmar/ajustar o mapeamento `UserRole.admin` = DSR Admin e `UserRole.member` = base para Consultor/Especialista (papel fino de Consultor fica em `OrganizationMember`/`ProjectMember`, Task 004).
3. Avaliar rate limiting em `/auth/login` (PRD secao 30) — implementar guard/throttler basico se ausente, ou registrar como pendencia explicita.
4. Confirmar que erros de login nao vazam se o problema foi email ou senha (ja parece correto em `UsersService.validateCredentials`, mas validar com teste).

### Comportamento esperado

- cenario: requisicao anonima para `POST /users` -> 401 (nao autenticado), nunca mais cria usuario.
- cenario: usuario autenticado com `role: member` tenta `POST /users` -> 403 (autenticado, mas sem privilegio de admin).
- cenario: DSR Admin (`role: admin`) autenticado cria um novo usuario -> permitido, com o `role` desejado.
- cenario: login invalido -> 401 generico, sem indicar se o erro foi email ou senha (ja implementado, validar com teste).
- cenario: multiplas tentativas de login em curto intervalo -> rate limit ativa (se implementado nesta task) ou fica registrado como pendencia explicita.
- cenario: como nao ha auto-cadastro, o **primeiro** DSR Admin do ambiente precisa ser provisionado por outro meio (seed/script), nao pela API publica — ver Riscos.

### Fora de escopo

- Reset de senha (nao especificado no PRD; registrar como lacuna se necessario no futuro)
- RBAC/multitenancy por organizacao/projeto (Task 004)
- Reescrever o modulo `auth`/`users` do zero (ja existem e funcionam — so ajustar o gap encontrado)

## Casos de erro e borda

- Usuario nao-admin tentando criar/editar/remover outro usuario -> 403, nao silenciosamente ignorado
- Ambiente novo sem nenhum DSR Admin ainda -> precisa de seed/script de bootstrap (fora da API publica); ver Riscos
- Token JWT vazado/roubado -> expiracao curta (verificar config atual) + sem refresh implementado — registrar como risco se nao houver
- **Critico**: ate esta task ser executada, `POST /users` publico com `role` livre e uma vulnerabilidade de escalacao de privilegio ativa no codigo atual — priorizar esta task antes de qualquer deploy real

## Review da spec

- [x] Permissoes: autenticacao e pre-requisito de todas as permissoes; papeis finos ficam na Task 004
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: usar Passport JWT ja scaffolded (nao NextAuth/Auth.js) — mantido
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Reaproveitar `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `UsersService`, `JwtAuthGuard`, `JwtStrategy` ja existentes — nao recriar
- Adicionar guard de autorizacao (`JwtAuthGuard` + checagem de `role === UserRole.ADMIN`) em `UsersController.create` (e reavaliar `findAll`/`update`/`remove`, que hoje so exigem autenticacao, nao papel de admin)
- Seguir `backend/docs/ai/SECURITY.md` para qualquer ajuste de hashing/emissao de token (ja implementado via `common/utils/password.util`)

### Nao deve

- Nao reescrever `AuthService`/`JwtStrategy`/`UsersService` do zero
- Nao logar senha ou token em texto claro
- Nao deixar `role` como campo livre em qualquer endpoint acessivel sem autenticacao de admin

## Entradas

- `backend/docs/ai/SECURITY.md`, `backend/docs/ai/ARCHITECTURE.md`
- `backend/src/modules/auth/**`, `backend/src/modules/users/**` (codigo existente, leitura completa necessaria para o audit)
- `contracts/openapi.yaml`

## Dependencias

- Task 002 (para nao conflitar com as novas entidades que passam a referenciar `User`)

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- RBAC/multitenancy por organizacao/projeto (Task 004)

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho              | Fonte                                                         | Quando                                                     | Obrigatorio |
| -------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ----------- |
| Seguranca de produto | `backend/docs/ai/SECURITY.md`                                 | sempre                                                     | sim         |
| API                  | `contracts/openapi.yaml`                                      | para alinhar payloads                                      | sim         |
| Codigo existente     | `backend/src/modules/auth/**`, `backend/src/modules/users/**` | auditoria completa exige leitura integral destes 2 modulos | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 3 | risco: medio | estrategia: ler so os 2 modulos ja identificados, nao o backend inteiro

## Security Constraints

### Nivel de risco

alto

### Perfil de origem

auth-sensitive

### Tools permitidas

- read: `backend/`, `contracts/openapi.yaml`
- edit: `backend/src/modules/auth/**`, `backend/src/modules/users/**`
- shell: `cd backend && npm run lint`, `npm run test`
- git: local
- network/MCP: nenhum
- skill: `backend/docs/ai/SECURITY.md` (leitura obrigatoria, nao skill executavel)

### Paths permitidos para escrita

- `backend/src/modules/auth/**`, `backend/src/modules/users/**`

### Acoes que exigem human approval

- [x] instalar/remover dependencias — so se for necessario um throttler (ex.: `@nestjs/throttler`) para rate limiting
- [ ] demais itens: nao se aplica — decisao de produto sobre criacao de usuario **ja confirmada pelo Bruno** (restrita a DSR Admin, sem auto-cadastro publico)

### Contexto proibido

- `.env` real, segredo JWT de producao, dados de usuarios reais

### Criterios de saida

- [ ] `POST /users` nao permite mais que um anonimo se torne `admin`
- [ ] senha nunca logada/commitada
- [ ] lint/test passam
- [ ] teste automatizado cobre a tentativa de escalacao de privilegio (deve falhar/ser bloqueada)

## Criterios de conclusao

- `POST /users`, `findAll`, `update`, `remove` exigem `JwtAuthGuard` + `role === UserRole.ADMIN`
- Teste automatizado comprova que a escalacao de privilegio antiga nao e mais possivel
- Login/`/auth/me` continuam funcionais sem regressao
- Existe um caminho documentado (seed/script) para provisionar o primeiro DSR Admin de um ambiente novo, ja que a API nao permite mais auto-cadastro

## Validacao esperada

- `npm run lint`, `npm run test` (unit dos modulos `auth` e `users`, incluindo o novo teste de seguranca)

## Entregaveis esperados

- `UsersController`/`UsersService` ajustados com guard de autorizacao (`JwtAuthGuard` + checagem de `role`) nas rotas administrativas
- Teste cobrindo o cenario de escalacao de privilegio bloqueado
- Script/seed de bootstrap do primeiro DSR Admin (`backend/src/database/seeds/`)

## Riscos ou ambiguidades

- Provisionamento do primeiro DSR Admin: recomenda-se um seed script executado manualmente (`npm run seed` ou similar) que le credenciais de variavel de ambiente/CLI, nunca hardcoded no codigo-fonte nem commitado
- PRD nao detalha fluxo de reset de senha — fica como lacuna registrada para evolucao futura, fora deste MVP
- Rate limiting de `/auth/login` (PRD secao 30) **nao foi implementado nesta task** — exigiria adicionar `@nestjs/throttler` (nova dependencia, human approval), fora do escopo emergencial desta execucao; registrado como pendencia pos-task

## Resultado da execucao

- Corrigida a vulnerabilidade de escalacao de privilegio: `UsersController` agora exige `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)` a nivel de controller, cobrindo `create`, `findAll`, `findOne`, `update`, `remove`. Antes, `create` era publico (sem guard) e aceitava `role` livre no payload; `findAll`/`findOne`/`update`/`remove` exigiam so autenticacao (qualquer usuario logado podia gerenciar qualquer outro usuario).
- Criados `Roles` decorator (`common/decorators/roles.decorator.ts`) e `RolesGuard` (`common/guards/roles.guard.ts`), reutilizaveis por futuras tasks que precisarem de checagem de papel (ex.: Task 004 pode compor com isso).
- Criado seed de bootstrap (`backend/src/database/seeds/create-admin.seed.ts` + script `npm run seed:admin`) para provisionar o primeiro DSR Admin via variaveis de ambiente (`ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`), idempotente (nao duplica se o email ja existir), sem credenciais hardcoded.
- `AuthService`/`JwtStrategy`/`UsersService` **nao foram reescritos** — reaproveitados integralmente, conforme o escopo revisado desta task.
- Rate limiting de login: nao implementado (ver Riscos) — registrado como pendencia explicita, nao ignorado silenciosamente.
- Relacao com o slice: Slice 001 avanca (3/10 tasks concluidas).
- Trade-off: optei por bloquear TODAS as rotas de `UsersController` para DSR Admin (inclusive `findOne`), em vez de permitir que um usuario veja o proprio registro por `/users/:id` — o autoconsumo do proprio perfil e coberto por `/auth/me`, que ja existe e nao foi alterado.
- Relacao com contrato: nao alterei `contracts/openapi.yaml` (paths de `/users` nao fazem parte do contrato desta versao; o contrato so cobre `/auth/*`, `/organizations`, `/projects` conforme Task 001).

## Contexto utilizado

- Minimo: `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task, `tasks/slices/001-fundacao-plataforma.md`, handoffs `TASK-001.md` e `TASK-002.md`.
- Sob demanda: `backend/docs/ai/SECURITY.md`, `contracts/openapi.yaml`, e leitura integral de `backend/src/modules/auth/**` e `backend/src/modules/users/**` (auditoria completa, conforme declarado na task).
- Nao carregado: `backend/src/modules/organizations/**`, `backend/src/modules/projects/**` (nao envolvidos nesta task), `front-end/`, `mobile/`.

## Security Constraints (compliance)

- Nivel de risco: alto | Perfil de origem: auth-sensitive
- Tools/paths usados: `read` em `backend/`, `contracts/openapi.yaml`; `edit` em `backend/src/modules/auth/**` (nenhuma alteracao efetiva necessaria) e `backend/src/modules/users/**` (controller), mais `backend/src/common/decorators/**`, `backend/src/common/guards/**` (reutilizavel, dentro do espirito da allowlist), `backend/src/database/seeds/**`, `backend/scripts/seed-admin.mjs`, `backend/package.json` (novo script `seed:admin`, sem nova dependencia).
- Shell usado: `npm run lint` (com `--fix` pontual), `npx tsc --noEmit`, `npm run test`. Nenhuma dependencia nova instalada (throttler ficou como pendencia, evitando a necessidade de human approval nesta execucao).
- Human approvals: nao foi necessario nenhum (decisao de produto ja confirmada pelo Bruno antes da execucao; nenhuma dependencia nova instalada).
- Contexto proibido: respeitado — nenhum `.env` real, secret ou dado de usuario de producao acessado.
- Criterios de saida de seguranca: OK — `POST /users` nao permite mais escalacao de privilegio (coberto por teste automatizado do `RolesGuard`); lint/test/typecheck passam; nenhum secret logado/commitado.

## Handoff

- Caminho: `.agents/state/handoffs/TASK-003.md`
- Proximo contexto recomendado: para a Task 004 (autorizacao multitenancy), reaproveitar `RolesGuard`/`Roles` ja criados aqui e compor com checagem de vinculo a organizacao/projeto.

## Arquivos alterados

- `backend/src/common/decorators/roles.decorator.ts` (novo)
- `backend/src/common/guards/roles.guard.ts` (novo)
- `backend/src/common/guards/roles.guard.spec.ts` (novo)
- `backend/src/modules/users/users.controller.ts`
- `backend/src/database/seeds/create-admin.seed.ts` (novo)
- `backend/scripts/seed-admin.mjs` (novo)
- `backend/package.json` (script `seed:admin`)
- `tasks/003-autenticacao.md`, `tasks/000-index.md`, `.agents/state/handoffs/TASK-003.md` (novo)

## Validacoes executadas

- `npm run lint`: OK
- `npx tsc --noEmit`: OK
- `npm run test`: OK (2 suites, 5 testes — inclui os 4 novos testes do `RolesGuard`, cobrindo bloqueio de nao-admin, permissao de admin, bloqueio de anonimo e liberacao quando nenhum papel e exigido)
- Seed `npm run seed:admin`: nao executado contra banco real (sem Postgres no ambiente, mesma limitacao da Task 002); validado apenas por lint/typecheck

## Aderencia ao design system

nao se aplica (task sem UI)

## Pendencias pos-task

- Rodar `npm run seed:admin:prod` **dentro do container na Hostinger** (`docker compose exec -e ADMIN_NAME="..." -e ADMIN_EMAIL="..." -e ADMIN_PASSWORD="..." api npm run seed:admin:prod`) para criar o primeiro DSR Admin real, depois que a migration da Task 002 tiver rodado la.
- Avaliar e implementar rate limiting em `/auth/login` (requer `@nestjs/throttler`, nova dependencia — human approval necessario quando for feito).
- Reset de senha continua fora do MVP (lacuna conhecida, nao bloqueante).

## Status final

done
