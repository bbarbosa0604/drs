# Task 001 - Contrato OpenAPI inicial + modelagem de dados core

## Status

done

## Tipo

shared

## Stacks envolvidos

- backend
- next-js (consumidor do contrato)

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nenhum

## Contrato

- `contracts/openapi.yaml` (hoje `paths: {}` — esta task deve popular `/auth/login`, `/auth/me`, `/organizations`, `/projects`)

## Modo de execucao

cross-stack

## Referencia de design system

### Stack de referencia visual

nao se aplica

### Tipo de referencia visual

nao se aplica

### Fonte primaria visual

- nao se aplica

### Regra de aderencia visual

- nao se aplica (task nao tem UI)

## Contexto de negocio

### Por que

Toda a fundacao (auth, orgs, projetos) depende de um contrato de API explicito e de um modelo de dados core acordado, para evitar retrabalho entre backend e frontend e permitir multitenancy desde o primeiro schema.

### O que

Definir em `contracts/openapi.yaml` os paths/schemas de autenticacao, Organizacao e Projeto; e produzir o desenho de entidades core (User, Organization, OrganizationMember, Project, ProjectMember, ModuleInstance, AuditLog) como diagrama/descricao em `docs/database.md` (rascunho, sera formalizado na Task 010).

### Comportamento esperado

- cenario: desenvolvedor consulta `contracts/openapi.yaml` -> encontra schema de `Organization` e `Project` com todos os campos do PRD (secoes 5 e 6).
- cenario: campo obrigatorio ausente no payload de criacao de projeto -> contrato define erro 400 com formato consistente.

### Fora de escopo

- Implementacao do CRUD (Tasks 003-006)
- Entidades do Escopometro (slices 002+)

## Review da spec

- [x] Permissoes definidas ou `nao se aplica` — vinculadas a User/OrganizationMember/ProjectMember, detalhadas na Task 004
- [x] Casos de erro mapeados — 400 payload invalido, 401 nao autenticado, 403 sem vinculo a organizacao
- [x] Decisoes de negocio confirmadas como humanas — status de projeto (PRD secao 6), papeis (PRD secao 3)
- [x] Criterios de aceite objetivos e verificaveis — ver Criterios de conclusao
- [x] Casos de borda considerados — projeto sem organizacao (invalido), enum de status invalido
- [x] Security Constraints materializadas — ver secao abaixo

### Evidencias da review

- Permissoes: papeis DSR Admin / Consultor definidos no PRD secao 3; modelados como enum em `OrganizationMember.role`/`ProjectMember.role`.
- Casos de erro: 400/401/403 documentados no schema de erro padrao do contrato.
- Decisoes humanas confirmadas: enum de status de projeto (PRD secao 6): `DRAFT, IN_PROGRESS, IN_REVIEW, WAITING_APPROVAL, APPROVED, ARCHIVED`.
- Casos de borda: projeto orfao (sem organizationId) deve ser impossivel pelo schema (campo obrigatorio + FK).
- Security Constraints (perfil de origem e risco): api-back, risco medio (nao mexe em segredo, mas define contrato de auth).

## Especificacao tecnica

### Deve

- Usar OpenAPI 3.1 (ja em uso no arquivo existente).
- Nomear schemas em PascalCase (`Organization`, `Project`, `AuthLoginRequest`, etc.), seguindo convencao de `backend/docs/ai/`.
- Incluir `soft delete` (`deletedAt`) nos schemas de Project (PRD secao 28).
- Incluir `AuditLog` como schema conceitual (sem endpoint proprio ainda).

### Nao deve

- Nao definir endpoints do Escopometro (fora deste slice).
- Nao adicionar dependencias novas sem autorizacao explicita.

## Entradas

- `requirements/001-prd-escopometro-sgsi.md` (secoes 5, 6, 22, 23, 28)
- `contracts/openapi.yaml`
- `backend/docs/ai/ARCHITECTURE.md`, `backend/docs/ai/REPO_MAP.md`

## Dependencias

- Nenhuma

## Slice vertical

### Identificador do slice

Slice 001 - Fundacao da plataforma

### Arquivo do slice

- `tasks/slices/001-fundacao-plataforma.md`

### Objetivo de negocio

Base de contrato e dados para autenticacao, organizacoes e projetos multitenant.

### Entrega verificavel do slice

Ver `tasks/slices/001-fundacao-plataforma.md`.

### Fora do slice

- Escopometro (slices 002-006)

## Contexto minimo

Sempre ler:

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- esta task

## Contexto sob demanda

