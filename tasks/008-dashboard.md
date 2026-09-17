# Task 008 - Dashboard

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

- Seguir tokens da Task 007; layout deve transmitir "consultoria, seguranca, governanca, metodologia, profissionalismo, simplicidade" (PRD secao 35), evitando aparencia de formulario administrativo generico.

## Contexto de negocio

### Por que

E a tela inicial pos-login; usuario precisa localizar rapidamente organizacoes/projetos recentes e iniciar acoes principais (PRD secao 4).

### O que

Dashboard com organizacoes recentes, projetos recentes, projetos em andamento, modulos utilizados (placeholder ate o Escopometro existir), documentos recentemente gerados (placeholder), atividades recentes (placeholder ate AuditLog existir), e acoes "Nova organizacao", "Novo projeto", "Abrir projeto".

### Comportamento esperado

- cenario: usuario sem organizacoes -> estado vazio com CTA "Nova organizacao".
- cenario: usuario com organizacoes/projetos -> listas ordenadas por atividade recente.

### Fora de escopo

- Documentos gerados e atividades reais (dependem de tasks futuras — usar estado vazio/placeholder explicito, nao dado fake)

## Casos de erro e borda

- Falha ao carregar dados (API fora do ar) -> estado de erro com retry, nao tela em branco
- Usuario autenticado mas sem nenhum vinculo a organizacao -> estado vazio, nao erro

## Review da spec

- [x] Permissoes: dashboard mostra so organizacoes/projetos vinculados ao usuario (herdado da Task 004)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: secoes do dashboard conforme PRD secao 4
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Consumir API via contrato (Task 001/005/006), nunca dado mockado em producao
- Estados de carregamento, vazio e erro explicitos para cada secao

### Nao deve

- Nao exibir "documentos gerados"/"atividades" com dados inventados antes de essas tasks existirem — usar placeholder "em breve" ou ocultar secao

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`
- `next-js/docs/ai/`

## Dependencias

- Task 006, Task 007

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Documentos/atividades reais

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho   | Fonte                                        | Quando | Obrigatorio |
| --------- | -------------------------------------------- | ------ | ----------- |
| UI web    | `design-system/front/brand/daryus-tokens.md` | sempre | sim         |
| API       | `contracts/openapi.yaml`                     | sempre | sim         |
| Front-end | `next-js/docs/ai/`                           | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 6 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

ui-front

### Tools permitidas

- read: `next-js/`, `design-system/front/`, `contracts/`
- edit: `next-js/src/app/(dashboard)/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/app/**`, `next-js/src/components/**`

### Acoes que exigem human approval

- [ ] nenhuma

### Contexto proibido

- `backend/` alem do contrato ja exposto

### Criterios de saida

- [ ] lint/typecheck/build passam

## Criterios de conclusao

- Dashboard exibe organizacoes/projetos reais do usuario autenticado, com estados vazio/erro tratados

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`; teste manual dos 3 estados (vazio, com dados, erro)

## Entregaveis esperados

- Pagina de dashboard em `next-js/src/app/(dashboard)/`

## Riscos ou ambiguidades

- "Modulos utilizados" so fara sentido pleno apos Slice 002 (Escopometro) existir

## Status final

planned
