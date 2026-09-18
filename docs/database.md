# Database — DRS

> Formaliza o rascunho da Task 001 (Task 010). ORM: **TypeORM** (nao Prisma — desvio da
> recomendacao generica do PRD, ver `CLAUDE.md`). Banco: PostgreSQL. Migrations em
> `backend/src/database/migrations/`. Atualizar a cada slice que adicionar entidade nova,
> nunca reescrever do zero.

## Convencoes

- PK: `uuid` (`gen_random_uuid()`/`uuid-ossp`), sempre `id`.
- Timestamps: `created_at`/`updated_at` (`timestamptz`), `camelCase` no TypeScript via
  `@Column({ name: 'created_at' })`.
- Soft delete: `deleted_at` (`timestamptz`, nullable) via `@DeleteDateColumn` — decisao
  #12 (PRD secao 28). `repository.softDelete()`/`find()` do TypeORM ja excluem
  registros com `deletedAt` preenchido por padrao.
- Enums de dominio ficam em `backend/src/common/enums/` (nao `enum` nativo do Postgres
  quando o valor e curto o bastante para `varchar` — ver `MembershipRole`,
  `ProjectStatus`, `ModuleKey`, `AuditAction`); `UserRole` e exceção histórica (já
  existia como `enum` Postgres antes deste projeto).

## Entidades implementadas (Slice 001 — Fundacao)

### User

`backend/src/modules/users/entities/user.entity.ts` — ja existia no scaffold antes deste
projeto (Tasks 002/003 reaproveitaram).

| Coluna        | Tipo            | Notas                      |
| ------------- | --------------- | -------------------------- |
| id            | uuid PK         |                            |
| name          | varchar(80)     |                            |
| email         | varchar(160)    | unique (`idx_users_email`) |
| phone         | varchar(32)     | nullable                   |
| password_hash | varchar(255)    | `select: false`            |
| role          | enum `UserRole` | `admin` \| `member`        |
| created_at    | timestamptz     |                            |
| updated_at    | timestamptz     |                            |

`admin` = DSR Admin (acesso global, PRD secao 3). `member` e a base sobre a qual o
vinculo por organizacao/projeto define o papel de Consultor.

### Organization

`backend/src/modules/organizations/entities/organization.entity.ts` (Task 002). Campos
do PRD secao 5.

| Coluna                               | Tipo         | Notas                                        |
| ------------------------------------ | ------------ | -------------------------------------------- |
| id                                   | uuid PK      |                                              |
| name                                 | varchar(160) | obrigatorio (razao social)                   |
| segment                              | varchar(120) | nullable                                     |
| employee_count                       | varchar(60)  | nullable (faixa livre)                       |
| geographic_scope                     | varchar(160) | nullable                                     |
| products_services                    | text         | nullable                                     |
| logo_url                             | varchar(500) | nullable — sem storage real ainda (Task 026) |
| institutional_history                | text         | nullable                                     |
| business                             | text         | nullable                                     |
| mission                              | text         | nullable                                     |
| vision                               | text         | nullable                                     |
| values                               | text[]       | default `{}`                                 |
| created_at / updated_at / deleted_at | timestamptz  | soft delete                                  |

### OrganizationMember

`backend/src/modules/organizations/entities/organization-member.entity.ts` (Task 002).

| Coluna          | Tipo                           | Notas                                      |
| --------------- | ------------------------------ | ------------------------------------------ |
| id              | uuid PK                        |                                            |
| organization_id | uuid FK                        | -> `organizations.id`, `ON DELETE CASCADE` |
| user_id         | uuid FK                        | -> `users.id`, `ON DELETE CASCADE`         |
| role            | varchar(24) (`MembershipRole`) | default `consultant`                       |
| created_at      | timestamptz                    |                                            |

Unique index `(organization_id, user_id)`. DSR Admin nao precisa de linha aqui (acesso
global via `UserRole.ADMIN`, ver `OrganizationsAccessService`).

### Project

