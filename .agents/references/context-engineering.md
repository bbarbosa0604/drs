# Context engineering para agentes

Use esta referencia somente quando a task exigir decisao sobre vertical slice, handoff, progressive disclosure ou orçamento de contexto.

## Principio

Contexto demais reduz qualidade. Specs longas, historico de conversa, diretorios inteiros e docs de stacks nao envolvidas devem ser evitados como entrada preventiva.

O agente deve trabalhar com a menor combinacao suficiente de:

- task atual;
- slice atual;
- handoff relevante;
- fonte sob demanda com gatilho concreto;
- validacao necessaria para a proxima decisao.

## Vertical slice

Um vertical slice é uma entrega funcional coerente. Ele nao deve ser apenas uma camada tecnica isolada, como "criar repository" ou "criar controller".

Um bom slice declara:

- objetivo de negocio;
- entrega verificavel;
- escopo incluido;
- fora de escopo;
- stacks envolvidas;
- contrato ou referencia visual quando aplicavel;
- criterios de aceite;
- riscos, erros e casos de borda;
- contexto mínimo e contexto sob demanda.

Se a spec grande trouxer varias jornadas independentes, divida antes de executar. O executor deve implementar apenas a task e o slice atuais.

## Handoff

Handoff é memoria curta para retomada. Ele existe para evitar recarregar conversa longa e arquivos que nao serao usados na proxima decisao.

Um handoff deve preservar:

- objetivo concluido;
- decisoes tecnicas tomadas;
- arquivos alterados;
- contratos criados ou modificados;
- validacoes executadas;
- pendencias conhecidas;
- riscos ou pontos de atencao;
- proximo contexto recomendado;
- contexto que nao deve ser recarregado.

Um handoff nao deve repetir a spec inteira, criar nova task, ampliar escopo ou substituir `tasks/000-index.md`.

## Progressive disclosure

Antes de carregar uma fonte sob demanda, declare:

- qual gatilho concreto exige a leitura;
- qual decisao, implementacao ou validacao depende dela;
- qual é o menor arquivo, path, trecho ou referencia suficiente.

Se nao houver gatilho, nao carregue.

Se a fonte estiver em `Contexto proibido` da task (Security Constraints), nao carregue mesmo que pareca util. Contexto proibido e mais forte que progressive disclosure. Ver `.agents/references/security-constraints.md` quando houver duvida.

## Orçamento de contexto

Bloqueie ou fatie novamente quando:

- a task exigir mais de 8 fontes obrigatorias;
- houver necessidade de ler multiplas stacks nao relacionadas;
- o executor precisar de uma spec inteira para descobrir o que fazer;
- a referencia visual, contrato ou requisito estiver generico demais;
- o handoff contradizer a task ou o slice.

Registre a estrategia de reducao na task: usar handoff existente, carregar path especifico de contrato, limitar docs de stack, ou criar novo slice.
