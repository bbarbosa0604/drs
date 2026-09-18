# Task 028 - Menu lateral de navegacao (Sidebar)

## Status

done

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nao se aplica

## Contrato

- nao se aplica

## Modo de execucao

single-stack

## Referencia de design system

### Stack de referencia visual

front-end (unica stack web do projeto: next-js)

### Tipo de referencia visual

aplicacao-prototipo visual (print trazido pelo usuario, produto "Fasters OS" — usado como inspiracao de padrao de layout, nao anexado ao repositorio)

### Fonte primaria visual

- `design-system/front/brand/daryus-tokens.md`

### Regra de aderencia visual

- Estrutura de layout (marca no topo do menu lateral, lista de itens, grupos colapsaveis com chevron, item ativo destacado) segue o padrao do print de referencia.
- Paleta segue exclusivamente `daryus-tokens.md`: fundo do menu em `--color-brand-navy`, destaque do item ativo em `--color-brand-primary`, nunca as cores do exemplo (preto/verde da referencia).

## Contexto de negocio

### Por que

O produto ainda navegava so por links soltos dentro de cada pagina (dashboard) e por um header sem menu. Conforme o DSR ganha mais modulos (Organizacoes, Projetos, e futuramente outros), e necessario um menu lateral persistente e extensivel para o usuario nao se perder entre eles.

### O que

Um componente `Sidebar` (`next-js/src/components/shell/Sidebar.tsx`) integrado ao `AppShell`, renderizado em toda rota autenticada (exceto `/login`), com:

- marca Daryus no topo;
- lista de navegacao com os 3 destinos hoje existentes (Dashboard, Organizacoes, Projetos);
- suporte generico a dois tipos de item — link direto e grupo colapsavel com `children` — para os proximos modulos serem adicionados sem alterar o componente;
- destaque visual do item/rota ativa.

### Comportamento esperado

- cenario: usuario autenticado acessa qualquer rota do shell (`/`, `/organizations`, `/organizations/:id`, `/projects`, `/projects/:id`, etc.)
  resultado esperado: menu lateral fixo visivel a esquerda, com o item correspondente destacado (por path exato ou prefixo).
- cenario: usuario clica no cabecalho de um grupo colapsavel (quando existir um)
  resultado esperado: grupo expande/colapsa; grupos com um filho na rota atual comecam expandidos.
- cenario: usuario acessa `/login`
  resultado esperado: menu lateral nao aparece (rota full-bleed, comportamento inalterado desde a Task 007).
- cenario: viewport estreito (mobile)
  resultado esperado: menu lateral empilha acima do conteudo (sem sobrepor nem cortar), sem drawer/hamburguer.

### Fora de escopo

- Menu mobile tipo drawer/hamburguer.
- Persistencia de estado de grupo aberto/fechado entre sessoes.
- Novos itens de menu para modulos que ainda nao existem (Escopometro como item proprio, Documentos, Auditoria, etc.).
- Restricao de itens por papel/permissao.

## Review da spec

- [x] Permissoes definidas ou `nao se aplica` -> nao se aplica (menu igual para qualquer usuario autenticado)
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados
- [x] Security Constraints materializadas

### Evidencias da review

- Permissoes: nao se aplica nesta task (nenhum item de menu restrito por papel).
- Casos de erro: rota sem correspondencia exata ao item (destaque por prefixo), `/login` sem menu, viewport estreito (ver `Comportamento esperado`).
- Decisoes humanas confirmadas: layout de referencia (print "Fasters OS") e alvo do repositorio (`bbarbosa0604/drs`, corrigindo o engano do push anterior em `fasters-projects/scaffolds`).
- Casos de borda: item pai destacado quando a rota e um filho (`/organizations/:id` destaca `Organizacoes`).
- Security Constraints (perfil de origem e risco): `ui-front`, risco baixo — ver bloco abaixo.

## Especificacao tecnica

### Deve

- CSS puro (custom properties) + CSS Modules, como o resto do `next-js` (`AppShell.module.css`, `page.module.css`) — nao usar Tailwind.
- Reaproveitar `--color-brand-navy`, `--color-brand-primary`, `--color-text-on-brand` de `next-js/src/app/globals.css` (ja derivados de `daryus-tokens.md`).
- Reaproveitar o componente `DaryusLogo` existente para a marca no topo do menu.
- `Sidebar` como Client Component (`'use client'`), pois depende de `usePathname` e de estado local de grupos abertos/fechados.
- Manter `AppShell` como o unico ponto que decide quando o shell (agora com `Sidebar`) aparece, preservando a lista `FULL_BLEED_ROUTES`.

