# Task 007 - Design tokens Daryus no next-js + shell de layout

## Status

planned

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

nao se aplica

## Modo de execucao

single-stack

## Referencia de design system

### Stack de referencia visual

front-end

### Tipo de referencia visual

artefato de design system

### Fonte primaria visual

- `design-system/front/brand/daryus-tokens.md`
- `design-system/front/brand/daryus-brandbook.pdf`

### Regra de aderencia visual

- Cores exatamente as do brandbook (`#FF6920` laranja principal, `#1D2833` navy, `#A33600` hover, `#FFAD85` tint, `#070A0D` ink) — nao usar tons aproximados.
- Tipografia: Montserrat Bold para titulos, Lato para texto corrido (Google Fonts).
- Nao usar a paleta generica da secao 35 do PRD (substituida pelos tokens oficiais Daryus).

## Contexto de negocio

### Por que

Todas as telas seguintes (dashboard, organizacao, projeto, Escopometro) precisam de uma base visual consistente com a marca Daryus, definida uma unica vez.

### O que

Definir tokens de cor/tipografia em `next-js/src/app/globals.css` (CSS custom properties, projeto nao usa Tailwind) e um shell de layout basico (header com logo, area de conteudo) reutilizavel pelas demais telas.

### Comportamento esperado

- cenario: qualquer pagina usa `var(--color-brand-primary)` etc. em vez de hex hardcoded.
- cenario: tema claro funcional (tema escuro fica registrado como pendencia futura, PRD secao 35 pede suporte a dark mode, mas nao e bloqueante do MVP).

### Fora de escopo

- Tema escuro completo (registrar como pendencia)
- Paginas de negocio (dashboard, org, projeto — tasks 008/009)

## Casos de erro e borda

- Fonte Google (Montserrat/Lato) indisponivel offline -> definir fallback sans-serif no `font-family`

## Review da spec

- [x] Permissoes: nao se aplica
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: paleta oficial Daryus (brandbook) confirmada pelo usuario nesta conversa
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Usar CSS puro (custom properties), consistente com `next-js/src/app/globals.css` atual
- Importar Montserrat/Lato via `next/font/google` (evita FOUC e respeita convencao Next.js)

### Nao deve

- Nao introduzir Tailwind ou outra lib de estilo sem autorizacao explicita (projeto atual e CSS puro)

## Entradas

- `design-system/front/brand/daryus-tokens.md`
- `next-js/src/app/globals.css`
- `next-js/docs/ai/` (se houver anexo STYLING.md)

## Dependencias

- Nenhuma (pode rodar em paralelo as tasks de backend do Slice 001)

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Paginas de negocio especificas

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho   | Fonte                                        | Quando                                 | Obrigatorio |
| --------- | -------------------------------------------- | -------------------------------------- | ----------- |
| UI web    | `design-system/front/brand/daryus-tokens.md` | sempre                                 | sim         |
| Front-end | `next-js/docs/ai/STYLING.md` (se existir)    | se a task tiver token/classe de layout | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: baixo

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

ui-front

### Tools permitidas

- read: `next-js/`, `design-system/front/`
- edit: `next-js/src/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/app/globals.css`, `next-js/src/components/**` (shell)

### Acoes que exigem human approval

- [ ] nenhuma desta lista se aplica

### Contexto proibido

- `backend/` (stack nao envolvida), `mobile/`

### Criterios de saida

- [ ] lint/typecheck/build passam
- [ ] cores batem com `daryus-tokens.md`

## Criterios de conclusao

- Tokens de cor/tipografia aplicados em `globals.css`
- Shell de layout renderiza logo Daryus (triangulo + wordmark) com cores corretas

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, inspecao visual no browser

## Entregaveis esperados

- `next-js/src/app/globals.css` atualizado, componente de shell/layout

## Riscos ou ambiguidades

- Asset do logo (SVG) nao foi fornecido nesta conversa — usar recriacao fiel do triangulo em CSS/SVG ou pedir o arquivo `LOGO RGB copy_Color.svg` citado no brandbook

## Status final

planned