`backend/src/modules/projects/entities/project.entity.ts` (Task 002/006). Campos do PRD
secao 6.

| Coluna                               | Tipo                          | Notas                                            |
| ------------------------------------ | ----------------------------- | ------------------------------------------------ |
| id                                   | uuid PK                       |                                                  |
| name                                 | varchar(160)                  | obrigatorio                                      |
| organization_id                      | uuid FK                       | -> `organizations.id`, `ON DELETE RESTRICT`      |
| description                          | text                          | nullable                                         |
| responsible_user_id                  | uuid FK                       | -> `users.id`, `ON DELETE RESTRICT`, obrigatorio |
| start_date                           | date                          | nullable                                         |
| expected_end_date                    | date                          | nullable                                         |
| status                               | varchar(24) (`ProjectStatus`) | default `DRAFT`                                  |
| created_at / updated_at / deleted_at | timestamptz                   | soft delete                                      |

`ProjectStatus`: `DRAFT`, `IN_PROGRESS`, `IN_REVIEW`, `WAITING_APPROVAL`, `APPROVED`,
`ARCHIVED` (identico ao contrato `contracts/openapi.yaml#ProjectStatus`). Regras de
transicao entre esses valores nao sao restritas no backend hoje — pendencia registrada
na Task 006.

Participantes (`participantUserIds` no contrato) nao sao uma coluna: sao derivados de
`ProjectMember`, excluindo `responsible_user_id` (ver `ProjectsService.toResponse`).

### ProjectMember

`backend/src/modules/projects/entities/project-member.entity.ts` (Task 002). Mesma forma
de `OrganizationMember`, trocando `organization_id` por `project_id` (`ON DELETE
CASCADE` em ambas FKs). Unique index `(project_id, user_id)`.

### ModuleInstance

`backend/src/modules/module-instances/entities/module-instance.entity.ts` (Task 002,
entidade criada; ativacao real e a Task 011).

| Coluna       | Tipo                      | Notas                                 |
| ------------ | ------------------------- | ------------------------------------- |
| id           | uuid PK                   |                                       |
| project_id   | uuid FK                   | -> `projects.id`, `ON DELETE CASCADE` |
| module_key   | varchar(40) (`ModuleKey`) | hoje so `SGSI_SCOPE`                  |
| activated_at | timestamptz               |                                       |
| deleted_at   | timestamptz               | nullable (soft delete)                |

Unique index `(project_id, module_key)` — ativacao idempotente (nao pode ativar o mesmo
modulo duas vezes no mesmo projeto).

### AuditLog

`backend/src/modules/audit-log/entities/audit-log.entity.ts` (Task 002, entidade criada;
cobertura completa e a Task 027). Uso real hoje: `ProjectsService.update` grava
`STATUS_CHANGE` quando o status de um projeto muda (Task 006).

| Coluna          | Tipo                        | Notas                                                                                                   |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------------------------- |
| id              | uuid PK                     |                                                                                                         |
| organization_id | uuid FK                     | -> `organizations.id`, `ON DELETE CASCADE`                                                              |
| project_id      | uuid FK                     | -> `projects.id`, `ON DELETE CASCADE`, nullable                                                         |
| user_id         | uuid FK                     | -> `users.id`, `ON DELETE RESTRICT`                                                                     |
| entity          | varchar(80)                 | nome da entidade afetada (ex.: `"Project"`)                                                             |
| entity_id       | uuid                        |                                                                                                         |
| action          | varchar(40) (`AuditAction`) | `CREATE`, `UPDATE`, `DELETE`, `STATUS_CHANGE`, `DOCUMENT_GENERATED`, `SUBMITTED_FOR_REVIEW`, `APPROVED` |
| timestamp       | timestamptz                 |                                                                                                         |
| metadata        | jsonb                       | nullable                                                                                                |

Indices: `(organization_id)`, `(entity, entity_id)`.

## Entidades implementadas (Slice 002 — Escopometro: Empresa & Contexto)

### SgsiScope

