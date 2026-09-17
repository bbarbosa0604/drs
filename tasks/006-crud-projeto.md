# Task 006 - CRUD Projeto (status, participantes, ativacao de modulos)

## Status

planned

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/projects`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Projeto e onde os modulos (a comecar pelo Escopometro) sao ativados; precisa existir com status e participantes antes de qualquer modulo.

### O que

CRUD de Projeto com campos do PRD secao 6 (nome, organizacao, descricao, responsavel, participantes, datas, status, modulos ativos) e enum de status (`DRAFT, IN_PROGRESS, IN_REVIEW, WAITING_APPROVAL, APPROVED, ARCHIVED`).

### Comportamento esperado

- cenario: criar projeto vinculado a organizacao existente -> sucesso, status inicial `DRAFT`.
- cenario: criar projeto com `organizationId` inexistente ou de outra organizacao sem vinculo -> 400/403.
- cenario: mudar status de projeto -> registra em `AuditLog` (integracao leve com Task 027, ou placeholder se ainda nao existir).

### Fora de escopo

- Ativacao do ModuleInstance do Escopometro em si (Task 011 cria a entidade; esta task so define `modulos ativos` como campo/relacao)

## Casos de erro e borda

- Transicao de status invalida (ex.: `ARCHIVED` -> `DRAFT`) -> decidir se e permitido; se PRD nao especifica, registrar como pendencia e no MVP permitir livremente com log em AuditLog
- Projeto sem participantes -> permitido (responsavel e obrigatorio, participantes nao)

## Review da spec

- [x] Permissoes: criacao/edicao exige vinculo a organizacao (Task 004)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: enum de status conforme PRD secao 6
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima) — transicao de status registrada como pendencia
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Reusar guard da Task 004
- Implementar soft delete (`deletedAt`, PRD secao 28)

### Nao deve

- Nao permitir criar projeto sem `organizationId` valido e autorizado

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#6`

## Dependencias

- Task 005

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- ModuleInstance do Escopometro (Task 011)

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
- edit: `backend/src/modules/projects/**`
- shell: `cd backend && npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/projects/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de projetos/clientes

### Criterios de saida

- [ ] guard de acesso aplicado
- [ ] lint/test passam

## Criterios de conclusao

- CRUD completo de Projeto com status, participantes e vinculo a organizacao validado

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Modulo `projects` (controller, service, DTOs)

## Riscos ou ambiguidades

- Regras de transicao de status nao estao explicitas no PRD — confirmar com o Bruno se alguma transicao deve ser bloqueada

## Status final

planned
