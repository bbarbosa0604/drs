---
name: layout
description: Cria ou refatora estruturas de layout no projeto `next-js/`. Use quando a tarefa envolver header, footer, shell de pagina, navegacao estrutural, menu mobile ou reorganizacao macro da interface.
metadata:
  short-description: Cria layouts e shells no padrao do next-js
---

# Layout

Use esta skill para montar a estrutura macro da interface sem puxar regra de dominio ou conteudo especifico para a camada de layout.

## Quando usar

- header ou footer novo
- shell de `layout.tsx`
- navegacao estrutural e menu mobile
- reorganizacao estrutural de rota

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/ACCESSIBILITY.md`

## Workflow

### 1. Preserve a responsabilidade do layout

Layout cuida de:

- estrutura, espacamento e navegacao estrutural
- composicao de regioes (`header`, `nav`, `main`, `footer`)

Layout nao cuida de:

- regra de negocio
- acesso a `payload` ou API externa
- conteudo especifico de uma secao

### 2. Consuma configuracao via port

- dado de header/footer vindo do CMS (ex.: `site-settings`, `header`, `footer`) passa pelo port de `core/content/`

### 3. Cuide de landmarks e navegacao por teclado

- um `main` por documento
- menu mobile operavel por teclado, com estado de aberto anunciado

### 4. Feche com checks

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Exemplos

- "Criar header flutuante com menu mobile" -> layout busca dados via port, componente de menu isola o Client Component do toggle
- "Refatorar footer" -> mover markup estrutural para o layout, manter conteudo (links, contato) vindo do CMS
