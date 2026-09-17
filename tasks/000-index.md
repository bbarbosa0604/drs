# Backlog unico do projeto - DRS (Daryus Resilient Services)

## Resumo do projeto

DRS e uma plataforma modular para apoiar execucao, registro, gestao e geracao de artefatos dos servicos/metodologias da Daryus. O primeiro modulo e o **Escopometro SGSI**, que permite a um especialista estruturar e documentar a definicao de escopo de um SGSI (ISO 27001), sem decidir automaticamente o escopo. Fonte: `requirements/001-prd-escopometro-sgsi.md`.

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- backend separado: sim (`backend/`, NestJS + TypeORM + PostgreSQL + Passport JWT, ja scaffolded)
- cms: nenhum
- banco: PostgreSQL (ja scaffolded em `backend/src/config/database.config.ts`, TypeORM, migrations via `backend/scripts/migration-*.mjs`)

## Progressive disclosure

- contexto mínimo global: `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`
- regra: carregar contexto sob demanda apenas por gatilho declarado na task ou no slice
- referencia de processo sob demanda: `.agents/references/context-engineering.md`
- referencia de security constraints: `.agents/references/security-constraints.md`
- handoffs: `.agents/state/handoffs/`

## Slices verticais

- `tasks/slices/001-fundacao-plataforma.md` - Fundacao: auth, RBAC, multitenancy, Organizacao, Projeto, design tokens Daryus
- `tasks/slices/002-escopometro-empresa-contexto.md` - Escopometro: ativacao do modulo, Etapa 1 Empresa, Etapa 2 Contexto, autosave
- `tasks/slices/003-escopometro-requisitos-escopo.md` - Escopometro: Etapa 3 Requisitos & CGSI, Etapa 4 Escopo, indicador de preenchimento
- `tasks/slices/004-escopometro-scope-engine.md` - Escopometro: Etapa 5 Cadeia de Valor, Etapa 6 Topologia & Arquitetura, diagramas
- `tasks/slices/005-escopometro-limites-aprovacao.md` - Escopometro: Etapa 7 Limites & Recursos, aprovacao, revisoes
- `tasks/slices/006-escopometro-previa-documentos.md` - Escopometro: Etapa 8 Previa & Exportacao, geracao DOCX/PPTX, auditoria, versionamento

## Classificacao do design-system por stack

- front: artefato documental (brandbook oficial + tokens derivados)
- fonte primaria visual front: `design-system/front/brand/daryus-brandbook.pdf`, `design-system/front/brand/daryus-tokens.md`
- mobile: nao se aplica
- fonte primaria visual mobile: nao se aplica

Observacao: o PRD (secao 35) cita paleta e prototipo HTML v0.1.3 como referencia visual funcional, mas o arquivo do prototipo **nao esta presente neste repositorio** (nao foi anexado). Isso e uma lacuna registrada abaixo — a fidelidade visual ao fluxo/telas do protipo so pode ser garantida se o HTML for fornecido; ate la, a UI segue a paleta/tipografia oficiais da Daryus e a especificacao funcional textual do PRD.

## Review consolidada da spec

- permissoes definidas: sim — DSR Admin e Consultor/Especialista priorizados no MVP (Revisor e Cliente/Aprovador ficam para depois). Cada task back declara guardas de autorizacao.
- casos de erro mapeados: sim, por task (ver `Comportamento esperado` e `Casos de erro e borda` de cada task/slice); cobrem falha de autosave, IDOR, sobrescrita de versao aprovada, importacao invalida, geracao de documento com dados incompletos.
- decisoes humanas pendentes de confirmacao: ver secao `Duvidas para validacao humana` abaixo.
- casos de borda relevantes: overwrite de versao aprovada, percentual de preenchimento com campos opcionais, importacao JSON com `schemaVersion` incompatível, projeto sem organizacao vinculada (nao deve existir), diagrama com dados incompletos.
- Security Constraints materializadas nas tasks: sim, uma por task (perfis: `infra-risk`, `auth-sensitive`, `api-back`, `ui-front`, `docs-only`, `cross-stack`).

## Arquivos analisados

