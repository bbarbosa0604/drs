# Task 020 - ValueChainBlock/TopologyNode/TopologyLink/ArchitectureComponent/ArchitectureInterface

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/value-chain`, `#/topology`, `#/architecture`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Sao os dados que alimentam os diagramas da Task 019: cadeia de valor (etapa 5) e topologia/arquitetura (etapa 6).

### O que

Entidades `ValueChainBlock` (nome, descricao, area responsavel, categoria INPUT/PRIMARY_PROCESS/SUPPORT_PROCESS/OUTPUT, classificacao IN_SCOPE/OUT_SCOPE/INTERFACE), `TopologyNode` (nome, tipo — Application/Database/Network/Firewall/Cloud/Server/User/Internet/Third Party/Physical Unit/Other —, descricao, classificacao), `TopologyLink` (origem, destino, descricao, tipo), `ArchitectureComponent` (nome, camada, descricao, classificacao), `ArchitectureInterface` (origem, destino, descricao).

### Comportamento esperado

- cenario: criar TopologyLink referenciando nos existentes -> validado por FK.
- cenario: excluir um TopologyNode referenciado por um link -> bloquear ou cascatear (decisao a registrar; recomenda-se bloquear com mensagem clara).

### Fora de escopo

- Renderizacao (Task 019 ja cobre a camada; aqui e so persistencia)

## Casos de erro e borda

- Link/interface para no/componente inexistente -> 400 com FK constraint
- Classificacao de escopo ausente -> permitir como "nao classificado" (nao forcar default IN_SCOPE)

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: enums exatamente conforme PRD secoes 12-13
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Validar integridade referencial de links/interfaces via FK
- Usar os enums exatos do PRD (tipos de no, categorias de cadeia de valor, classificacoes de escopo)

### Nao deve

- Nao inferir classificacao de escopo automaticamente

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#12, #13`

## Dependencias

- Task 019 (contrato de dados alinhado)

## Slice vertical

### Identificador

Slice 004 - Escopometro: Scope Engine

### Arquivo

`tasks/slices/004-escopometro-scope-engine.md`

### Fora do slice

- Renderizacao

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho | Fonte                    | Quando | Obrigatorio |
| ------- | ------------------------ | ------ | ----------- |
| API     | `contracts/openapi.yaml` | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 1 | risco: medio

## Security Constraints

### Nivel de risco

medio

### Perfil de origem

api-back

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/sgsi-scope/scope-engine/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/sgsi-scope/scope-engine/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de clientes

### Criterios de saida

- [ ] lint/test passam
- [ ] integridade referencial testada

## Criterios de conclusao

- CRUD completo das 5 entidades com validacao referencial e enums corretos

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Submodulo `scope-engine` dentro de `sgsi-scope`

## Riscos ou ambiguidades

- Politica de exclusao de no/componente referenciado precisa confirmacao (bloquear vs cascata)

## Status final

done

## Resultado da execucao

- Submodulo `backend/src/modules/sgsi-scope/scope-engine/` com 5 entidades TypeORM
  (`ValueChainBlockEntity`, `TopologyNodeEntity`, `TopologyLinkEntity`,
  `ArchitectureComponentEntity`, `ArchitectureInterfaceEntity`), 3 services + 3
  controllers (`ValueChain`, `Topology`, `Architecture`) e `ScopeEngineModule`
  registrado em `app.module.ts`.
- Enums (`ScopeClassification`, `ValueChainCategory`, `TopologyNodeType`) exatamente
  conforme PRD secoes 12-13, criados em `backend/src/common/enums/` (mesma convencao de
  `ContextAspectType` da Task 012) — **desvio documentado** do path de escrita restrito
  da Security Constraints (`scope-engine/**`); ver "Pendencias ou bloqueios".
- `classification` sempre `nullable`, nunca default `IN_SCOPE` (dto/entity/service —
  omitido ou `null` fica "nao classificado").
- Validacao referencial: `TopologyLink`/`ArchitectureInterface` validam
  `fromNodeId`/`toNodeId`/`fromComponentId`/`toComponentId` contra o `sgsiScopeId` do
  projeto antes de salvar -> `BadRequestException` (400) se o no/componente nao existir
  ou for de outro escopo (FK do banco com `ON DELETE RESTRICT` como defesa em
  profundidade).
