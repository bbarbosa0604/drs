---
name: handoff-task
description: gerar ou atualizar um handoff curto para retomada de contexto após execução de uma task da raiz, preservando decisões, contexto usado, validações, pendências e próximo contexto recomendado sem resumir o projeto inteiro.
---

Gere ou atualize handoff de uma task da raiz.

## Objetivo

Criar memória curta, auditável e reutilizável para evitar recarregar histórico longo ou contexto global desnecessário em sessões futuras.

## Entrada obrigatória

- task da raiz em `tasks/*.md`
- resultado da execução
- arquivos alterados
- validações executadas
- pendências ou bloqueios
- contexto efetivamente carregado

## Saída obrigatória

Criar ou atualizar arquivo em:

`.agents/state/handoffs/TASK-XXX.md`

## Regras

- não resumir o projeto inteiro;
- não criar backlog;
- não criar escopo novo;
- não contrariar a task;
- não substituir `tasks/000-index.md`;
- registrar apenas decisões e contexto úteis para retomada;
- manter o handoff curto;
- indicar próximo contexto recomendado;
- indicar fontes que não devem ser carregadas na próxima etapa quando não se aplicarem.

## Conteúdo obrigatório

- identificador da task;
- título da task;
- slice vertical;
- status final;
- decisões preservadas;
- contexto mínimo lido;
- contexto sob demanda carregado;
- compliance de Security Constraints (risco, tools usadas vs allowlist, human approvals, contexto proibido, critérios de saída);
- arquivos alterados;
- validações executadas;
- pendências;
- próxima ação sugerida;
- próximo contexto recomendado;
- contexto que não deve ser carregado.

## Arquivo de referência

- `references/modelo-handoff.md`
