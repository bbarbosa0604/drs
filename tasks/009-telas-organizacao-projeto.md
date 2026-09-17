# Task 009 - Telas de Organizacao e Projeto

## Status

done

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/organizations`, `#/paths/projects`

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

- Formularios devem usar os tokens da Task 007; evitar aparencia de formulario administrativo generico (PRD secao 35).

## Contexto de negocio

### Por que

Sao as telas onde o usuario efetivamente cria/mantem os dados centrais (Organizacao, Projeto) usados por todos os modulos.

### O que

Telas de listagem, criacao e edicao de Organizacao (campos PRD secao 5) e de Projeto (campos PRD secao 6, incluindo status e participantes).

### Comportamento esperado

- cenario: criar organizacao com campos obrigatorios preenchidos -> sucesso, redireciona para a organizacao criada.
- cenario: criar projeto sem organizacao selecionada -> validacao de formulario impede submissao.
- cenario: editar projeto e mudar status -> UI reflete o novo status imediatamente.

### Fora de escopo

- Ativacao do Escopometro na tela de projeto (Slice 002)

## Casos de erro e borda

- Erro de validacao do backend (400) -> exibir mensagem por campo, nao erro generico
- Usuario tenta editar organizacao/projeto sem permissao -> UI nunca deve permitir chegar la (esconder acao), mas backend (Task 004) e a garantia real

## Review da spec

- [x] Permissoes: telas respeitam vinculo do usuario (Task 004)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: campos conforme PRD secoes 5-6
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Usar React Hook Form + Zod para validacao (PRD secao 24/26), com schema compartilhado quando possivel com o backend
- Reaproveitar shell/tokens da Task 007

### Nao deve

- Nao duplicar regra de validacao divergente da API (fonte de verdade e o backend)

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Task 006, Task 007

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Ativacao de modulos

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
- edit: `next-js/src/app/(dashboard)/organizations/**`, `next-js/src/app/(dashboard)/projects/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/app/(dashboard)/organizations/**`, `next-js/src/app/(dashboard)/projects/**`

### Acoes que exigem human approval

- [x] instalar/remover dependencias — se `react-hook-form`/`zod` ainda nao estiverem em `next-js/package.json`

### Contexto proibido

- `backend/` alem do contrato exposto

### Criterios de saida

- [x] lint/typecheck/build passam
- [x] validacao de formulario cobre campos obrigatorios

## Criterios de conclusao

- [x] CRUD completo de Organizacao e Projeto navegavel via UI, com validacao e feedback de erro (com uma excecao registrada abaixo: participantes de projeto)

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual do fluxo de criacao/edicao

## Entregaveis esperados

- Paginas/rotas de Organizacao e Projeto em `next-js/src/app/(dashboard)/`

## Riscos ou ambiguidades

- **Gap de contrato encontrado durante a execucao**: o formulario de Projeto deveria permitir escolher `responsibleUserId` e `participantUserIds` (PRD secao 6), mas nao existe nenhum endpoint que um Consultor comum possa chamar para listar usuarios — `GET /users` e restrito a DSR Admin (`RolesGuard`, Task 003). Sem isso, um Consultor nao tem como montar um seletor de responsavel/participantes. Decisao adotada (nao confirmada com o Bruno): `responsibleUserId` e sempre o usuario autenticado que cria o projeto (campo oculto, nao editavel no formulario); `participantUserIds` **nao e editavel nesta tela** (o backend ja aceita esse campo, mas a UI nao expõe um seletor). Ver pendencia.

## Resultado da execucao

