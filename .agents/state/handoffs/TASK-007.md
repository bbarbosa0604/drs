# Handoff - Task 007

## Identificador da task

Task 007 - Design tokens Daryus no next-js + shell de layout

## Slice vertical

Slice 001 - Fundacao da plataforma (`tasks/slices/001-fundacao-plataforma.md`)

## Status final

done

## Decisoes preservadas

- Stack de estilo mantida como **CSS puro (custom properties) + CSS Modules**, seguindo a instrucao explicita da task e o estado real do projeto (sem Tailwind instalado), **nao** o padrao Tailwind descrito em `next-js/docs/ai/STYLING.md` (doc de scaffold desatualizado para este projeto — ver pendencia).
- Tokens de cor em 2 niveis: nivel 1 (`--color-brand-*`, valores crus do brandbook) e nivel 2 semantico (`--color-surface`, `--color-text-*`, `--color-border`, `--color-accent*`).
- Tipografia via `next/font/google` (Montserrat 700 para titulos, Lato 400/700 para corpo), com fallback `sans-serif`.
- `AppShell` envolve toda a aplicacao a partir de `RootLayout` (nao um componente isolado sem uso) — todas as paginas ja herdam o header.
- Logo recriado em SVG/CSS (triangulo + wordmark) por falta do asset oficial; variante `light`/`dark` disponivel.
- Tema escuro fica fora de escopo (pendencia futura, PRD secao 35).

## Contexto efetivamente usado

- Minimo padrao (sem handoff anterior — task roda em paralelo ao backend, primeira do slice para a stack next-js).
- `design-system/front/brand/daryus-tokens.md` (paleta/tipografia obrigatorias).
- `next-js/docs/ai/STYLING.md` (contexto sob demanda obrigatorio) — gerou a contradicao registrada abaixo.

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Nenhuma dependencia nova instalada (fontes via `next/font/google`, ja parte do Next.js). Nenhum human approval necessario.

## Arquivos alterados

- Modificados: `next-js/src/app/globals.css`, `next-js/src/app/layout.tsx`.
- Criados: `next-js/src/components/shell/AppShell.tsx` (+ `.module.css`), `next-js/src/components/shell/DaryusLogo.tsx` (+ `.module.css`).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK.
- Inspecao visual: `next dev` local (porta 3001, 3000 ja ocupada por outro processo) + screenshot no browser — header navy, triangulo `#FF6920`, wordmark Montserrat confirmados contra `daryus-tokens.md`.

## Pendencias ou bloqueios

- `next-js/docs/ai/STYLING.md` contradiz o estado real do projeto (Tailwind vs CSS puro) — recomenda-se uma task de docs/governanca para corrigir o doc ou confirmar com o Bruno se a stack de estilo deveria migrar para Tailwind.
- Asset oficial do logo (`LOGO RGB copy_Color.svg`) ainda nao fornecido; SVG atual e uma recriacao fiel, nao o arquivo original.
- Tema escuro completo nao implementado.

## Proximo contexto recomendado

Para a Task 008 (Dashboard): reusar `AppShell` (ja envolve toda a app) e os tokens semanticos de `globals.css` em vez de cores hardcoded. Task 009 (telas Organizacao/Projeto) segue o mesmo padrao.
