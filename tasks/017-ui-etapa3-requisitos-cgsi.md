# Task 017 - UI Etapa 3 Requisitos & CGSI

## Status

planned

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/stakeholders`, `#/requirements`, `#/governance`

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

- Seguir tokens Daryus; sem prototipo HTML disponivel, seguir especificacao textual do PRD secao 10.

## Contexto de negocio

### Por que

Permite ao Consultor registrar partes interessadas, requisitos legais e o comite de governanca antes de declarar o escopo.

### O que

Tela com 3 blocos: partes interessadas (lista dinamica), requisitos legais (busca/selecao da biblioteca + adicao customizada), governanca/CGSI (dados do comite + lista de membros).

### Comportamento esperado

- cenario: adicionar parte interessada -> aparece na lista com todos os campos do PRD secao 10.1.
- cenario: buscar requisito na biblioteca -> encontra itens da lista inicial (LGPD, Marco Civil, etc.).

### Fora de escopo

- Etapa 4 (Task 018)

## Casos de erro e borda

- Biblioteca de requisitos vazia (seed nao rodou) -> estado vazio com mensagem, nao erro
- Membro do comite sem papel -> validacao de formulario bloqueia

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: campos conforme PRD secao 10
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Usar React Hook Form + Zod; reaproveitar padrao de autosave

### Nao deve

- Nao hardcodar a lista de requisitos legais no componente (deve vir da API)

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Task 015

## Slice vertical

### Identificador

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo

### Arquivo

`tasks/slices/003-escopometro-requisitos-escopo.md`

### Fora do slice

- Etapa 4

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

- Etapa 3 funcional com os 3 blocos (stakeholders, requisitos, CGSI)

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 3

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

planned
