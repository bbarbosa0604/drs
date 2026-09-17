# Task 019 - Camada de diagramas independente (ValueChainDiagram, TopologyDiagram, ArchitectureDiagram)

## Status

planned

## Tipo

shared

## Stacks envolvidos

- next-js
- backend (contrato de dados que alimenta os diagramas)

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/value-chain`, `#/topology`, `#/architecture` (formato de dados que os diagramas consomem)

## Modo de execucao

cross-stack

## Referencia de design system

### Stack de referencia visual

front-end

### Tipo de referencia visual

artefato de design system

### Fonte primaria visual

- `design-system/front/brand/daryus-tokens.md`

### Regra de aderencia visual

- Cores de classificacao de escopo mapeadas nos tokens Daryus: grafite (dentro do escopo) -> `--color-brand-navy` ou tom escuro neutro; cinza claro (fora do escopo) -> tom neutro claro; contorno laranja (interface) -> `--color-brand-primary` (PRD secao 12).

## Contexto de negocio

### Por que

PRD exige que o dominio "nunca dependa diretamente de SVG" (secoes 12, 37) — os diagramas devem ser derivados de dados estruturados, com a tecnologia de renderizacao substituivel.

### O que

Definir a interface/contrato de dados comum (nos, arestas/conexoes, classificacao de escopo) e as 3 implementacoes de renderizacao (`ValueChainDiagram`, `TopologyDiagram`, `ArchitectureDiagram`) como modulos puros: recebem dados estruturados, calculam layout, renderizam (SVG como escolha inicial de tecnologia, mas isolada).

### Comportamento esperado

- cenario: dados de cadeia de valor mudam -> diagrama re-renderiza automaticamente, sem intervencao manual de layout.
- cenario: trocar a tecnologia de renderizacao (SVG -> Canvas) no futuro -> nao deveria exigir mudar o modelo de dados.

### Fora de escopo

- Entidades de dados (Task 020)
- UI das etapas 5/6 que consomem essa camada (Tasks 021/022)

## Casos de erro e borda

- Dados incompletos (no sem tipo, conexao para no inexistente) -> a camada de diagrama deve tratar graciosamente (omitir ou marcar como invalido), nao quebrar a renderizacao inteira

## Review da spec

- [x] Permissoes: nao se aplica (camada tecnica pura)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: abstracao obrigatoria dados->layout->render (PRD secoes 12, 37, 44)
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Definir tipos TypeScript compartilhados para o formato de dados de diagrama (nos, arestas, classificacao)
- Isolar a logica de layout/render em modulos proprios, testaveis sem DOM quando possivel

### Nao deve

- Nao acoplar a logica de classificacao de escopo a detalhes de SVG

## Entradas

- `requirements/001-prd-escopometro-sgsi.md#12, #13, #37, #44`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Slice 003 completo

## Slice vertical

### Identificador

Slice 004 - Escopometro: Scope Engine

### Arquivo

`tasks/slices/004-escopometro-scope-engine.md`

### Fora do slice

- Entidades e UI (Tasks 020-022)

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho   | Fonte                                        | Quando | Obrigatorio |
| --------- | -------------------------------------------- | ------ | ----------- |
| UI web    | `design-system/front/brand/daryus-tokens.md` | sempre | sim         |
| Front-end | `next-js/docs/ai/`                           | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: medio (cross-stack) — se o desenho de dados exigir muita ida-e-volta com o backend, considerar dividir em 2 tasks (contrato + render)

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

cross-stack

### Tools permitidas

- read: `next-js/`, `backend/` (so os schemas relevantes), `contracts/`, `design-system/front/`
- edit: `next-js/src/modules/sgsi-scope/diagrams/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/modules/sgsi-scope/diagrams/**`

### Acoes que exigem human approval

- [ ] nenhuma

### Contexto proibido

- codigo de outras stacks alem do necessario para o contrato de dados

### Criterios de saida

- [ ] lint/typecheck/build passam
- [ ] tipos de dados de diagrama documentados

## Criterios de conclusao

- Modulos `ValueChainDiagram`, `TopologyDiagram`, `ArchitectureDiagram` implementados como funcao pura de dados -> render, com tipos compartilhados

## Validacao esperada

- `npm run lint`, `npm run typecheck`, testes unitarios de layout com dados de exemplo

## Entregaveis esperados

- `next-js/src/modules/sgsi-scope/diagrams/` (3 componentes + tipos)

## Riscos ou ambiguidades

- Se o escopo desta task crescer demais (3 diagramas de uma vez), dividir em tasks por diagrama na execucao

## Status final

planned
