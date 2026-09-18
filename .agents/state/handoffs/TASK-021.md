# Handoff - Task 021

## Identificador da task

Task 021 - UI Etapa 5 Cadeia de Valor + diagrama

## Slice vertical

Slice 004 - Escopometro: Scope Engine — terceira task do slice.

## Status final

done

## Decisoes preservadas

- Diagrama consome `ValueChainDiagram` (Task 019) direto, sem logica de layout na UI —
  a UI so monta `DiagramData` a partir dos blocos (nome->label, categoria->group,
  classificacao->classification via `toDiagramClassification`).
- `ScopeClassification` (diagramas) ganhou `unclassified` como 4o valor — decisao
  registrada na Task 021, nao na 019, porque so ficou necessaria quando a UI real
  passou a alimentar o diagrama com dados que podem vir sem classificacao.
- Blocos sao ordenados por categoria fixa (`INPUT/PRIMARY_PROCESS/SUPPORT_PROCESS/OUTPUT`)
  antes de virar `DiagramData`, para o layout em linhas (Task 019,
  `sequential-layout.ts`) sair estavel independente da ordem de criacao.
- `services/sgsi-scope/scope-engine.service.ts` e `modules/sgsi-scope/scope-engine-options.ts`
  ja cobrem Topologia/Arquitetura tambem (usados pela Task 022) — escritos nesta task
  para nao duplicar tipos/rotulos entre as duas tasks do mesmo slice.
- `.claude/launch.json` criado na raiz do scaffold (fora do repositorio `projetos/DRS`)
  para permitir usar o Browser pane no dev server do next-js.

## Contexto efetivamente usado

- Minimo padrao + handoff/task da Task 019 (contrato dos diagramas) e Task 020
  (contrato da API).
- Padrao de codigo: `scope-definition/page.tsx` + `EtapaEscopoForm.tsx` + `ScopeListBlock.tsx`
  (Task 018) como referencia direta de estrutura (page/layout/service/BFF route).

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Escrita em `next-js/src/modules/sgsi-scope/**` (inclui
  `services/` e `app/`, que tambem precisaram de escrita — mesmo padrao ja aceito nas
  Tasks 013-018). Nenhum acesso a `backend/` alem do contrato.

## Arquivos alterados

Ver `tasks/021-ui-etapa5-cadeia-valor.md`, secao "Arquivos alterados".

## Validacoes executadas

- `npm run lint`, `npm run typecheck`, `npm run test` (vitest 9/9), `npm run build` (34
  rotas): OK.
- Manual: redirect para `/login` sem sessao confirmado contra um backend real em `:3000`
  (sem Postgres, `DATABASE_ENABLED=false` — TypeORM nao inicializa). Fluxo completo nao
  testado por falta de banco.

## Pendencias ou bloqueios

- Testar fluxo completo (CRUD de blocos + diagrama) contra backend com Postgres real.

## Proximo contexto recomendado

Task 022 - UI Etapa 6 (Topologia & Arquitetura), mesma stack de servicos/opcoes.