`backend/src/modules/sgsi-scope/entities/sgsi-scope.entity.ts` (Task 011). Raiz do modulo
Escopometro dentro de um Projeto.

| Coluna                               | Tipo        | Notas                                                       |
| ------------------------------------ | ----------- | ----------------------------------------------------------- |
| id                                   | uuid PK     |                                                             |
| project_id                           | uuid FK     | -> `projects.id`, `ON DELETE CASCADE`, unique (1:1)         |
| module_instance_id                   | uuid FK     | -> `module_instances.id`, `ON DELETE CASCADE`, unique (1:1) |
| created_at / updated_at / deleted_at | timestamptz | soft delete                                                 |

### SgsiScopeVersion

`backend/src/modules/sgsi-scope/entities/sgsi-scope-version.entity.ts` (Task 011). So a
raiz do versionamento (PRD secao 20) — protecao contra sobrescrita de versao aprovada e a
Task 027.

| Coluna         | Tipo                                   | Notas                                    |
| -------------- | -------------------------------------- | ---------------------------------------- |
| id             | uuid PK                                |                                          |
| sgsi_scope_id  | uuid FK                                | -> `sgsi_scopes.id`, `ON DELETE CASCADE` |
| version_number | int                                    | comeca em 1 na ativacao                  |
| status         | varchar(20) (`SgsiScopeVersionStatus`) | default `DRAFT`; `DRAFT` \| `APPROVED`   |
| created_at     | timestamptz                            |                                          |

### DocumentControl

`backend/src/modules/sgsi-scope/entities/document-control.entity.ts` (Task 011). Etapa
1.2 (PRD secao 8.2). Criado vazio na ativacao do modulo; preenchido via autosave.

| Coluna                  | Tipo        | Notas                                                          |
| ----------------------- | ----------- | -------------------------------------------------------------- |
| id                      | uuid PK     |                                                                |
| sgsi_scope_id           | uuid FK     | -> `sgsi_scopes.id`, `ON DELETE CASCADE`, unique (1:1)         |
| classification          | varchar(80) | nullable                                                       |
| version                 | varchar(40) | nullable (versao do documento, distinta de `SgsiScopeVersion`) |
| document_date           | date        | nullable                                                       |
| valid_until             | date        | nullable                                                       |
| prepared_by_user_id     | uuid FK     | -> `users.id`, `ON DELETE SET NULL`, nullable                  |
| approved_by_user_id     | uuid FK     | -> `users.id`, `ON DELETE SET NULL`, nullable                  |
| created_at / updated_at | timestamptz |                                                                |

### OrganizationContext

`backend/src/modules/sgsi-scope/context/entities/organization-context.entity.ts` (Task
012). Etapa 2.1 (PRD secao 9.1). Criado sob demanda no primeiro autosave, nao na ativacao
do modulo.

| Coluna                  | Tipo        | Notas                                                                   |
| ----------------------- | ----------- | ----------------------------------------------------------------------- |
| id                      | uuid PK     |                                                                         |
| sgsi_scope_id           | uuid FK     | -> `sgsi_scopes.id`, `ON DELETE CASCADE`, unique (1:1)                  |
| history                 | jsonb       | nullable; envelope `{ html: string }` com HTML ja sanitizado no backend |
| created_at / updated_at | timestamptz |                                                                         |

**Nota**: "Direcionadores" (negocio/missao/visao/valores, PRD secao 9.2) **nao** viraram
uma tabela `OrganizationValue` — sao os mesmos campos que `Organization` ja tem
(`business`/`mission`/`vision`/`values`), reaproveitados diretamente via
`GET`/`PATCH /organizations/:id` (Task 005). Ver `tasks/012-contexto-organizacional.md`
para a decisao completa.

### ContextAspect

`backend/src/modules/sgsi-scope/context/entities/context-aspect.entity.ts` (Task 012).
Etapas 2.3/2.4 (PRD secao 9.3/9.4) — questoes externas e internas. Sem soft delete
(registro filho de lista, decisao deliberada de manter simples).