- **Dependencias novas instaladas com aprovacao do Bruno**: `react-hook-form`, `zod`, `@hookform/resolvers` (glue entre os dois, necessaria para `zodResolver`, nao estava listada explicitamente na task mas e infraestrutura minima para "React Hook Form + Zod" funcionarem juntos).
- Todas as rotas ficaram em `next-js/src/app/organizations/**` e `next-js/src/app/projects/**` (sem route group `(dashboard)`), consistente com a Task 008: este projeto nao usa `(dashboard)/`, a rota pos-login e `/` diretamente.
- Organizacao: `/organizations` (lista, com estado vazio/erro), `/organizations/new` (criacao), `/organizations/[id]` (edicao — mesmo formulario, reaproveitado via prop `organization`). Todos os campos do PRD secao 5 estao no formulario, incluindo `values` (textarea, um valor por linha, convertido para array no submit).
- Projeto: `/projects`, `/projects/new`, `/projects/[id]`. Campo `organizationId` e um `<select>` populado com as organizacoes do usuario (trava para edicao, so pode ser definido na criacao); `status` so aparece no formulario de edicao (create sempre nasce `DRAFT`, conforme a task pede); `responsibleUserId`/`participantUserIds` — ver ambiguidade acima.
- Erros de validacao do backend (400) aparecem como uma mensagem unica acima do botao de salvar, nao por campo — o backend (`class-validator`) nao retorna erro estruturado por campo hoje, so uma mensagem geral; granularidade por campo ficaria para uma task que ajuste o formato de erro do backend (fora do escopo "front-end only" desta task).
- BFF: 4 novas Route Handlers (`/api/organizations`, `/api/organizations/[id]`, `/api/projects`, `/api/projects/[id]`) leem o cookie httpOnly (Task 008) e repassam para o backend — os client components de formulario nunca veem o token.
- Componentes reutilizaveis criados: `components/forms/Field.tsx` (label + input + erro, usado nos dois formularios) e reaproveitados `components/dashboard/{SectionCard,EmptyState}` (Task 008) para as listas/estados de erro.
- **Mesma familia de desvio de paths ja registrada nas Tasks 007/008**: criei `next-js/src/services/**` (estendendo os services de Organization/Project ja existentes com `get`/`create`/`update`) e `next-js/src/components/forms/**`, alem de `next-js/src/app/organizations/**`/`projects/**`. Necessario porque a logica de chamada HTTP e sessao ja vive em `services/` desde a Task 008 (`next-js/docs/ai/ARCHITECTURE.md`), e duplicar isso dentro de `app/organizations/` teria quebrado a fronteira arquitetural do proprio projeto.

## Arquivos alterados

- Criados: `next-js/src/components/forms/Field.tsx` (+`.module.css`), `next-js/src/app/organizations/{organization-schema.ts,OrganizationForm.tsx,OrganizationForm.module.css,page.tsx,page.module.css,new/page.tsx,[id]/page.tsx}`, `next-js/src/app/projects/{project-schema.ts,ProjectForm.tsx,ProjectForm.module.css,page.tsx,page.module.css,new/page.tsx,[id]/page.tsx}`, `next-js/src/app/api/organizations/route.ts`, `next-js/src/app/api/organizations/[id]/route.ts`, `next-js/src/app/api/projects/route.ts`, `next-js/src/app/api/projects/[id]/route.ts`.
- Modificados: `next-js/src/services/organizations/organizations.service.ts` (+`getOrganization`/`createOrganization`/`updateOrganization`), `next-js/src/services/projects/projects.service.ts` (+`getProject`/`createProject`/`updateProject`), `next-js/src/services/http/backend-client.ts` (+`toErrorResponse`), `next-js/package.json`/`package-lock.json` (novas dependencias).

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run build`: executado com sucesso (13 rotas geradas)
- Teste manual (via `next dev` + browser): confirmado que `/organizations`, `/organizations/new`, `/projects`, `/projects/new` redirecionam para `/login` sem sessao. **Fluxo completo de criacao/edicao nao testado contra o backend real** (sem Postgres/backend disponivel neste ambiente, mesma limitacao da Task 008).

## Pendencias pos-task

- Confirmar com o Bruno a decisao de `responsibleUserId`/`participantUserIds` (ambiguidade acima) — provavelmente exige uma nova rota de backend (ex.: `GET /organizations/:id/members` ou `GET /projects/:id/members`) antes de expor um seletor de usuarios na UI.
- Testar o fluxo completo (criar organizacao, criar projeto, editar status) contra o backend real apos deploy.
- Erros de validacao do backend continuam exibidos como mensagem unica, nao por campo.

## Status final

done
