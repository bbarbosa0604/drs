# Task 016 - ScopeDefinition/ScopeCharacteristic/ScopeBenefit + calculo do percentual de preenchimento

## Status

done

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

- [x] teste unitario do calculo de percentual cobre casos de borda (0%, parcial, completo)
- [x] lint/test passam

## Criterios de conclusao

- [x] CRUD de ScopeDefinition/ScopeCharacteristic/ScopeBenefit; endpoint de percentual funcional e testado

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Submodulo `scope-definition` dentro de `sgsi-scope`

## Riscos ou ambiguidades

- **Lista fechada definida** (22 checks, ver `fill-percentage.util.ts`): cobre so as
  Etapas 1-4 (unicas modeladas ate este slice). "Dados da organizacao" da Etapa 1
  (nome/segmento/etc.) ficam **fora** do calculo por serem referencia reaproveitada da
  Organizacao (Task 013), nao dado preenchido no fluxo do Escopometro; "Direcionadores"
  da Etapa 2 (negocio/missao/visao/valores) **entram**, porque o PRD os lista como parte
  ativa do que a Etapa 2 pede ao usuario, mesmo armazenados na Organizacao. Esta divisao
  nao foi confirmada explicitamente com o Bruno — registrar como pendencia se o
  entendimento for outro.

## Resultado da execucao

- `calculateFillPercentage` (`fill-percentage.util.ts`) e uma funcao pura: recebe um
  objeto de 22 booleans e devolve `{ label, percentage, totalChecks, passedChecks }`.
  `label` e sempre o texto fixo "Percentual de preenchimento do Escopometro" — testado
  explicitamente que a resposta nunca inclui outro campo/rotulo (PRD secao 16).
  `FillPercentageService` so agrega dados reais (Organization, DocumentControl,
  OrganizationContext, ContextAspect, Stakeholder, ProjectRequirement,
  GovernanceCommittee/Member, ScopeDefinition, ScopeCharacteristic, ScopeBenefit) em
  paralelo e monta o objeto de checks — toda a logica de calculo fica isolada e testavel
  sem banco.
- `ScopeDefinitionEntity` criado sob demanda no primeiro autosave (mesmo padrao de
  `OrganizationContext`/`GovernanceCommittee`, Tasks 012/015); `detailedDescription`
  reusa `sanitizeRichTextHtml` (Task 012) — mesma allowlist, mesma protecao XSS.
  `ScopeCharacteristic`/`ScopeBenefit` sao CRUD simples (create/update/delete), sem soft
  delete, mesma decisao ja tomada para `ContextAspect` (Task 012).
- Nenhuma logica de sugestao/preenchimento automatico do escopo foi adicionada — o
  service so persiste o que o usuario envia, nunca deriva ou completa
  `formalDeclaration`/`executiveJustification`/`detailedDescription` (regra critica do
  PRD secao 11).
- Todas as rotas reusam `JwtAuthGuard` + `ProjectAccessGuard` (Task 004), mesmo padrao
  das demais secoes do Escopometro.

## Arquivos alterados

- Criado: `backend/src/modules/sgsi-scope/scope-definition/entities/{scope-definition,scope-characteristic,scope-benefit}.entity.ts`
- Criado: `backend/src/modules/sgsi-scope/scope-definition/dto/{update-scope-definition,scope-list-item}.dto.ts`
- Criado: `backend/src/modules/sgsi-scope/scope-definition/scope-definition.service.ts` (+spec)
- Criado: `backend/src/modules/sgsi-scope/scope-definition/scope-definition.controller.ts`
- Criado: `backend/src/modules/sgsi-scope/scope-definition/fill-percentage.util.ts` (+spec)
- Criado: `backend/src/modules/sgsi-scope/scope-definition/fill-percentage.service.ts` (+spec)
- Criado: `backend/src/modules/sgsi-scope/scope-definition/fill-percentage.controller.ts`
- Criado: `backend/src/modules/sgsi-scope/scope-definition/scope-definition.module.ts`
- Criado: `backend/src/database/migrations/1700000005000-CreateScopeDefinitionTables.ts`
- Modificado: `backend/src/app.module.ts` (registro do `ScopeDefinitionModule`)
- Modificado: `contracts/openapi.yaml` (+6 paths, +6 schemas)
- Modificado: `docs/database.md` (3 novas entidades + secao do percentual)

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run test`: executado com sucesso (16 suites, 64 testes, incluindo 0%/parcial/100%
  do calculo de percentual, garantia de que o label nunca muda, sanitizacao XSS da
  descricao detalhada, e agregacao correta no `FillPercentageService`)
- `npm run build`: executado com sucesso
- `contracts/openapi.yaml` validado com `js-yaml` (28 paths, 45 schemas)
- **Migration criada mas nao executada contra Postgres real** (mesma limitacao das Tasks
  002/005/006/011/012/015) — sera aplicada no proximo deploy a Hostinger

## Pendencias pos-task

- Rodar a migration no proximo deploy a Hostinger.
- Confirmar com o Bruno a divisao "Direcionadores entram, Dados da organizacao nao" no
  calculo do percentual.

## Status final

done
