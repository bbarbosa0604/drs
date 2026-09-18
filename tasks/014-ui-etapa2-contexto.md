# Task 014 - UI Etapa 2 Contexto

## Status

done

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/context`

## Modo de execucao

single-stack

## Referencia de design system

### Stack de referencia visual

front-end

### Tipo de referencia visual

artefato de design system

### Fonte primaria visual

- `design-system/front/brand/daryus-tokens.md`

### Regra de aderencia visual

- Seguir tokens Daryus; editor de conteudo rico deve ter aparencia profissional/consultoria (PRD secao 35).

## Contexto de negocio

### Por que

Registrar o contexto organizacional (historico, direcionadores, questoes externas/internas) e pre-requisito para a declaracao de escopo mais adiante.

### O que

Editor de conteudo rico (TipTap) para historico; formulario para negocio/missao/visao/valores; listas dinamicas de questoes externas e internas (titulo, descricao, observacoes).

### Comportamento esperado

- cenario: usuario formata texto no editor (negrito, listas) -> conteudo salvo como JSON estruturado.
- cenario: adicionar questao externa -> aparece na lista correspondente, separada das internas.

### Fora de escopo

- Etapa 3 em diante

## Casos de erro e borda

- Editor com conteudo muito longo -> nao ha limite definido no PRD; registrar como nao-bloqueante para o MVP
- Questao sem titulo -> validacao de formulario impede salvar

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: uso de TipTap/ProseMirror (PRD secao 29), nao `execCommand`
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Integrar TipTap (ou ProseMirror equivalente) armazenando JSON, nunca `document.execCommand`
- Reaproveitar padrao de autosave da Task 013

### Nao deve

- Nao renderizar HTML nao sanitizado vindo do editor

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`
- `requirements/001-prd-escopometro-sgsi.md#9, #29`

## Dependencias

- Task 012, Task 013

## Slice vertical

### Identificador

Slice 002 - Escopometro: Empresa & Contexto

### Arquivo

`tasks/slices/002-escopometro-empresa-contexto.md`

### Fora do slice

- Etapa 3 em diante

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho | Fonte                                        | Quando | Obrigatorio |
| ------- | -------------------------------------------- | ------ | ----------- |
| UI web  | `design-system/front/brand/daryus-tokens.md` | sempre | sim         |
| API     | `contracts/openapi.yaml`                     | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

ui-front

### Tools permitidas

- read: `next-js/`, `design-system/front/`, `contracts/`
- edit: `next-js/src/modules/sgsi-scope/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/modules/sgsi-scope/**`

### Acoes que exigem human approval

- [x] instalar/remover dependencias — adicionar TipTap/ProseMirror ao `next-js/package.json`

### Contexto proibido

- `backend/` alem do contrato exposto

### Criterios de saida

- [x] lint/typecheck/build passam
- [x] conteudo rico sanitizado na exibicao

## Criterios de conclusao

- [x] Etapa 2 funcional com editor rico, direcionadores e questoes externas/internas

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 2 em `next-js/src/modules/sgsi-scope/`

## Riscos ou ambiguidades