- `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`
- `requirements/001-prd-escopometro-sgsi.md`
- `design-system/front/README.md`, `design-system/front/brand/daryus-tokens.md`
- `contracts/openapi.yaml` (vazio, `paths: {}`)
- `backend/AGENTS.md`, `backend/package.json`, `backend/src/config/database.config.ts`, `backend/docs/ai/ARCHITECTURE.md`, `backend/docs/ai/SECURITY.md`
- `next-js/AGENTS.md`, `next-js/package.json`

## Premissas adotadas

- ORM/banco: manter **TypeORM + PostgreSQL** ja scaffolded em `backend/`, e nao migrar para Prisma como o PRD sugere de forma generica (secao 18/24) — o PRD foi escrito antes da decisao de separar o backend. Ver duvida registrada abaixo.
- Autenticacao: usar o modulo `modules/auth` (NestJS + Passport JWT) ja scaffolded em `backend/`, satisfazendo a exigencia do PRD de "solucao consolidada de autenticacao, nao implementar autenticacao manual propria".
- Front-end consome a API do backend via `contracts/openapi.yaml` (hoje vazio) — cada task shared/back que expuser endpoint deve atualizar o contrato antes da task front consumir.
- Paleta e tipografia oficiais Daryus (`design-system/front/brand/daryus-tokens.md`) substituem a paleta de referencia generica do PRD (secao 35).
- Prototipo HTML v0.1.3 citado no PRD nao esta disponivel neste repositorio; UI sera implementada a partir da especificacao textual do PRD + tokens Daryus, nao de fidelidade pixel-a-pixel a um prototipo.
- Editor de conteudo rico (historico, descricao detalhada) usara TipTap/ProseMirror armazenando JSON, conforme PRD secao 29.
- Geracao de documentos (DOCX/PPTX) e storage de arquivos ficam para a Fase 5 (slice 006); nao sao MVP bloqueante das etapas 1-7.

## Principais riscos e ambiguidades

- Conflito PRD x scaffold: PRD recomenda Prisma; projeto ja tem TypeORM. Registrado como duvida humana.
- Ausencia do prototipo HTML v0.1.3: risco de divergencia visual/de fluxo em relacao ao que o Bruno tem em mente. Registrado como duvida humana.
- `contracts/openapi.yaml` esta vazio: toda task de integracao cliente-servidor exige atualizar o contrato antes/durante a task (nao e trabalho a parte).
- Escopo do PRD e grande (44 secoes, ~30 entidades). Estrategia de execucao abaixo prioriza fundacao e as 2 primeiras etapas do Escopometro; as demais so devem ser refinadas com `gerar-tasks-adicionais`/revisao humana quando a Fase 1 estiver proxima da conclusao, para evitar planejamento obsoleto.

## Estrategia de execucao

Ordem recomendada: Slice 001 (fundacao) -> Slice 002 (Empresa/Contexto) -> Slice 003 (Requisitos/Escopo) -> Slice 004 (Scope Engine: diagramas) -> Slice 005 (Limites/Aprovacao) -> Slice 006 (Previa/Documentos/Auditoria/Versionamento). Cada slice so comeca apos o slice anterior estar `done` ou explicitamente destravado por dependencia parcial documentada na task.

## Tasks por tipo

### Shared

- Task 001 - Contrato OpenAPI inicial + modelagem de dados core (User, Organization, Project, ModuleInstance, AuditLog)
- Task 010 - CLAUDE.md + docs/architecture.md + docs/database.md (PRD secao 45)
- Task 019 - Camada de diagramas independente (ValueChainDiagram, TopologyDiagram, ArchitectureDiagram)

### Back

