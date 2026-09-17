# Task 023 - ScopeLocation/ScopeEmployeeGroup/ScopeAsset/ScopeProvider/ScopeApproval/ScopeRevision

## Status

planned

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

planned
