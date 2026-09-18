# Handoff - Task 017

## Identificador da task

Task 017 - UI Etapa 3 Requisitos & CGSI

## Slice vertical

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo
(`tasks/slices/003-escopometro-requisitos-escopo.md`) — Tasks 015-017 concluidas; falta
so a Task 018 (UI Etapa 4) para o slice fechar.

## Status final

done

## Decisoes preservadas

- Biblioteca de requisitos vem 100% de `GET /requirements` (Task 015) — nunca hardcoded
  no componente, conforme a task exigia explicitamente.
- Requisito customizado (sem `requirementId`) e um campo separado do fluxo de busca na
  biblioteca, nao uma opcao dentro do mesmo formulario — mais claro para o usuario
  distinguir "escolher da biblioteca" de "criar um novo".
- `GovernanceBlock` reusa `useAutosave`/`AutosaveIndicator` (Tasks 011/013) para o
  comite, mas membros sao create/delete simples (sem autosave por campo, ja que sao
  registros de lista curtos).
- Sem edicao inline de itens ja criados (stakeholders, requisitos aplicados, membros) —
  so create/delete, matching o que a task pedia literalmente.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 016 (backend do slice) e Task 014 (padrao de UI por
  secao do Escopometro).
- `requirements/001-prd-escopometro-sgsi.md` secao 10.

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Nenhuma dependencia nova instalada. Nenhum acesso a
  `backend/` alem do contrato ja exposto.

## Arquivos alterados

- Criados: `services/sgsi-scope/requirements.service.ts`,
  `app/api/projects/[id]/sgsi-scope/{stakeholders,stakeholders/[stakeholderId],requirements,requirements/[projectRequirementId],governance,governance/members,governance/members/[memberId]}/route.ts`,
  `app/projects/[id]/sgsi-scope/requirements/page.tsx`,
  `modules/sgsi-scope/etapa-requisitos/{EtapaRequisitosForm,StakeholderBlock,RequirementsBlock,GovernanceBlock}.tsx`
  (+css).
- Modificado: `modules/sgsi-scope/StepNav.tsx` (href da Etapa 3).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK (27 rotas).
- Manual: redirect `/projects/:id/sgsi-scope/requirements` -> `/login` sem sessao
  confirmado. Fluxo completo (CRUD dos 3 blocos) nao testado contra backend real.

## Pendencias ou bloqueios

- Testar o fluxo completo contra o backend real apos deploy (incluindo a biblioteca
  legal seedada, Task 015).
- Sem edicao inline — so create/delete.

## Proximo contexto recomendado

Task 018 (UI Etapa 4 - Escopo, frontend): reusar o mesmo padrao (services, Route
Handlers BFF, `StepNav`, `useAutosave`) para `ScopeDefinition`/`ScopeCharacteristic`/
`ScopeBenefit` (backend ja pronto, Task 016) e exibir o percentual de preenchimento
(`GET .../fill-percentage`) em algum lugar visivel da UI.
