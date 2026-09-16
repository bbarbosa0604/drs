# Guia Principal Para Agentes

## Stack

- Next.js + React + TypeScript
- App Router para rotas, layouts e renderizacao
- Tailwind v4 com tokens em 3 niveis declarados em `@theme`
- Services para acesso HTTP e integracoes a API externa
- Ports em `core/` e adapters na fronteira para conteudo local
- Payload CMS opcional dentro do proprio Next via Local API
- ESLint + TypeScript para validacao estatica

## Arquitetura Geral

Fluxo principal:

`Route/Page -> Components -> Services -> API/Adapters`

Diretrizes:

- `src/app/` define rotas, layouts, pages e boundaries do App Router.
- Components concentram composicao visual e comportamento de interface.
- Services encapsulam acesso a dados e regras de integracao.
- Adapters convertem payload externo ou documento de CMS para tipos internos.
- Quando houver CMS local, a page consome o port de `core/`, nunca o SDK do CMS.
- Server Components devem ser preferidos quando nao houver interatividade no cliente.
- Client Components devem ser usados apenas quando houver estado, eventos, browser APIs ou hooks de cliente.

## Regras De Desenvolvimento

- Manter componentes pequenos e com responsabilidade unica.
- Preferir tipagem explicita e evitar `any`.
- Reutilizar `components/` e padroes existentes antes de criar novas estruturas.
- Adicionar novos services antes de consumir APIs diretamente em pages.
- Manter novos fluxos coerentes com os patterns documentados.
- Respeitar a task da raiz e registrar validacoes executadas nela.

## Norma E Procedimento

- `docs/ai/*` define a norma; a skill define o procedimento e a prova.
- Nenhum dos dois repete o outro. A skill cita o doc pelo caminho.

## Uso de Skills

Este repositorio possui skills locais em `.agents/skills/`.

Use essas skills automaticamente sempre que a tarefa do usuario combinar claramente com o workflow delas, mesmo que o usuario nao cite o nome da skill diretamente no chat.

Regras:

- leia primeiro `AGENTS.md` e `docs/ai/*` para entender arquitetura, padroes e regras do projeto
- trate `docs/ai/*` como fonte principal de contexto estrutural
- trate `.agents/skills/*` como camada operacional para executar tarefas recorrentes do projeto
- quando uma tarefa combinar claramente com uma skill, use a skill correspondente sem esperar invocacao explicita
- prefira skills base para tarefas comuns de implementacao, refactor, componentes, paginas, secoes, formularios e workflow de desenvolvimento
- mantenha skills sensiveis ou de revisao critica como uso explicito quando fizer sentido, como `seguranca`, `colecao` ou `qa`
- nunca use skill para contrariar os padroes documentados em `docs/ai/*`; a skill deve reforcar o padrao do repositorio, nao competir com ele
- se mais de uma skill se aplicar, use apenas o menor conjunto necessario
- se nenhuma skill se aplicar bem, siga apenas a documentacao do repositorio e o contexto local do codigo

Objetivo:

- reduzir ambiguidade
- reaproveitar workflows recorrentes
- economizar contexto e tokens
- manter consistencia entre mudancas feitas por agentes e desenvolvedores

## Comandos Principais

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run format:write`

## Leitura Recomendada

- `docs/ai/ARCHITECTURE.md`
- `docs/ai/FRONTEND_PATTERNS.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/DEVELOPMENT_WORKFLOW.md`
- `docs/ai/SECURITY.md`
- `docs/ai/ACCESSIBILITY.md`
- `docs/ai/QA.md`
- `docs/ai/EXAMPLES.md`
- `docs/ai/REPO_MAP.md`

Anexos desta stack, carregados por gatilho declarado na task:

- `docs/ai/STYLING.md`: estilo ou token
- `docs/ai/SEO.md`: rota indexavel
- `docs/ai/PERFORMANCE.md`: midia, script de terceiro ou meta de Core Web Vitals
- `docs/ai/PAYLOAD_CMS.md`: somente quando o perfil declarar `cms: payload`

- Todos os padroes e orientacoes descritos nos documentos acima devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
