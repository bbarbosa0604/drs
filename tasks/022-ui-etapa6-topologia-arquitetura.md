# Task 022 - UI Etapa 6 Topologia & Arquitetura + diagramas

## Status

planned

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/topology`, `#/architecture`

## Modo de execucao

single-stack

## Referencia de design system

### Stack de referencia visual

front-end

### Tipo de referencia visual

artefato de design system

### Fonte primaria visual

- `design-system/front/brand/daryus-tokens.md`

### Regra de aderencia visual

- Mesmo mapeamento de cores de classificacao de escopo da Task 019/021.

## Contexto de negocio

### Por que

Permite ao Consultor mapear a topologia tecnica e a arquitetura de componentes do ambiente do SGSI.

### O que

Duas subsecoes: Topologia (cadastro de nos com os 11 tipos do PRD secao 13.1, conexoes com origem/destino/descricao/tipo) e Arquitetura (componentes com nome/camada/descricao/classificacao, interfaces com origem/destino/descricao). Cada uma com seu diagrama (`TopologyDiagram`, `ArchitectureDiagram`) gerado automaticamente.

### Comportamento esperado

- cenario: adicionar no de topologia tipo "Firewall" -> aparece no diagrama com icone/estilo proprio (se definido) ou estilo padrao por classificacao.
- cenario: criar interface de arquitetura entre 2 componentes -> diagrama de arquitetura reflete a conexao.

### Fora de escopo

- Etapa 7 em diante

## Casos de erro e borda

- No/componente sem classificacao -> exibido como "nao classificado" no diagrama, nao como dentro do escopo por padrao

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: 11 tipos de no do PRD secao 13.1 usados literalmente
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Consumir `TopologyDiagram`/`ArchitectureDiagram` da Task 019

### Nao deve

- Nao duplicar logica de layout na UI

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Task 019, Task 020

## Slice vertical

### Identificador

Slice 004 - Escopometro: Scope Engine

### Arquivo

`tasks/slices/004-escopometro-scope-engine.md`

### Fora do slice

- Etapa 7

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho | Fonte                                        | Quando | Obrigatorio |
| ------- | -------------------------------------------- | ------ | ----------- |
| UI web  | `design-system/front/brand/daryus-tokens.md` | sempre | sim         |
| API     | `contracts/openapi.yaml`                     | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

ui-front

### Tools permitidas

- read: `next-js/`, `design-system/front/`, `contracts/`
- edit: `next-js/src/modules/sgsi-scope/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/modules/sgsi-scope/**`

### Acoes que exigem human approval

- [ ] nenhuma

### Contexto proibido

- `backend/` alem do contrato exposto

### Criterios de saida

- [ ] lint/typecheck/build passam

## Criterios de conclusao

- Etapa 6 funcional com as 2 subsecoes e seus diagramas sincronizados

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 6

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

planned
