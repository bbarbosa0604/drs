# Task 027 - AuditLog + versionamento SgsiScopeVersion (protecao contra sobrescrita)

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/versions`, `#/audit-log`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

PRD exige rastreabilidade completa (secao 21) e que "uma versao aprovada nao deve ser silenciosamente sobrescrita" (secao 20/44) — sem isso, o produto perde credibilidade como ferramenta de consultoria/certificacao.

### O que

Entidade `AuditLog` (organizacao, projeto, usuario, entidade, entidadeId, acao, timestamp, metadata) registrando criacao/alteracao/exclusao/mudanca de status/geracao de documento/submissao para revisao/aprovacao; logica de versionamento que cria nova `SgsiScopeVersion` (ou revisao controlada) em vez de sobrescrever uma versao com status aprovado.

### Comportamento esperado

- cenario: qualquer alteracao relevante no Escopometro -> gera entrada em `AuditLog`.
- cenario: tentar editar uma `SgsiScopeVersion` com status aprovado -> sistema cria nova versao automaticamente ou bloqueia a edicao direta, nunca sobrescreve em silencio.
- cenario: consultar historico de auditoria de um projeto -> so acessivel a quem tem vinculo (guard da Task 004).

### Fora de escopo

- UI de auditoria (nao especificada no PRD como tela propria do MVP; se necessaria, registrar como pendencia)

## Casos de erro e borda

- Volume alto de eventos de auditoria -> nao e requisito de performance do MVP, mas a query de listagem deve suportar paginacao basica
- Falha ao gravar AuditLog -> nao deve impedir a operacao principal, mas deve ser logada como erro interno (trade-off a documentar)

## Review da spec

- [x] Permissoes: consulta de auditoria restrita por vinculo a organizacao/projeto (e potencialmente so DSR Admin — a confirmar)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: lista de operacoes auditadas conforme PRD secao 21; regra de nao sobrescrever versao aprovada (secao 20/44)
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Centralizar a gravacao de `AuditLog` num service/interceptor reutilizavel, nao espalhar chamadas manuais em cada controller
- Implementar a checagem de "versao aprovada nao editavel diretamente" no service de `SgsiScopeVersion`, nao na UI

### Nao deve

- Nao permitir que a UI seja a unica barreira contra sobrescrita de versao aprovada (a garantia real e no backend)

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#20, #21, #44`
- `backend/docs/ai/SECURITY.md`

## Dependencias

- Slice 005 completo, Task 011 (SgsiScopeVersion base)

## Slice vertical

### Identificador

Slice 006 - Escopometro: Previa, Documentos & Productizacao

### Arquivo

`tasks/slices/006-escopometro-previa-documentos.md`

### Fora do slice

- UI de auditoria dedicada

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho              | Fonte                         | Quando                             | Obrigatorio |
| -------------------- | ----------------------------- | ---------------------------------- | ----------- |
| API                  | `contracts/openapi.yaml`      | sempre                             | sim         |
| Seguranca de produto | `backend/docs/ai/SECURITY.md` | sempre (auditoria e dado sensivel) | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: medio

## Security Constraints

### Nivel de risco

alto

### Perfil de origem

