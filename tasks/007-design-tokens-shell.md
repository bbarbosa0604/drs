# Task 007 - Design tokens Daryus no next-js + shell de layout

## Status

done

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

- [x] lint/typecheck/build passam
- [x] cores batem com `daryus-tokens.md`

## Criterios de conclusao

- [x] Tokens de cor/tipografia aplicados em `globals.css`
- [x] Shell de layout renderiza logo Daryus (triangulo + wordmark) com cores corretas

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, inspecao visual no browser

## Entregaveis esperados

- `next-js/src/app/globals.css` atualizado, componente de shell/layout

## Riscos ou ambiguidades

- Asset do logo (SVG) nao foi fornecido nesta conversa — usado recriacao fiel do triangulo em SVG inline (`DaryusLogo.tsx`). Substituir pelo arquivo oficial `LOGO RGB copy_Color.svg` quando disponivel.
- **Contradicao encontrada entre a task e `next-js/docs/ai/STYLING.md`**: STYLING.md descreve um padrao Tailwind v4 com tokens em `@theme` e proibe CSS Module, mas o projeto real nao tem Tailwind instalado (`package.json` sem dependencia) e ja usava CSS Module antes desta task (`page.module.css`). Segui a instrucao explicita desta task ("Deve: CSS puro/custom properties", "Nao deve: nao introduzir Tailwind sem autorizacao") e o estado real do codigo, mantendo CSS Modules para os componentes do shell. `STYLING.md` parece um doc generico de scaffold nao adaptado a este projeto — recomenda-se corrigi-lo ou confirmar a stack de estilo com o Bruno numa task de docs/governanca (fora do escopo de escrita desta task: paths permitidos eram so `globals.css` e `components/**`).

## Resultado da execucao

- Tokens de cor (nivel 1) adicionados em `globals.css` com os 5 tons oficiais do brandbook (`--color-brand-tint/primary/primary-dark/navy/ink`), mais tokens semanticos (nivel 2) para superficie, texto e borda.
- Tipografia: Montserrat (peso 700, titulos) e Lato (400/700, texto corrido) carregadas via `next/font/google` em `layout.tsx`, expostas como `--font-montserrat`/`--font-lato` e consumidas via `--font-heading`/`--font-body`.
- Fallback `sans-serif` mantido nas variaveis de fonte para o caso de indisponibilidade do Google Fonts.
- Criado `AppShell` (`components/shell/AppShell.tsx`) com header (fundo navy, logo) e area de conteudo; agora envolve toda a aplicacao a partir de `RootLayout`, entao todas as paginas (incluindo a home atual) ja usam o shell.
- Criado `DaryusLogo` (`components/shell/DaryusLogo.tsx`) recriando o simbolo (triangulo, variante cor principal) + wordmark em SVG/CSS Module, com variante `light`/`dark` para uso em fundos claros ou escuros.
- Tema escuro **nao** implementado (fora de escopo desta task, registrado como pendencia conforme o proprio PRD secao 35).
- Verificacao visual feita rodando `next dev` localmente e conferindo com screenshot: header navy, triangulo laranja (`#FF6920`) e wordmark Montserrat renderizam corretamente.

## Arquivos alterados

- Modificado: `next-js/src/app/globals.css` (tokens de cor/tipografia)
- Modificado: `next-js/src/app/layout.tsx` (fontes Google + `AppShell`)
- Criado: `next-js/src/components/shell/AppShell.tsx`
- Criado: `next-js/src/components/shell/AppShell.module.css`
- Criado: `next-js/src/components/shell/DaryusLogo.tsx`
- Criado: `next-js/src/components/shell/DaryusLogo.module.css`

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run build`: executado com sucesso
- Inspecao visual: `next dev` local + screenshot no browser, cores conferidas contra `daryus-tokens.md`

## Pendencias pos-task

- Substituir o SVG recriado do triangulo pelo arquivo oficial do brandbook quando disponivel.
- Reconciliar `next-js/docs/ai/STYLING.md` (assume Tailwind) com o estado real do projeto (CSS puro + CSS Modules) — fora do escopo de escrita desta task.
- Tema escuro completo (PRD secao 35) fica para uma task futura.

## Status final

done
