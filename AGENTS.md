# AGENTS

Guia principal de orquestracao para o scaffold monorepo.

## Objetivo

Este repositorio adota desenvolvimento orientado por especificacao com backlog unico na raiz.

Autoridade de orquestracao:

- `AGENTS.md` (raiz)
- `GUIDE.md` (raiz)
- `.agents/skills/` (raiz)
- `.agents/context-map.md` e `.agents/references/` (indice e referencias sob demanda)

## Estrutura de governanca

- raiz: orquestracao de planejamento, execucao e rastreabilidade entre stacks
- `front-end/`: regras locais de implementacao front-end React/Vite
- `next-js/`: regras locais de implementacao front-end Next.js
- `backend/`: regras locais de implementacao backend
- `mobile/`: regras locais de implementacao mobile, quando o projeto incluir mobile

## Regra de novo projeto

Este repositorio e template e fonte de convencao, nao area de trabalho.

- nenhum produto e implementado na raiz do scaffold
- todo projeto vive em `projetos/<nome>/`, com governanca propria e somente a stack escolhida
- bootstrap por `node scripts/new-project.mjs <nome> --stack=<front-end|next-js> [--cms=payload|proprio|nenhum]`
- cada projeto e repositorio git independente; `projetos/` e ignorado pelo git do scaffold e por `ignoreDuringUpgrade`
- convencao desce do scaffold para o projeto; melhoria sobe por task da raiz do scaffold
- correcao em `docs/ai/` de uma stack nao chega sozinha a projeto ja criado, porque a stack esta em `ignoreDuringUpgrade`; o port e manual

Referência sob demanda: `.agents/references/novo-projeto.md`.

## Fontes de verdade globais

- `requirements/`: requisitos de produto
- `design-system/front/`: base visual e comportamental oficial do front-end, podendo conter artefatos documentais, aplicacao-prototipo visual ou prints de telas
- `design-system/mobile/`: base visual e comportamental oficial do mobile, podendo conter artefatos documentais, aplicacao-prototipo visual ou prints de telas
- `contracts/openapi.yaml`: contrato oficial de API
- `tasks/`: backlog unico do projeto
- `front-end/`: scaffold React/Vite para projetos web React
- `next-js/`: scaffold Next.js para projetos web Next
- `mobile/`: scaffold Expo para projetos com aplicativo mobile

## Progressive disclosure e controle de contexto

Este scaffold usa progressive disclosure para evitar excesso de contexto e reduzir risco de dumb zone.

`AGENTS.md` deve funcionar como indice de decisao para agentes, nao como documentacao enciclopedica do projeto. Detalhes longos devem ficar em referencias menores e ser carregados somente quando houver gatilho explicito.

Regras:

- carregar primeiro apenas contexto mínimo;
- usar `.agents/context-map.md` para decidir quais fontes adicionais devem ser lidas;
- não carregar `requirements/`, `design-system/`, `contracts/` ou `docs/ai/` inteiros sem gatilho explícito;
- declarar antes de cada leitura sob demanda qual decisao, implementacao ou validacao depende daquela fonte;
- cada task deve declarar `Contexto mínimo` e `Contexto sob demanda`;
- cada task deve declarar `Orçamento de contexto` e bloquear quando o escopo exigir contexto amplo demais;
- cada task deve declarar `## Security Constraints` materializado (tools permitidas, human approval, contexto proibido, criterios de saida);
- cada execução deve gerar ou atualizar handoff em `.agents/state/handoffs/`;
- handoffs servem para retomada entre sessões e não substituem tasks da raiz;
- handoff não é backlog, não cria escopo novo e não pode contrariar a task.

Referência sob demanda:

- `.agents/references/context-engineering.md`: usar quando houver duvida sobre vertical slice, handoff, progressive disclosure ou controle de contexto.
- `.agents/references/security-constraints.md`: usar quando houver duvida sobre tools permitidas, human approval, contexto proibido ou criterios de saida de seguranca do agente.

## Regra de progressive disclosure

A raiz não deve carregar todo o projeto no contexto por padrão. A raiz deve decidir qual slice ou task será executado, declarar quais fontes governam aquele escopo e carregar apenas os arquivos necessários para a próxima decisão verificável.

