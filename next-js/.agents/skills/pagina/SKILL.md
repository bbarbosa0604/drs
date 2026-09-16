---
name: pagina
description: Cria ou refatora rotas no App Router do projeto `next-js/`. Use quando a tarefa envolver nova rota, `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, metadata de rota ou composicao de secoes numa pagina existente.
metadata:
  short-description: Cria rotas do App Router no padrao do next-js
---

# Pagina

Use esta skill quando a mudanca principal estiver numa rota do App Router. Ela ajuda a manter a rota fina, Server Component por padrao, e com composicao clara.

## Quando usar

- nova rota em `src/app/`
- ajuste de `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` ou `not-found.tsx`
- pagina que consome port de `core/content/` ou service de API externa
- reorganizacao de rota que cresceu demais

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/DEVELOPMENT_WORKFLOW.md`
- `docs/ai/SEO.md`

## Workflow

### 1. Defina o papel da rota

A rota deve:

- orquestrar layout e secoes
- chamar o port (`core/content/`) ou service, nunca a ferramenta de infraestrutura direto
- exportar `generateMetadata` quando a rota for indexavel

A rota nao deve:

- importar `payload` ou cliente de banco diretamente
- concentrar logica de negocio longa
- crescer com varios blocos de JSX densos sem extrair componente

### 2. Escolha Server ou Client Component

- Server Component por padrao
- Client Component so quando houver estado, evento ou API de browser
- boundary de `"use client"` no menor arquivo possivel

### 3. Feche com checks

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Exemplos

- "Criar rota /sobre" -> `page.tsx` Server Component, `generateMetadata` proprio, composicao de secoes existentes
- "Pagina lenta com fetch bloqueante" -> avaliar Suspense/streaming ou mover para o port com cache por tag
