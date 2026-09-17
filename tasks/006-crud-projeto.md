# Task 006 - CRUD Projeto (status, participantes, ativacao de modulos)

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/projects`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Projeto e onde os modulos (a comecar pelo Escopometro) sao ativados; precisa existir com status e participantes antes de qualquer modulo.

### O que

CRUD de Projeto com campos do PRD secao 6 (nome, organizacao, descricao, responsavel, participantes, datas, status, modulos ativos) e enum de status (`DRAFT, IN_PROGRESS, IN_REVIEW, WAITING_APPROVAL, APPROVED, ARCHIVED`).

### Comportamento esperado

- cenario: criar projeto vinculado a organizacao existente -> sucesso, status inicial `DRAFT`.
- cenario: criar projeto com `organizationId` inexistente ou de outra organizacao sem vinculo -> 400/403.
- cenario: mudar status de projeto -> registra em `AuditLog` (integracao leve com Task 027, ou placeholder se ainda nao existir).

### Fora de escopo

- Ativacao do ModuleInstance do Escopometro em si (Task 011 cria a entidade; esta task so define `modulos ativos` como campo/relacao)

## Casos de erro e borda

- Transicao de status invalida (ex.: `ARCHIVED` -> `DRAFT`) -> decidir se e permitido; se PRD nao especifica, registrar como pendencia e no MVP permitir livremente com log em AuditLog
- Projeto sem participantes -> permitido (responsavel e obrigatorio, participantes nao)

## Review da spec

- [x] Permissoes: criacao/edicao exige vinculo a organizacao (Task 004)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: enum de status conforme PRD secao 6
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima) — transicao de status registrada como pendencia
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Reusar guard da Task 004
- Implementar soft delete (`deletedAt`, PRD secao 28)

### Nao deve

- Nao permitir criar projeto sem `organizationId` valido e autorizado

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#6`

## Dependencias

- Task 005

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- ModuleInstance do Escopometro (Task 011)

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho | Fonte                    | Quando | Obrigatorio |
| ------- | ------------------------ | ------ | ----------- |
| API     | `contracts/openapi.yaml` | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

medio

### Perfil de origem

api-back

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/projects/**`
- shell: `cd backend && npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/projects/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de projetos/clientes

### Criterios de saida

- [x] guard de acesso aplicado
- [x] lint/test passam

## Criterios de conclusao

- [x] CRUD completo de Projeto com status, participantes e vinculo a organizacao validado

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Modulo `projects` (controller, service, DTOs)

## Riscos ou ambiguidades

- Regras de transicao de status nao estao explicitas no PRD — **decisao adotada (nao confirmada com o Bruno)**: qualquer transicao e permitida livremente no MVP, apenas registrando `AuditLog` (`STATUS_CHANGE`) com o `from`/`to`. Nenhuma transicao e bloqueada.

## Resultado da execucao

- Nenhuma migration nova foi necessaria: `ProjectEntity`/`ProjectMemberEntity`/`AuditLogEntity` e o enum `ProjectStatus` ja existiam identicos ao contrato desde a Task 002 (o item de human approval da task nao chegou a se aplicar).
- `ProjectInputDto` espelha o schema `ProjectInput` (mesmo DTO em `POST`/`PATCH`; `status` opcional).
- `ProjectsService.create` valida acesso a organizacao via `OrganizationsAccessService` (Task 004) antes de criar — organizacao inexistente -> 404, sem vinculo -> 403. Valida tambem que `responsibleUserId` e cada `participantUserIds[]` existem (`UsersService.findOne`, 404 se nao existir), evitando erro de FK cru do Postgres.
- Ao criar, o responsavel, o usuario autenticado (criador) e os participantes informados viram `ProjectMember` automaticamente — necessario para que `ProjectAccessGuard` (Task 004) nao bloqueie o proprio criador em requests seguintes.
- `ProjectsService.update` so revalida acesso a organizacao/responsavel quando esses campos mudam; participantes/responsavel novos sao adicionados como `ProjectMember` (participantes removidos do payload **nao** perdem o vinculo automaticamente — decisao de escopo, ver pendencia).
- Mudanca de `status` no update grava um `AuditLogEntity` (`action: STATUS_CHANGE`, `metadata: { from, to }`); nenhuma transicao e bloqueada.
- `participantUserIds` na resposta e sempre recalculado a partir da tabela `project_members` (excluindo o `responsibleUserId`), nunca apenas ecoado do payload.
- `DELETE /projects/:projectId` faz soft delete sem bloqueio (diferente da Organizacao, nao ha uma entidade "abaixo" de Projeto nesta task que justifique bloquear).

## Arquivos alterados

- Criado: `backend/src/modules/projects/dto/project-input.dto.ts`
- Criado: `backend/src/modules/projects/projects.service.ts`
- Criado: `backend/src/modules/projects/projects.service.spec.ts`
- Criado: `backend/src/modules/projects/projects.controller.ts`
- Modificado: `backend/src/modules/projects/projects.module.ts` (controller/service registrados; importa `OrganizationsModule` e `UsersModule`; registra `AuditLogEntity` via TypeORM)

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run test`: executado com sucesso (8 suites, 31 testes)
- `npm run build`: executado com sucesso

## Pendencias pos-task

- Confirmar com o Bruno se alguma transicao de status deve ser bloqueada (ex.: `ARCHIVED -> DRAFT`). Assumido "permitir livremente" como default do MVP.
- `update` nao remove `ProjectMember` de participantes tirados do payload (apenas adiciona novos). Se o comportamento esperado for sincronizacao total (remover quem saiu da lista), precisa de confirmacao e ajuste.
- Sem smoke test contra Postgres real ainda (apenas testes unitarios com repositorio mockado).

## Status final

done