Todo fluxo deve começar pelo contexto mínimo e avançar para contexto sob demanda somente quando houver gatilho explícito na task, no contrato, na referência visual ou na stack afetada.

Ao retomar uma conversa longa, o agente deve preferir o handoff relevante em `.agents/state/handoffs/` ao histórico bruto da conversa. Se nao houver handoff suficiente, registrar a lacuna na task antes de continuar.

## Regra de vertical slice

Vertical slice é uma entrega funcional coerente que atravessa as camadas necessarias do sistema. Nao é apenas uma lista de tarefas tecnicas por camada.

Cada slice deve:

- existir como arquivo proprio em `tasks/slices/`;
- declarar objetivo de negocio, entrega verificavel e fora de escopo;
- apontar tasks relacionadas;
- declarar contexto mínimo, contexto sob demanda e risco de contexto;
- ser pequeno o bastante para execucao incremental sem carregar uma spec inteira.

Uma task nao deve avançar para outro slice sem nova task da raiz.

## Regra de handoff

Handoff é memoria curta de execucao. Ele preserva apenas decisoes, contexto usado, arquivos alterados, validacoes, pendencias e proximo contexto recomendado.

Handoff nao deve:

- repetir a spec inteira;
- substituir `tasks/000-index.md`;
- criar novo escopo;
- ser usado como justificativa para implementar fora da task atual.

## Regra de backlog unico

Toda task deve ser criada na raiz em `tasks/` e deve conter:

- `Tipo`: `front`, `back`, `mobile` ou `shared`
- `Stacks envolvidos`
- `Contrato` (quando aplicavel)
- `Modo de execucao`: `single-stack` ou `cross-stack`
- `Slice vertical` com caminho concreto para `tasks/slices/*.md`
- `Contexto mínimo`, `Contexto sob demanda` e `Orçamento de contexto`
- `## Security Constraints` com listas materializadas (nao apenas o nome de um perfil)

Nao existe task valida fora da raiz.

## Regra de Security Constraints (agente)

Security Constraints governam a execucao do agente na task: o que pode usar, o que exige humano, o que nao pode entrar no contexto e como validar a saida.

Regras:

- a skill de planejamento materializa o bloco completo; o usuario apenas revisa;
- a skill de execucao aplica o bloco da task e nao reinterpreta so o nome do perfil;
- tools fora da allowlist sao proibidas por omissao;
- acoes marcadas com human approval sao bloqueantes ate confirmacao humana;
- contexto proibido na task nao deve ser carregado;
- task sem Security Constraints materializado nao deve ser executada como `done` (bloquear ou completar o bloco antes);
- isso e complementar a seguranca de produto em `*/docs/ai/SECURITY.md`, nao a substitui.

## Skills da raiz

- `planejar-tasks`: cria backlog unico consolidado por tipo e dependencias
- `executar-task`: executa uma task da raiz, com delegacao por stack
- `gerar-tasks-adicionais`: gera change requests no backlog unico da raiz
- `handoff-task`: gera ou atualiza handoff curto de uma task da raiz
- `criar-cms-payload`: implementa Payload CMS dentro da stack `next-js`, via Local API
- `criar-cms-next`: implementa CMS proprio escrito a mao dentro da stack `next-js`

`criar-cms-payload` e `criar-cms-next` sao mutuamente exclusivas. A escolha e perguntada no planejamento e registrada em `Perfil do projeto` como `cms: payload | proprio | nenhum`; o criterio completo esta no `SKILL.md` de cada uma.

## Skills locais

Skills locais das stacks existem para implementacao especializada.
Elas nao devem planejar backlog global.

## Padronizacao de contexto AI por stack

- `front-end/docs/ai/` e `next-js/docs/ai/` devem manter a mesma malha documental base para stacks web:
  - `ACCESSIBILITY.md`
  - `AGENTS.md`
  - `ARCHITECTURE.md`
  - `CLEAN_CODE.md`
  - `CODE_STYLE.md`
  - `COMPONENT_REUSE.md`
  - `DEVELOPMENT_WORKFLOW.md`
  - `EXAMPLES.md`
  - `FRONTEND_PATTERNS.md`
  - `QA.md`
  - `REPO_MAP.md`
  - `SECURITY.md`
