# Task 010 - CLAUDE.md + docs/architecture.md + docs/database.md

## Status

done

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

- [x] documentos criados e linkados no `tasks/000-index.md` se relevante

## Criterios de conclusao

- [x] `CLAUDE.md`, `docs/architecture.md`, `docs/database.md` criados e coerentes com o que foi implementado nas Tasks 001-009 (a task cita 001-006; o backlog ja avancou ate a Task 009 no momento da execucao, entao os tres docs tambem cobrem Tasks 007-009)

## Validacao esperada

- Revisao humana do conteudo (nao ha lint para markdown neste projeto, salvo `npm run format`)

## Entregaveis esperados

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`

## Riscos ou ambiguidades

- Deve ser atualizado incrementalmente conforme os slices seguintes avancam — nao e um documento estatico

## Resultado da execucao

- `CLAUDE.md` (raiz, novo arquivo): lista literalmente as 13 decisoes nao-negociaveis (PRD
  secao 44) e as proibicoes de migracao do prototipo (PRD secao 38), documenta os desvios
  ja tomados entre a stack recomendada pelo PRD (secao 24: Next.js full-stack, Prisma,
  Tailwind, TanStack Query) e a stack real implementada (backend NestJS separado,
  TypeORM, CSS puro + CSS Modules, sem TanStack Query), e resume o padrao de
  multitenancy/autorizacao (404 vs 403, guards por request).
- `docs/architecture.md` (novo): camadas do backend, multitenancy/autorizacao,
  autenticacao/sessao (BFF com cookie httpOnly, Task 008), convencao de `services/*` no
  next-js, e secoes explicitamente marcadas como "planejado" para diagramas, documentos
  gerados, storage e versionamento (decisoes #8-#10 do PRD, ainda nao implementadas —
  Slice 002+).
- `docs/database.md` (reescrito a partir do rascunho da Task 001): formaliza as 7
  entidades ja implementadas (User, Organization, OrganizationMember, Project,
  ProjectMember, ModuleInstance, AuditLog) com colunas, FKs, indices e enums reais
  (conferidos contra o codigo, nao só contra o rascunho), reafirma TypeORM como ORM (nao
  Prisma, ver `## Convencoes`), e lista as ~24 entidades do Escopometro (PRD secao 22)
  como pendentes, a criar incrementalmente pelos Slices 002-006.
- Nenhuma das tres pendencias/ambiguidades ja registradas em Tasks 005/006/007/009 foi
  resolvida aqui — esta task e de consolidacao documental, nao de decisao de produto;
  todas foram apenas centralizadas em `CLAUDE.md`/`docs/architecture.md` para ficarem
  visiveis a qualquer sessao futura.

## Arquivos alterados

- Criado: `CLAUDE.md`
- Criado: `docs/architecture.md`
- Reescrito: `docs/database.md` (existia como rascunho da Task 001)

## Validacoes executadas

- Nao ha lint/build para markdown neste projeto (task `docs-only`); validado por leitura
  cruzada com o codigo real (`backend/src/modules/{organizations,projects}/entities/`,
  `backend/src/common/enums/`, `next-js/src/services/`, `next-js/src/app/api/`) para
  garantir que os documentos refletem o que foi implementado, nao so o que o PRD pede.

## Pendencias pos-task

- `docs/modules/sgsi-scope.md` fica para o inicio do Slice 002 (fora de escopo desta
  task, conforme already definido).
- Os tres documentos precisam de atualizacao incremental a cada task/slice futuro — nao
  sao estaticos.

## Status final

done
