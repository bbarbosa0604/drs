# Database (rascunho) - DRS

> Rascunho produzido na Task 001. Sera formalizado/expandido na Task 010
> (`CLAUDE.md` + `docs/architecture.md` + `docs/database.md`) e evolui a cada slice
> do Escopometro. ORM: TypeORM. Banco: PostgreSQL (ja scaffolded em `backend/`).

## Entidades cobertas nesta versao (Slice 001 - Fundacao)

### User (ja implementada em `backend/src/modules/users/entities/user.entity.ts`)

- `id` (uuid, PK)
- `name` (varchar 80)
- `email` (varchar 160, unique)
- `phone` (varchar 32, nullable)
- `passwordHash` (varchar 255, `select: false`)
- `role`: enum `UserRole` (`admin` | `member`) — `admin` = DSR Admin (PRD secao 3)
- `createdAt`, `updatedAt`

Observacao: a entidade e o CRUD (`modules/users`) e a autenticacao (`modules/auth`, login + `/auth/me` via JWT)
**ja existem no scaffold do backend**, descobertos durante a execucao desta task. As Tasks 002 e 003 do backlog
devem ser revisadas antes de executar para reaproveitar esse trabalho em vez de recria-lo — ver
`tasks/000-index.md`, secao "Observacoes finais".

### Organization (a criar)

- `id` (uuid, PK)
- `name` (razao social/nome) — obrigatorio
- `segment`, `employeeCount`, `geographicScope`, `productsServices` — nullable
- `logoUrl` — nullable (storage definitivo: Task 026)
- `institutionalHistory`, `business`, `mission`, `vision` — nullable
- `values` (lista de strings)
- `createdAt`, `updatedAt`, `deletedAt` (soft delete, PRD secao 28)

### OrganizationMember (a criar)

- `id` (uuid, PK)
- `organizationId` (FK -> Organization)
- `userId` (FK -> User)
- `role`: enum `OrganizationMemberRole` (`CONSULTANT` no MVP)
- unique constraint (`organizationId`, `userId`)
- `createdAt`

Nota: DSR Admin (`User.role = admin`) tem acesso global e nao precisa de um registro
`OrganizationMember` por organizacao (ver Task 004).

### Project (a criar)

- `id` (uuid, PK)
- `name` — obrigatorio
- `organizationId` (FK -> Organization) — obrigatorio
- `description` — nullable
- `responsibleUserId` (FK -> User) — obrigatorio
- `participantUserIds` (relacao N:N via `ProjectMember`, ou array simples no MVP — decisao de implementacao)
- `startDate`, `expectedEndDate` — nullable
- `status`: enum `ProjectStatus` (`DRAFT`, `IN_PROGRESS`, `IN_REVIEW`, `WAITING_APPROVAL`, `APPROVED`, `ARCHIVED`)
- `createdAt`, `updatedAt`, `deletedAt` (soft delete)

### ProjectMember (a criar)

- `id` (uuid, PK)
- `projectId` (FK -> Project)
- `userId` (FK -> User)
- `role`: enum `OrganizationMemberRole` (reaproveitado; `CONSULTANT` no MVP)
- unique constraint (`projectId`, `userId`)

### ModuleInstance (conceitual nesta versao — implementacao na Task 011)

- `id` (uuid, PK)
- `projectId` (FK -> Project)
- `moduleKey`: enum `ModuleKey` (`SGSI_SCOPE`)
- `activatedAt`, `deletedAt`
- unique constraint (`projectId`, `moduleKey`) — ativacao idempotente

### AuditLog (conceitual nesta versao — implementacao na Task 027)

- `id` (uuid, PK)
- `organizationId` (FK -> Organization)
- `projectId` (FK -> Project, nullable)
- `userId` (FK -> User)
- `entity` (nome da entidade afetada)
- `entityId` (uuid)
- `action`: enum `AuditAction` (`CREATE`, `UPDATE`, `DELETE`, `STATUS_CHANGE`, `DOCUMENT_GENERATED`, `SUBMITTED_FOR_REVIEW`, `APPROVED`)
- `timestamp`
- `metadata` (jsonb, nullable)

## Relacionamentos (resumo)

```text
User 1---N OrganizationMember N---1 Organization
User 1---N ProjectMember       N---1 Project
Organization 1---N Project
Project 1---N ModuleInstance
Organization 1---N AuditLog
Project 0..1---N AuditLog
```

## Pendente para as proximas tasks

- Entidades do Escopometro (SgsiScope, SgsiScopeVersion, DocumentControl, etc. - Slices 002-006) serao adicionadas
  incrementalmente a este documento pelas tasks correspondentes, nao de uma vez.
- Confirmar se `Project.participantUserIds` sera relacao N:N dedicada (`ProjectMember`) desde a Task 006 ou
  apenas `responsibleUserId` + `ProjectMember` para os demais participantes (recomendado, evita ambiguidade).
