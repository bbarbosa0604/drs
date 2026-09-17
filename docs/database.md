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

## Relacionamentos (resumo)

```text
User 1---N OrganizationMember N---1 Organization
User 1---N ProjectMember       N---1 Project
Organization 1---N Project
Project 1---N ModuleInstance
Organization 1---N AuditLog
Project 0..1---N AuditLog
```

## Versionamento (planejado, Slice 002+)

`SgsiScope`/`SgsiScopeVersion` (PRD secao 20) ainda nao existem — nenhuma migration
criada. Quando o Slice 002 (Escopometro) comecar, a regra e: uma versao aprovada nunca e
sobrescrita silenciosamente; uma alteracao relevante apos aprovacao gera nova versao ou
revisao controlada (`ScopeRevision`, PRD secao 22).

## Pendente para as proximas tasks

Entidades do Escopometro (`SgsiScope`, `SgsiScopeVersion`, `DocumentControl`,
`OrganizationContext`, `OrganizationValue`, `ContextAspect`, `Stakeholder`,
`Requirement`, `GovernanceCommittee`, `GovernanceMember`, `ScopeDefinition`,
`ScopeCharacteristic`, `ScopeBenefit`, `ValueChainBlock`, `TopologyNode`, `TopologyLink`,
`ArchitectureComponent`, `ArchitectureInterface`, `ScopeLocation`,
`ScopeEmployeeGroup`, `ScopeAsset`, `ScopeProvider`, `ScopeApproval`, `ScopeRevision`,
`GeneratedDocument` — lista completa do PRD secao 22) serao adicionadas incrementalmente
a este documento pelas tasks correspondentes (Slices 002-006), nao de uma vez.
