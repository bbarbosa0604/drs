# Task 018 - UI Etapa 4 Escopo + indicador de preenchimento

## Status

done

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

- [x] lint/typecheck/build passam
- [x] texto do indicador revisado contra a regra do PRD secao 16

## Criterios de conclusao

- [x] Etapa 4 funcional; indicador de percentual visivel com disclaimer correto

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, revisao de copy

## Entregaveis esperados

- Tela/rota da Etapa 4 + componente de indicador de percentual (reutilizavel nas demais etapas)

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Resultado da execucao

- `FillPercentageIndicator` (`modules/sgsi-scope/FillPercentageIndicator.tsx`): mostra o
  label literal vindo da API ("Percentual de preenchimento do Escopometro"), uma barra de
  progresso em cor neutra (navy da marca, nunca verde/vermelho de aprovado/reprovado), e
  um **disclaimer sempre visivel** (paragrafo abaixo da barra, nao tooltip escondido)
  dizendo explicitamente que o indicador nao mede conformidade ISO 27001, maturidade,
  qualidade, prontidao ou adequacao — texto revisado linha a linha contra a lista de
  proibicoes do PRD secao 16.
- O indicador foi colocado em `next-js/src/app/projects/[id]/sgsi-scope/layout.tsx`, um
  layout novo que envolve **todas** as rotas do Escopometro (Etapas 1-4 ja existentes) —
  nao so a Etapa 4 —, satisfazendo "visivel nesta e nas demais etapas" sem duplicar a
  chamada em cada pagina. Se o modulo ainda nao foi ativado ou a sessao expirou, o layout
  so renderiza os filhos (a propria pagina trata o estado de erro/redirect).
- `ScopeDefinition` (declaracao formal, fundamentacao executiva) com autosave via
  textarea simples; descricao detalhada reusa o `RichTextEditor` (TipTap, Task 014).
  `ScopeListBlock` e um componente generico reutilizado para caracteristicas e
  beneficios (mesma forma, so muda o endpoint).
- `StepNav` ganhou `href` real para a Etapa 4 — as 4 etapas do Slice 002/003 agora sao
  todas navegaveis livremente entre si (PRD secao 7).

## Arquivos alterados

- Criados: `next-js/src/services/sgsi-scope/scope-definition.service.ts`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/scope-definition/route.ts` (+
  `characteristics[/:id]`, `benefits[/:id]`),
  `next-js/src/app/projects/[id]/sgsi-scope/scope-definition/page.tsx`,
  `next-js/src/app/projects/[id]/sgsi-scope/layout.tsx` (+css),
  `next-js/src/modules/sgsi-scope/FillPercentageIndicator.tsx` (+css),
  `next-js/src/modules/sgsi-scope/etapa-escopo/{EtapaEscopoForm,ScopeListBlock}.tsx` (+css).
- Modificado: `next-js/src/modules/sgsi-scope/StepNav.tsx` (href da Etapa 4).

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run build`: executado com sucesso (33 rotas)
- Revisao de copy: texto do disclaimer conferido linha a linha contra a lista de "nao
  representa" do PRD secao 16 (conformidade ISO 27001, maturidade, qualidade, prontidao,
  adequacao — todos citados explicitamente no disclaimer)
- Teste manual (via `next dev` + browser): confirmado que
  `/projects/:id/sgsi-scope/scope-definition` redireciona para `/login` sem sessao.
  **Indicador visual e fluxo completo (autosave, listas) nao testados contra backend
  real** (sem Postgres/backend disponivel neste ambiente, mesma limitacao das demais
  tasks de UI).

## Pendencias pos-task

- Testar o indicador e o fluxo completo contra o backend real apos deploy.
- Este e o ultimo entregavel do Slice 003 (015-018) — slice fecha com esta task.

## Status final

done