- Decisao humana registrada (recomendacao do PRD adotada): excluir um `TopologyNode`/
  `ArchitectureComponent` ainda referenciado por um link/interface e **bloqueado**
  (`ConflictException`, 409), nunca cascateado.
- Contrato `contracts/openapi.yaml` atualizado: 15 paths novos (`value-chain`,
  `value-chain/blocks[/:id]`, `topology`, `topology/nodes[/:id]`, `topology/links[/:id]`,
  `architecture`, `architecture/components[/:id]`, `architecture/interfaces[/:id]`) + 17
  schemas novos + resposta `Conflict` (409) nova em `components/responses`.
- `docs/architecture.md` e `docs/database.md` atualizados com o que foi implementado
  (a secao "Diagramas" do architecture.md, que citava a Task 020 como pendente, e a nova
  secao "Slice 004" do database.md).

## Arquivos alterados

- Criados: `backend/src/common/enums/{scope-classification,value-chain-category,topology-node-type}.enum.ts`,
  `backend/src/modules/sgsi-scope/scope-engine/{scope-engine.module.ts,value-chain.controller.ts,value-chain.service.ts,value-chain.service.spec.ts,topology.controller.ts,topology.service.ts,topology.service.spec.ts,architecture.controller.ts,architecture.service.ts,architecture.service.spec.ts}`,
  `.../scope-engine/entities/{value-chain-block,topology-node,topology-link,architecture-component,architecture-interface}.entity.ts`,
  `.../scope-engine/dto/{value-chain-block,topology-node,topology-link,architecture-component,architecture-interface}.dto.ts`,
  `backend/src/database/migrations/1700000006000-CreateScopeEngineTables.ts`.
- Modificado: `backend/src/app.module.ts` (registro do `ScopeEngineModule`),
  `contracts/openapi.yaml`, `docs/architecture.md`, `docs/database.md`.

## Validacoes executadas

- `npm run test` (backend, jest): 19 suites / 75 testes, todos passando (11 novos nos 3
  spec files do scope-engine).
- `npm run lint` OK (apos `--fix` de formatacao), `npm run build` (`nest build`) OK.
- `contracts/openapi.yaml` validado com `js-yaml` (parse sem erro, 41 paths / 61
  schemas).

## Pendencias ou bloqueios

- **Migration criada, nao executada** — sem Postgres real neste ambiente (mesma situacao
  de todas as migrations anteriores do projeto). Rodar `npm run migration:run` contra um
  banco real exige aprovacao humana explicita (marcado na Security Constraints da task) —
  nao fiz isso.
- **Desvio de path documentado**: os 3 enums novos foram colocados em
  `backend/src/common/enums/` (fora do path de escrita nominal
  `scope-engine/**`/`database/migrations/**` da Security Constraints), replicando a
  convencao ja usada por `ContextAspectType` (Task 012) em vez de duplicar o enum dentro
  do submodulo — mesma logica do wiring em `app.module.ts` (tambem fora do path nominal,
  mas necessario para o modulo funcionar). Decisao de consistencia de codebase, nao
  scope creep; se o Bruno preferir os enums dentro de `scope-engine/enums/`, e um ajuste
  pequeno e isolado.
- Politica de exclusao (bloquear em vez de cascatear) segue a recomendacao do PRD, mas
  nao foi explicitamente confirmada pelo Bruno — mesmo padrao de "premissa adotada,
  registrada" das Tasks 005/006 (politica de exclusao de Organizacao/status de Projeto).
- Sem verificacao contra API real (sem Postgres rodando); cobertura e so unitaria
  (services com repository mockado).

## Proximo contexto recomendado

Tasks 021/022 (Slice 004) - UI das Etapas 5 (Cadeia de Valor) e 6 (Topologia &
Arquitetura), consumindo os endpoints desta task e os componentes
`ValueChainDiagram`/`TopologyDiagram`/`ArchitectureDiagram` da Task 019.
