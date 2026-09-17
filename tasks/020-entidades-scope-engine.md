# Task 020 - ValueChainBlock/TopologyNode/TopologyLink/ArchitectureComponent/ArchitectureInterface

## Status

planned

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

planned
