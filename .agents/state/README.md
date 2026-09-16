# State dos agentes

Este diretório armazena artefatos temporários ou persistentes de apoio à execução por agentes.

## Objetivo

Reduzir perda de contexto entre sessões e evitar que agentes recarreguem histórico longo ou documentos globais desnecessários.

## Handoffs

Os handoffs ficam em:

`.agents/state/handoffs/`

Eles registram memória curta por task:

- decisões preservadas;
- contexto utilizado;
- arquivos alterados;
- validações executadas;
- pendências;
- próximo contexto recomendado.

Handoff não é backlog.
Handoff não substitui `tasks/000-index.md`.
Handoff não cria escopo novo.
Handoff não deve resumir o projeto inteiro.

## Slices

Slices de backlog devem ser registrados em:

`tasks/slices/`

Slices são usados para decompor specs grandes em entregas verticais menores e fazem parte do backlog rastreável.

`.agents/state/` não deve armazenar backlog. Use este diretório apenas para memória operacional curta, como handoffs.
