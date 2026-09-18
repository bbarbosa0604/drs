# Handoff - Task 028

## Identificador da task

Task 028 - Menu lateral de navegacao (Sidebar)

## Slice vertical

Slice 007 - Shell e navegacao — primeira e unica task do slice, ambos `done`.

## Status final

done

## Decisoes preservadas

- `Sidebar` (`next-js/src/components/shell/Sidebar.tsx`) e Client Component, unico
  ponto que decide os itens de navegacao (`NAV_ITEMS`), com dois tipos de item
  (`NavLinkItem`/`NavGroupItem`) — grupos colapsaveis existem como capacidade generica
  desde ja, mesmo sem nenhum modulo real precisar de grupo hoje. Ao adicionar um novo
  modulo, o padrao e adicionar um item em `NAV_ITEMS`, nunca alterar a logica de
  renderizacao.
- A marca (`DaryusLogo`) saiu do header antigo do `AppShell` e foi para o topo do
  `Sidebar` — o header antigo (so logo, 64px) deixou de existir; cada pagina continua
  responsavel pelo proprio cabecalho de conteudo (ex.: `page.tsx` do dashboard ja tinha
  `topBar` com saudacao + logout).
- **Engano corrigido nesta rodada**: esta mesma funcionalidade foi implementada por
  engano no repositorio `fasters-projects/scaffolds` (o gerador de scaffold, nao o
  produto), commitada e pusheada la (`2bdf7fe`), depois revertida no mesmo repositorio
  (`0245288`) assim que o erro foi percebido. A implementacao real ficou neste
  repositorio (`bbarbosa0604/drs`), do zero, adaptada ao `next-js` (o scaffold errado
  usava React/Vite, que este projeto nao usa).

## Contexto efetivamente usado

- Minimo padrao + `tasks/028-menu-lateral-navegacao.md`, `tasks/slices/007-shell-navegacao.md`.
- `CLAUDE.md` (raiz do projeto DRS) — confirmou a regra "nenhuma implementacao sem task
  da raiz" e a stack real (CSS puro + CSS Modules, sem Tailwind).
- `next-js/src/components/shell/AppShell.tsx`, `DaryusLogo.tsx`, `next-js/src/app/globals.css`.
- `design-system/front/brand/daryus-tokens.md`.

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Escrita restrita a
  `next-js/src/components/shell/{AppShell,Sidebar}.{tsx,module.css}` mais os arquivos
  de processo (`tasks/**`, este handoff). Nenhuma dependencia nova instalada. Nenhum
  `.env`/token/dado de producao acessado ou logado. Push remoto para `bbarbosa0604/drs`
  aprovado explicitamente pelo Bruno na conversa que originou esta task.

## Arquivos alterados

Ver `tasks/028-menu-lateral-navegacao.md`, secao "Arquivos alterados".

## Validacoes executadas

- `cd next-js && npm run lint` — sem erros.
- `cd next-js && npm run typecheck` — sem erros.
- `cd next-js && npm run test` — 3 arquivos, 9 testes, todos passando (suite
  pre-existente da Task 019, nao afetada por esta task).
- `cd next-js && npm run build` — build de producao concluido, todas as rotas
  compilaram (todas dinamicas; nenhuma chamada de rede real durante o build).

## Pendencias ou bloqueios

- **Sem verificacao visual autenticada real**: nao havia backend/DB local disponivel, e
  o `next-js/.env.local` deste ambiente aponta para a API de producao
  (`api.drs.fasters.com.br`) — para nao usar credenciais/dados reais so para uma
  captura de tela, a verificacao desta task ficou em lint/typecheck/test/build + leitura
  de codigo. Recomendado ao Bruno: rodar `npm run dev` com uma sessao real e conferir o
  menu lateral visualmente na proxima oportunidade.
- Sem arquivo do print de referencia ("Fasters OS") versionado no repositorio — a
  aderencia visual foi por memoria da conversa, nao por comparacao objetiva. Se o Bruno
  quiser fidelidade maior (ex.: badge de notificacao, avatar/rodape do usuario no menu),
  isso vira uma task nova.

## Proximo contexto recomendado

Nenhuma proxima task planejada automaticamente por esta entrega. Quando o Escopometro
(ou outro modulo) precisar de um item de navegacao proprio no `Sidebar`, tratar como
task nova e pequena (so adicionar item a `NAV_ITEMS`, sem tocar o componente).
