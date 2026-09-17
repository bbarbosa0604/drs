# Task 009 - Telas de Organizacao e Projeto

## Status

planned

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/organizations`, `#/paths/projects`

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

- Formularios devem usar os tokens da Task 007; evitar aparencia de formulario administrativo generico (PRD secao 35).

## Contexto de negocio

### Por que

Sao as telas onde o usuario efetivamente cria/mantem os dados centrais (Organizacao, Projeto) usados por todos os modulos.

### O que

Telas de listagem, criacao e edicao de Organizacao (campos PRD secao 5) e de Projeto (campos PRD secao 6, incluindo status e participantes).

### Comportamento esperado

- cenario: criar organizacao com campos obrigatorios preenchidos -> sucesso, redireciona para a organizacao criada.
- cenario: criar projeto sem organizacao selecionada -> validacao de formulario impede submissao.
- cenario: editar projeto e mudar status -> UI reflete o novo status imediatamente.

### Fora de escopo

- Ativacao do Escopometro na tela de projeto (Slice 002)

## Casos de erro e borda

- Erro de validacao do backend (400) -> exibir mensagem por campo, nao erro generico
- Usuario tenta editar organizacao/projeto sem permissao -> UI nunca deve permitir chegar la (esconder acao), mas backend (Task 004) e a garantia real

## Review da spec

- [x] Permissoes: telas respeitam vinculo do usuario (Task 004)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: campos conforme PRD secoes 5-6
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Usar React Hook Form + Zod para validacao (PRD secao 24/26), com schema compartilhado quando possivel com o backend
- Reaproveitar shell/tokens da Task 007

### Nao deve

- Nao duplicar regra de validacao divergente da API (fonte de verdade e o backend)

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Task 006, Task 007

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Ativacao de modulos

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
- edit: `next-js/src/app/(dashboard)/organizations/**`, `next-js/src/app/(dashboard)/projects/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/app/(dashboard)/organizations/**`, `next-js/src/app/(dashboard)/projects/**`

### Acoes que exigem human approval

- [x] instalar/remover dependencias — se `react-hook-form`/`zod` ainda nao estiverem em `next-js/package.json`

### Contexto proibido

- `backend/` alem do contrato exposto

### Criterios de saida

- [ ] lint/typecheck/build passam
- [ ] validacao de formulario cobre campos obrigatorios

## Criterios de conclusao

- CRUD completo de Organizacao e Projeto navegavel via UI, com validacao e feedback de erro

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual do fluxo de criacao/edicao

## Entregaveis esperados

- Paginas/rotas de Organizacao e Projeto em `next-js/src/app/(dashboard)/`

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

planned