- Task 002 - Entidades Organization/OrganizationMember/Project/ProjectMember/ModuleInstance/AuditLog (base) — User ja existe, nao recriar
- Task 003 - Auditar/ajustar auth existente — CORRIGE vulnerabilidade encontrada: `POST /users` publico aceitava `role: admin` sem autenticacao (escalacao de privilegio) + sessao
- Task 004 - Autorizacao multitenancy + RBAC (DSR Admin, Consultor)
- Task 005 - CRUD Organizacao
- Task 006 - CRUD Projeto (status, participantes, ativacao de modulos)
- Task 011 - Ativacao ModuleInstance Escopometro + SgsiScope/SgsiScopeVersion/DocumentControl + autosave
- Task 012 - OrganizationContext/OrganizationValue/ContextAspect
- Task 015 - Stakeholder/Requirement (biblioteca legal)/GovernanceCommittee/GovernanceMember
- Task 016 - ScopeDefinition/ScopeCharacteristic/ScopeBenefit + calculo do percentual de preenchimento
- Task 020 - ValueChainBlock/TopologyNode/TopologyLink/ArchitectureComponent/ArchitectureInterface
- Task 023 - ScopeLocation/ScopeEmployeeGroup/ScopeAsset/ScopeProvider/ScopeApproval/ScopeRevision
- Task 026 - DocumentGenerationService (DOCX/PPTX) + storage S3-compatible
- Task 027 - AuditLog + versionamento SgsiScopeVersion (protecao contra sobrescrita)

### Front

- Task 007 - Design tokens Daryus no next-js + shell de layout
- Task 008 - Dashboard
- Task 009 - Telas de Organizacao e Projeto
- Task 013 - UI Etapa 1 Empresa
- Task 014 - UI Etapa 2 Contexto
- Task 017 - UI Etapa 3 Requisitos & CGSI
- Task 018 - UI Etapa 4 Escopo + indicador de preenchimento
- Task 021 - UI Etapa 5 Cadeia de Valor + diagrama
- Task 022 - UI Etapa 6 Topologia & Arquitetura + diagramas
- Task 024 - UI Etapa 7 Limites & Recursos
- Task 025 - UI Etapa 8 Previa & Exportacao

### Mobile

- Nao se aplica

## Status inicial das tasks

- Task 001: `done`
- Task 002: `done`
- Task 003: `done`
- Task 004: `done`
- Task 005: `done`
- Task 006: `done`
- Task 007: `done`
- Task 008: `done`
- Task 009: `done`
- Task 010: `done`
- Task 011: `done`
- Task 012: `done`
- Demais tasks (013-027): `planned`

## Dependencias cruzadas

- Task 002-010 dependem da Task 001 (contrato + modelagem core)
- Task 003, 004 dependem da Task 002
- Task 005, 006 dependem da Task 004
- Task 007, 008, 009 dependem da Task 006 (contrato de Organizacao/Projeto) e da Task 007 (tokens) entre si (008/009 dependem de 007)
- Slice 002 (011-014) depende do Slice 001 completo
- Slice 003 (015-018) depende do Slice 002
- Slice 004 (019-022) depende do Slice 003
- Slice 005 (023-024) depende do Slice 004
- Slice 006 (025-027) depende do Slice 005

## Handoffs

- `.agents/state/handoffs/TASK-001.md` - Task 001 concluida (`done`); proximo contexto recomendado para a Task 002.
- `.agents/state/handoffs/TASK-002.md` - Task 002 concluida (`done`); migration criada mas nao executada (sem Postgres no ambiente); proximo contexto recomendado para a Task 003.
- `.agents/state/handoffs/TASK-003.md` - Task 003 concluida (`done`); vulnerabilidade de escalacao de privilegio corrigida; proximo contexto recomendado para a Task 004.
- `.agents/state/handoffs/TASK-004.md` - Task 004 concluida (`done`); guards de multitenancy (`OrganizationAccessGuard`/`ProjectAccessGuard`) prontos para uso; proximo contexto recomendado para a Task 005.
- `.agents/state/handoffs/TASK-005.md` - Task 005 concluida (`done`); CRUD de Organizacao com guard aplicado; politica de exclusao com projetos ativos pendente de confirmacao humana; proximo contexto recomendado para a Task 006.
- `.agents/state/handoffs/TASK-006.md` - Task 006 concluida (`done`); CRUD de Projeto com status/participantes/AuditLog; regra de transicao de status livre pendente de confirmacao humana; proximo contexto recomendado para a Task 007 (front-end, fora do escopo backend).
- `.agents/state/handoffs/TASK-007.md` - Task 007 concluida (`done`); tokens Daryus + `AppShell` no next-js; contradicao entre a task e `next-js/docs/ai/STYLING.md` (Tailwind vs CSS puro) registrada como pendencia; proximo contexto recomendado para a Task 008.
- `.agents/state/handoffs/TASK-008.md` - Task 008 concluida (`done`); dashboard real com fluxo minimo de login/sessao (gap de backlog, nenhuma task cobria login) construido para viabilizar a task; proximo contexto recomendado para a Task 009.
- `.agents/state/handoffs/TASK-009.md` - Task 009 concluida (`done`); CRUD de Organizacao/Projeto navegavel via UI (react-hook-form + zod, aprovado pelo Bruno); gap de contrato encontrado (sem endpoint de listagem de usuarios para Consultor) registrado como pendencia — `responsibleUserId`/`participantUserIds` simplificados; proximo contexto recomendado para a Task 010.
- `.agents/state/handoffs/TASK-010.md` - Task 010 concluida (`done`); `CLAUDE.md`, `docs/architecture.md` e `docs/database.md` criados/formalizados, consolidando as decisoes e pendencias das Tasks 001-009; Slice 001 (Fundacao da plataforma) esta 100% `done`; proximo contexto recomendado para o inicio do Slice 002 (Task 011).
- `.agents/state/handoffs/TASK-011.md` - Task 011 concluida (`done`); primeira task do Slice 002; modulo `sgsi-scope` (ativacao idempotente + autosave de DocumentControl) criado; contrato `openapi.yaml` ganhou os paths que faltavam (aprovado pelo Bruno); migration criada mas ainda nao rodada contra Postgres real; proximo contexto recomendado para a Task 012.
- `.agents/state/handoffs/TASK-012.md` - Task 012 concluida (`done`); submodulo `context` (OrganizationContext + ContextAspect) com sanitizacao de HTML via `sanitize-html`; `OrganizationValue` deliberadamente nao criada (reusa campos de `Organization`, pendente de confirmacao); migration criada mas ainda nao rodada; proximo contexto recomendado para a Task 013.

