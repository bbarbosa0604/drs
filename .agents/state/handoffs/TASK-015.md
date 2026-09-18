# Handoff - Task 015

## Identificador da task

Task 015 - Stakeholder/Requirement (biblioteca legal)/GovernanceCommittee/GovernanceMember

## Slice vertical

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo
(`tasks/slices/003-escopometro-requisitos-escopo.md`) — **primeira task do slice.**
Slice 002 (Tasks 011-014) esta 100% `done`.

## Status final

done

## Decisoes preservadas

- **Biblioteca de requisitos e global** (confirmado com o Bruno): uma tabela
  `requirements` seedada e compartilhada, mantida pelo DSR Admin (`RolesGuard`). Cada
  projeto vincula quais aplica via `ProjectRequirement` (com campos denormalizados,
  permitindo customizacao local sem tocar a biblioteca).
- Duplicar o mesmo requisito no mesmo projeto e **permitido** (sem unique index) —
  decisao explicita ja presente na task original.
- `GovernanceCommittee` e criado lazy (no primeiro autosave ou primeiro membro), mesma
  decisao ja tomada para `OrganizationContext` na Task 012.
- `jobRole` ("funcao") do membro do CGSI e obrigatorio via DTO — o `ValidationPipe`
  global ja cobre o 400, sem logica extra no service.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 014.
- `requirements/001-prd-escopometro-sgsi.md` secoes 10, 32.
- Confirmacao humana explicita sobre o escopo da biblioteca (global vs por-projeto).

## Compliance de Security Constraints

- Risco medio / perfil `api-back`. Migration/schema de banco — aprovada explicitamente
  antes de escrever a migration (mesmo padrao das Tasks 011/012).

## Arquivos alterados

- Criados: `common/enums/requirement-category.enum.ts`,
  `modules/sgsi-scope/requirements/entities/{stakeholder,requirement,project-requirement,governance-committee,governance-member}.entity.ts`,
  `modules/sgsi-scope/requirements/dto/*.dto.ts`,
  `modules/sgsi-scope/requirements/{stakeholders,requirements-library,project-requirements,governance}.{service,controller}.ts`
  (+specs), `modules/sgsi-scope/requirements/requirements.module.ts`,
  `database/migrations/1700000004000-CreateRequirementsAndGovernanceTables.ts`.
- Modificados: `app.module.ts`, `contracts/openapi.yaml` (+13 paths, +13 schemas),
  `docs/database.md` (5 novas entidades).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK, `npm run test` OK (13
  suites / 53 testes).
- `contracts/openapi.yaml` validado com `js-yaml` (22 paths, 39 schemas).
- Migration (com seed da biblioteca legal) nao executada contra Postgres real neste
  ambiente.

## Pendencias ou bloqueios

- Rodar a migration (com seed) no proximo deploy a Hostinger.
- UI administravel da biblioteca legal fica para uma task futura (Task 015 e backend-only).

## Proximo contexto recomendado

Task 016 (ScopeDefinition/ScopeCharacteristic/ScopeBenefit — Etapa 4, backend): mesmo
padrao de submodulo dentro de `sgsi-scope`, reuso de `ProjectAccessGuard`, e reaproveitar
`RequirementCategory`/o padrao de biblioteca+selecao se a Etapa 4 precisar de algo
semelhante.