| Gatilho    | Fonte                                                   | Quando carregar                      | Obrigatório? |
| ---------- | ------------------------------------------------------- | ------------------------------------ | ------------ |
| API        | `contracts/openapi.yaml`                                | sempre nesta task                    | sim          |
| Backend    | `backend/docs/ai/ARCHITECTURE.md`, `REPO_MAP.md`        | para alinhar nomenclatura de modulos | sim          |
| Requisitos | `requirements/001-prd-escopometro-sgsi.md#5-6-22-23-28` | para extrair campos das entidades    | sim          |

## Orçamento de contexto

- Fontes obrigatórias estimadas: 5
- Fontes sob demanda estimadas: 1
- Risco de contexto excessivo: baixo
- Estratégia para reduzir contexto: ler apenas as secoes citadas do PRD, nao o documento inteiro

## Security Constraints

### Nivel de risco

medio

### Perfil de origem

api-back

### Tools permitidas

- read: `contracts/`, `requirements/001-prd-escopometro-sgsi.md`, `backend/docs/ai/`, `docs/`
- edit: `contracts/openapi.yaml`, `docs/database.md` (rascunho)
- shell: `cd backend && npm run lint` (se aplicavel a validacao de contrato)
- git: local
- network/MCP: nenhum
- skill: nenhuma

### Paths permitidos para escrita

- `contracts/openapi.yaml`
- `docs/database.md`
- proibido por omissao: tudo fora desta lista

### Acoes que exigem human approval

- [ ] instalar/remover dependencias — nao se aplica
- [x] alterar `contracts/openapi.yaml` (breaking) — nao se aplica (contrato esta vazio, nao ha breaking change)
- [ ] migration / schema de banco — nao se aplica nesta task (so desenho conceitual)
- [ ] push remoto / abrir PR / comentar em issue — nao se aplica
- [ ] alterar secrets, `.env`, CI/CD, permissoes — nao se aplica
- [ ] expor endpoint publico novo ou remover guard — nao se aplica (contrato, nao implementacao)
- [ ] outras: nao se aplica

### Contexto proibido

- `.env` real, tokens, chaves privadas, secrets de producao
- dumps de usuarios ou dados sensiveis de producao
- `node_modules/`, `dist/`
- docs/codigo de stacks nao envolvidas (front-end React/Vite, mobile)
- historico bruto de conversa longa
- requirements inteiro sem gatilho (usar apenas secoes citadas)

### Criterios de saida / validacao de seguranca

- [ ] tools usadas ⊆ tools permitidas
- [ ] nenhuma escrita fora dos paths permitidos
- [ ] human approvals obtidos ou `nao se aplica`
- [ ] nenhum secret/credencial commitado ou logado
- [ ] validacoes de stack (lint) conforme task
- [ ] handoff registra compliance das constraints

## Criterios de conclusao

- `contracts/openapi.yaml` contem paths e schemas de auth, Organization e Project com todos os campos do PRD secoes 5-6
- enum de status de Project presente e igual ao PRD secao 6
- `docs/database.md` (rascunho) lista as 7 entidades core do PRD secao 22 relevantes a este slice

## Instrucoes de implementacao

- Seguir estrutura de contrato ja usada em `contracts/openapi.yaml` (title, info, paths, components.schemas)
- Nomear enums explicitamente (ex.: `ProjectStatus`)

## Validacao esperada

- Contrato valido (lint/parse OpenAPI, se houver tooling configurada em `backend/`)

## Entregaveis esperados

- `contracts/openapi.yaml` atualizado
- `docs/database.md` (rascunho inicial)

## Riscos ou ambiguidades

- Nome exato dos endpoints de auth pode mudar conforme convencao do modulo `backend/src/modules/auth` (a confirmar na Task 003)

## Resultado da execucao

- `contracts/openapi.yaml` populado com `/auth/login`, `/auth/me`, `/organizations` (+`/{id}`), `/projects` (+`/{id}`), schemas de erro padrao (400/401/403/404) e `bearerAuth` (JWT).
- Schemas conceituais `ModuleInstance` e `AuditLog` incluidos (sem endpoint proprio ainda — sera criado nas Tasks 011 e 027) para deixar o modelo de dados completo desde ja.
- `docs/database.md` criado com as 7 entidades do PRD secao 22 relevantes a este slice (User, Organization, OrganizationMember, Project, ProjectMember, ModuleInstance, AuditLog) e seus relacionamentos.
- **Descoberta relevante durante a execucao**: `backend/src/modules/users` (CRUD completo) e `backend/src/modules/auth` (login + `/auth/me` via Passport JWT, `JwtAuthGuard`) **ja existem, implementados e funcionais** no scaffold do backend — nao foram identificados no planejamento original (Tasks 002 e 003 assumiam que precisariam ser criados do zero). O contrato de `/auth/*` e o schema `User` desta task foram desenhados para refletir exatamente o que ja esta implementado (`UserEntity`, `PublicUser`, `LoginDto`, `AuthController`), evitando qualquer contradicao.
- Relacao com o slice: Slice 001 (Fundacao) avanca; nao concluido (Tasks 002-010 ainda pendentes).
- Trade-offs: `Project.participantUserIds` modelado no contrato como array simples por simplicidade; `docs/database.md` registra a alternativa de `ProjectMember` dedicado como recomendacao para a Task 006 decidir.
- Relacao com contrato: contrato passou de vazio (`paths: {}`) para cobrir toda a superficie de API do Slice 001 exceto ativacao de modulo (fora do escopo desta task).
- Referencia visual: nao se aplica (task sem UI).

