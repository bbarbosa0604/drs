# Handoff - Task 006

## Identificador da task

Task 006 - CRUD Projeto (status, participantes, ativacao de modulos)

## Slice vertical

Slice 001 - Fundacao da plataforma (`tasks/slices/001-fundacao-plataforma.md`)

## Status final

done

## Decisoes preservadas

- `ProjectInputDto` e o mesmo DTO para `POST`/`PATCH` (espelha `ProjectInput` do contrato); `status` e opcional.
- Criacao de projeto valida acesso a organizacao via `OrganizationsAccessService` (Task 004): 404 se a org nao existe, 403 sem vinculo. Tambem valida existencia de `responsibleUserId` e de cada `participantUserIds[]` via `UsersService.findOne` (404 se algum nao existir), evitando erro de FK cru do Postgres.
- Responsavel, criador e participantes viram `ProjectMember` automaticamente na criacao (necessario para o proprio criador nao ser bloqueado pelo `ProjectAccessGuard` depois).
- `update` so revalida organizacao/responsavel quando esses campos mudam de valor; participantes removidos do payload **nao** perdem `ProjectMember` automaticamente (so adiciona novos) — pendente de confirmacao se o esperado e sincronizacao total.
- Mudanca de `status` grava `AuditLogEntity` (`STATUS_CHANGE`, `metadata: {from, to}`); **nenhuma transicao de status e bloqueada** no MVP (decisao assumida, nao confirmada com o Bruno).
- `participantUserIds` na resposta e sempre recalculado a partir de `project_members` (nunca ecoado cru do payload).

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 005.
- `contracts/openapi.yaml` (paths `/projects`, `/projects/{id}`, schemas `Project`/`ProjectInput`/`ProjectStatus`).
- `common/enums/project-status.enum.ts`, `common/enums/audit-action.enum.ts`, `modules/audit-log/entities/audit-log.entity.ts` (ja existentes desde a Task 002, sem alteracao).

## Compliance de Security Constraints

- Risco medio / perfil `api-back`. Sem migration nova (schema ja existia identico ao contrato desde a Task 002), entao o item de human approval nao se aplicou de fato. Guard de acesso (`ProjectAccessGuard`) aplicado em todas as rotas com `:projectId`.

## Arquivos alterados

- Criados: `modules/projects/dto/project-input.dto.ts`, `modules/projects/projects.service.ts` (+spec), `modules/projects/projects.controller.ts`.
- Modificado: `modules/projects/projects.module.ts` (controller/service registrados; agora importa `OrganizationsModule` e `UsersModule`; registra `AuditLogEntity` via TypeORM).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK, `npm run test` OK (8 suites / 31 testes).

## Pendencias ou bloqueios

- Confirmar com o Bruno se alguma transicao de status deve ser bloqueada (ex.: `ARCHIVED -> DRAFT`).
- Confirmar se `update` deveria sincronizar totalmente os participantes (remover quem saiu da lista) em vez de so adicionar novos.
- Sem smoke test contra Postgres real ainda.

## Proximo contexto recomendado

A Task 007 (design tokens/shell) e front-end (next-js), fora do escopo deste agente de backend. Se a proxima execucao continuar no backend, revisar as duas pendencias acima antes de avancar para tasks que dependam do ciclo de vida completo de Projeto (ex.: Task 011 - ativacao do modulo Escopometro).
