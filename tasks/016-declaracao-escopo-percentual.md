# Task 016 - ScopeDefinition/ScopeCharacteristic/ScopeBenefit + calculo do percentual de preenchimento

## Status

planned

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/scope-definition`, `#/fill-percentage`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Etapa 4 e a etapa central do modulo (PRD secao 11): declaracao formal, fundamentacao, caracteristicas e beneficios do escopo, todos preenchidos pelo especialista, nunca decididos automaticamente.

### O que

Entidades `ScopeDefinition` (declaracao formal, fundamentacao executiva, descricao detalhada), `ScopeCharacteristic` e `ScopeBenefit` (listas dinamicas); endpoint que calcula o percentual de preenchimento do Escopometro inteiro (soma de presenca de campos esperados em todas as etapas ja implementadas ate este slice).

### Comportamento esperado

- cenario: todos os campos obrigatorios do Escopometro preenchidos ate esta etapa -> percentual reflete isso (nao 100% se etapas futuras ainda nao existirem no modelo, ou considerar so as etapas ja modeladas — decisao a registrar).
- cenario: campo esperado vazio -> reduz o percentual, sem qualificar "bom" ou "ruim".

### Fora de escopo

- Qualquer avaliacao de adequacao/conformidade (PRD secao 16, regra critica)

## Casos de erro e borda

- Percentual nunca deve ser rotulado como conformidade/maturidade/prontidao (PRD secao 16) — validar que a API retorna so o numero e um label neutro ("Percentual de preenchimento do Escopometro")

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: regra critica do PRD secao 11 (nao decidir escopo automaticamente) e secao 16 (indicador so mede presenca)
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Calculo de percentual deve ser uma funcao pura e testavel (lista de campos esperados -> % preenchido)

### Nao deve

- Nao incluir logica que sugira ou preencha automaticamente a declaracao de escopo

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#11, #16`

## Dependencias

- Task 015

## Slice vertical

### Identificador

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo

### Arquivo

`tasks/slices/003-escopometro-requisitos-escopo.md`

### Fora do slice

- Cadeia de valor/topologia/arquitetura (slice 004)

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
- edit: `backend/src/modules/sgsi-scope/scope-definition/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/sgsi-scope/scope-definition/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de clientes

### Criterios de saida

- [ ] teste unitario do calculo de percentual cobre casos de borda (0%, parcial, completo)
- [ ] lint/test passam

## Criterios de conclusao

- CRUD de ScopeDefinition/ScopeCharacteristic/ScopeBenefit; endpoint de percentual funcional e testado

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Submodulo `scope-definition` dentro de `sgsi-scope`

## Riscos ou ambiguidades

- Definir explicitamente quais campos entram no calculo de percentual (lista fechada) para evitar ambiguidade futura

## Status final

planned