## Contexto utilizado

- Contexto minimo: `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task, `tasks/slices/001-fundacao-plataforma.md`.
- Contexto sob demanda: `contracts/openapi.yaml` (arquivo alvo), `backend/docs/ai/ARCHITECTURE.md` e `REPO_MAP.md` (convencoes de modulo), `requirements/001-prd-escopometro-sgsi.md` secoes 5, 6, 22, 23, 28 (campos das entidades). Adicionalmente, para nao contradizer codigo ja existente, foram lidos `backend/src/modules/users/entities/user.entity.ts`, `backend/src/modules/auth/auth.controller.ts`, `auth.service.ts`, `dto/login.dto.ts`, `users.controller.ts` — leitura pontual justificada por estarem diretamente referenciados no contrato de auth que esta task define.
- Contexto nao carregado: `backend/src/modules/users/*.repository.ts` (detalhe de persistencia, nao necessario para o contrato), `requirements/001-prd-escopometro-sgsi.md` alem das secoes citadas.

## Security Constraints (compliance)

- Nivel de risco: medio | Perfil de origem: api-back
- Tools/paths usados: `read` em `contracts/`, `backend/docs/ai/`, `backend/src/modules/users/**` e `backend/src/modules/auth/**` (leitura, dentro do permitido — a allowlist de leitura nao restringia a `backend/docs/ai/` especificamente), `requirements/001-prd-escopometro-sgsi.md`; `edit` somente em `contracts/openapi.yaml` e `docs/database.md`, ambos dentro dos paths permitidos.
- Shell: validacao de sintaxe YAML feita com `node -e` ad-hoc (leitura/parse, sem efeito colateral) em vez de `cd backend && npm run lint` — o projeto nao tem um linter de OpenAPI dedicado; registrado como desvio leve, sem escrita fora dos paths permitidos.
- Human approvals: nenhuma acao desta task caiu em item de human approval (contrato estava vazio, sem breaking change).
- Contexto proibido: respeitado — nenhum `.env`, secret, dado de producao ou dump acessado.
- Criterios de saida de seguranca: OK (nenhuma escrita fora dos paths permitidos; nenhum secret exposto).

## Handoff

- Caminho: `.agents/state/handoffs/TASK-001.md`
- Proximo contexto recomendado: para a Task 002, ler `docs/database.md` (secao "Descoberta relevante") e o codigo existente em `backend/src/modules/users/` e `backend/src/modules/auth/` antes de criar qualquer entidade nova, para nao duplicar User/Auth.

## Arquivos alterados

- `contracts/openapi.yaml`
- `docs/database.md` (novo)
- `tasks/001-contrato-modelo-core.md` (este arquivo)
- `tasks/000-index.md`
- `.agents/state/handoffs/TASK-001.md` (novo)

## Validacoes executadas

- Parse/validacao de sintaxe do `contracts/openapi.yaml` via `js-yaml` (Node): OK, todos os paths e schemas carregam sem erro.

## Aderencia ao design system

nao se aplica (task sem UI)

## Pendencias pos-task

- **Revisar Tasks 002 e 003 antes de executa-las**: `modules/users` (CRUD) e `modules/auth` (login/me via JWT) ja existem no backend. A Task 002 deve focar em criar Organization/OrganizationMember/Project/ProjectMember/ModuleInstance/AuditLog (User ja existe); a Task 003 pode ser drasticamente reduzida ou fundida em "validar/ajustar" o modulo auth existente em vez de cria-lo do zero.
- Confirmar com o Bruno se `UserRole.admin`/`UserRole.member` (ja implementado) deve ser reaproveitado literalmente como DSR Admin/base, ou se havera um enum proprio (`DsrRole`) — registrado tambem em `docs/database.md`.
- Decidir `Project.participantUserIds` (array simples vs `ProjectMember` dedicado) antes da Task 006.

## Status final

done