## Duvidas para validacao humana

1. **ORM/banco**: confirmar manutencao de TypeORM + PostgreSQL (ja scaffolded) em vez de migrar para Prisma como o PRD sugere de forma generica. Premissa adotada: manter TypeORM.
2. **Prototipo HTML v0.1.3**: o PRD trata este arquivo como referencia funcional/visual obrigatoria, mas ele nao foi fornecido neste repositorio. Se existir, deve ser anexado em `design-system/front/` para orientar fielmente fluxo, campos e copy das 8 etapas. Ate la, a implementacao seguira apenas a especificacao textual do PRD.
3. **Papeis alem do MVP** (Revisor, Cliente/Aprovador): confirmar que ficam fora do escopo das tasks 001-027 (conforme PRD secao 3, "prioridade do MVP").
4. **Bibliotecas administraveis** (requisitos legais, categorias de ativos, templates — PRD secao 32): confirmar que comecam como dados semi-hardcoded revisaveis (nao um CMS completo) no MVP, evoluindo depois.
5. **Descoberta na Task 001 — ja ajustada nas Tasks 002/003**: `backend/src/modules/users` (CRUD) e `backend/src/modules/auth` (login/`me` via Passport JWT) ja existem, implementados e funcionais no scaffold do backend. Tasks 002 e 003 foram reescritas para reaproveitar esse codigo em vez de recria-lo. `UserRole` (`admin`/`member`) sera reaproveitado como base de DSR Admin — confirmar se serve assim.
6. ~~BLOQUEANTE, decisao de produto (Task 003)~~ — **RESOLVIDO**: criacao de usuario e exclusiva do DSR Admin autenticado (sem auto-cadastro publico). A Task 003 corrige a vulnerabilidade encontrada (`POST /users` publico aceitando `role` livre) restringindo `create`/`findAll`/`update`/`remove` a `JwtAuthGuard` + `role === admin`, e inclui um seed de bootstrap do primeiro DSR Admin.

## Observacoes finais

- Projeto criado a partir do scaffold versao 1.0.0.
- Nenhuma implementacao sem task da raiz deste projeto.
- PRD fonte: `requirements/001-prd-escopometro-sgsi.md`.
- Paleta/tipografia Daryus: `design-system/front/brand/daryus-tokens.md`.
- Task 001 concluida: `contracts/openapi.yaml` populado (auth, organizations, projects) e `docs/database.md` criado. Ver `tasks/001-contrato-modelo-core.md` e `.agents/state/handoffs/TASK-001.md` para detalhes.
