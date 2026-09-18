# Handoff - Task 023

## Identificador da task

Task 023 - ScopeLocation/ScopeEmployeeGroup/ScopeAsset/ScopeProvider/ScopeApproval/ScopeRevision

## Slice vertical

Slice 005 - Escopometro: Limites, Recursos & Aprovacao — primeira task do slice.

## Status final

done

## Decisoes preservadas

- Reusa `ScopeClassification` (`common/enums/scope-classification.enum.ts`, Task 020)
  em todas as 4 entidades de lista — nenhum enum novo criado (explicitamente pedido
  pela task: "Nao deve: Nao reimplementar enum de classificacao diferente").
- `ScopeApproval` e um registro **unico** por `SgsiScope` (upsert), nao uma lista — a
  secao 14.5 do PRD descreve um unico bloco de campos de aprovacao, nao "cadastro de
  aprovacoes". Segue o mesmo padrao 1:1 de `ScopeDefinition` (Task 016).
- `ScopeRevision` e **so criacao/listagem** (sem update/delete) — a secao 14.6 do PRD
  chama explicitamente de "Historico", mesmo espirito de `AuditLog` (uma entrada de log
  nao se edita depois).
- `ScopeProvider` nao tem campo `responsible` — o PRD secao 14.4 lista apenas
  prestador/servico/descricao/classificacao para essa subsecao (diferente de
  `ScopeAsset`, que tem `responsible` per secao 14.3).

## Contexto efetivamente usado

- Minimo padrao + `tasks/023-entidades-limites-recursos.md`,
  `tasks/slices/005-escopometro-limites-aprovacao.md`.
- `requirements/001-prd-escopometro-sgsi.md` secao 14 (campos exatos de cada
  subsecao).
- Padrao de codigo: `scope-definition/` (Task 016, registro 1:1 + listas simples) e
  `scope-engine/` (Task 020, service unico cobrindo varias entidades) como referencia
  direta.

## Compliance de Security Constraints

- Risco medio / perfil `api-back`. Escrita em
  `backend/src/modules/sgsi-scope/limits/**` e `backend/src/database/migrations/**`
  conforme o path nominal (sem desvio, diferente da Task 020). **Migration/schema de
  banco exigia aprovacao humana** — criada mas **nao executada** contra nenhum
  Postgres real.

## Arquivos alterados

Ver `tasks/023-entidades-limites-recursos.md`, secao "Arquivos alterados".

## Validacoes executadas

- `npm run test` (backend): 20 suites / 80 testes passando.
- `npm run lint` (com `--fix`), `npm run build`: OK.
- `contracts/openapi.yaml`: parse OK via `js-yaml` (52 paths, 74 schemas).

## Pendencias ou bloqueios

- Migration nao executada (aprovacao humana necessaria).
- `fill-percentage.util.ts` nao foi estendido para Etapas 5-7 — lacuna registrada, nao
  decisao silenciosa (ver `tasks/023-entidades-limites-recursos.md`).
- Sem teste de integracao contra API/banco reais.

## Proximo contexto recomendado

Task 024 - UI Etapa 7 (Limites & Recursos), consumindo
`/projects/:id/sgsi-scope/limits` (GET agregado + POST/PATCH/DELETE por subsecao).
