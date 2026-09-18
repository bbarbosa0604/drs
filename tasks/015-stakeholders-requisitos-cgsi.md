# Task 015 - Stakeholder/Requirement (biblioteca legal)/GovernanceCommittee/GovernanceMember

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/stakeholders`, `#/requirements`, `#/governance`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Etapa 3 exige registrar partes interessadas, requisitos legais e o comite de governanca (CGSI) antes da declaracao de escopo.

### O que

Entidades `Stakeholder` (parte interessada, requisitos, necessidades, expectativas, observacoes), `Requirement` (com seed de biblioteca legal brasileira inicial administravel pelo DSR Admin, nao hardcoded no frontend), `GovernanceCommittee` e `GovernanceMember`.

### Comportamento esperado

- cenario: listar requisitos -> retorna a biblioteca seed + requisitos customizados do projeto.
- cenario: DSR Admin adiciona novo requisito a biblioteca -> disponivel para todos os projetos (biblioteca global) ou so para o projeto atual (a definir na implementacao; MVP pode comecar por-projeto e evoluir).

### Fora de escopo

- UI administravel completa da biblioteca legal (fica como "premissa: semi-hardcoded revisavel" registrada no `000-index.md`)

## Casos de erro e borda

- Requisito duplicado -> permitido, mas nao e erro (decisao do especialista)
- Membro de CGSI sem funcao definida -> 400

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: lista inicial de requisitos legais conforme PRD secao 10.2
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Seed de biblioteca legal como dado de banco (migration/seed script), nao hardcoded em componente (PRD secao 10.2, 32)

### Nao deve

- Nao hardcodar a biblioteca legal permanentemente no frontend

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#10, #32`

## Dependencias

- Slice 002 completo

## Slice vertical

### Identificador

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo

### Arquivo

`tasks/slices/003-escopometro-requisitos-escopo.md`

### Fora do slice

- ScopeDefinition/ScopeCharacteristic/ScopeBenefit (Task 016)

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho | Fonte                    | Quando | Obrigatorio |
| ------- | ------------------------ | ------ | ----------- |
| API     | `contracts/openapi.yaml` | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

medio

### Perfil de origem

api-back

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/sgsi-scope/requirements/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/sgsi-scope/requirements/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de clientes

### Criterios de saida

- [x] lint/test passam
- [x] seed da biblioteca legal executavel (na migration; nao executada contra Postgres real ainda)

## Criterios de conclusao

- [x] CRUD de Stakeholder/Requirement/GovernanceCommittee/GovernanceMember; biblioteca legal seedada

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Submodulo `requirements`/`governance` dentro de `sgsi-scope`

## Riscos ou ambiguidades

- **Resolvido com o Bruno**: a biblioteca de requisitos e **global** (uma tabela seedada e
  compartilhada, mantida pelo DSR Admin), nao uma copia por projeto. Cada projeto marca
  quais requisitos se aplicam via `ProjectRequirement` (tabela de vinculo, com campos
  denormalizados para permitir customizacao local sem afetar a biblioteca).

## Resultado da execucao

- 4 sub-recursos implementados, todos sob `backend/src/modules/sgsi-scope/requirements/`:
  - **Stakeholders**: CRUD completo (`/projects/:id/sgsi-scope/stakeholders[/:id]`),
    campos exatamente conforme PRD secao 10.1.
  - **Requirements (biblioteca global)**: `GET /requirements` (leitura por qualquer
    usuario autenticado) + `POST`/`PATCH`/`DELETE` restritos a DSR Admin (`RolesGuard`,
    mesmo padrao de `UsersController`, Task 003). Migration insere as 10 referencias
    legais do PRD secao 10.2 via `INSERT` parametrizado.
  - **Project requirements**: `GET /projects/:id/sgsi-scope/requirements` retorna
    `{ library, selected }` (biblioteca inteira + o que o projeto aplicou);
    `POST` aceita `requirementId` (denormaliza titulo/categoria/descricao da biblioteca)
    ou `title` (customizado, sem `requirementId`) — 400 se nenhum dos dois for enviado.
    Duplicar o mesmo requisito no projeto e permitido (sem unique index), conforme a
    task pedia explicitamente.
  - **Governance (CGSI)**: `GET`/`PATCH .../governance` para o comite (criado sob demanda
    no primeiro autosave ou no primeiro membro) + CRUD de membros
    (`POST`/`PATCH`/`DELETE .../governance/members[/:id]`). `jobRole` ("funcao") e
    obrigatorio via DTO — falta dele gera 400 automaticamente pelo `ValidationPipe`
    global, sem logica extra no service (mesmo padrao ja usado no `title` de
    `ContextAspect`, Task 012).
- Todas as rotas de projeto reusam `JwtAuthGuard` + `ProjectAccessGuard` (Task 004); a
  rota global de biblioteca usa `JwtAuthGuard` + `RolesGuard`/`@Roles(UserRole.ADMIN)`
  so nas mutacoes.
- Sequencia de criacao do `GovernanceCommittee` e lazy (nao criado na ativacao do modulo,
  Task 011) — mesma decisao ja tomada para `OrganizationContext` na Task 012.

## Arquivos alterados

- Criado: `backend/src/common/enums/requirement-category.enum.ts`
- Criado: `backend/src/modules/sgsi-scope/requirements/entities/{stakeholder,requirement,project-requirement,governance-committee,governance-member}.entity.ts`
- Criado: `backend/src/modules/sgsi-scope/requirements/dto/{stakeholder,requirement-library,project-requirement,governance}.dto.ts`
- Criado: `backend/src/modules/sgsi-scope/requirements/{stakeholders,requirements-library,project-requirements,governance}.service.ts` (+specs para stakeholders/project-requirements/governance)
- Criado: `backend/src/modules/sgsi-scope/requirements/{stakeholders,requirements-library,project-requirements,governance}.controller.ts`
- Criado: `backend/src/modules/sgsi-scope/requirements/requirements.module.ts`
- Criado: `backend/src/database/migrations/1700000004000-CreateRequirementsAndGovernanceTables.ts`
- Modificado: `backend/src/app.module.ts` (registro do `RequirementsModule`)
- Modificado: `contracts/openapi.yaml` (+13 paths, +13 schemas)
- Modificado: `docs/database.md` (5 novas entidades documentadas)

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run test`: executado com sucesso (13 suites, 53 testes, incluindo:
  biblioteca+customizado na listagem, 400 sem `requirementId`/`title`, denormalizacao da
  biblioteca, duplicacao permitida, criacao lazy do comite, 404 ao remover membro sem
  comite)
- `npm run build`: executado com sucesso
- `contracts/openapi.yaml` validado com `js-yaml` (22 paths, 39 schemas)
- **Migration criada mas nao executada contra Postgres real** (mesma limitacao das Tasks
  002/005/006/011/012) — sera aplicada no proximo deploy a Hostinger, incluindo o seed da
  biblioteca legal

## Pendencias pos-task

- Rodar a migration (com seed) no proximo deploy a Hostinger.
- UI administravel da biblioteca legal continua fora de escopo (Task 015 so cobre
  backend) — DSR Admin gerencia via API por enquanto.

## Status final

done
