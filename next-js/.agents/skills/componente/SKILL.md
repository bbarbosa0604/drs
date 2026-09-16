---
name: componente
description: Cria ou refatora componentes reutilizaveis no projeto `next-js/`, dentro de `components/`. Use quando a tarefa envolver card, badge, bloco visual, composicao de UI ou extracao de trecho repetido de uma pagina ou secao.
metadata:
  short-description: Cria componentes reutilizaveis no next-js
---

# Componente

Use esta skill para construir pecas visuais reutilizaveis. O foco e manter a API do componente pequena e nao deixar regra de dominio vazar para dentro dele.

## Quando usar

- novo componente visual em `components/`
- refactor de componente grande
- extracao de trecho repetido entre paginas ou secoes
- componente que precisa de estilo com Tailwind e tokens

## Leitura inicial

- `AGENTS.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/STYLING.md`

## Workflow

### 1. Modele uma API pequena

- props bem tipadas, sem `any`
- sem prop bag generica demais
- sem chamada a `payload`, banco ou API externa dentro do componente

### 2. Use Tailwind com tokens

- token semantico antes de valor arbitrario
- `clsx` para classe condicional
- sem CSS Module novo (ver `docs/ai/STYLING.md`)

### 3. Mantenha o componente facil de compor

- estados visuais explicitos (loading, vazio, erro quando aplicavel)
- extraia utilitario quando o render ficar denso
- prefira Server Component; suba para Client Component so a parte que precisa

### 4. Feche com checks

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Exemplos

- "Criar card de diferencial" -> componente puro, props tipadas, sem fetch interno
- "Extrair badge de status repetido" -> tipar variantes, mover para `components/`, simplificar quem chamava antes
