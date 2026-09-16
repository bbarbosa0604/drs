# Novo projeto

Use esta referencia somente quando for criar um projeto novo, decidir o perfil de um projeto ou auditar a aderencia de um projeto existente ao padrao de bootstrap.

## Principio

Este repositorio e template e fonte de convencao, nao area de trabalho.

Nenhum produto e implementado na raiz do scaffold. Todo projeto vive em `projetos/<nome>/` e carrega sua propria copia da governanca mais somente a stack escolhida.

A raiz do scaffold so muda quando a mudanca for de governanca, por task da raiz do scaffold.

## O que e copiado

Governanca comum, declarada em `scaffold-manifest.json` no bloco `projectBootstrap.commonPaths`:

- `AGENTS.md`, `GUIDE.md`, `GUIDE-FLUXOGRAMA.mmd`, `GUIDE-FLUXOGRAMA.svg`, `README.md`, `.scaffold-version`
- `.agents/`, `tasks/`, `requirements/`, `design-system/`, `contracts/`, `docs/`, `scripts/`
- `.github/`, `.husky/`, `.vscode/`, `.codex/`, `.gitignore`
- `package.json`, `package-lock.json`, `commitlint.config.cjs`, `lint-staged.config.js`, `review-guard.config.json`, `scaffold-manifest.json`

Mais **somente a stack escolhida**, declarada em `projectBootstrap.stackPaths`:

- `front-end/` quando a stack web for React/Vite
- `next-js/` quando a stack web for Next.js
- `backend/` quando o projeto tiver backend separado
- `mobile/` quando o projeto tiver mobile

`scaffold-manifest.json` e a fonte unica dessas listas. `scripts/new-project.mjs` le o manifesto; nao duplique a lista em outro lugar.

## O que nao e copiado

- stacks nao escolhidas
- `projetos/` do scaffold
- `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`
- `.git/` do scaffold
- tasks, slices, change requests e handoffs do scaffold

## Limpeza obrigatoria pos-copia

O script executa; a auditoria confere.

- `tasks/`: remover slices, change requests e tasks do scaffold; deixar `tasks/000-index.md` reduzido ao esqueleto com `Perfil do projeto` preenchido
- `.agents/state/handoffs/`: esvaziar, mantendo `.gitkeep`
- `requirements/`: esvaziar, mantendo `README.md`
- `design-system/front/` e `design-system/mobile/`: esvaziar, mantendo `README.md`
- `contracts/openapi.yaml`: manter como stub
- `README.md` e `package.json` do projeto: ajustar nome e descricao

Handoff herdado do scaffold e a fonte de erro mais comum em projeto novo: ele descreve entrega que nunca aconteceu no projeto.

## Perfil do projeto

Respondido antes de qualquer task e registrado em `tasks/000-index.md`, no slice e na task:

- stack web: `front-end` (React/Vite) | `next-js` (Next.js) | nao se aplica
- mobile: sim | nao
- backend separado: sim | nao
- cms: `payload` | `proprio` | `nenhum`
- banco: destino em dev e destino em producao

`cms` governa qual skill implementa conteudo editavel. Ver a regra de selecao em `.agents/skills/criar-cms-payload/SKILL.md`.

## Nome e identidade

- diretorio em kebab-case: `projetos/<nome>/`
- nome que nao colide com projeto existente
- `.scaffold-version` preservado, para rastrear de qual versao o projeto nasceu

## Git

- cada projeto e repositorio git independente, com remote e historico proprios
- `projetos/` esta no `.gitignore` do scaffold; o scaffold nunca versiona projeto
- `git init` roda no bootstrap; commit e do usuario
- `projetos/**` esta em `ignoreDuringUpgrade`: upgrade do scaffold nunca sobrescreve projeto

## Direcao de mudanca

Convencao desce do scaffold para o projeto. Melhoria sobe do projeto para o scaffold, e so por task da raiz do scaffold.

- nao editar o scaffold a partir de uma task de projeto
- nao editar um projeto a partir de uma task do scaffold, salvo entrega de auditoria declarada na task
- correcao de doc de stack nao chega sozinha aos projetos ja criados, porque a stack esta em `ignoreDuringUpgrade`; o port e manual e vira change request no projeto

## Bloqueios

Bloqueie quando:

- a stack web nao estiver decidida
- o projeto for `next-js` com conteudo editavel e `cms` nao estiver decidido
- o nome colidir com projeto existente em `projetos/`
- houver pedido de implementar produto fora de `projetos/`
- a limpeza pos-copia nao tiver sido feita e a primeira task ja estiver sendo planejada
