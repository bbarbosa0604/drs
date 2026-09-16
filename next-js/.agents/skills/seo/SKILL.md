---
name: seo
description: Ajusta metadata, dados estruturados, sitemap e semantica de documento no projeto `next-js/`. Use quando a tarefa envolver `generateMetadata`, canonical, Open Graph, JSON-LD, `sitemap.ts`, `robots.ts`, ou hierarquia de heading e landmarks de uma rota.
metadata:
  short-description: Ajusta SEO e semantica de documento no next-js
---

# SEO

Use esta skill para fechar a parte tecnica de SEO de uma rota ja existente. Ela nao redefine a norma, so aplica o que ja esta em `docs/ai/SEO.md`.

## Quando usar

- rota nova precisando de `generateMetadata`
- Open Graph ou Twitter card incompletos
- dado estruturado (JSON-LD) novo ou incorreto
- `sitemap.ts`/`robots.ts` desatualizados
- heading fora de ordem ou landmark faltando

## Leitura inicial

- `AGENTS.md`
- `docs/ai/SEO.md`
- `docs/ai/ACCESSIBILITY.md`
- `docs/ai/PAYLOAD_CMS.md`

## Workflow

### 1. Garanta metadata completa

- `generateMetadata` ou `metadata` por rota indexavel
- canonical absoluto
- Open Graph e Twitter com imagem dimensionada

### 2. Valide o dado estruturado

- um bloco JSON-LD por tipo de entidade
- so dado que aparece de fato na pagina

### 3. Confira sitemap e robots

- rota publicada entra no sitemap; `/admin` e `/api` ficam de fora
- campo de SEO vazio no CMS cai para `seo-defaults`, nunca renderiza tag vazia

### 4. Confira semantica de documento

- exatamente um `h1`, sem salto de nivel
- `main` unico, com `header`/`nav`/`footer` quando existirem

### 5. Feche com checks

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- validar o JSON-LD num validador de dados estruturados

## Exemplos

- "Rota nova sem metadata" -> `generateMetadata` com title, description, canonical e OG
- "JSON-LD de Organization desatualizado" -> conferir contra `seo-defaults`/`site-settings` do CMS, nao hardcodar
