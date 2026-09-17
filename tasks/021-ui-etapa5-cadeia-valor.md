# Task 021 - UI Etapa 5 Cadeia de Valor + diagrama

## Status

planned

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/value-chain`

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

- Cores de classificacao conforme mapeamento da Task 019 (grafite/cinza/contorno laranja -> tokens Daryus).

## Contexto de negocio

### Por que

Permite ao Consultor construir a cadeia de valor e ver o diagrama gerado automaticamente, sem desenhar manualmente.

### O que

Formulario para criar/editar blocos da cadeia de valor (nome, descricao, area, categoria, classificacao) + renderizacao do `ValueChainDiagram` (Task 019) refletindo os dados em tempo real.

### Comportamento esperado

- cenario: adicionar bloco -> diagrama atualiza automaticamente.
- cenario: mudar classificacao de um bloco -> cor no diagrama muda de acordo.

### Fora de escopo

- Topologia/Arquitetura (Task 022)

## Casos de erro e borda

- Cadeia de valor vazia -> diagrama mostra estado vazio, nao erro

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: 4 categorias e 3 classificacoes exatas do PRD secao 12
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Consumir `ValueChainDiagram` da Task 019, nao reimplementar renderizacao

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

- Etapa 6

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

- Etapa 5 funcional com formulario + diagrama sincronizado

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 5

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

planned