### Nao deve

- Nao adicionar novas dependencias (usar apenas `next/link`, `next/navigation`, `clsx`, ja presentes).
- Nao alterar fluxo de autenticacao/sessao (`services/auth/*`) nesta task.
- Nao criar itens de menu para modulos inexistentes.

## Entradas

- `next-js/src/components/shell/AppShell.tsx`
- `next-js/src/components/shell/DaryusLogo.tsx`
- `next-js/src/app/globals.css`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Nenhuma

## Slice vertical

### Identificador do slice

Slice 007 - Shell e navegacao

### Arquivo do slice

- `tasks/slices/007-shell-navegacao.md`

### Objetivo de negócio

Dar a qualquer usuario autenticado um menu lateral persistente e extensivel para navegar entre os modulos do DSR.

### Entrega verificável do slice

Menu lateral funcional em toda rota autenticada, com estrutura pronta para novos modulos.

### Fora do slice

- Menu mobile tipo drawer/hamburguer.
- Novos modulos de navegacao alem dos 3 existentes.

## Contexto mínimo

Sempre ler:

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- esta task

## Contexto sob demanda

| Gatilho                        | Fonte                                        | Quando carregar                                               | Obrigatório? |
| ------------------------------ | -------------------------------------------- | ------------------------------------------------------------- | ------------ |
| UI web                         | `design-system/front/brand/daryus-tokens.md` | sempre, esta task altera UI web                               | sim          |
| API                            | `contracts/openapi.yaml#/paths/...`          | nao se aplica, sem mudanca de contrato                        | nao          |
| Front-end                      | `next-js/AGENTS.md`, `next-js/docs/ai/`      | sempre, stack web envolvida                                   | sim          |
| Backend                        | `backend/docs/ai/...`                        | nao se aplica, sem mudanca de backend                         | nao          |
| Mobile                         | `mobile/docs/ai/...`                         | nao se aplica, mobile nao confirmado                          | nao          |
| Segurança de produto           | `docs/ai/SECURITY.md`                        | nao se aplica, sem auth/permissoes/dados sensiveis nesta task | nao          |
| Security Constraints do agente | `.agents/references/security-constraints.md` | consultado para materializar o bloco abaixo                   | sim          |

## Orçamento de contexto

- Fontes obrigatórias estimadas: 5
- Fontes sob demanda estimadas: 2
- Risco de contexto excessivo: baixo
- Estratégia para reduzir contexto: escopo restrito a `next-js/src/components/shell/`, sem tocar rotas/servicos

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

ui-front

### Tools permitidas

- read: repositorio `projetos/DRS` inteiro (para contexto), com foco em `next-js/`
- edit: `next-js/src/components/shell/**`, `tasks/**`, `.agents/state/handoffs/TASK-028.md`
- shell: `cd next-js && npm run lint`, `cd next-js && npm run typecheck`, `cd next-js && npm run test`, `cd next-js && npm run build`
- git: local e remote (`bbarbosa0604/drs`, branch `main`)
- network/MCP: nenhum (nenhuma chamada a backend real/producao)
- skill: nenhuma

### Paths permitidos para escrita

- `next-js/src/components/shell/AppShell.tsx`
- `next-js/src/components/shell/AppShell.module.css`
- `next-js/src/components/shell/Sidebar.tsx`
- `next-js/src/components/shell/Sidebar.module.css`
- `tasks/028-menu-lateral-navegacao.md`
- `tasks/slices/007-shell-navegacao.md`
- `tasks/000-index.md`
- `.agents/state/handoffs/TASK-028.md`
- proibido por omissao: tudo fora desta lista

### Acoes que exigem human approval

- [ ] instalar/remover dependencias -> nao se aplica (nenhuma dependencia nova)
- [ ] alterar `contracts/openapi.yaml` (breaking) -> nao se aplica
- [ ] migration / schema de banco -> nao se aplica
- [x] push remoto / abrir PR / comentar em issue -> aprovado pelo Bruno nesta conversa, destino corrigido para `bbarbosa0604/drs`
- [ ] alterar secrets, `.env`, CI/CD, permissoes -> nao se aplica
- [ ] expor endpoint publico novo ou remover guard -> nao se aplica
- outras: nenhuma

### Contexto proibido

- `.env`, `.env.local`, `VERCEL_OIDC_TOKEN` e qualquer outro token real
- dados reais de organizacoes/projetos vindos da API de producao (`api.drs.fasters.com.br`)
- `node_modules/`, `.next/`
- docs/codigo do `backend` e `mobile` (nao envolvidos)

