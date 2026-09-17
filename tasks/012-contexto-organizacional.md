# Task 012 - OrganizationContext/OrganizationValue/ContextAspect

## Status

planned

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/context`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Etapa 2 (Contexto) exige registrar historico, direcionadores (negocio/missao/visao/valores) e questoes externas/internas — base para a declaracao de escopo mais adiante.

### O que

Entidades `OrganizationContext` (historico rich text em JSON), `OrganizationValue` (negocio/missao/visao/valores) e `ContextAspect` (questoes externas/internas, com titulo/descricao/observacoes).

### Comportamento esperado

- cenario: salvar historico como conteudo rico -> persistido como JSON estruturado (TipTap), nao HTML livre (PRD secao 29).
- cenario: cadastrar questao externa -> aparece separada de questoes internas.

### Fora de escopo

- UI (Task 014)

## Casos de erro e borda

- Conteudo rico com HTML malicioso colado -> sanitizar antes de persistir (PRD secao 30)
- Questao sem titulo -> 400

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: campos exatamente conforme PRD secao 9
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Sanitizar qualquer conteudo rico recebido (PRD secao 30) antes de persistir
- Armazenar conteudo rico como JSON estruturado, nao HTML

### Nao deve

- Nao aceitar HTML arbitrario sem sanitizacao

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#9, #29, #30`

## Dependencias

- Task 011

## Slice vertical

### Identificador

Slice 002 - Escopometro: Empresa & Contexto

### Arquivo

`tasks/slices/002-escopometro-empresa-contexto.md`

### Fora do slice

- UI

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho              | Fonte                         | Quando                   | Obrigatorio |
| -------------------- | ----------------------------- | ------------------------ | ----------- |
| API                  | `contracts/openapi.yaml`      | sempre                   | sim         |
| Seguranca de produto | `backend/docs/ai/SECURITY.md` | por causa da sanitizacao | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: medio

## Security Constraints

### Nivel de risco

medio

### Perfil de origem

api-back

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/sgsi-scope/context/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/sgsi-scope/context/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de clientes

### Criterios de saida

- [ ] sanitizacao de conteudo rico coberta por teste
- [ ] lint/test passam

## Criterios de conclusao

- CRUD de OrganizationContext/OrganizationValue/ContextAspect com sanitizacao de conteudo rico

## Validacao esperada

- `npm run test` incluindo teste de sanitizacao contra XSS

## Entregaveis esperados

- Submodulo `context` dentro de `sgsi-scope`

## Riscos ou ambiguidades

- Biblioteca de sanitizacao a escolher (ex.: `sanitize-html`) — registrar como decisao tecnica na implementacao

## Status final

planned
