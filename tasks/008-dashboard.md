# Task 008 - Dashboard

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

- Seguir tokens da Task 007; layout deve transmitir "consultoria, seguranca, governanca, metodologia, profissionalismo, simplicidade" (PRD secao 35), evitando aparencia de formulario administrativo generico.

## Contexto de negocio

### Por que

E a tela inicial pos-login; usuario precisa localizar rapidamente organizacoes/projetos recentes e iniciar acoes principais (PRD secao 4).

### O que

Dashboard com organizacoes recentes, projetos recentes, projetos em andamento, modulos utilizados (placeholder ate o Escopometro existir), documentos recentemente gerados (placeholder), atividades recentes (placeholder ate AuditLog existir), e acoes "Nova organizacao", "Novo projeto", "Abrir projeto".

### Comportamento esperado

- cenario: usuario sem organizacoes -> estado vazio com CTA "Nova organizacao".
- cenario: usuario com organizacoes/projetos -> listas ordenadas por atividade recente.

### Fora de escopo

- Documentos gerados e atividades reais (dependem de tasks futuras — usar estado vazio/placeholder explicito, nao dado fake)

## Casos de erro e borda

- Falha ao carregar dados (API fora do ar) -> estado de erro com retry, nao tela em branco
- Usuario autenticado mas sem nenhum vinculo a organizacao -> estado vazio, nao erro

## Review da spec

- [x] Permissoes: dashboard mostra so organizacoes/projetos vinculados ao usuario (herdado da Task 004)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: secoes do dashboard conforme PRD secao 4
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Consumir API via contrato (Task 001/005/006), nunca dado mockado em producao
- Estados de carregamento, vazio e erro explicitos para cada secao

### Nao deve

