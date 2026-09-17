# Handoff - Task 008

## Identificador da task

Task 008 - Dashboard

## Slice vertical

Slice 001 - Fundacao da plataforma (`tasks/slices/001-fundacao-plataforma.md`)

## Status final

done

## Decisoes preservadas

- **Login nao tinha task propria no backlog** (nenhuma das tasks 001-027 cobre a UI de login) — construido o minimo necessario dentro desta task, pois o dashboard exige chamar rotas protegidas por JWT. Ver pendencia abaixo: confirmar com o Bruno se isso deveria ter sido uma task formal separada.
- Sessao guardada em cookie **httpOnly** proprio do Next.js (`dsr_session`), setado por Route Handlers (`/api/auth/login`, `/api/auth/logout`) que fazem de BFF para o backend NestJS. O token nunca chega ao bundle do client. Escolhido por seguir `next-js/docs/ai/SECURITY.md` ("preferir cookies httpOnly quando o backend suportar" — aqui o Next.js e quem passa a "suportar", ja que o backend so devolve bearer token no corpo).
- Todas as chamadas ao backend (`/auth/me`, `/organizations`, `/projects`) acontecem em Server Components/Route Handlers, nunca em client components — evita CORS e mantem o token fora do client.
- Dashboard implementado em `/` (`src/app/page.tsx`), substituindo o placeholder do scaffold, e nao em `(dashboard)/` — route group nao muda a URL, e `/` ja e a rota pos-login pedida.
- `services/**` foi criado apesar de nao estar nos "Paths permitidos para escrita" literais da task, porque `next-js/docs/ai/ARCHITECTURE.md` exige centralizar HTTP em `services/http/` — mesma familia de contradicao ja registrada na Task 007 (task vs doc de scaffold).
- Estados tratados: vazio (sem organizacao -> CTA), erro (backend fora do ar -> card com retry), placeholders explicitos para modulos/documentos/atividades (nada inventado).

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 007.
- `contracts/openapi.yaml` (Organization/Project), `next-js/docs/ai/ARCHITECTURE.md`, `SECURITY.md`, `FRONTEND_PATTERNS.md`.

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Nenhuma dependencia nova instalada. Token de sessao nunca exposto ao client (cookie httpOnly, leitura so em Server Components/Route Handlers).

## Arquivos alterados

- Criados: `next-js/.env.example`, `next-js/src/services/http/backend-client.ts`, `next-js/src/services/auth/{session,auth.service}.ts`, `next-js/src/services/organizations/organizations.service.ts`, `next-js/src/services/projects/projects.service.ts`, `next-js/src/app/api/auth/{login,logout}/route.ts`, `next-js/src/app/login/{page.tsx,LoginForm.tsx,login.module.css}`, `next-js/src/app/LogoutButton.tsx` (+css), `next-js/src/components/dashboard/{SectionCard,EmptyState}.tsx` (+css).
- Modificados: `next-js/src/app/page.tsx`, `next-js/src/app/page.module.css`.

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK.
- Manual: redirect `/` -> `/login` sem sessao confirmado no browser; erro do backend exibido no form de login sem crash. Estados "com dados"/"vazio" do dashboard **nao testados contra backend real** (sem Postgres/backend disponivel neste ambiente).

## Pendencias ou bloqueios

- Confirmar com o Bruno se o fluxo de login deveria virar uma task formal no backlog (rastreabilidade).
- Testar dashboard com dados reais (org/projeto seedados) apos deploy.
- `/organizations/new`, `/projects/new`, `/organizations/:id`, `/projects/:id` ainda nao existem — Task 009.

## Proximo contexto recomendado

Task 009 (telas Organizacao/Projeto): criar essas rotas reaproveitando `services/organizations`, `services/projects`, `services/auth/session` ja existentes, e os componentes `SectionCard`/`EmptyState` quando fizer sentido.
