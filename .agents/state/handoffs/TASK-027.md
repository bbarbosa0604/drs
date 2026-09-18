# Handoff - Task 027

## Identificador da task

Task 027 - AuditLog + versionamento SgsiScopeVersion (protecao contra sobrescrita)

## Slice vertical

Slice 006 - Escopometro: Previa, Documentos & Productizacao — **fecha o slice e o
backlog atual** (Tasks 001-027 todas `done`).

## Status final

done

## Decisoes preservadas

- `AuditLogService.record()` e o unico ponto de gravacao daqui para frente — servicos
  novos devem chamar isso, nunca criar/salvar `AuditLogEntity` direto (o padrao antigo
  de `ProjectsService.update`, de antes deste service existir, ficou registrado como
  pendencia de migracao, nao removido).
- `SgsiScopeVersioningService.requestEditableVersion` e o unico caminho oficial para
  "editar o escopo": decide sozinho se reusa a versao DRAFT atual ou cria uma nova a
  partir de uma APPROVED. A garantia contra sobrescrita vive no backend (service), nao
  na UI — conforme o "Nao deve" explicito da task.
- **Decisao humana nao confirmada, registrada como pendencia real**: acesso ao
  `AuditLog` via `OrganizationAccessGuard` (qualquer membro da organizacao, nao so DSR
  Admin) — a task listava isso como duvida sem resposta; adotei o padrao de acesso ja
  usado em todo o resto do produto, mas nao perguntei ao Bruno antes (era so uma
  leitura, risco baixo de reverter se ele preferir DSR-Admin-only).
- **Gap real, nao decisao silenciosa**: a protecao de versionamento e a centralizacao
  de auditoria existem como capacidade, mas **nenhum servico de escrita existente**
  (`ScopeDefinitionService`, `ScopeEngineService`, `LimitsService`, etc.) foi
  modificado para chama-las — isso exigiria editar modulos fora do path desta task
  (`audit-log/**`, `sgsi-scope/versioning/**`). Documentado com destaque em
  `docs/architecture.md` para nao passar despercebido.
- Corrigi `docs/architecture.md` — a secao "Versionamento" dizia "planejado, Slice
  002+" e "SgsiScope/SgsiScopeVersion ainda nao existem", desatualizado desde a Task
  011 (mesmo padrao de doc-local-desatualizado ja visto com `STYLING.md`/`QA.md`).

## Contexto efetivamente usado

- Minimo padrao + `tasks/027-auditoria-versionamento.md`,
  `tasks/slices/006-escopometro-previa-documentos.md`.
- `requirements/001-prd-escopometro-sgsi.md` secoes 20, 21, 44.
- `backend/docs/ai/SECURITY.md` (obrigatorio pela task — auditoria e dado sensivel).
- Padrao de codigo: `ProjectsService.update` (Task 006) como referencia do formato de
  `AuditLog` ja usado; `LimitsService`/`ScopeEngineService` como referencia de
  `resolveSgsiScopeId`.

## Compliance de Security Constraints

- Risco alto / perfil `auth-sensitive`. Escrita em `backend/src/modules/audit-log/**`
  e `backend/src/modules/sgsi-scope/versioning/**` conforme o path nominal, mais o
  wiring obrigatorio em `app.module.ts` (mesmo padrao de todas as tasks anteriores).
  **Migration/schema exigia aprovacao humana** — nao houve nenhuma migration nova
  (tabelas `audit_logs`/`sgsi_scope_versions` ja existiam desde as Tasks 002/011).

## Arquivos alterados

Ver `tasks/027-auditoria-versionamento.md`, secao "Arquivos alterados".

## Validacoes executadas

- `npm run test` (backend): 23 suites / 94 testes (9 novos, incluindo o teste que a
  task exige explicitamente: bloqueio de sobrescrita de versao aprovada).
- `npm run lint` (com `--fix`), `npm run build`: OK.
- `contracts/openapi.yaml`: parse OK (60 paths, 78 schemas).

## Pendencias ou bloqueios

Ver `tasks/027-auditoria-versionamento.md`, secao "Pendencias ou bloqueios" — a mais
importante: nenhum servico de escrita real do Escopometro chama
`requestEditableVersion`/`AuditLogService` ainda.

## Proximo contexto recomendado

Backlog atual (`tasks/000-index.md`, Tasks 001-027) esta 100% `done`. Nao ha proxima
task planejada — qualquer trabalho seguinte exige nova rodada de planejamento
(`gerar-tasks-adicionais` ou revisao humana direta), conforme a estrategia de execucao
registrada no proprio `tasks/000-index.md`.