- Biblioteca de editor: **TipTap** (aprovado pelo Bruno) — `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`.
- **Reconciliacao com a Task 012**: o backend guarda `OrganizationContext.history` como
  `{ html: string }` (HTML sanitizado), nao a arvore ProseMirror/JSON completa que o PRD
  secao 29 sugere literalmente. TipTap resolve isso bem: o editor em si nunca usa
  `document.execCommand` (representa o conteudo internamente como um documento
  estruturado ProseMirror, cumprindo a decisao nao-negociavel #8/#11 do PRD), so o
  formato de transporte para salvar (`editor.getHTML()`) e HTML, compativel com o
  contrato ja existente. A sanitizacao real acontece no backend (Task 012); o editor so
  restringe a **allowlist de extensoes ativas** (sem code block, code inline ou linha
  horizontal) para bater com o que o backend aceita — nao reimplementa sanitizacao no
  client, so evita o usuario formatar algo que sumiria depois de salvar.

## Resultado da execucao

- Rota `/projects/:id/sgsi-scope/context` (Server Component): busca projeto + organizacao
  - secao de contexto (`GET .../sgsi-scope/context`, Task 012) em paralelo, renderiza
    `EtapaContextoForm`. Se o modulo nunca foi ativado (404), mostra estado vazio com link
    de volta para a Etapa 1 (nao ha ativacao automatica aqui — so a Etapa 1 ativa).
- `RichTextEditor` (`modules/sgsi-scope/RichTextEditor.tsx`): TipTap com toolbar minima
  (negrito, italico, tachado, H1-H3, listas, citacao). Autosave via `useAutosave` (Task
  013, reaproveitado) chamando `PATCH /api/projects/:id/sgsi-scope/context/history`.
- "Direcionadores" (negocio/missao/visao/valores): formulario com autosave que reusa o
  endpoint de Organizacao ja existente (`PATCH /api/organizations/:id`, Task 009) — como
  esse DTO exige `name` (nao aceita PATCH parcial so dos 4 campos), o autosave sempre
  envia o objeto `Organization` completo (ja carregado em memoria, so o campo editado
  muda), nao um payload parcial de verdade. Efeito pratico para o usuario e identico
  (edita so os 4 campos na tela), mas tecnicamente e um PUT-like sobre o objeto inteiro.
- "Questoes externas/internas": `AspectList` (client component reutilizado 2x) com
  create/delete via os novos Route Handlers (`POST`/`DELETE .../context/aspects[/:id]`).
  Sem edicao inline nesta task (so criar/remover) — nao pedido explicitamente pela
  especificacao, mantendo o escopo minimo.
- `StepNav` extraido de `EtapaEmpresaForm` (Task 013) para um componente compartilhado,
  agora com `href` real para as Etapas 1 e 2 (navegacao livre, PRD secao 7); Etapas 3-8
  continuam so como rotulo (sem UI ainda).
- Todos os novos Route Handlers seguem o mesmo padrao BFF ja estabelecido (leem o cookie
  httpOnly, nunca expoem o token ao client).

## Arquivos alterados

- Criados: `next-js/src/services/sgsi-scope/context.service.ts`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/context/history/route.ts`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/context/aspects/route.ts`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/context/aspects/[aspectId]/route.ts`,
  `next-js/src/app/projects/[id]/sgsi-scope/context/page.tsx`,
  `next-js/src/modules/sgsi-scope/StepNav.tsx`,
  `next-js/src/modules/sgsi-scope/RichTextEditor.tsx` (+css),
  `next-js/src/modules/sgsi-scope/etapa-contexto/EtapaContextoForm.tsx` (+css),
  `next-js/src/modules/sgsi-scope/etapa-contexto/AspectList.tsx`.
- Modificados: `next-js/src/modules/sgsi-scope/etapa-empresa/EtapaEmpresaForm.tsx`
  (steps extraidos para `StepNav`), `next-js/package.json`/`package-lock.json` (TipTap).

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run build`: executado com sucesso (20 rotas)
- Teste manual (via `next dev` + browser): confirmado que
  `/projects/:id/sgsi-scope/context` redireciona para `/login` sem sessao. **Editor
  TipTap, autosave e CRUD de questoes nao testados contra backend real** (sem
  Postgres/backend disponivel neste ambiente, mesma limitacao das Tasks 008/009/013).

## Pendencias pos-task

- Testar o fluxo completo (editor, direcionadores, questoes) contra o backend real apos
  deploy.
- Considerar edicao inline de questoes existentes (so criar/remover foi implementado).
- Revisitar se "Direcionadores" deveria ter um endpoint de PATCH parcial proprio em vez de
  reusar o PATCH completo de Organizacao.

## Status final

done
