# Task 005 - CRUD Organizacao

## Status

planned

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/organizations`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Organizacao e a entidade central reutilizavel entre projetos (PRD secao 5) — precisa existir antes de qualquer projeto.

### O que

CRUD de Organizacao com os campos do PRD secao 5 (razao social, segmento, colaboradores, abrangencia geografica, produtos/servicos, logotipo, historico, negocio, missao, visao, valores).

### Comportamento esperado

- cenario: DSR Admin ou Consultor cria organizacao -> registro persistido, usuario criador vira `OrganizationMember`.
- cenario: edicao de organizacao por usuario sem vinculo -> 403 (Task 004).

### Fora de escopo

- Upload de logotipo em storage definitivo (pode usar campo de URL/placeholder nesta task; storage S3 e tratado a fundo na Task 026)

## Casos de erro e borda

- Nome/razao social vazio -> 400
- Exclusao de organizacao com projetos ativos -> usar soft delete (PRD secao 28) e bloquear se houver dependencia critica (a decidir: bloquear ou cascatear soft delete — registrar como pendencia se ambiguo)

## Review da spec

- [x] Permissoes: criacao/edicao exige vinculo (DSR Admin ou Consultor membro)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: campos exatamente conforme PRD secao 5
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Reusar guard da Task 004 em todas as rotas
- Implementar soft delete (`deletedAt`)

### Nao deve

- Nao expor endpoint de listagem sem filtro por vinculo do usuario

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#5`

## Dependencias

- Task 004

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Storage definitivo de logotipo

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
- edit: `backend/src/modules/organizations/**`
- shell: `cd backend && npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/organizations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco (se campos exigirem coluna nova alem da Task 002)

### Contexto proibido

- dados reais de organizacoes/clientes

### Criterios de saida

- [ ] guard de acesso aplicado
- [ ] lint/test passam

## Criterios de conclusao

- CRUD completo de Organizacao com todos os campos do PRD secao 5, protegido por guard

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Modulo `organizations` (controller, service, DTOs)

## Riscos ou ambiguidades

- Politica de exclusao de organizacao com projetos ativos precisa confirmacao humana

## Status final

planned
