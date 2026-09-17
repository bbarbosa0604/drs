# Task 010 - CLAUDE.md + docs/architecture.md + docs/database.md

## Status

planned

## Tipo

shared

## Stacks envolvidos

- next-js
- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

nao se aplica

## Modo de execucao

cross-stack

## Referencia de design system

nao se aplica (task de documentacao)

## Contexto de negocio

### Por que

PRD secao 45 recomenda explicitamente criar `CLAUDE.md`, `docs/architecture.md`, `docs/database.md` e `docs/modules/sgsi-scope.md` como guias permanentes para o desenvolvimento assistido por IA.

### O que

Escrever `CLAUDE.md` (regras permanentes que a IA deve respeitar), `docs/architecture.md` (camadas, multitenancy, autorizacao, servicos, repositories, documentos, diagramas, storage, auditoria) e `docs/database.md` (entidades, relacionamentos, enums, indices, soft delete, versionamento — formalizando o rascunho da Task 001). `docs/modules/sgsi-scope.md` fica para quando o Slice 002 comecar (especificacao funcional detalhada das 8 etapas), nao nesta task.

### Comportamento esperado

- cenario: nova sessao de IA le `CLAUDE.md` -> entende as decisoes arquiteturais nao-negociaveis do PRD secao 44 sem precisar reler o PRD inteiro.

### Fora de escopo

- `docs/modules/sgsi-scope.md` (deixar como pendencia para o inicio do Slice 002)

## Casos de erro e borda

- nao se aplica (task de documentacao)

## Review da spec

- [x] Permissoes: nao se aplica
- [x] Casos de erro mapeados: nao se aplica
- [x] Decisoes humanas confirmadas: as 13 decisoes arquiteturais nao-negociaveis do PRD secao 44 devem estar listadas literalmente
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda: nao se aplica
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Consolidar as entidades da Task 001/002 em `docs/database.md` com relacionamentos explicitos
- Listar em `CLAUDE.md` as decisoes das secoes 44 e as proibicoes da secao 38 do PRD (o que nao replicar do prototipo)

### Nao deve

- Nao copiar o PRD inteiro para dentro desses docs — resumir e referenciar `requirements/001-prd-escopometro-sgsi.md`

## Entradas

- `requirements/001-prd-escopometro-sgsi.md#18, #22, #24, #38, #44, #45`
- Resultado das Tasks 001-006 (entidades e contrato ja definidos)

## Dependencias

- Task 006

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- `docs/modules/sgsi-scope.md`

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho    | Fonte                                                        | Quando | Obrigatorio |
| ---------- | ------------------------------------------------------------ | ------ | ----------- |
| Requisitos | `requirements/001-prd-escopometro-sgsi.md#18,22,24,38,44,45` | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 4 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

docs-only

### Tools permitidas

- read: `requirements/`, `backend/`, `next-js/`, `contracts/`
- edit: `CLAUDE.md`, `docs/**`
- shell: nenhum
- git: local

### Paths permitidos para escrita

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`

### Acoes que exigem human approval

- [ ] nenhuma

### Contexto proibido

- nenhum alem do padrao (secrets, dados de producao)

### Criterios de saida

- [ ] documentos criados e linkados no `tasks/000-index.md` se relevante

## Criterios de conclusao

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md` criados e coerentes com o que foi implementado nas Tasks 001-006

## Validacao esperada

- Revisao humana do conteudo (nao ha lint para markdown neste projeto, salvo `npm run format`)

## Entregaveis esperados

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`

## Riscos ou ambiguidades

- Deve ser atualizado incrementalmente conforme os slices seguintes avancam — nao e um documento estatico

## Status final

planned
