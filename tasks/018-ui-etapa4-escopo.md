# Task 018 - UI Etapa 4 Escopo + indicador de preenchimento

## Status

planned

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/scope-definition`, `#/fill-percentage`

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

- Indicador de percentual deve ser rotulado literalmente "Percentual de preenchimento do Escopometro" (PRD secao 16), com estilo neutro (nao usar cores de "aprovado/reprovado" que sugiram avaliacao de qualidade).

## Contexto de negocio

### Por que

E a etapa central do modulo: declaracao formal, fundamentacao, caracteristicas e beneficios do escopo, decididos pelo especialista.

### O que

Tela com: declaracao formal (textarea/rich text), fundamentacao executiva, descricao detalhada (rich text), listas dinamicas de caracteristicas e beneficios, e o indicador de percentual de preenchimento visivel nesta e nas demais etapas (header persistente, por exemplo).

### Comportamento esperado

- cenario: preencher declaracao de escopo -> percentual de preenchimento sobe.
- cenario: usuario passa o mouse/foca no indicador -> tooltip explicita que ele NAO mede conformidade/maturidade/adequacao (PRD secao 16).

### Fora de escopo

- Slice 004 em diante

## Casos de erro e borda

- Declaracao de escopo vazia -> nao bloqueia navegacao, so reflete no percentual

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: regra critica do indicador (PRD secao 16) deve estar visivel na propria UI, nao so em doc interno
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Exibir o disclaimer do indicador de preenchimento de forma visivel (nao so tooltip escondido)

### Nao deve

- Nao rotular o indicador como "conformidade", "maturidade", "prontidao" ou "adequacao" em nenhum texto de UI

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`
- `requirements/001-prd-escopometro-sgsi.md#11, #16`

## Dependencias

- Task 016, Task 017

## Slice vertical

### Identificador

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo

### Arquivo

`tasks/slices/003-escopometro-requisitos-escopo.md`

### Fora do slice

- Slice 004

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
- [ ] texto do indicador revisado contra a regra do PRD secao 16

## Criterios de conclusao

- Etapa 4 funcional; indicador de percentual visivel com disclaimer correto

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, revisao de copy

## Entregaveis esperados

- Tela/rota da Etapa 4 + componente de indicador de percentual (reutilizavel nas demais etapas)

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

planned
