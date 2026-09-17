# Handoff - Task 011

## Identificador da task

Task 011 - Ativacao ModuleInstance Escopometro + SgsiScope/SgsiScopeVersion/DocumentControl + autosave

## Slice vertical

Slice 002 - Escopometro: Empresa & Contexto (`tasks/slices/002-escopometro-empresa-contexto.md`)
— **primeira task do slice.**

## Status final

done

## Decisoes preservadas

- Contrato (`contracts/openapi.yaml`) recebeu os paths `/projects/{id}/modules`,
  `/projects/{id}/sgsi-scope`, `/projects/{id}/sgsi-scope/document-control` — nao
  existiam antes, apesar da task ja os referenciar. Aprovado pelo Bruno antes de editar
  fora do path de escrita declarado da task.
- Migration `1700000002000-CreateSgsiScopeTables` (tabelas `sgsi_scopes`,
  `sgsi_scope_versions`, `document_controls`) criada com aprovacao explicita do Bruno.
  **Ainda nao executada** contra Postgres real (sem banco neste ambiente) — rodar no
  proximo deploy (`migration:run:prod` na Hostinger, mesmo fluxo das Tasks 002/005/006).
- Ativacao de modulo e idempotente via o unique index `(project_id, module_key)` de
  `module_instances` (ja existia desde a Task 002) — nao precisou de coluna nova ali.
- Autosave e "por secao" (um endpoint por secao da Escopometro), nao campo a campo —
  segue a propria recomendacao da task. `DocumentControl` e a unica secao concreta
  entregue aqui; futuras secoes (Contexto, Requisitos, etc., Tasks 012+) devem seguir o
  mesmo padrao de endpoint proprio com DTO totalmente opcional.
- Todas as rotas ficam sob `/projects/:projectId/...`, reusando `JwtAuthGuard` +
  `ProjectAccessGuard` (Task 004) direto no controller — sem guard novo.
- Sequencia de criacao (ModuleInstance -> SgsiScope -> SgsiScopeVersion -> DocumentControl)
  **nao usa transacao SQL explicita** — risco de registro orfao em caso de falha no meio,
  aceito como divida tecnica de MVP (ver pendencia).

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 010.
- `requirements/001-prd-escopometro-sgsi.md` secoes 7, 8.2, 18, 19, 20.
- `docs/architecture.md`/`docs/database.md` (Task 010) para alinhar com o que ja estava
  documentado sobre versionamento/auditoria planejados.

## Compliance de Security Constraints

- Risco medio / perfil `api-back`. Migration/schema de banco — human approval obtida
  antes de escrever a migration. Nenhuma dependencia nova instalada.

## Arquivos alterados

- Criados: `common/enums/sgsi-scope-version-status.enum.ts`,
  `modules/sgsi-scope/entities/{sgsi-scope,sgsi-scope-version,document-control}.entity.ts`,
  `modules/sgsi-scope/dto/{activate-module,update-document-control}.dto.ts`,
  `modules/sgsi-scope/sgsi-scope.service.ts` (+spec), `modules/sgsi-scope/sgsi-scope.controller.ts`,
  `modules/sgsi-scope/sgsi-scope.module.ts`,
  `database/migrations/1700000002000-CreateSgsiScopeTables.ts`.
- Modificados: `app.module.ts` (registro do modulo), `contracts/openapi.yaml` (+3 paths, +6 schemas).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK, `npm run test` OK (9
  suites / 36 testes, incluindo idempotencia de ativacao e autosave parcial).
- `contracts/openapi.yaml` validado com `js-yaml` (parse OK).
- Migration nao executada contra banco real neste ambiente.

## Pendencias ou bloqueios

- Rodar a migration no proximo deploy a Hostinger.
- Falta de transacao SQL na sequencia de ativacao (risco de registro orfao).
- Autosave concorrente (duas abas) e last-write-wins, sem lock otimista — limitacao
  conhecida, ja prevista pela propria task.

## Proximo contexto recomendado

Task 012 (Contexto organizacional — Etapa 2): seguir o mesmo padrao desta task para
autosave por secao ao criar as entidades `OrganizationContext`/`OrganizationValue`/`ContextAspect`.
Reusar `ProjectAccessGuard` da mesma forma (rotas sob `/projects/:projectId/...`).
