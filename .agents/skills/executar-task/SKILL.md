---
name: executar-task
description: executar uma task da raiz em backlog unico, roteando para front-end React/Vite, Next.js, backend e mobile opcional conforme tipo, stacks envolvidos e modo de execucao, com suporte a progressive disclosure, subagentes paralelos, atualizacao obrigatoria de task, indice e handoff.
---

Execute exatamente uma task da raiz por vez.

## Entrada obrigatoria

Task em `tasks/*.md` contendo:

- `Tipo`
- `Stacks envolvidos`
- `Perfil do projeto` quando houver decisao entre React/Vite, Next.js ou mobile opcional
- `Contrato`
- `Modo de execucao`
- `Slice vertical`
- caminho concreto para o arquivo do slice em `tasks/slices/*.md`
- `Contexto mínimo`
- `Contexto sob demanda`
- `Orçamento de contexto`
- `## Security Constraints` materializado (tools, human approval, contexto proibido, criterios de saida)

## Fluxo obrigatorio

1. Ler contexto mínimo:
   - `AGENTS.md`
   - `GUIDE.md`
   - `.agents/context-map.md`
   - `tasks/000-index.md`
   - arquivo da task
2. Ler o arquivo do slice referenciado pela task em `tasks/slices/*.md`.
3. Ler handoff anterior relacionado, se existir em `.agents/state/handoffs/`.
4. Identificar o slice vertical da task.
5. Identificar o perfil da task:
   - `front-end` para React/Vite
   - `next-js` para Next.js
   - mobile `sim` ou `nao`
6. Validar `## Security Constraints`:
   - se ausente/incompleto em task nova → `blocked` (ou completar constraints antes de executar);
   - declarar tools e paths pretendidos e confrontar com a allowlist;
   - se acao ∈ human approval → parar e pedir confirmacao humana antes de prosseguir.
7. Avaliar `Contexto sob demanda` declarado na task e `Contexto proibido`.
8. Listar quais fontes serão carregadas e por quê; nunca carregar contexto proibido.
9. Validar bloqueios, incluindo contrato, dependências, referência visual, consistencia com o slice, excesso de contexto e Security Constraints.
10. Marcar task como `in_progress`.
11. Carregar apenas o contexto sob demanda necessário para a próxima decisão verificável.
12. Rotear execução:
    - `single-stack`: delegar para stack única
    - `cross-stack`/`shared`: delegar para stacks envolvidas, sem carregar contexto de stacks não envolvidas
13. Consolidar resultados técnicos.
14. Validar criterios de saida de seguranca do bloco Security Constraints.
15. Atualizar task da raiz, incluindo obrigatoriamente:
    - bloco `## Status` no topo do arquivo da task;
    - bloco `## Resultado da execucao`;
    - bloco `## Contexto utilizado`;
    - compliance de Security Constraints no resultado/contexto;
    - bloco `## Handoff`;
    - bloco `## Arquivos alterados`;
    - bloco `## Validacoes executadas`;
    - bloco `## Pendencias pos-task`;
    - bloco `## Status final`.
16. Atualizar o arquivo do slice quando a execucao alterar status, riscos, dependencias ou entregas relacionadas.
17. Atualizar `tasks/000-index.md` com o mesmo status final registrado na task.
18. Gerar ou atualizar handoff em `.agents/state/handoffs/` com secao de compliance de Security Constraints.
19. Fazer reconciliacao final de status antes de responder:
    - `## Status` da task deve ser igual a `## Status final`;
    - status da task em `tasks/000-index.md` deve ser igual a `## Status final`;
    - status do handoff deve ser igual a `## Status final`;
    - se o slice for concluido ou bloqueado por esta execucao, o arquivo em `tasks/slices/*.md` deve refletir o mesmo status.
20. Finalizar como `done` ou `blocked`. Nao marcar `done` se criterios de saida de seguranca falharem sem justificativa humana.

## Regras de roteamento

- Task `front`: executar em `front-end/` quando `Stacks envolvidos` indicar React/Vite ou `front-end`
- Task `front`: executar em `next-js/` quando `Stacks envolvidos` indicar Next.js ou `next-js`
- Task `back`: executar em `backend/`
- Task `mobile`: executar em `mobile/` somente quando mobile estiver confirmado no perfil/task
- Task `shared`: executar conforme `Stacks envolvidos`
- se `Tipo: front` nao indicar claramente `front-end` ou `next-js`, bloquear e pedir correcao da task em vez de escolher por inferencia
- Task de conteudo editavel: rotear pela skill declarada no perfil, `criar-cms-payload` para `cms: payload` e `criar-cms-next` para `cms: proprio`
- se `Tipo: mobile` existir mas o perfil indicar `mobile: nao`, bloquear e registrar inconsistencia de planejamento
- se a task envolver conteudo editavel e o perfil nao declarar `cms`, bloquear e pedir correcao do planejamento em vez de escolher a skill por inferencia
- nunca executar `criar-cms-payload` e `criar-cms-next` na mesma task ou no mesmo projeto

## Regras de subagentes

Para `cross-stack`/`shared`:

- dividir subtrabalho por stack sem sobreposicao de responsabilidade
- executar em paralelo quando possivel
- nao carregar contexto de stack nao envolvida
- nao fechar a task antes de consolidar todas as respostas

## Regras de contrato

