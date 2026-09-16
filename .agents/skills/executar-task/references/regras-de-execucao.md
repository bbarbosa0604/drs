# Regras de execucao (raiz)

## Principio

Uma task da raiz por vez, com possibilidade de paralelismo interno quando a task for cross-stack, sempre usando progressive disclosure.

## Progressive disclosure na execução

A execução deve começar apenas com contexto mínimo.

Antes de carregar qualquer fonte adicional, o executor deve declarar:

- qual fonte pretende carregar;
- qual gatilho da task justifica essa leitura;
- qual decisão ou implementação depende dessa fonte.

Não carregar contexto de stack não envolvida.
Não carregar diretórios inteiros se a task apontar arquivos concretos.
Não carregar `requirements/` completo quando a task apontar requisito específico.

## Quando usar paralelismo

- task com `Modo de execucao: cross-stack`
- task `shared` com stacks independentes

## Quando bloquear

- dependencia nao concluida
- requisito ambiguo impeditivo
- contrato ausente para integracao
- task `front` sem indicar `front-end` ou `next-js` em `Stacks envolvidos`
- task `mobile` quando o perfil do projeto indicar que nao ha mobile
- task sem `Contexto mínimo` ou `Contexto sob demanda`
- task nova sem `## Security Constraints` materializado (tools, human approval, contexto proibido, criterios de saida)
- Security Constraints incompletas em risco medio/alto (allowlist vazia ou generica demais)
- acao exigindo human approval sem confirmacao humana
- tentativa de carregar fonte listada em contexto proibido
- escrita fora dos paths permitidos
- contexto sob demanda genérico demais para execução segura
- necessidade de carregar múltiplos domínios não relacionados
- slice vertical amplo demais ou com múltiplas jornadas independentes
- limitacao de ambiente impeditiva
- referencia visual ambigua ou conflitante quando a fidelidade da UI for critica
- prints de telas insuficientes para cobrir estado/fluxo critico sem premissa registrada

## Security Constraints na execução

Antes de implementar:

1. Ler o bloco `## Security Constraints` da task.
2. Se ausente em task nova → `blocked` ou completar via planejamento/CR antes de executar.
3. Declarar tools e paths que serao usados e confrontar com a allowlist.
4. Se a acao estiver marcada com human approval → parar e pedir confirmacao; nao executar e avisar depois.
5. Antes de cada leitura sob demanda → checar contexto proibido da task e regras gerais do `context-map`.
6. No fechamento → validar criterios de saida de seguranca; registrar compliance no relatorio, na task e no handoff.
7. Nao marcar `done` se criterios de saida de seguranca falharem sem justificativa humana registrada.

Referencia sob demanda: `.agents/references/security-constraints.md`.

## Regra de rastreabilidade

Toda execucao deve deixar claro:

- qual status final foi aplicado no arquivo da task
- qual status final foi aplicado no `tasks/000-index.md`
- qual status final foi aplicado no handoff
- o que foi feito em cada stack
- qual arquivo de slice foi usado e se ele precisou ser atualizado
- qual stack web foi usada quando `Tipo` for `front` (`front-end` ou `next-js`)
- quais arquivos mudaram
- quais validacoes rodaram
- o que ficou pendente
- qual contexto mínimo foi lido
- qual contexto sob demanda foi efetivamente carregado
- qual handoff foi criado ou atualizado
- se Security Constraints foram aplicadas e com qual compliance
- qual fonte em `design-system/front/` ou `design-system/mobile/` governou a UI de cada stack
- se a implementacao ficou fiel a uma aplicacao-prototipo visual, prints de telas ou quais desvios foram aceitos

Nao considerar a execucao concluida enquanto o arquivo da task permanecer com `## Status` igual a `in_progress`.

## Regra de qualidade estrutural

Antes de concluir, revisar se a implementacao manteve responsabilidades separadas:

- funcoes utilitarias reutilizaveis ou com regra propria ficam em `utils/` dedicado, nao espalhadas em pages ou componentes
- interfaces e tipos reutilizaveis ficam em `types/` ou `interfaces/`, conforme convencao da stack, nao soltos em pages ou componentes
- componentes, hooks e funcoes grandes devem ser quebrados por responsabilidade quando misturarem estado, renderizacao, formatacao, integracao ou regra de negocio
- arquivos grandes, sujos ou com responsabilidades misturadas devem ser refatorados dentro do escopo da task; se a refatoracao exceder o slice, registrar pendencia objetiva na task
