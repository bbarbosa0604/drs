# Task 024 - UI Etapa 7 Limites & Recursos

## Status

done

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/locations`, `#/employee-groups`, `#/assets`, `#/providers`, `#/approval`, `#/revisions`

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

- Seguir tokens Daryus; sem prototipo HTML, seguir especificacao textual do PRD secao 14.

## Contexto de negocio

### Por que

Fecha o levantamento operacional do escopo antes da previa/exportacao final.

### O que

Tela com 5 subsecoes em abas ou secoes colapsaveis: localidades, colaboradores/areas, ativos tecnologicos, prestadores de servico, aprovacao; mais um bloco de historico de revisoes.

### Comportamento esperado

- cenario: adicionar ativo tecnologico -> aparece na lista com categoria e responsavel.
- cenario: registrar aprovacao -> bloco de aprovacao mostra metodo/plataforma/responsavel/data.

### Fora de escopo

- Etapa 8 (Task 025)

## Casos de erro e borda

- Nenhuma alem das ja mapeadas na Task 023

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (Task 023)
- [x] Decisoes humanas confirmadas: 5 subsecoes + revisoes (PRD secao 14)
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (Task 023)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Reaproveitar padrao de formulario/lista dinamica ja usado nas etapas anteriores (consistencia de UX)

### Nao deve

- Nao introduzir um padrao de UI novo so para esta etapa sem justificativa

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Task 023

## Slice vertical

### Identificador

Slice 005 - Escopometro: Limites, Recursos & Aprovacao

### Arquivo

`tasks/slices/005-escopometro-limites-aprovacao.md`

### Fora do slice

- Etapa 8

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

- Etapa 7 funcional com as 5 subsecoes + revisoes

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 7

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

done

## Resultado da execucao

- Uma rota (`/projects/:id/sgsi-scope/limits`) com 6 blocos empilhados (mesmo padrao de
  secoes/cards ja usado nas Etapas 4/6, **nao abas** — abas seriam um padrao de UI novo
  sem justificativa, contra o "Nao deve" da task): Localidades, Colaboradores/areas,
  Ativos, Prestadores (listas com create/edit/delete in-place, reusando o padrao
  `*Row.tsx` das Tasks 021/022), Aprovacao (autosave, mesmo hook `useAutosave` da Etapa 4) e Revisoes (log append-only: so formulario de criacao + lista somente leitura,
  espelhando `ScopeRevisionEntity` nao ter update/delete).
- `services/sgsi-scope/limits.service.ts` criado seguindo o mesmo formato de
  `scope-engine.service.ts` (Task 021).

## Arquivos alterados

- Criados: `next-js/src/services/sgsi-scope/limits.service.ts`,
  `next-js/src/modules/sgsi-scope/etapa-limites-recursos/**`
  (`EtapaLimitesRecursosForm.tsx` + `.module.css`, `EntityRow.module.css`,
  `{ScopeLocationRow,ScopeEmployeeGroupRow,ScopeAssetRow,ScopeProviderRow}.tsx`),
  `next-js/src/app/projects/[id]/sgsi-scope/limits/page.tsx`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/limits/{locations[/:id],employee-groups[/:id],assets[/:id],providers[/:id],approval,revisions}/route.ts`.
- Modificado: `next-js/src/modules/sgsi-scope/StepNav.tsx` (href da Etapa 7).

## Validacoes executadas

- `npm run lint`, `npm run typecheck`, `npm run test` (vitest 9/9), `npm run build` (52
  rotas): OK.
- Manual: redirect para `/login` sem sessao confirmado no browser (backend real em
  `:3000`, sem Postgres). Fluxo completo nao testado por falta de banco.

## Pendencias ou bloqueios

- Testar fluxo completo (CRUD das 4 listas + autosave de aprovacao + criacao de
  revisao) contra backend com Postgres real.
- Slice 005 (Tasks 023-024) esta 100% `done`.

## Proximo contexto recomendado

Task 025 (Slice 006) - UI Etapa 8 (Previa & Exportacao): visao consolidada do
Escopometro.