### Criterios de saida / validacao de seguranca

- [x] tools usadas ⊆ tools permitidas
- [x] nenhuma escrita fora dos paths permitidos
- [x] human approvals obtidos (push aprovado nesta conversa)
- [x] nenhum secret/credencial commitado ou logado
- [x] validacoes de stack (lint/test/build) executadas
- [x] handoff registra compliance das constraints

## Criterios de conclusao

- `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build` (dentro de `next-js/`) passam sem erros.
- `Sidebar` renderiza Dashboard/Organizacoes/Projetos e destaca a rota ativa (verificado por leitura de codigo; sem sessao de producao disponivel para verificacao visual ao vivo — ver pendencia).
- `/login` continua sem o menu lateral.

## Instrucoes de implementacao

- Mover a marca (`DaryusLogo`) do header antigo para o topo do `Sidebar`.
- `AppShell` passa a renderizar `<Sidebar />` + `<main>` em grid de 2 colunas (260px + resto), empilhando em telas <= 900px.
- `Sidebar` usa uma lista `NAV_ITEMS` tipada (`NavLinkItem | NavGroupItem`) para permitir grupos colapsaveis futuros sem mudar o componente.

## Validacao esperada

- lint
- typecheck
- test (suite existente do next-js, 9 testes, inalterada)
- build (`next build`, todas as rotas dinamicas compilam sem erro de tipo)

## Entregaveis esperados

- `next-js/src/components/shell/Sidebar.tsx`
- `next-js/src/components/shell/Sidebar.module.css`
- `next-js/src/components/shell/AppShell.tsx` (atualizado)
- `next-js/src/components/shell/AppShell.module.css` (atualizado)

## Riscos ou ambiguidades

- Sem o arquivo do prototipo visual "Fasters OS" versionado no repositorio, a aderencia ao print e por memoria da conversa, nao por comparacao pixel a pixel.
- Sem backend/DB local rodando com dados de teste, a verificacao foi por lint/typecheck/test/build e leitura de codigo, nao por captura de tela autenticada real. Recomendado ao Bruno: validar visualmente com `npm run dev` apos login real na proxima oportunidade.

## Resultado da execucao

Implementado com sucesso. `Sidebar` criado e integrado ao `AppShell`, substituindo o header simples anterior. Nenhuma dependencia nova. Todas as validacoes de stack (lint/typecheck/test/build) passaram.

## Contexto utilizado

- `AGENTS.md`, `GUIDE.md`, `tasks/000-index.md`, `CLAUDE.md` (raiz do projeto)
- `next-js/src/components/shell/AppShell.tsx`, `DaryusLogo.tsx`, `next-js/src/app/globals.css`
- `design-system/front/brand/daryus-tokens.md`

## Handoff

- `.agents/state/handoffs/TASK-028.md`

## Arquivos alterados

- `next-js/src/components/shell/Sidebar.tsx` (novo)
- `next-js/src/components/shell/Sidebar.module.css` (novo)
- `next-js/src/components/shell/AppShell.tsx`
- `next-js/src/components/shell/AppShell.module.css`
- `tasks/028-menu-lateral-navegacao.md` (novo)
- `tasks/slices/007-shell-navegacao.md` (novo)
- `tasks/000-index.md`

## Validacoes executadas

- `cd next-js && npm run lint` -> sem erros
- `cd next-js && npm run typecheck` -> sem erros
- `cd next-js && npm run test` -> 3 arquivos, 9 testes, todos passando (suite pre-existente, nao afetada)
- `cd next-js && npm run build` -> build de producao concluido, 62 rotas geradas, todas dinamicas (nenhuma chamada de rede real durante o build)

## Aderencia ao design system

Cores usadas exclusivamente de `daryus-tokens.md`/`globals.css` (`--color-brand-navy`, `--color-brand-primary`, `--color-text-on-brand`). Estrutura (marca no topo, lista de links, grupo colapsavel com chevron, item ativo destacado) inspirada no print de referencia trazido pelo usuario, sem arquivo de print versionado no repositorio para comparacao objetiva futura — registrado como risco acima.

## Pendencias pos-task

- Validar visualmente em `npm run dev` com sessao autenticada real (nao feito nesta task para nao usar credenciais de producao).
- Quando o Escopometro ganhar um item de navegacao proprio (fora do fluxo atual via `/projects/:id`), avaliar se ele deve virar um grupo colapsavel do `Sidebar`.

## Status final

done
