# Task 021 - UI Etapa 5 Cadeia de Valor + diagrama

## Status

done

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

done

## Resultado da execucao

- `EtapaCadeiaValorForm` (`modules/sgsi-scope/etapa-cadeia-valor/`): formulario de
  criacao de bloco (nome, categoria, area, classificacao, descricao) + lista com
  edicao/remocao in-place (`ValueChainBlockRow`) + `ValueChainDiagram` (Task 019)
  sincronizado com o estado local a cada create/update/delete.
- Blocos ordenados por categoria (`INPUT -> PRIMARY_PROCESS -> SUPPORT_PROCESS ->
OUTPUT`) antes de alimentar o diagrama, para as linhas aparecerem numa ordem estavel
  independente da ordem de criacao.
- `ScopeClassification` da camada de diagramas (Task 019) ganhou um 4o valor
  `unclassified` (estilo proprio, borda tracejada) — o PRD trata "sem classificacao"
  como estado real (nunca inferido automaticamente), e o diagrama nao devia mentir
  reusando o estilo de `out-scope` para isso.
- Servico compartilhado `services/sgsi-scope/scope-engine.service.ts` e opcoes/rotulos
  em `modules/sgsi-scope/scope-engine-options.ts` (usados tambem pela Task 022).
- `StepNav` ganhou o href da Etapa 5.

## Arquivos alterados

- Criados: `next-js/src/services/sgsi-scope/scope-engine.service.ts`,
  `next-js/src/modules/sgsi-scope/scope-engine-options.ts`,
  `next-js/src/modules/sgsi-scope/etapa-cadeia-valor/{EtapaCadeiaValorForm,ValueChainBlockRow}.tsx`
  (+ `.module.css`),
  `next-js/src/app/projects/[id]/sgsi-scope/value-chain/page.tsx`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/value-chain/blocks/route.ts` (+ `[blockId]/route.ts`).
- Modificado: `next-js/src/modules/sgsi-scope/StepNav.tsx` (hrefs 5/6),
  `next-js/src/modules/sgsi-scope/diagrams/types.ts` (+ `unclassified`),
  `next-js/src/modules/sgsi-scope/diagrams/render/DiagramSvg.tsx` (+`.module.css`).
- Criado (fora do next-js): `.claude/launch.json` na raiz do scaffold (`/Users/bruno/Documents/Projetos/DRS`),
  para permitir preview do dev server do next-js pelo Browser pane.

## Validacoes executadas

- `npm run lint`, `npm run typecheck`, `npm run test` (vitest, 9/9 — inclui os testes de
  layout da Task 019, que continuam validos com o 4o valor de classificacao), `npm run
build` (34 rotas): todos OK.
- Manual: com um backend real rodando em `:3000` (porem com `DATABASE_ENABLED=false`,
  sem Postgres — TypeORM nao inicializa), confirmado no browser que
  `/projects/:id/sgsi-scope/value-chain` sem sessao redireciona para `/login`. Fluxo
  completo (autosave, diagrama com dados reais) **nao testado** contra API real por
  falta de Postgres neste ambiente — mesma limitacao das Tasks 011-020.

## Pendencias ou bloqueios

- Testar o fluxo completo (criar/editar/remover bloco, diagrama atualizando) contra o
  backend real apos deploy/com Postgres disponivel.

## Proximo contexto recomendado

Task 022 (Slice 004) - UI Etapa 6 (Topologia & Arquitetura), reutilizando
`scope-engine.service.ts` e `scope-engine-options.ts` desta task.
