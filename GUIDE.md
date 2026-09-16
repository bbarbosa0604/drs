# Guia de desenvolvimento orientado por especificacao (orquestrado na raiz)

Este scaffold usa fluxo unico de planejamento e execucao na raiz para web, backend e mobile opcional.

## Estrutura esperada

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `.agents/references/`
- `.agents/skills/`
- `.agents/state/handoffs/`
- `requirements/`
- `design-system/front/` (artefatos documentais, aplicacao-prototipo visual ou prints de telas)
- `design-system/mobile/` (artefatos documentais, aplicacao-prototipo visual ou prints de telas)
- `contracts/openapi.yaml`
- `tasks/`
- `front-end/` (React/Vite)
- `next-js/` (Next.js)
- `backend/`
- `mobile/` (quando o projeto incluir mobile)
- `projetos/` (produtos; cada um com sua propria copia desta estrutura)

## Fluxo oficial

### 0. Progressive disclosure

Antes de planejar ou executar, use `.agents/context-map.md` para limitar o contexto carregado.

Todo fluxo começa com contexto mínimo e avança para contexto sob demanda conforme gatilhos explícitos.

Quando houver duvida de processo sobre fatias verticais, handoff ou uso de contexto, consulte apenas a referência sob demanda:

- `.agents/references/context-engineering.md`

Quando houver duvida sobre tools permitidas, human approval, contexto proibido ou criterios de saida de seguranca do agente:

- `.agents/references/security-constraints.md`

Nao carregue PRDs, requirements, design-system, contrato e docs de stacks inteiros por padrao.

### 0.1 Bootstrap do projeto

O scaffold e template, nao area de trabalho. Nenhum produto e implementado na raiz.

Antes de planejar, crie o projeto:

- `node scripts/new-project.mjs <nome> --stack=<front-end|next-js> [--backend] [--mobile] [--cms=payload|proprio|nenhum]`

O script copia a governanca comum mais somente a stack escolhida, zera tasks e handoffs herdados, escreve o `Perfil do projeto` e roda `git init` sem commit.

Depois disso, todo o fluxo abaixo roda dentro de `projetos/<nome>/`, nunca na raiz do scaffold.

Referencia sob demanda: `.agents/references/novo-projeto.md`.

### 1. Planejamento global por vertical slices

Use a skill da raiz `planejar-tasks`.

Ela deve:

- ler contexto mínimo da raiz;
- confirmar stack web, mobile e skill de CMS (`payload`, `proprio` ou `nenhum`);
- revisar requirements e referências visuais;
- decompor a demanda em vertical slices de negócio;
- criar um arquivo por slice em `tasks/slices/`;
- transformar slices em tasks rastreáveis no backlog único;
- declarar contexto mínimo e contexto sob demanda em cada task;
- declarar orçamento de contexto e estrategia de reducao em cada task;
- materializar `## Security Constraints` em cada task (perfil interno expandido em listas concretas; o usuario so revisa);
- registrar dependências cruzadas.

### 2. Revisão humana

Revise `tasks/000-index.md`, os slices planejados e as tasks geradas antes de implementar.

### 3. Execução de task

Use a skill da raiz `executar-task` com uma task da raiz.

A execução deve:

- ler contexto mínimo;
- validar e aplicar `## Security Constraints` da task (tools, paths, human approval, contexto proibido, criterios de saida);
- declarar quais fontes sob demanda serao carregadas, com gatilho e motivo;
- carregar contexto sob demanda apenas quando necessário e nunca carregar contexto proibido;
- parar e pedir confirmacao humana antes de acoes marcadas com human approval;
- executar uma task por vez;
- não avançar para outro slice;
- delegar por stack quando aplicável;
- atualizar a task e `tasks/000-index.md`;
- gerar ou atualizar handoff em `.agents/state/handoffs/` com compliance das constraints.

### 4. Retomada via handoff

Ao retomar uma sessão, leia primeiro o handoff da última task relacionada, depois a task atual e o índice.

O handoff deve orientar o próximo contexto a carregar, mas não substitui a task nem o backlog.

Se o handoff estiver ausente, incompleto ou contraditorio com a task, use a task e o slice como fonte principal e registre a lacuna na execucao.

### 5. Mudanças de escopo

Use a skill da raiz `gerar-tasks-adicionais`.

As novas tasks devem ir para `tasks/change-requests/`, manter classificação por tipo + dependências e declarar contexto mínimo/sob demanda.

## Regras obrigatorias

- nao existe implementacao de produto na raiz do scaffold
- nao existe implementacao sem task da raiz
- nao existe task sem contexto mínimo e contexto sob demanda
- nao existe task sem slice vertical e orçamento de contexto
- nao existe task nova sem `## Security Constraints` materializado
- `contracts/openapi.yaml` e prerequisito para integracoes cliente-servidor
- cada task finaliza em `done` ou `blocked`
- toda execucao deve atualizar:
  - arquivo da task
  - `tasks/000-index.md`
  - handoff em `.agents/state/handoffs/`
- handoff não é backlog, não substitui task e não cria escopo novo
- não carregar contexto de stack não envolvida na task
- nao carregar fontes listadas como contexto proibido na task
- acoes com human approval na task exigem confirmacao antes da execucao
- nao usar historico longo da conversa como substituto de handoff, task ou slice

## Governanca local das stacks

Cada stack (`front-end/`, `next-js/`, `backend/`, `mobile/`) tem `AGENTS.md`, `GUIDE.md` e/ou `docs/ai/` para implementacao local.

Elas nao substituem a orquestracao da raiz.
