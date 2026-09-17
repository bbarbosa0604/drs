# Task 015 - Stakeholder/Requirement (biblioteca legal)/GovernanceCommittee/GovernanceMember

## Status

planned

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

- [ ] lint/test passam
- [ ] seed da biblioteca legal executavel

## Criterios de conclusao

- CRUD de Stakeholder/Requirement/GovernanceCommittee/GovernanceMember; biblioteca legal seedada

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Submodulo `requirements`/`governance` dentro de `sgsi-scope`

## Riscos ou ambiguidades

- Escopo exato da biblioteca (global vs por-projeto) precisa confirmacao humana antes de fechar o modelo de dados definitivo

## Status final

planned
