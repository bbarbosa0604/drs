# Handoff - Task 022

## Identificador da task

Task 022 - UI Etapa 6 Topologia & Arquitetura + diagramas

## Slice vertical

Slice 004 - Escopometro: Scope Engine — **fecha o slice** (Tasks 019-022 todas `done`).

## Status final

done

## Decisoes preservadas

- Uma unica rota/pagina para a Etapa 6, com 2 subsecoes (Topologia, Arquitetura),
  espelhando a UI do PRD ("Etapa 6 — Topologia & Arquitetura" e uma etapa so no
  `StepNav`, com 2 sub-blocos 13.1/13.2 — nao 2 rotas separadas).
- Agrupamento visual no diagrama: Topologia por `type` do no (11 valores fixos do PRD);
  Arquitetura por `layer` (texto livre do usuario, com fallback "Sem camada").
- Criacao de conexao/interface exige pelo menos 1 no/componente existente (dropdown de
  selecao, nao ID digitado a mao) — reduz o caso de erro "no/componente inexistente" que
  o backend (Task 020) so devolve 400 se alguem contornar a UI.
- Exclusao bloqueada (409, Task 020) e mostrada como erro na propria linha, sem remover
  o item do estado local antes da resposta — diferente do padrao "remover otimista"
  usado para bloco/link/interface (que nao tem bloqueio de integridade sabido de
  antemao pela UI).

## Contexto efetivamente usado

- Minimo padrao + handoff/task da Task 021 (reaproveita `scope-engine.service.ts` e
  `scope-engine-options.ts` sem alteracao).

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Escrita em `next-js/src/modules/sgsi-scope/**`
  (+ `app/`, `services/` no mesmo padrao ja aceito desde a Task 013).

## Arquivos alterados

Ver `tasks/022-ui-etapa6-topologia-arquitetura.md`, secao "Arquivos alterados".

## Validacoes executadas

- `npm run lint`, `npm run typecheck`, `npm run test` (vitest 9/9), `npm run build` (41
  rotas): OK.
- Manual: redirect para `/login` sem sessao confirmado no browser (backend real em
  `:3000`, sem Postgres — TypeORM nao inicializa). Fluxo completo nao testado.

## Pendencias ou bloqueios

- Testar fluxo completo (CRUD + os 2 diagramas) contra backend com Postgres real.

## Proximo contexto recomendado

Inicio do Slice 005 (Task 023): entidades ScopeLocation/ScopeEmployeeGroup/ScopeAsset/
ScopeProvider/ScopeApproval/ScopeRevision (Etapa 7 - Limites & Recursos, + aprovacao e
revisoes do escopo).