- O conteudo deve ser adaptado a tecnologia local (`front-end` React/Vite ou `next-js` Next.js), mas a cobertura documental deve permanecer equivalente.
- Alem da malha base, cada stack pode ter anexos proprios, desde que declarados aqui.
- Anexos de `next-js/`:
  - `STYLING.md` (Tailwind v4 e tokens em 3 niveis)
  - `SEO.md`
  - `PERFORMANCE.md`
  - `PAYLOAD_CMS.md` (somente quando o projeto usar Payload)
- Anexo nao cria obrigacao de paridade. Um anexo so migra para a malha base quando existir equivalente escrito na outra stack web.
- Pendente de paridade futura: `SEO.md` e `PERFORMANCE.md` no `front-end/`.
- Tasks `front` devem ler o `docs/ai/` da stack web escolhida antes de implementar, e os anexos somente por gatilho declarado na task.

## Regras operacionais

- nenhuma implementacao de produto na raiz do scaffold; todo projeto vive em `projetos/<nome>/`
- nenhuma implementacao sem task da raiz
- uma task da raiz por vez
- toda task deve declarar contexto mínimo e contexto sob demanda
- toda task deve declarar Security Constraints materializado
- toda execução deve gerar ou atualizar handoff curto em `.agents/state/handoffs/`
- não carregar contexto de stack não envolvida na task
- não carregar fontes listadas em contexto proibido da task
- se a task exigir contexto excessivo, bloquear e recomendar fatiamento em slices menores
- se a acao estiver em human approval na task, parar e pedir confirmacao antes de executar
- tasks `shared` podem executar subagentes em paralelo por stack
- toda execucao atualiza a task e `tasks/000-index.md`
- `contracts/openapi.yaml` e obrigatorio para integracoes cliente-servidor
- task com UI de `front` deve usar `design-system/front/` como referencia visual primaria
- task com UI de `mobile` deve usar `design-system/mobile/` como referencia visual primaria
- task `shared` com UI em mais de uma stack deve explicitar a referencia visual de cada stack
- quando a referencia visual declarada for prints de telas, a task deve apontar os arquivos/imagens concretos e registrar telas, estados e lacunas que os prints nao cobrem
- nao usar a referencia visual de uma stack para inferir a outra sem registro explicito na task
- antes de planejar tasks, confirmar se a stack web sera `front-end` (React/Vite) ou `next-js` (Next.js)
- antes de planejar tasks, confirmar se o projeto tera `mobile`; se nao tiver, nao gerar tasks nem obrigar leitura local de `mobile/`
- antes de planejar tasks de conteudo editavel em `next-js`, confirmar qual skill de CMS governa o projeto e registrar `cms` no perfil; nao inferir

## Commits e PRs para humanos e IAs

- Todos os commits devem usar Conventional Commits no formato `<type>(<scope>): <description>`.
- O `scope` é obrigatório para manter responsabilidade clara por área, módulo ou stack.
- Tipos permitidos: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`, `ci`, `perf`, `build`, `revert`.
- Nunca usar mensagens genéricas como `update files`, `changes`, `fix stuff`, `wip`, `feat: ajustes` ou `fix: correção`.
- Preferir commits pequenos e lógicos.
- Não misturar refactor e feature no mesmo commit quando puder separar.
- Não misturar mobile, backend, front-end e Next.js no mesmo commit, exceto quando a alteração for necessariamente transversal.
- Antes de commitar, rodar os checks locais configurados ou deixar os hooks executarem.
- Se o Review Guard emitir warnings, avaliar se faz sentido dividir o commit ou explicar a decisão na descrição da PR.
- Não burlar hooks com `--no-verify`, exceto em situação emergencial e documentada.
- Ver detalhes em `docs/development/commits-and-prs.md` e `docs/development/review-guard.md`.

## Comandos uteis por stack

Front-end:

- `cd front-end`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

Next.js:

- `cd next-js`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`

Esta stack nao tem script `test`. `npm run quality:test` na raiz pula a stack e sai verde; nao tratar isso como evidencia de teste.

Bootstrap de projeto:

- `node scripts/new-project.mjs <nome> --stack=next-js --cms=payload`

Backend:

- `cd backend`
- `npm run start:dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`

Mobile:

- `cd mobile`
- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
