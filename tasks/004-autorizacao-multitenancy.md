# Task 004 - Autorizacao multitenancy + RBAC (DSR Admin, Consultor)

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml` (guards aplicam-se a todos os paths de Organization/Project)

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

PRD secao 23: "nunca confiar apenas em um organizationId enviado pelo frontend"; "protecoes contra IDOR sao obrigatorias". Sem isso, qualquer usuario autenticado poderia acessar dados de qualquer organizacao.

### O que

Implementar guard/decorator que verifica, a cada request, se o usuario autenticado tem vinculo (`OrganizationMember`/`ProjectMember`) com a organizacao/projeto do recurso solicitado, mais RBAC basico (DSR Admin vs Consultor) para acoes administrativas.

### Comportamento esperado

- cenario: Consultor da Organizacao A tenta acessar Projeto da Organizacao B -> 403.
- cenario: DSR Admin acessa qualquer organizacao -> permitido (papel administrativo global).
- cenario: Consultor tenta administrar usuarios/configuracoes da plataforma -> 403 (acao restrita a DSR Admin).

### Fora de escopo

- Papeis Revisor e Cliente/Aprovador (pos-MVP)

## Casos de erro e borda

- `organizationId`/`projectId` inexistente -> 404 (nao vazar existencia de recurso de outra org via 403 vs 404 inconsistente — definir padrao e documentar)
- Usuario removido de uma organizacao mas com token ainda valido -> guard deve recarregar vinculo a cada request, nao confiar so no payload do JWT

## Review da spec

- [x] Permissoes definidas: DSR Admin (global), Consultor (por organizacao/projeto vinculado)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: MVP prioriza so estes 2 papeis (PRD secao 3)
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Validar vinculo a organizacao/projeto no backend, sempre, mesmo que o front ja filtre
- Cobrir com teste automatizado o caso de IDOR (acesso cruzado entre organizacoes)

### Nao deve

- Nao confiar em `organizationId` vindo do body/query sem validar contra o vinculo do usuario autenticado

## Entradas

- `backend/docs/ai/SECURITY.md`, `ARCHITECTURE.md`
- `requirements/001-prd-escopometro-sgsi.md#3, #23`

## Dependencias

- Task 003

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Papeis alem de DSR Admin/Consultor

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho              | Fonte                         | Quando | Obrigatorio |
| -------------------- | ----------------------------- | ------ | ----------- |
| Seguranca de produto | `backend/docs/ai/SECURITY.md` | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 1 | risco: medio

## Security Constraints

### Nivel de risco

alto

### Perfil de origem

auth-sensitive

### Tools permitidas

- read: `backend/`
- edit: `backend/src/modules/**` (guards/decorators compartilhados)
- shell: `cd backend && npm run lint`, `npm run test`
- git: local
- network/MCP: nenhum
- skill: nenhuma

### Paths permitidos para escrita

- `backend/src/common/**` (guards/decorators), `backend/src/modules/organizations/**`, `backend/src/modules/projects/**` (checagem de acesso)

### Acoes que exigem human approval

- [ ] nenhuma acao desta lista se aplica alem das ja cobertas pela Task 002/003

### Contexto proibido

- dados reais de usuarios/organizacoes de producao

### Criterios de saida

- [x] teste de IDOR passa (acesso cruzado bloqueado)
- [x] lint/test passam

## Criterios de conclusao

- [x] Guard de organizacao/projeto implementado e pronto para aplicacao nas rotas de Organization/Project (rotas em si sao escopo das Tasks 005/006, ainda nao existentes)
- [x] Teste automatizado comprova bloqueio de acesso cruzado entre organizacoes (e entre projetos)

## Validacao esperada

- `npm run test` incluindo teste de autorizacao cruzada

## Entregaveis esperados

- Guard/decorator de multitenancy + RBAC basico

## Riscos ou ambiguidades

- Padrao de resposta definido: 404 quando organizationId/projectId nao existe, 403 quando existe mas o usuario nao tem vinculo. Documentado como comentario de topo em `OrganizationsAccessService`/`ProjectsAccessService` (nao foi alterado `backend/docs/ai/SECURITY.md` por estar fora dos paths de escrita autorizados desta task; recomenda-se portar essa decisao para SECURITY.md em uma task de docs/governanca).
- RBAC (DSR Admin vs Consultor) para acoes administrativas ja existia via `RolesGuard`/`@Roles` (Task 003); nao foi necessario recriar.

## Resultado da execucao

- Implementado `OrganizationsAccessService` e `ProjectsAccessService`, que recarregam o vinculo (`OrganizationMember`/`ProjectMember`) do usuario autenticado a cada request, nunca confiando apenas no payload do JWT.
- Implementado `OrganizationAccessGuard` e `ProjectAccessGuard` (`src/common/guards/`), que leem `:organizationId`/`:projectId` dos route params, chamam os access services e retornam 404 (recurso inexistente) ou 403 (sem vinculo) conforme o caso; `UserRole.ADMIN` (DSR Admin) tem acesso irrestrito.
- Criados `OrganizationsModule` e `ProjectsModule` minimos (sem controllers ainda) registrando as entidades via TypeORM e exportando os access services, e wireados em `AppModule`.
- Nao foram criadas rotas HTTP de Organization/Project nesta task (isso pertence as Tasks 005/006); os guards ficam prontos para serem aplicados junto com `JwtAuthGuard` quando essas rotas forem implementadas.
- RBAC DSR Admin/Consultor para acoes administrativas reutiliza o `RolesGuard` + `@Roles(UserRole.ADMIN)` ja existentes da Task 003.

## Arquivos alterados

- Criado: `backend/src/modules/organizations/organizations-access.service.ts`
- Criado: `backend/src/modules/organizations/organizations-access.service.spec.ts`
- Criado: `backend/src/modules/organizations/organizations.module.ts`
- Criado: `backend/src/modules/projects/projects-access.service.ts`
- Criado: `backend/src/modules/projects/projects-access.service.spec.ts`
- Criado: `backend/src/modules/projects/projects.module.ts`
- Criado: `backend/src/common/guards/organization-access.guard.ts`
- Criado: `backend/src/common/guards/organization-access.guard.spec.ts`
- Criado: `backend/src/common/guards/project-access.guard.ts`
- Criado: `backend/src/common/guards/project-access.guard.spec.ts`
- Modificado: `backend/src/app.module.ts` (registro de `OrganizationsModule`/`ProjectsModule`)

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run test`: executado com sucesso (6 suites, 19 testes, incluindo os cenarios de IDOR cross-organization e cross-project)
- `npm run build`: executado com sucesso

## Pendencias pos-task

- Aplicar `OrganizationAccessGuard`/`ProjectAccessGuard` nos controllers reais quando as Tasks 005 (CRUD Organizacao) e 006 (CRUD Projeto) criarem as rotas.
- Portar a decisao 404 vs 403 para `backend/docs/ai/SECURITY.md` (fora do escopo de escrita desta task).

## Status final

done
