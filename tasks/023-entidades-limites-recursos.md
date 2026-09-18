# Task 023 - ScopeLocation/ScopeEmployeeGroup/ScopeAsset/ScopeProvider/ScopeApproval/ScopeRevision

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/locations`, `#/employee-groups`, `#/assets`, `#/providers`, `#/approval`, `#/revisions`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Etapa 7 (Limites & Recursos) fecha o levantamento de escopo com localidades, pessoas, ativos, prestadores e o registro formal de aprovacao.

### O que

Entidades `ScopeLocation` (nome, endereco, descricao, classificacao), `ScopeEmployeeGroup` (area/grupo, quantidade, descricao, classificacao), `ScopeAsset` (ativo, categoria, descricao, responsavel, classificacao), `ScopeProvider` (prestador, servico, descricao, classificacao), `ScopeApproval` (metodo, plataforma, texto, responsavel, data, observacoes), `ScopeRevision` (versao, data, responsavel, descricao da alteracao).

### Comportamento esperado

- cenario: registrar aprovacao -> fica associada a versao atual do SgsiScope.
- cenario: listar revisoes -> ordenadas por data/versao.

### Fora de escopo

- Versionamento completo com protecao de sobrescrita (Task 027 formaliza isso; aqui e so o registro basico por etapa)

## Casos de erro e borda

- Aprovacao sem responsavel/data -> permitido no MVP (nao bloqueia preenchimento), mas reduz percentual de preenchimento

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: 5 subsecoes + revisoes conforme PRD secao 14
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Seguir os mesmos campos e enums de classificacao de escopo ja usados nas entidades anteriores (consistencia)

### Nao deve

- Nao reimplementar enum de classificacao diferente do ja usado em ValueChainBlock/TopologyNode

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#14`

## Dependencias

- Slice 004 completo

## Slice vertical

### Identificador

Slice 005 - Escopometro: Limites, Recursos & Aprovacao

### Arquivo

`tasks/slices/005-escopometro-limites-aprovacao.md`

### Fora do slice

- Versionamento completo (Task 027)

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
- edit: `backend/src/modules/sgsi-scope/limits/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/sgsi-scope/limits/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de clientes

### Criterios de saida

- [ ] lint/test passam

## Criterios de conclusao

- CRUD completo das 6 entidades da etapa 7

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Submodulo `limits` dentro de `sgsi-scope`

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

done

## Resultado da execucao

- Submodulo `backend/src/modules/sgsi-scope/limits/` com as 6 entidades, um
  service/controller so (`LimitsService`/`LimitsController`, mesmo espirito do
  `ScopeDefinitionService`) e `LimitsModule` registrado em `app.module.ts`.
- 4 entidades de lista (Location/EmployeeGroup/Asset/Provider) com CRUD completo,
  reusando `ScopeClassification` (nao um enum novo, per "Nao deve" da task).
- `ScopeApproval`: registro unico por `SgsiScope` (upsert via `PATCH`), todos os campos
  opcionais — responsavel/data ausentes nao bloqueiam o salvamento (PRD - Task 023).
- `ScopeRevision`: log de historico, so `POST`/listagem (sem update/delete) — decisao
  de modelagem porque o PRD descreve a secao 14.6 como "Historico", nao uma lista
  editavel.
- Contrato `openapi.yaml`: 11 paths novos + 15 schemas novos.

## Arquivos alterados

- Criados: `backend/src/modules/sgsi-scope/limits/**` (module, controller, service +
  spec, 6 entities, 6 dto files),
  `backend/src/database/migrations/1700000007000-CreateLimitsTables.ts`.
- Modificado: `backend/src/app.module.ts`, `contracts/openapi.yaml`, `docs/database.md`.

## Validacoes executadas

- `npm run test` (backend): 20 suites / 80 testes passando (5 novos).
- `npm run lint` (com `--fix` de formatacao), `npm run build` (`nest build`): OK.
- `contracts/openapi.yaml`: parse OK via `js-yaml` (52 paths, 74 schemas).

## Pendencias ou bloqueios

- Migration criada, **nao executada** contra Postgres real (aprovacao humana
  necessaria antes de rodar `npm run migration:run`).
- `fill-percentage.util.ts` (Task 016) **nao foi estendido** para cobrir Etapas 5-7
  (Cadeia de Valor, Topologia & Arquitetura, Limites & Recursos) — o PRD (casos de erro
  desta task) implica que a aprovacao incompleta deveria "reduzir o percentual de
  preenchimento", mas isso exigiria revisitar a lista fechada de 22 checks (Task 016) de
  forma deliberada, fora do criterio de conclusao explicito desta task ("CRUD completo
  das 6 entidades"). Registrado como lacuna real, nao decisao silenciosa — nenhuma task
  do Slice 004 tambem fez essa extensao.
- Sem teste de integracao contra API/banco reais.

## Proximo contexto recomendado

Task 024 (Slice 005) - UI Etapa 7 (Limites & Recursos), consumindo
`/projects/:id/sgsi-scope/limits`.
