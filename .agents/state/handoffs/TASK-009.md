# Handoff - Task 009

## Identificador da task

Task 009 - Telas de Organizacao e Projeto

## Slice vertical

Slice 001 - Fundacao da plataforma (`tasks/slices/001-fundacao-plataforma.md`)

## Status final

done

## Decisoes preservadas

- `react-hook-form` + `zod` + `@hookform/resolvers` instalados com aprovacao explicita do Bruno (a task exigia human approval para novas dependencias).
- Rotas em `next-js/src/app/organizations/**` e `next-js/src/app/projects/**` (sem `(dashboard)/`), seguindo a estrutura ja estabelecida na Task 008.
- **Gap de contrato**: nao existe endpoint que um Consultor comum possa usar para listar usuarios (`GET /users` e admin-only, Task 003). Por isso `responsibleUserId` no formulario de Projeto e sempre o usuario autenticado (campo oculto, nao editavel), e `participantUserIds` **nao tem seletor na UI** ainda, apesar do backend ja aceitar o campo (Task 006). Precisa de uma rota nova de backend (ex.: `GET /organizations/:id/members`) para resolver de verdade — fora do escopo desta task (front-end only, `Contexto proibido: backend/ alem do contrato exposto`).
- Erros 400 do backend aparecem como mensagem unica no formulario, nao por campo (o backend nao retorna erro estruturado por campo hoje).
- `organizationId` do projeto fica travado (`disabled`) na edicao — so pode ser escolhido na criacao, para nao complicar a UX de "mudar de organizacao" sem necessidade real pedida pela task.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 008.
- `contracts/openapi.yaml` (Organization/Project/ProjectInput/OrganizationInput), `next-js/docs/ai/ARCHITECTURE.md`, `FRONTEND_PATTERNS.md`.

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Novas dependencias instaladas **com aprovacao humana** (item explicito da task). Nenhum acesso a `backend/` alem do contrato.

## Arquivos alterados

- Criados: `components/forms/Field.tsx` (+css), `app/organizations/{organization-schema.ts,OrganizationForm.tsx(+css),page.tsx(+css),new/page.tsx,[id]/page.tsx}`, `app/projects/{project-schema.ts,ProjectForm.tsx(+css),page.tsx(+css),new/page.tsx,[id]/page.tsx}`, `app/api/organizations/route.ts` (+`[id]/route.ts`), `app/api/projects/route.ts` (+`[id]/route.ts`).
- Modificados: `services/organizations/organizations.service.ts`, `services/projects/projects.service.ts`, `services/http/backend-client.ts` (+`toErrorResponse`), `package.json`/`package-lock.json`.

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK (13 rotas).
- Manual: redirect para `/login` confirmado em `/organizations`, `/organizations/new`, `/projects`, `/projects/new` sem sessao. Fluxo de criacao/edicao **nao testado contra backend real** (sem Postgres/backend disponivel neste ambiente).

## Pendencias ou bloqueios

- Resolver o gap de contrato (listagem de membros de organizacao/projeto) antes de expor um seletor real de responsavel/participantes.
- Testar o fluxo completo (criar org, criar projeto, editar status) com o backend real apos deploy.

## Proximo contexto recomendado

Task 010 (docs/governanca) segue no front-end/geral. Se alguma task futura tocar o backend de Organization/Project, considerar resolver o gap de listagem de membros junto.
