# Handoff - Task 005

## Identificador da task

Task 005 - CRUD Organizacao

## Slice vertical

Slice 001 - Fundacao da plataforma (`tasks/slices/001-fundacao-plataforma.md`)

## Status final

done

## Decisoes preservadas

- `OrganizationInputDto` e o mesmo DTO para `POST` e `PATCH` (espelha o schema `OrganizationInput` do contrato, `name` sempre obrigatorio).
- Criador da organizacao sempre vira `OrganizationMember` (papel `CONSULTANT`), mesmo quando e DSR Admin.
- Listagem (`GET /organizations`) filtra por vinculo: DSR Admin ve todas, demais usuarios veem apenas as organizacoes onde tem `OrganizationMember`.
- `DELETE /organizations/:organizationId` bloqueia (409) quando ha projetos nao deletados vinculados, em vez de cascatear soft delete — decisao registrada como pendencia, **nao confirmada com o Bruno**.
- Rotas com `:organizationId` aplicam `OrganizationAccessGuard` (Task 004) alem do `JwtAuthGuard` do controller.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 004.
- `contracts/openapi.yaml` (paths `/organizations` e `/organizations/{id}`, schemas `Organization`/`OrganizationInput`).

## Compliance de Security Constraints

- Risco medio / perfil `api-back`. Nenhuma migration nova (todos os campos do PRD secao 5 ja existiam desde a Task 002), entao o item de human approval da task nao se aplicou. Guard de acesso aplicado nas rotas com `:organizationId`.

## Arquivos alterados

- Criados: `modules/organizations/dto/organization-input.dto.ts`, `modules/organizations/organizations.service.ts` (+spec), `modules/organizations/organizations.controller.ts`.
- Modificado: `modules/organizations/organizations.module.ts` (controller/service registrados; import de `ProjectEntity` apenas para leitura na checagem de exclusao).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK, `npm run test` OK (7 suites / 26 testes).

## Pendencias ou bloqueios

- Confirmar com o Bruno a politica de exclusao de organizacao com projetos ativos (bloquear vs. cascatear).
- Sem smoke test contra Postgres real ainda (so testes unitarios com repositorio mockado).

## Proximo contexto recomendado

Para a Task 006 (CRUD Projeto): seguir o mesmo padrao desta task (DTO espelhando `ProjectInput`, `ProjectAccessGuard` da Task 004 nas rotas `:projectId`, filtro de listagem por vinculo). Atencao: `ProjectStatus` no contrato (`DRAFT, IN_PROGRESS, IN_REVIEW, WAITING_APPROVAL, APPROVED, ARCHIVED`) precisa ser conferido contra `backend/src/common/enums/project-status.enum.ts` (criado na Task 002) antes de reusar.
