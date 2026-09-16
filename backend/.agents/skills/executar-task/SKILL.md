---
name: executar-task
description: executar uma task da raiz no contexto local de Backend, respeitando o backlog unico, o contrato central openapi e as regras tecnicas da stack.
---

Execute somente o escopo local de uma task da raiz.

## Contexto obrigatorio

1. ../AGENTS.md
2. ../GUIDE.md
3. ../.agents/context-map.md
4. ../tasks/000-index.md
5. task selecionada em ../tasks/*.md
6. AGENTS.md
7. docs/ai/ relevante para backend

## Progressive disclosure local

Executar apenas o escopo local da task da raiz.

Ler somente:

- contexto mínimo da task;
- docs locais da stack atual;
- fontes sob demanda que a task declarar para esta stack.

Não carregar contexto de outras stacks.
Não replanejar backlog.
Não expandir escopo.

Ao finalizar, registrar resultado local curto para consolidação e handoff:

- arquivos alterados nesta stack;
- decisões técnicas locais;
- validações executadas;
- pendências que afetem esta ou outras stacks.

## Regras de escopo

- executar apenas parte Backend da task
- nao replanejar backlog global
- nao criar task fora da raiz
- nao expandir escopo silenciosamente

## Regras de status

- iniciar marcando a task da raiz como in_progress quando aplicavel
- registrar resultado tecnico local para consolidacao
- status final permitido: done ou blocked

## Regras de bloqueio

Marcar blocked quando houver impedimento real:
- dependencia nao concluida
- ambiguidade impeditiva
- contrato ausente/incompleto para integracao
- limitacao de ambiente

## Regras de validacao

Rodar validacoes locais relevantes da stack e declarar exatamente o que foi executado.

## Resultado esperado

Atualizacao rastreavel da task da raiz com:
- resultado local
- arquivos alterados
- validacoes executadas
- pendencias
