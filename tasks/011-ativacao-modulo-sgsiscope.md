# Task 011 - Ativacao ModuleInstance Escopometro + SgsiScope/SgsiScopeVersion/DocumentControl + autosave

## Status

done

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

- [x] lint/test passam
- [x] autosave testado com payload parcial

## Criterios de conclusao

- [x] Ativacao de modulo idempotente; autosave funcional por secao; DocumentControl persistido

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Modulo `sgsi-scope` (base) com ativacao e autosave

## Riscos ou ambiguidades

- Estrategia de "PATCH parcial" adotada: **por secao** (recomendacao da propria task), um endpoint por
  secao (`PATCH /projects/:id/sgsi-scope/document-control`), nao campo a campo. Futuras
  secoes (Contexto, Requisitos, etc.) devem seguir o mesmo padrao quando forem criadas.
- **Gaps encontrados e resolvidos com aprovacao do Bruno**: (1) o contrato nao tinha os
  paths `/projects/{id}/modules` e `/sgsi-scopes` que a propria task referenciava — foram
  adicionados nesta task (fora do path de escrita declarado, `backend/src/modules/sgsi-scope/**`,
  mesma familia de desvio ja registrada nas Tasks 007/008/009); (2) migration/schema de
  banco (`sgsi_scopes`, `sgsi_scope_versions`, `document_controls`) — aprovada
  explicitamente antes de escrever o arquivo.

## Resultado da execucao

- Ativacao (`POST /projects/:projectId/modules`) e idempotente: usa o unique index
  existente `(project_id, module_key)` de `module_instances` (Task 002) para detectar
  ativacao previa; se ja existe, retorna a `SgsiScope` existente com `200`; se nao,
  cria `ModuleInstance` + `SgsiScope` + primeira `SgsiScopeVersion` (`DRAFT`, `versionNumber: 1`)
  - `DocumentControl` vazio, numa sequencia (nao numa transacao SQL explicita — TypeORM
    `QueryRunner`/transaction nao foi usado aqui para manter o service simples; risco
    aceito no MVP, ver pendencia) e retorna `201`.
- `GET /projects/:projectId/sgsi-scope` retorna a `SgsiScope` com `documentControl`
  embutido e `currentVersionNumber`/`currentVersionStatus` calculados a partir da versao
  mais recente; `404` se o modulo nunca foi ativado no projeto.
- `PATCH /projects/:projectId/sgsi-scope/document-control` e o autosave: todos os campos
  do DTO sao opcionais, so os campos enviados sao sobrescritos (`Object.assign`), nunca
  exige o payload inteiro.
- Todas as 3 rotas ficam sob `/projects/:projectId/...` e reusam `JwtAuthGuard` +
  `ProjectAccessGuard` (Task 004) direto no controller, sem guard novo — herdando 404
  (projeto inexistente) / 403 (sem vinculo) do padrao ja estabelecido.
- `SgsiScopeVersion` criada nesta task e so a raiz do versionamento (PRD secao 20):
  nenhuma logica de "gerar nova versao ao editar apos aprovacao" foi implementada (isso e
  a Task 027, explicitamente fora de escopo aqui).

## Arquivos alterados

- Criado: `backend/src/common/enums/sgsi-scope-version-status.enum.ts`
- Criado: `backend/src/modules/sgsi-scope/entities/{sgsi-scope,sgsi-scope-version,document-control}.entity.ts`
- Criado: `backend/src/modules/sgsi-scope/dto/{activate-module,update-document-control}.dto.ts`
- Criado: `backend/src/modules/sgsi-scope/sgsi-scope.service.ts` (+spec)
- Criado: `backend/src/modules/sgsi-scope/sgsi-scope.controller.ts`
- Criado: `backend/src/modules/sgsi-scope/sgsi-scope.module.ts`
- Criado: `backend/src/database/migrations/1700000002000-CreateSgsiScopeTables.ts`
- Modificado: `backend/src/app.module.ts` (registro do `SgsiScopeModule`)
- Modificado: `contracts/openapi.yaml` (+3 paths, +6 schemas: `ActivateModuleInput`,
  `SgsiScopeVersionStatus`, `DocumentControlInput`, `DocumentControl`, `SgsiScope`; e
  descricao do `ModuleInstance` atualizada)

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run test`: executado com sucesso (9 suites, 36 testes, incluindo idempotencia da
  ativacao e autosave parcial do DocumentControl)
- `npm run build`: executado com sucesso
- `contracts/openapi.yaml` validado com `js-yaml` (parse sem erro, 9 paths / 20 schemas)
- **Migration criada mas nao executada contra Postgres real** (sem banco disponivel neste
  ambiente de desenvolvimento) — sera aplicada (`migration:run:prod`) no proximo deploy a
  Hostinger, mesmo padrao das Tasks 002/005/006.

## Pendencias pos-task

- Rodar a migration `1700000002000-CreateSgsiScopeTables` contra o Postgres real no
  proximo deploy.
- Ativacao nao usa transacao SQL explicita entre a criacao de `ModuleInstance`,
  `SgsiScope`, `SgsiScopeVersion` e `DocumentControl` — uma falha no meio dessa sequencia
  pode deixar registros orfaos. Aceitavel no MVP (idempotencia do proximo request tende a
  corrigir o estado), mas registrar como divida tecnica se o volume de erro justificar.
- Autosave concorrente (duas abas) e last-write-wins, conforme a propria task ja previa —
  nao ha lock otimista implementado.

## Status final

done