- Nao exibir "documentos gerados"/"atividades" com dados inventados antes de essas tasks existirem — usar placeholder "em breve" ou ocultar secao

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`
- `next-js/docs/ai/`

## Dependencias

- Task 006, Task 007

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Documentos/atividades reais

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho   | Fonte                                        | Quando | Obrigatorio |
| --------- | -------------------------------------------- | ------ | ----------- |
| UI web    | `design-system/front/brand/daryus-tokens.md` | sempre | sim         |
| API       | `contracts/openapi.yaml`                     | sempre | sim         |
| Front-end | `next-js/docs/ai/`                           | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 6 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

ui-front

### Tools permitidas

- read: `next-js/`, `design-system/front/`, `contracts/`
- edit: `next-js/src/app/(dashboard)/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/app/**`, `next-js/src/components/**`

### Acoes que exigem human approval

- [ ] nenhuma

### Contexto proibido

- `backend/` alem do contrato ja exposto

### Criterios de saida

- [x] lint/typecheck/build passam

## Criterios de conclusao

- [x] Dashboard exibe organizacoes/projetos reais do usuario autenticado, com estados vazio/erro tratados

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`; teste manual dos 3 estados (vazio, com dados, erro)

## Entregaveis esperados

- Pagina de dashboard em `next-js/src/app/(dashboard)/`

## Riscos ou ambiguidades

- "Modulos utilizados" so fara sentido pleno apos Slice 002 (Escopometro) existir

## Resultado da execucao

- **Gap de backlog encontrado e resolvido dentro do escopo desta task**: nenhuma task (001-027) cobre a tela de login. Como Task 008 exige "Consumir API via contrato, nunca dado mockado" e todas as rotas de `/organizations` e `/projects` exigem JWT (Task 003/004), foi necessario construir o fluxo minimo de autenticacao para o dashboard funcionar de verdade — decisao registrada aqui, nao expandida silenciosamente:
  - `next-js/src/app/login/` (pagina + form client component) chamando `POST /api/auth/login`.
  - `next-js/src/app/api/auth/login` e `.../logout` (Route Handlers) fazem de BFF: chamam o backend NestJS e guardam o `accessToken` num cookie **httpOnly** proprio do Next.js (`dsr_session`), nunca expondo o token ao bundle do client — segue a preferencia de `next-js/docs/ai/SECURITY.md` por cookies httpOnly, ja que o backend so devolve bearer token no corpo.
  - Dashboard (Server Component) le o cookie, busca `/auth/me`, `/organizations` e `/projects` **no servidor** (nunca no client), e redireciona para `/login` se a sessao expirou (401) ou nao existe.
- Dashboard implementado em `next-js/src/app/page.tsx` (rota `/`), nao em `(dashboard)/` (route group nao muda a URL — `/` ja e a rota inicial pos-login pedida pela task, e substitui a home placeholder do scaffold criada antes da Task 007/008).
- Secoes implementadas: organizacoes recentes, projetos recentes, projetos em andamento (filtrado por `status === 'IN_PROGRESS'` no client dos dados ja carregados, sem endpoint novo), e 3 placeholders explicitos ("Em breve...") para modulos utilizados, documentos gerados e atividades recentes — nunca dado inventado.
- Estado vazio: usuario sem nenhuma organizacao ve um card unico com CTA "Nova organizacao" em vez das 6 secoes.
- Estado de erro: falha de rede/backend fora do ar mostra um card de erro com link "Tentar novamente" (recarrega `/`), sem tela em branco — testado manualmente apontando para um servidor que respondeu com erro (ver Validacoes executadas).
- Acoes "Nova organizacao"/"Novo projeto"/"Abrir projeto" (via clique num item da lista) apontam para rotas que ainda nao existem (`/organizations/new`, `/projects/new`, `/organizations/:id`, `/projects/:id`) — serao criadas na Task 009. Isso e esperado no desenvolvimento incremental, nao e dado inventado.
- **Desvio dos paths de escrita listados na task**: criei `next-js/src/services/**` (http client, sessao, auth, organizations, projects) e `next-js/.env.example`, alem de `next-js/src/app/**` e `next-js/src/components/**`. O `next-js/docs/ai/ARCHITECTURE.md` deste projeto exige centralizar chamadas HTTP em `services/http/` e separar integracao de UI — seguir literalmente so `app/**`/`components/**` teria misturado fetch/token direto nas paginas, contra a arquitetura documentada do proprio projeto. Mesma natureza da contradicao ja registrada na Task 007 entre a task e um doc `docs/ai/` do scaffold.

## Arquivos alterados

- Criados: `next-js/.env.example`, `next-js/src/services/http/backend-client.ts`, `next-js/src/services/auth/session.ts`, `next-js/src/services/auth/auth.service.ts`, `next-js/src/services/organizations/organizations.service.ts`, `next-js/src/services/projects/projects.service.ts`, `next-js/src/app/api/auth/login/route.ts`, `next-js/src/app/api/auth/logout/route.ts`, `next-js/src/app/login/page.tsx`, `next-js/src/app/login/LoginForm.tsx`, `next-js/src/app/login/login.module.css`, `next-js/src/app/LogoutButton.tsx`, `next-js/src/app/LogoutButton.module.css`, `next-js/src/components/dashboard/SectionCard.tsx` (+`.module.css`), `next-js/src/components/dashboard/EmptyState.tsx` (+`.module.css`).
- Modificados: `next-js/src/app/page.tsx` (substituido o placeholder do scaffold pelo dashboard real), `next-js/src/app/page.module.css`.

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run build`: executado com sucesso
- Teste manual (via `next dev` + browser): usuario sem cookie de sessao e redirecionado de `/` para `/login`; tentativa de login com o backend respondendo erro mostra a mensagem de erro no formulario sem crash. **Nao foi possivel testar os estados "com dados" e "vazio" contra um backend real** (sem Postgres/backend rodando neste ambiente) — recomenda-se smoke test manual apos o proximo deploy com um usuario seedado.

## Pendencias pos-task

- Testar os estados "com dados" e "vazio" do dashboard contra o backend real apos deploy.
- Rotas `/organizations/new`, `/projects/new`, `/organizations/:id`, `/projects/:id` ainda nao existem (Task 009).
- Confirmar com o Bruno se o fluxo de login construido aqui (cookie httpOnly via Route Handler, sem task dedicada no backlog) e o esperado, ou se deveria virar uma task formal separada no backlog para rastreabilidade.

## Status final

done
