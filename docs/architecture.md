# Architecture — DRS

> Consolida as decisoes arquiteturais implementadas nas Tasks 001-009 (Slice 001 —
> Fundacao da plataforma). Atualizar incrementalmente a cada slice, nao reescrever do
> zero. Ver `CLAUDE.md` para as decisoes nao-negociaveis e desvios da stack recomendada
> pelo PRD.

## Visao geral

Dois processos separados, comunicando via HTTP e o contrato em `contracts/openapi.yaml`:

```text
next-js (App Router, Server Components + Route Handlers)
        |  fetch, servidor-a-servidor, bearer JWT
        v
backend (NestJS, Controller -> Service -> Repository -> Postgres)
```

- **Backend** e a fonte oficial de dados (decisao nao-negociavel #5). Nenhuma regra de
  autorizacao ou validacao critica vive so no frontend.
- **Frontend** nunca acessa o Postgres diretamente nem embute segredo do backend no
  bundle do client.

## Camadas do backend

`Controller -> Service -> Repository -> Database`, como documentado em
`backend/docs/ai/ARCHITECTURE.md`:

- `controller`: roteamento, DTOs (`class-validator`), guards, status HTTP. Nunca acessa
  repository/banco direto.
- `service`: regra de negocio, orquestracao entre repositories, eventos de dominio.
- `repository`: acesso a dados via TypeORM (`@InjectRepository`). Os modulos de
  Organization/Project (Tasks 005-006) injetam `Repository<Entity>` diretamente — nao ha
  a camada de abstracao `UsersRepository` (interface + in-memory/TypeORM) usada em
  `modules/users`; esse padrao foi criado antes deste projeto para permitir rodar sem
  banco (`DATABASE_ENABLED=false`) e nao foi replicado onde nao havia essa necessidade
  (evitar overengineering).
- `database/migrations`: uma migration por Task que muda schema (`1700000000000-*`,
  `1700000001000-*`, ...). Nunca `synchronize: true` em nenhum ambiente.

Modulos implementados: `auth`, `users`, `organizations`, `projects`. Cada um com
`*.module.ts`, `*.controller.ts` (quando exposto via HTTP), `*.service.ts`, `entities/`,
`dto/`.

## Multitenancy e autorizacao

Ver detalhe em `CLAUDE.md#multitenancy-e-autorizacao`. Resumo tecnico:

- `OrganizationsAccessService`/`ProjectsAccessService` (`backend/src/modules/{organizations,projects}/`)
  concentram a checagem de vinculo (`OrganizationMember`/`ProjectMember`), consultando o
  banco a cada chamada — nunca confiam no payload do JWT.
- `OrganizationAccessGuard`/`ProjectAccessGuard` (`backend/src/common/guards/`) aplicam
  essa checagem nas rotas com `:organizationId`/`:projectId`, alem do `JwtAuthGuard`.
- `RolesGuard` + `@Roles(UserRole.ADMIN)` (Task 003) cobrem RBAC de plataforma (DSR Admin
  vs. usuario comum) — usado hoje em `UsersController` (CRUD de usuarios e admin-only).
- Toda entidade de negocio (Organization, Project, e futuramente as entidades do
  Escopometro) carrega `organizationId` direto ou indireto, conforme decisao #2/#6.

## Autenticacao e sessao

- Backend: Passport JWT (`@nestjs/passport` + `passport-jwt`), `POST /auth/login` retorna
  `{ accessToken, user }`, `GET /auth/me` valida o bearer token. Sem refresh token nem
  rate limiting em `/auth/login` ainda (pendencia registrada na Task 003).
- Frontend: como o backend so devolve o token no corpo (nao seta cookie), o next-js atua
  como BFF (Task 008): `POST /api/auth/login` e `POST /api/auth/logout`
  (`next-js/src/app/api/auth/`) chamam o backend e guardam/removem o token num cookie
  **httpOnly** proprio (`dsr_session`, `next-js/src/services/auth/session.ts`). O token
  nunca chega ao bundle do client. Toda leitura de dados protegidos acontece em Server
  Components ou outras Route Handlers, nunca em client components.
- Mutacoes vindas de formularios (Task 009) tambem passam por Route Handlers-proxy
  (`next-js/src/app/api/organizations/`, `.../projects/`) pelo mesmo motivo: o client
  component nunca tem acesso ao token para chamar o backend direto.

## Servicos e repositories (convencao)

- `services/http/backend-client.ts` (`next-js`): unico ponto que monta a URL do backend
  (`BACKEND_API_URL`, variavel server-only) e injeta o header `Authorization`. Nenhuma
  page/component monta URL manualmente.
- `services/<dominio>/<dominio>.service.ts`: uma funcao por operacao (`list*`, `get*`,
  `create*`, `update*`), tipada com a forma exata do schema do contrato. Adapta a
  resposta do backend para o modelo consumido pela UI quando necessario.
- No backend, `*.service.ts` e onde vive a regra de negocio (ex.: `OrganizationsService.remove`
  bloqueando exclusao com projetos ativos; `ProjectsService.update` decidindo quando
  gravar `AuditLog`).

## Diagramas (decisao #8 — camada implementada na Task 019, entidades e endpoints na Task 020)

`next-js/src/modules/sgsi-scope/diagrams/` implementa a camada tecnica pura exigida pelo
PRD (secoes 12, 13, 37, 44): os diagramas sao **derivados de dados estruturados**, nunca
desenhados a mao livre ou armazenados como imagem estatica editavel, e o dominio nunca
depende diretamente de SVG.

- Contrato de dados comum em `types.ts`: `DiagramNode` (com `classification: 'in-scope' |
'out-scope' | 'interface'` e `group` livre), `DiagramConnection`, `DiagramData` (entrada)
  e `DiagramLayout` (saida, com nos/conexoes posicionados).
- Layout e uma funcao pura `DiagramData -> DiagramLayout`, testavel sem DOM
  (`layout/sequential-layout.ts` para linhas agrupadas — usado pela Cadeia de Valor;
  `layout/grouped-column-layout.ts` para colunas agrupadas — usado por Topologia e
  Arquitetura). Conexao para no inexistente e omitida e reportada em
  `invalidConnectionIds`, sem quebrar o restante do diagrama.
- Render e uma camada isolada e substituivel (`render/DiagramSvg.tsx`, escolha inicial SVG)
  que so conhece `DiagramLayout` — trocar a tecnologia de renderizacao no futuro nao exige
  mudar o modelo de dados nem os modulos de layout.
- Componentes publicos por diagrama: `ValueChainDiagram`, `TopologyDiagram`,
  `ArchitectureDiagram` (barrel em `diagrams/index.ts`).
- Cores de classificacao de escopo (grafite/navy = dentro do escopo, cinza claro = fora do
  escopo, contorno laranja = interface) escopadas em `render/DiagramSvg.module.css`,
  derivadas dos tokens Daryus (`--color-brand-navy`, `--color-brand-primary`).

As 5 entidades reais (`ValueChainBlock`, `TopologyNode`, `TopologyLink`,
`ArchitectureComponent`, `ArchitectureInterface` — ver `docs/database.md`) e os endpoints
que as persistem foram implementados na Task 020, no submodulo
`backend/src/modules/sgsi-scope/scope-engine/`. `classification` e sempre nullable e
nunca inferida automaticamente; exclusao de no/componente ainda referenciado por
link/interface e **bloqueada** (409), nunca cascateada (decisao humana registrada na
Task 020, seguindo a recomendacao do PRD). Pendente: as UIs das Etapas 5/6 (Tasks
021/022), que devem consumir `ValueChainDiagram`/`TopologyDiagram`/`ArchitectureDiagram`
(Task 019) alimentados pelos endpoints desta task — nao implementar layout/render
proprios nem re-derivar `DiagramData` na UI.

## Previa consolidada (Etapa 8, Task 025)

`next-js/src/app/projects/[id]/sgsi-scope/preview/page.tsx` implementa a Etapa 8 (PRD
secao 15) **sem** um endpoint de preview agregado no backend — nenhuma task do backlog
atual cria esse endpoint (`tasks/000-index.md` nao lista uma task para
`/sgsi-scope/preview`). A pagina busca em paralelo (`Promise.all`) os endpoints que ja
existem (`project`, `organization`, `sgsi-scope`, `fill-percentage`,
`scope-definition`, `value-chain`, `topology`, `architecture`, `limits`) e so compoe a
exibicao (`modules/sgsi-scope/etapa-previa/classified-items.ts` agrupa por
classificacao so para renderizar, sem recalcular nenhuma regra de dominio) — mesmo
padrao ja usado pela Task 022 (Topologia+Arquitetura numa pagina so). Se um endpoint de
preview agregado for criado no futuro, esta pagina deve passar a consumi-lo em vez de
fazer varios fetches.

## Documentos gerados (decisao #9 — implementado, Task 026)

`backend/src/modules/document-generation/` implementa `DocumentGenerationService`
como servico independente do CRUD do Escopometro (PRD secao 17/44) — controller so
orquestra HTTP, toda a logica (agregar dados, validar, renderizar, subir ao storage,
persistir) vive no service.

- **Templates isolados** (`templates/*.template.ts`): cada um recebe um
  `DocumentContext` (dados ja agregados, nunca repository/entity direto) e devolve um
  `Buffer` — evoluir o layout do documento nao toca no dominio. `docx` (DOCX) e
  `pptxgenjs` (PPTX), aprovados pelo Bruno (Task 025/026).
- **Storage**: `DocumentStorageAdapter` (interface `putObject`/`getObject`, minima
  compativel com S3) com `LocalFilesystemStorageAdapter` como implementacao de
  desenvolvimento (aprovada pelo Bruno — sem provedor real nem credenciais de
  producao neste ambiente), salvando em `backend/storage/generated-documents/` (fora
  do git). Trocar por S3/MinIO real e so uma nova implementacao da interface, injetada
  no `DocumentGenerationModule` via o token `DOCUMENT_STORAGE_ADAPTER`.
- **Validacao**: gerar qualquer um dos 3 documentos exige `ScopeDefinition
.formalDeclaration` preenchida (Etapa 4) — 400 caso contrario, nunca gera documento
  incompleto silenciosamente (PRD - Task 026, casos de erro).
- **Nunca marca "gerado" sem upload confirmado**: `GeneratedDocumentEntity` so e
  persistida depois do `storage.putObject` resolver; se o storage falhar, a operacao
  toda falha e nada e salvo.
- **Download autenticado**: `GET .../documents/:documentId/download` devolve o
  binario (o backend exige bearer token, entao o link nunca aponta direto para ele) —
  o next-js proxya via `/api/projects/:id/sgsi-scope/documents/:documentId/download`
  (Task 026 atualizou esse ponto da Task 025, que ainda nao existia).
- `next-js/src/services/sgsi-scope/documents.service.ts` (Task 025, ajustado pela
  Task 026): `GeneratedDocument` reflete o schema real do backend (sem
  `downloadUrl` — o BFF do next-js monta esse link a partir do `id`).

## Storage (planejado)

PRD secao 24 recomenda Object Storage compativel com S3 (logotipos, documentos gerados,
anexos). Ainda nao implementado: `Organization.logoUrl` hoje e um campo de texto livre
(URL), sem upload real (Task 005 registrou isso como fora de escopo, remetendo a Task
026).

## Auditoria

`AuditLogEntity` (`backend/src/modules/audit-log/entities/`) existe desde a Task 002.
Uso real ainda parcial: `ProjectsService.update` grava uma entrada `STATUS_CHANGE` quando
o status de um projeto muda (Task 006). As demais acoes sugeridas pelo PRD secao 21
(criacao, edicao, exclusao, geracao de documento, submissao para revisao, aprovacao) nao
geram `AuditLog` ainda — cobertura completa e o objetivo da Task 027.

## Versionamento (planejado, Slice 002+)

`SgsiScope`/`SgsiScopeVersion` (PRD secao 20) ainda nao existem. Uma versao aprovada
nunca deve ser sobrescrita silenciosamente; uma alteracao relevante apos aprovacao deve
originar nova versao ou revisao controlada. Modelagem detalhada fica para a task que
criar essas entidades (Slice 002).

## Pendencias

- Nao ha endpoint para um usuario comum listar membros de uma organizacao/projeto —
  bloqueia seletor real de responsavel/participantes na UI de Projeto (ver
  `tasks/009-telas-organizacao-projeto.md`).
- Rate limiting em `/auth/login` nao implementado (Task 003).
- `next-js/docs/ai/STYLING.md` desatualizado (descreve Tailwind; o projeto usa CSS puro +
  CSS Modules desde a Task 007).
- Politica de exclusao de Organizacao com projetos ativos (Task 005) e regra de transicao
  de status de Projeto (Task 006) sao defaults provisorios, nao confirmados com o
  usuario.
