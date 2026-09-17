# Task 011 - Ativacao ModuleInstance Escopometro + SgsiScope/SgsiScopeVersion/DocumentControl + autosave

## Status

planned

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/projects/{id}/modules`, `#/paths/sgsi-scopes`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

E o ponto de entrada do primeiro modulo do DSR: sem isso, nenhuma das 8 etapas do Escopometro tem onde persistir dados.

### O que

Endpoint para ativar o Escopometro num Projeto (cria `ModuleInstance` + `SgsiScope` + primeira `SgsiScopeVersion` em rascunho), entidade `DocumentControl` (classificacao, versao, datas, elaborado/aprovado por) e endpoint generico de autosave por secao (persistindo parcialmente sem exigir formulario completo).

### Comportamento esperado

- cenario: ativar Escopometro em projeto que ainda nao tem -> cria ModuleInstance + SgsiScope + versao rascunho.
- cenario: ativar em projeto que ja tem -> idempotente, retorna a instancia existente, nao duplica.
- cenario: autosave de um campo isolado (ex.: nome da empresa) -> persiste sem exigir os demais campos preenchidos.

### Fora de escopo

- Entidades das etapas 2-8 (tasks seguintes)
- Versionamento completo com protecao de versao aprovada (Task 027)

## Casos de erro e borda

- Autosave concorrente (duas abas) -> last-write-wins aceitavel no MVP, mas deve ser documentado como limitacao conhecida
- Payload de autosave malformado -> 400 sem corromper o restante do documento

## Review da spec

- [x] Permissoes: herdadas do vinculo a organizacao/projeto (Slice 001)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: navegacao livre entre etapas (PRD secao 7), regra de importacao so como referencia (PRD secao 8.3)
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Usar UUID/CUID2 para todos os IDs novos (PRD secao 27)
- Persistir autosave de forma incremental (PATCH parcial), nao exigir payload completo

### Nao deve

- Nao usar `localStorage` como fonte oficial (PRD secao 18) — banco e a fonte de verdade

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#7, #8.2, #18, #19, #20`

## Dependencias

- Slice 001 completo (Tasks 001-010)

## Slice vertical

### Identificador

Slice 002 - Escopometro: Empresa & Contexto

### Arquivo

`tasks/slices/002-escopometro-empresa-contexto.md`

### Fora do slice

- Entidades das etapas 3-8

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho | Fonte                                 | Quando | Obrigatorio |
| ------- | ------------------------------------- | ------ | ----------- |
| API     | `contracts/openapi.yaml`              | sempre | sim         |
| Backend | `backend/docs/ai/BACKEND_PATTERNS.md` | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: medio

## Security Constraints

### Nivel de risco

medio

### Perfil de origem

api-back

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/sgsi-scope/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/sgsi-scope/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de clientes/projetos

### Criterios de saida

- [ ] lint/test passam
- [ ] autosave testado com payload parcial

## Criterios de conclusao

- Ativacao de modulo idempotente; autosave funcional por secao; DocumentControl persistido

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Modulo `sgsi-scope` (base) com ativacao e autosave

## Riscos ou ambiguidades

- Estrategia exata de "PATCH parcial" (campo a campo vs por secao) deve ser definida na implementacao; recomenda-se por secao para reduzir chamadas

## Status final

planned