| Coluna                  | Tipo                              | Notas                                    |
| ----------------------- | --------------------------------- | ---------------------------------------- |
| id                      | uuid PK                           |                                          |
| sgsi_scope_id           | uuid FK                           | -> `sgsi_scopes.id`, `ON DELETE CASCADE` |
| type                    | varchar(20) (`ContextAspectType`) | `EXTERNAL` \| `INTERNAL`                 |
| title                   | varchar(160)                      | obrigatorio                              |
| description             | text                              | nullable                                 |
| observations            | text                              | nullable                                 |
| created_at / updated_at | timestamptz                       |                                          |

Indice: `(sgsi_scope_id)`.

## Relacionamentos (resumo)

```text
User 1---N OrganizationMember N---1 Organization
User 1---N ProjectMember       N---1 Project
Organization 1---N Project
Project 1---N ModuleInstance
Organization 1---N AuditLog
Project 0..1---N AuditLog

Project 1---1 SgsiScope 1---1 ModuleInstance
SgsiScope 1---N SgsiScopeVersion
SgsiScope 1---1 DocumentControl
SgsiScope 1---1 OrganizationContext
SgsiScope 1---N ContextAspect
SgsiScope 1---N Stakeholder
SgsiScope 1---N ProjectRequirement N---0..1 Requirement (biblioteca global)
SgsiScope 1---1 GovernanceCommittee 1---N GovernanceMember
SgsiScope 1---1 ScopeDefinition
SgsiScope 1---N ScopeCharacteristic
SgsiScope 1---N ScopeBenefit
```

## Versionamento (planejado, Slice 002+)

`SgsiScope`/`SgsiScopeVersion` existem desde a Task 011 (raiz do versionamento, PRD secao
20), mas so a primeira versao rascunho e criada na ativacao. Protecao contra sobrescrita
de versao aprovada — gerar nova versao ou revisao controlada (`ScopeRevision`, PRD secao 22) ao editar apos aprovacao — ainda **nao** implementada; e a Task 027.

## Entidades implementadas (Slice 003 — Requisitos, CGSI & Declaracao de Escopo)

### Stakeholder

`backend/src/modules/sgsi-scope/requirements/entities/stakeholder.entity.ts` (Task 015).
Etapa 3.1 (PRD secao 10.1).

| Coluna                  | Tipo         | Notas                                    |
| ----------------------- | ------------ | ---------------------------------------- |
| id                      | uuid PK      |                                          |
| sgsi_scope_id           | uuid FK      | -> `sgsi_scopes.id`, `ON DELETE CASCADE` |
| name                    | varchar(160) | "parte interessada", obrigatorio         |
| requirements            | text         | nullable                                 |
| needs                   | text         | nullable                                 |
| expectations            | text         | nullable                                 |
| observations            | text         | nullable                                 |
| created_at / updated_at | timestamptz  |                                          |

### Requirement

`backend/src/modules/sgsi-scope/requirements/entities/requirement.entity.ts` (Task 015).
**Biblioteca global** (decisao confirmada com o usuario: nao e por-projeto), mantida pelo
DSR Admin (`RolesGuard`, mesmo padrao de `UsersController`). Seedada na migration com as
10 referencias legais brasileiras do PRD secao 10.2 (Constituicao Federal, LGPD, Marco
Civil, Lei Carolina Dieckmann, Lei do Software, Lei de Direitos Autorais, Codigo Civil,
CDC, Decreto do Comercio Eletronico, orientacoes ANPD).

| Coluna                  | Tipo                                | Notas                                                          |
| ----------------------- | ----------------------------------- | -------------------------------------------------------------- |
| id                      | uuid PK                             |                                                                |
| title                   | varchar(200)                        |                                                                |
| category                | varchar(20) (`RequirementCategory`) | default `LEGAL`; `LEGAL`\|`REGULATORY`\|`CONTRACTUAL`\|`OTHER` |
| description             | text                                | nullable                                                       |
| created_at / updated_at | timestamptz                         |                                                                |