- para integracao cliente-servidor, `contracts/openapi.yaml` deve existir e cobrir o endpoint relevante
- carregar apenas o path relevante quando possivel
- se contrato estiver ausente/incompleto e impedir execucao segura, marcar `blocked`

## Regras de design system e fidelidade visual

- task `front` com impacto em UI deve inspecionar apenas as fontes concretas declaradas em `design-system/front/`
- task `front` em `next-js` usa a mesma referencia visual `design-system/front/`, mas deve ler somente o contexto local de `next-js/`
- task `mobile` com impacto em UI deve inspecionar apenas as fontes concretas declaradas em `design-system/mobile/`
- task `shared` com impacto em UI deve registrar a fonte primaria visual de cada stack envolvida
- se a subpasta relevante contiver apenas artefatos de design system, seguir fielmente componentes, tokens, regras visuais, estados e comportamento documentados
- se a subpasta relevante contiver uma aplicacao-prototipo visual, tratar essa aplicacao como fonte primaria visual obrigatoria da implementacao para a stack correspondente
- se a subpasta relevante contiver prints de telas declarados na task, tratar esses prints como fonte primaria visual obrigatoria da implementacao para a stack correspondente
- nao reinterpretar, modernizar ou simplificar a UI por iniciativa propria quando houver aplicacao-prototipo visual ou prints de telas na subpasta relevante de `design-system/`
- nao usar `design-system/front/` para inferir UI mobile, nem `design-system/mobile/` para inferir UI front, salvo regra explicita na task
- todo desvio permitido deve ser registrado na task com justificativa objetiva, impacto e escopo do ajuste
- quando prints de telas nao cobrirem estados necessarios, registrar a lacuna e a decisao tomada; bloquear se a lacuna impedir fidelidade critica

## Regras de acessibilidade (front-end/UI)

- para task `front` ou qualquer task web com impacto em interface, ler `front-end/docs/ai/ACCESSIBILITY.md` ou `next-js/docs/ai/ACCESSIBILITY.md` conforme stack somente quando o gatilho de UI se aplicar
- tratar o checklist de acessibilidade como criterio minimo de aceite tecnico
- registrar na atualizacao da task quais praticas de acessibilidade foram aplicadas
- se houver gap de acessibilidade nao resolvido, documentar risco e plano de correcao na task antes de concluir
- se a aplicacao-prototipo visual ou os prints de telas conflitarem com acessibilidade minima, preservar ao maximo a intencao visual e documentar claramente o desvio inevitavel

## Regras de qualidade estrutural

- utils reutilizaveis ou com regra propria devem ficar em pasta `utils/` dedicada da stack ou do modulo; nao deixar funcoes auxiliares soltas dentro de pages ou componentes
- interfaces e tipos reutilizaveis devem ficar em pasta dedicada `types/` ou `interfaces/`, conforme padrao da stack; nao declarar contratos de dominio, DTOs, view models ou props compartilhadas soltos em pages ou componentes
- quebrar funcoes, hooks, componentes e arquivos grandes quando acumularem responsabilidades diferentes, regras de negocio, formatacao, estado e renderizacao no mesmo lugar
- componentizar por responsabilidade sempre que a implementacao crescer, preservando legibilidade e evitando arquivos grandes, sujos ou com regras misturadas
- antes de concluir task `front`, verificar se a mudanca respeita a organizacao de `utils/`, `types/`/`interfaces/`, hooks, services e components da stack envolvida

## Contexto mínimo para toda execução

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- arquivo do slice em `tasks/slices/*.md`
- arquivo da task

## Contexto sob demanda

Carregar somente o que a task declarar em `Contexto sob demanda` e apenas quando o gatilho se aplicar.

Exemplos:

- `requirements/`: somente se a task apontar requisito concreto ou se houver ambiguidade de negócio;
- `design-system/front/`: somente se houver UI web;
- `design-system/mobile/`: somente se houver UI mobile;
- `contracts/openapi.yaml`: somente se houver API;
- docs locais da stack: somente da stack envolvida;
- `ACCESSIBILITY.md`: somente se houver UI;
- segurança de produto: somente se houver auth, permissões, dados sensíveis ou risco declarado;
- Security Constraints do agente: `.agents/references/security-constraints.md` somente se houver dúvida ao aplicar o bloco da task.

## Regra de Security Constraints

- A fonte de verdade operacional e o bloco `## Security Constraints` da task, nao o nome do perfil sozinho.
- Tools fora da allowlist sao proibidas por omissao.
- Human approval e bloqueante: pedir confirmacao antes da acao.
- Contexto proibido vence progressive disclosure.
- App-security (`SECURITY.md` / skill local) e complementar e continua sob demanda.

## Regra de handoff

Toda execução deve gerar ou atualizar um handoff em `.agents/state/handoffs/`.

O handoff deve ser curto e conter apenas:

- identificador da task;
- slice vertical;
- status final;
- decisões preservadas;
- contexto efetivamente usado;
- compliance de Security Constraints;
- arquivos alterados;
- validações executadas;
- pendências ou bloqueios;
- recomendação de próximo contexto a carregar.

O handoff não substitui a task, não cria escopo novo e não deve resumir todo o projeto.

## Regra de bloqueio por contexto

Bloquear a execução quando a task exigir contexto amplo demais para execução segura. Nesse caso, registrar recomendação de fatiamento em slices menores.

## Arquivos de referencia

- `references/regras-de-execucao.md`
- `references/regras-atualizacao-task.md`
- `references/modelo-relatorio-execucao.md`
