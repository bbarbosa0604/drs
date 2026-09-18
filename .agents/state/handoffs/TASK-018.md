# Handoff - Task 018

## Identificador da task

Task 018 - UI Etapa 4 Escopo + indicador de preenchimento

## Slice vertical

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo
(`tasks/slices/003-escopometro-requisitos-escopo.md`) — **fecha o slice (Tasks
015-018 todas `done`).**

## Status final

done

## Decisoes preservadas

- `FillPercentageIndicator` vive num **layout compartilhado**
  (`app/projects/[id]/sgsi-scope/layout.tsx`), nao so na pagina da Etapa 4 — assim fica
  visivel em todas as Etapas do Escopometro (1-4 ate agora) sem duplicar a chamada de
  API em cada pagina. Se o modulo nao esta ativado ou a sessao expirou, o layout so
  renderiza os filhos (a pagina trata o erro).
- Disclaimer do indicador e **sempre visivel** (paragrafo fixo, nao tooltip escondido) e
  cita explicitamente as 5 coisas que o PRD secao 16 probe (conformidade ISO 27001,
  maturidade, qualidade, prontidao, adequacao). Cor da barra e neutra (navy da marca),
  nunca semaforo verde/vermelho.
- `ScopeListBlock` e generico (reutilizado para caracteristicas e beneficios) — mesma
  forma de dado, so muda o segmento da URL.
- Descricao detalhada do escopo reusa o `RichTextEditor` (TipTap, Task 014) — mesmo
  padrao de conteudo rico ja estabelecido.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 017 (UI) e Task 016 (backend do slice).
- `requirements/001-prd-escopometro-sgsi.md` secoes 11, 16 — revisao de copy linha a
  linha contra a lista de proibicoes da secao 16.

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Nenhuma dependencia nova. Nenhum acesso a `backend/`
  alem do contrato ja exposto. Texto do indicador revisado contra a regra do PRD.

## Arquivos alterados

- Criados: `services/sgsi-scope/scope-definition.service.ts`,
  `app/api/projects/[id]/sgsi-scope/scope-definition/route.ts` (+
  `characteristics[/:id]`, `benefits[/:id]`),
  `app/projects/[id]/sgsi-scope/scope-definition/page.tsx`,
  `app/projects/[id]/sgsi-scope/layout.tsx` (+css),
  `modules/sgsi-scope/FillPercentageIndicator.tsx` (+css),
  `modules/sgsi-scope/etapa-escopo/{EtapaEscopoForm,ScopeListBlock}.tsx` (+css).
- Modificado: `modules/sgsi-scope/StepNav.tsx` (href da Etapa 4).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK (33 rotas).
- Revisao de copy do disclaimer contra o PRD secao 16.
- Manual: redirect `/projects/:id/sgsi-scope/scope-definition` -> `/login` sem sessao
  confirmado. Indicador visual e fluxo completo nao testados contra backend real.

## Pendencias ou bloqueios

- Testar o indicador e o fluxo completo (autosave, listas) contra o backend real apos
  deploy.

## Proximo contexto recomendado

Inicio do Slice 004 (Scope Engine: diagramas — Cadeia de Valor, Topologia &
Arquitetura). Task 019 provavelmente trata das entidades de diagrama
(`ValueChainBlock`, `TopologyNode`, `TopologyLink`, etc., PRD secoes 12-13) — verificar
`tasks/000-index.md` para a task exata na sequencia.