### ProjectRequirement

`backend/src/modules/sgsi-scope/requirements/entities/project-requirement.entity.ts`
(Task 015). Requisito aplicado a um projeto — da biblioteca (`requirement_id` preenchido)
ou customizado (`requirement_id` nulo). Campos denormalizados de proposito (ver
comentario no codigo). Duplicar o mesmo requisito no mesmo projeto e **permitido**
(decisao explicita do PRD/Task 015) — sem unique index em `(sgsi_scope_id, requirement_id)`.

| Coluna                  | Tipo                                | Notas                                                |
| ----------------------- | ----------------------------------- | ---------------------------------------------------- |
| id                      | uuid PK                             |                                                      |
| sgsi_scope_id           | uuid FK                             | -> `sgsi_scopes.id`, `ON DELETE CASCADE`             |
| requirement_id          | uuid FK                             | -> `requirements.id`, `ON DELETE SET NULL`, nullable |
| title                   | varchar(200)                        | copiado da biblioteca ou digitado livremente         |
| category                | varchar(20) (`RequirementCategory`) | default `LEGAL`                                      |
| description             | text                                | nullable                                             |
| observations            | text                                | nullable (nota especifica do projeto)                |
| created_at / updated_at | timestamptz                         |                                                      |

### GovernanceCommittee

`backend/src/modules/sgsi-scope/requirements/entities/governance-committee.entity.ts`
(Task 015). Etapa 3.3 (PRD secao 10.3) — criado sob demanda (lazy) no primeiro autosave
ou no primeiro membro adicionado, nao na ativacao do modulo.

| Coluna                  | Tipo         | Notas                                                  |
| ----------------------- | ------------ | ------------------------------------------------------ |
| id                      | uuid PK      |                                                        |
| sgsi_scope_id           | uuid FK      | -> `sgsi_scopes.id`, `ON DELETE CASCADE`, unique (1:1) |
| name                    | varchar(160) | nullable                                               |
| objective               | text         | nullable                                               |
| responsibilities        | text         | nullable                                               |
| observations            | text         | nullable                                               |
| created_at / updated_at | timestamptz  |                                                        |

### GovernanceMember