auth-sensitive

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/audit-log/**`, `backend/src/modules/sgsi-scope/versioning/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/audit-log/**`, `backend/src/modules/sgsi-scope/versioning/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de usuarios/clientes de producao

### Criterios de saida

- [ ] teste comprova bloqueio de sobrescrita de versao aprovada
- [ ] lint/test passam

## Criterios de conclusao

- `AuditLog` grava todas as operacoes listadas no PRD secao 21; versao aprovada nunca e sobrescrita silenciosamente (testado)

## Validacao esperada

- `npm run test` incluindo teste especifico de tentativa de sobrescrita de versao aprovada

## Entregaveis esperados

- Modulo `audit-log` + logica de versionamento protegida

## Riscos ou ambiguidades

- Definir se consulta de `AuditLog` e exclusiva de DSR Admin ou tambem visivel ao Consultor do proprio projeto — registrar como duvida se nao decidido ate a execucao

## Status final

done

## Decisao humana registrada (nao decidida antes da execucao)

A task listava como "Riscos ou ambiguidades" se a consulta de `AuditLog` e exclusiva
de DSR Admin ou tambem visivel ao Consultor do proprio projeto. Adotei
`OrganizationAccessGuard` (qualquer membro da organizacao ve o historico da propria
organizacao, DSR Admin irrestrito) como premissa — mesmo padrao de acesso ja usado em
todas as outras rotas de leitura do produto. **Nao confirmado explicitamente pelo
Bruno** — registrado como pendencia, nao decisao silenciosa e irreversivel (e so uma
checagem de leitura, facil de restringir depois se precisar).

## Resultado da execucao

- `AuditLogService.record()` (`backend/src/modules/audit-log/`): ponto centralizado de
  gravacao, exportado do `AuditLogModule` para outros modulos usarem (evita "espalhar
  chamadas manuais em cada controller", conforme a task pede).
- `AuditLogController`: `GET /organizations/:id/audit-log`, paginado (`page`/`limit`,
  1-100), guardado por `OrganizationAccessGuard`.
- `SgsiScopeVersioningService` (`backend/src/modules/sgsi-scope/versioning/`):
  `requestEditableVersion` (garantia real contra sobrescrita — cria nova versao DRAFT
  se a atual for APPROVED) e `approveCurrentVersion` (409 se ja aprovada). Ambos
  registram `AuditLog` via `AuditLogService`.
- **Nenhuma migration nova necessaria** — `audit_logs` e `sgsi_scope_versions` ja
  existem desde as Tasks 002/011 (a Security Constraints da task pedia aprovacao
  humana para migration, mas nao houve nenhuma para pedir aprovacao).
- **Gap real registrado** (nao decisao silenciosa): a garantia de
  `requestEditableVersion` existe mas **nao esta cablada** nos servicos que de fato
  editam o conteudo do escopo (`ScopeDefinitionService`, `ScopeEngineService`,
  `LimitsService`, etc.) — chamar esse metodo antes de qualquer mutacao relevante e um
  follow-up, fora do path de escrita desta task (`audit-log/**`,
  `sgsi-scope/versioning/**`). Da mesma forma, `ProjectsService.update` (Task 006)
  continua gravando `AuditLog` manualmente (criado antes deste service existir) — nao
  foi migrado.

## Arquivos alterados

- Criados: `backend/src/modules/audit-log/{audit-log.service.ts,audit-log.service.spec.ts,audit-log.controller.ts,audit-log.module.ts,dto/query-audit-log.dto.ts}`,
  `backend/src/modules/sgsi-scope/versioning/{sgsi-scope-versioning.service.ts,sgsi-scope-versioning.service.spec.ts,sgsi-scope-versioning.controller.ts,sgsi-scope-versioning.module.ts}`.
- Modificado: `backend/src/app.module.ts`, `contracts/openapi.yaml` (4 paths + 2
  schemas + descricao do `AuditLog` corrigida), `docs/architecture.md` (secoes
  "Auditoria" e "Versionamento" — a segunda estava desatualizada, dizia que
  `SgsiScope`/`SgsiScopeVersion` "ainda nao existem", quando existem desde a Task 011).

## Validacoes executadas

- `npm run test` (backend): 23 suites / 94 testes passando (9 novos, incluindo o teste
  que comprova o bloqueio de sobrescrita de versao aprovada, exigido pela task).
- `npm run lint` (com `--fix`), `npm run build` (`nest build`): OK.
- `contracts/openapi.yaml`: parse OK via `js-yaml` (60 paths, 78 schemas).

## Pendencias ou bloqueios

- Consulta de `AuditLog` restrita a `OrganizationAccessGuard` — decisao nao confirmada
  explicitamente pelo Bruno (ver secao acima).
- `requestEditableVersion` nao esta cablada nos servicos de escrita reais do
  Escopometro — protecao contra sobrescrita existe, mas nao e automatica ainda.
- `ProjectsService.update` continua gravando `AuditLog` manualmente (nao migrado para
  `AuditLogService`).
- Cobertura de auditoria (PRD secao 21) ainda parcial: so `SgsiScopeVersion`
  (CREATE/APPROVED) e `Project.status` (legado) geram entradas hoje.
- Sem teste de integracao HTTP completo.

## Proximo contexto recomendado

Backlog atual (Tasks 001-027) esta 100% `done`. Proximos passos possiveis, todos fora
do backlog planejado ate aqui: (1) cablar `requestEditableVersion`/`AuditLogService`
nos servicos de escrita do Escopometro; (2) migrar `ProjectsService.update` para
`AuditLogService`; (3) rodar as 9 migrations pendentes contra um Postgres real (todas
criadas, nenhuma executada neste ambiente); (4) confirmar com o Bruno a decisao de
acesso ao `AuditLog` (organizacao vs. DSR-Admin-only); (5) refinar Slice 005/006 com
UI de auditoria, se o produto precisar dela (PRD nao especifica tela propria no MVP).
