---
name: modal
description: Cria ou refatora modais e dialogos no projeto `next-js/`. Use quando a tarefa envolver lightbox, confirmacao, dialog de detalhes, overlay com foco preso, ou abertura/fechamento controlado por estado num Client Component.
metadata:
  short-description: Cria modais e dialogos acessiveis no next-js
---

# Modal

Use esta skill para montar dialogos sem acoplar regra de dominio no componente base e sem quebrar acessibilidade.

## Quando usar

- lightbox de galeria
- modal de confirmacao
- dialog com formulario
- refatoracao de overlay improvisado

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ACCESSIBILITY.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Isole a estrutura base

- `components/Modal` ou equivalente generico: overlay, foco preso, `Esc` fecha, `aria-modal`
- componente de dominio (ex.: fotos da galeria) usa a base, nao reimplementa foco

### 2. Marque a fronteira Client

- estado de aberto/fechado vive no menor Client Component possivel
- `"use client"` nao sobe para a pagina inteira

### 3. Cuide do minimo de acessibilidade

- foco vai para o modal ao abrir e volta para o elemento de origem ao fechar
- ordem de tab previsivel dentro do modal
- setas navegam quando for carrossel/lightbox

### 4. Feche com checks

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Exemplos

- "Criar lightbox da galeria" -> base de modal generica, componente de galeria decide as fotos, foco preso e `Esc`/setas funcionando
- "Modal de confirmar exclusao no admin" -> acao primaria e secundaria claras, sem logica de negocio dentro da base