`backend/src/modules/sgsi-scope/requirements/entities/governance-member.entity.ts` (Task
015). `job_role` ("funcao") e obrigatorio — caso de borda do PRD/Task 015 ("membro sem
funcao definida -> 400"), validado via DTO.

| Coluna                  | Tipo         | Notas                                              |
| ----------------------- | ------------ | -------------------------------------------------- |
| id                      | uuid PK      |                                                    |
| governance_committee_id | uuid FK      | -> `governance_committees.id`, `ON DELETE CASCADE` |
| name                    | varchar(160) | obrigatorio                                        |
| job_role                | varchar(120) | "funcao", obrigatorio                              |
| area                    | varchar(120) | nullable                                           |
| committee_role          | varchar(120) | "papel no comite" (ex.: Presidente), nullable      |
| created_at / updated_at | timestamptz  |                                                    |

## Entidades implementadas (Slice 003, continuacao — Etapa 4)

### ScopeDefinition

`backend/src/modules/sgsi-scope/scope-definition/entities/scope-definition.entity.ts`
(Task 016). Etapa 4.1-4.3 (PRD secao 11) — criado sob demanda no primeiro autosave.
`detailed_description` segue o mesmo formato `{ html }` sanitizado de
`OrganizationContext.history` (Task 012).

| Coluna                  | Tipo        | Notas                                                  |
| ----------------------- | ----------- | ------------------------------------------------------ |
| id                      | uuid PK     |                                                        |
| sgsi_scope_id           | uuid FK     | -> `sgsi_scopes.id`, `ON DELETE CASCADE`, unique (1:1) |
| formal_declaration      | text        | nullable — "declaracao formal do escopo"               |
| executive_justification | text        | nullable — "fundamentacao executiva"                   |
| detailed_description    | jsonb       | nullable — `{ html }` sanitizado                       |
| created_at / updated_at | timestamptz |                                                        |

### ScopeCharacteristic / ScopeBenefit

`backend/src/modules/sgsi-scope/scope-definition/entities/scope-{characteristic,benefit}.entity.ts`
(Task 016). Etapas 4.4/4.5 — listas dinamicas, mesma forma simples (so `description`).

| Coluna        | Tipo        | Notas                                    |
| ------------- | ----------- | ---------------------------------------- |
| id            | uuid PK     |                                          |
| sgsi_scope_id | uuid FK     | -> `sgsi_scopes.id`, `ON DELETE CASCADE` |
| description   | text        | obrigatorio                              |
| created_at    | timestamptz |                                          |

### Percentual de preenchimento (sem entidade propria)

`GET /projects/:id/sgsi-scope/fill-percentage` (Task 016) e uma agregacao calculada em
tempo real por `FillPercentageService`, sem tabela propria. `calculateFillPercentage`
(`fill-percentage.util.ts`) e uma funcao pura testada isoladamente (0%, parcial, 100%) —
ver PRD secao 16: o resultado **nunca** representa conformidade/maturidade/qualidade/
prontidao/adequacao, so presenca de campos. Lista fechada de 22 checks cobrindo Etapas
1-4 (as unicas modeladas ate este slice); Etapa 1 "Dados da organizacao" fica de fora por
ser referencia reaproveitada da Organizacao, nao dado preenchido no fluxo do Escopometro.

## Entidades implementadas (Slice 004 — Scope Engine: Cadeia de Valor, Topologia & Arquitetura)

Persistencia das 5 entidades que alimentam a camada de diagramas da Task 019
(`next-js/src/modules/sgsi-scope/diagrams`). `classification` (PRD secao 12) e sempre
nullable e **nunca** inferida automaticamente — ausente significa "nao classificada", em
nenhum caso um default `IN_SCOPE` silencioso.

### ValueChainBlock

`backend/src/modules/sgsi-scope/scope-engine/entities/value-chain-block.entity.ts`
(Task 020). Etapa 5 (PRD secao 12).

| Coluna                  | Tipo         | Notas                                                        |
| ----------------------- | ------------ | ------------------------------------------------------------ |
| id                      | uuid PK      |                                                              |
| sgsi_scope_id           | uuid FK      | -> `sgsi_scopes.id`, `ON DELETE CASCADE`                     |
| name                    | varchar(160) |                                                              |
| description             | text         | nullable                                                     |
| responsible_area        | varchar(160) | nullable                                                     |
| category                | varchar(30)  | enum `INPUT \| PRIMARY_PROCESS \| SUPPORT_PROCESS \| OUTPUT` |
| classification          | varchar(20)  | nullable — enum `IN_SCOPE \| OUT_SCOPE \| INTERFACE`         |
| created_at / updated_at | timestamptz  |                                                              |

### TopologyNode / TopologyLink

`backend/src/modules/sgsi-scope/scope-engine/entities/topology-{node,link}.entity.ts`
(Task 020). Etapa 6.1 (PRD secao 13.1). `TopologyLink.from_node_id`/`to_node_id` sao FK
para `topology_nodes` com `ON DELETE RESTRICT` (defesa em profundidade); o bloqueio com
mensagem clara (409) acontece antes, no `TopologyService.removeNode` — decisao humana do
PRD (bloquear em vez de cascatear) registrada na Task 020.

| Coluna (TopologyNode)   | Tipo         | Notas                                                                                                                                 |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| id                      | uuid PK      |                                                                                                                                       |
| sgsi_scope_id           | uuid FK      | -> `sgsi_scopes.id`, `ON DELETE CASCADE`                                                                                              |
| name                    | varchar(160) |                                                                                                                                       |
| type                    | varchar(30)  | enum `APPLICATION \| DATABASE \| NETWORK \| FIREWALL \| CLOUD \| SERVER \| USER \| INTERNET \| THIRD_PARTY \| PHYSICAL_UNIT \| OTHER` |
| description             | text         | nullable                                                                                                                              |
| classification          | varchar(20)  | nullable                                                                                                                              |
| created_at / updated_at | timestamptz  |                                                                                                                                       |

| Coluna (TopologyLink)     | Tipo         | Notas                                              |
| ------------------------- | ------------ | -------------------------------------------------- |
| id                        | uuid PK      |                                                    |
| sgsi_scope_id             | uuid FK      | -> `sgsi_scopes.id`, `ON DELETE CASCADE`           |
| from_node_id / to_node_id | uuid FK      | -> `topology_nodes.id`, `ON DELETE RESTRICT`       |
| description               | text         | nullable                                           |
| link_type                 | varchar(120) | nullable — livre, PRD nao lista enum para conexoes |
| created_at / updated_at   | timestamptz  |                                                    |

### ArchitectureComponent / ArchitectureInterface

`backend/src/modules/sgsi-scope/scope-engine/entities/architecture-{component,interface}.entity.ts`
(Task 020). Etapa 6.2 (PRD secao 13.2). Mesma politica de `ArchitectureInterface` (FK
`ON DELETE RESTRICT` + bloqueio 409 explicito em `ArchitectureService.removeComponent`).

| Coluna (ArchitectureComponent) | Tipo         | Notas                                           |
| ------------------------------ | ------------ | ----------------------------------------------- |
| id                             | uuid PK      |                                                 |
| sgsi_scope_id                  | uuid FK      | -> `sgsi_scopes.id`, `ON DELETE CASCADE`        |
| name                           | varchar(160) |                                                 |
| layer                          | varchar(160) | nullable — "camada", livre (PRD nao lista enum) |
| description                    | text         | nullable                                        |
| classification                 | varchar(20)  | nullable                                        |
| created_at / updated_at        | timestamptz  |                                                 |

| Coluna (ArchitectureInterface)      | Tipo        | Notas                                                 |
| ----------------------------------- | ----------- | ----------------------------------------------------- |
| id                                  | uuid PK     |                                                       |
| sgsi_scope_id                       | uuid FK     | -> `sgsi_scopes.id`, `ON DELETE CASCADE`              |
| from_component_id / to_component_id | uuid FK     | -> `architecture_components.id`, `ON DELETE RESTRICT` |
| description                         | text        | nullable                                              |
| created_at / updated_at             | timestamptz |                                                       |

Enums (`ScopeClassification`, `ValueChainCategory`, `TopologyNodeType`) vivem em
`backend/src/common/enums/`, seguindo a convencao ja usada por `ContextAspectType`
(Task 012) — deviacao intencional do path de escrita restrito da Security Constraints da
Task 020 (`scope-engine/**`), documentada no handoff da task para manter o codebase
consistente em vez de duplicar o enum dentro do submodulo.

Migration: `1700000006000-CreateScopeEngineTables.ts` — criada, **ainda nao executada**
contra um Postgres real (mesma situacao das migrations anteriores neste ambiente de
desenvolvimento).

## Pendente para as proximas tasks

`SgsiScope`, `SgsiScopeVersion`, `DocumentControl`, `OrganizationContext`,
`ContextAspect`, `Stakeholder`, `Requirement`, `ProjectRequirement`,
`GovernanceCommittee`, `GovernanceMember`, `ScopeDefinition`, `ScopeCharacteristic`,
`ScopeBenefit`, `ValueChainBlock`, `TopologyNode`, `TopologyLink`,
`ArchitectureComponent` e `ArchitectureInterface` ja existem (Tasks
011/012/015/016/020, acima). `OrganizationValue` foi deliberadamente **nao** criada (ver
nota em `OrganizationContext`). Restam do PRD secao 22: `ScopeLocation`,
`ScopeEmployeeGroup`, `ScopeAsset`, `ScopeProvider`, `ScopeApproval`, `ScopeRevision`,
`GeneratedDocument` — serao adicionadas incrementalmente a este documento pelas tasks
correspondentes (Slices 005-006), nao de uma vez.
