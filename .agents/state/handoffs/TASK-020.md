# Handoff - Task 020

## Identificador da task

Task 020 - ValueChainBlock/TopologyNode/TopologyLink/ArchitectureComponent/ArchitectureInterface

## Slice vertical

Slice 004 - Escopometro: Scope Engine (`tasks/slices/004-escopometro-scope-engine.md`) —
segunda task do slice (a primeira foi a Task 019, camada de diagramas).

## Status final

done

## Decisoes preservadas

- `classification` (PRD secao 12) e sempre `nullable`, em entidade/DTO/service — nunca
  um default `IN_SCOPE` silencioso. Omitido ou `null` fica "nao classificado".
- Exclusao de `TopologyNode`/`ArchitectureComponent` ainda referenciado por um
  link/interface e **bloqueada** (409 `ConflictException`), nunca cascateada — adotando a
  recomendacao do PRD (a task listava isso como decisao humana pendente; segui a
  recomendacao explicita do proprio PRD em vez de escolher cascata).
- Validacao referencial de `TopologyLink`/`ArchitectureInterface` e feita na aplicacao
  (`BadRequestException` 400 se `fromNodeId`/`toNodeId`/`fromComponentId`/
  `toComponentId` nao existir ou pertencer a outro escopo) — a FK do banco
  (`ON DELETE RESTRICT`) e so defesa em profundidade, nao a fonte da mensagem de erro.
- Cada service (`ValueChainService`, `TopologyService`, `ArchitectureService`) duplica o
  proprio `resolveSgsiScopeId(projectId)` privado — mesmo padrao ja usado em
  `ScopeDefinitionService`/`StakeholdersService`/etc., sem abstracao compartilhada
  (evitar overengineering, conforme `next-js/docs/ai/FRONTEND_PATTERNS.md` e o mesmo
  espirito no backend).
- **Desvio de path registrado**: os enums `ScopeClassification`/`ValueChainCategory`/
  `TopologyNodeType` foram criados em `backend/src/common/enums/`, fora do path de
  escrita nominal da Security Constraints da task (`scope-engine/**`). Segui a convencao
  do projeto (`ContextAspectType`, Task 012) em vez de duplicar o enum dentro do
  submodulo, pelo mesmo motivo que `app.module.ts` precisou ser editado fora do path
  nominal: sem isso o modulo simplesmente nao funciona/nao segue o padrao existente. Se
  o Bruno preferir os enums isolados em `scope-engine/enums/`, e um ajuste pequeno.

## Contexto efetivamente usado

- Minimo padrao + `tasks/020-entidades-scope-engine.md`,
  `tasks/slices/004-escopometro-scope-engine.md`, handoff da Task 019.
- `requirements/001-prd-escopometro-sgsi.md` secoes 12-13 (enums exatos, campos de cada
  entidade).
- Padrao de codigo existente: `scope-definition/` (Task 016) e `requirements/` (Task 015) como referencia de estrutura de submodulo, DTO com `class-validator`, e teste
  unitario com repository mockado.

## Compliance de Security Constraints

- Risco medio / perfil `api-back`. Escrita em `backend/src/modules/sgsi-scope/scope-engine/**`
  e `backend/src/database/migrations/**` conforme o path nominal, **mais** os 2 desvios
  documentados acima (`common/enums/`, `app.module.ts`) por necessidade tecnica/consistencia.
  **Migration/schema de banco exigia aprovacao humana** — a migration foi criada mas
  **nao executada** contra nenhum Postgres real (nao havia um disponivel neste ambiente,
  e mesmo se houvesse, rodar contra producao/staging precisa de aprovacao explicita do
  Bruno antes).

## Arquivos alterados

- Criados: `backend/src/common/enums/{scope-classification,value-chain-category,topology-node-type}.enum.ts`,
  `backend/src/modules/sgsi-scope/scope-engine/**` (module, 3 controllers, 3 services + 3
  specs, 5 entities, 5 dto files),
  `backend/src/database/migrations/1700000006000-CreateScopeEngineTables.ts`.
- Modificado: `backend/src/app.module.ts`, `contracts/openapi.yaml` (15 paths + 17
  schemas + resposta `Conflict`), `docs/architecture.md`, `docs/database.md`.

## Validacoes executadas

- `npm run test` (backend): 19 suites / 75 testes passando (11 novos).
- `npm run lint` (com `--fix` de formatacao), `npm run build` (`nest build`): OK.
- `contracts/openapi.yaml`: parse OK via `js-yaml` (41 paths, 61 schemas).

## Pendencias ou bloqueios

- Migration nao executada contra Postgres real (aprovacao humana necessaria antes de
  rodar `npm run migration:run` em qualquer ambiente).
- Politica de bloqueio (vs. cascata) segue a recomendacao do PRD, nao uma confirmacao
  explicita do Bruno — mesmo padrao de premissa registrada das Tasks 005/006.
- Sem teste de integracao contra API/banco reais — cobertura e so unitaria.
- Desvio de path dos enums (ver "Decisoes preservadas") — revisar se o Bruno quiser
  outro local.

## Proximo contexto recomendado

Tasks 021/022 (Slice 004) - UI das Etapas 5 (Cadeia de Valor) e 6 (Topologia &
Arquitetura). Consomem os endpoints REST desta task (`/projects/:id/sgsi-scope/{value-chain,topology,architecture}`)
e os componentes `ValueChainDiagram`/`TopologyDiagram`/`ArchitectureDiagram` da Task 019
(`next-js/src/modules/sgsi-scope/diagrams`) — a UI monta `DiagramData` a partir da
resposta destes endpoints, nao reimplementa layout/render.
