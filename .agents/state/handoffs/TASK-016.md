# Handoff - Task 016

## Identificador da task

Task 016 - ScopeDefinition/ScopeCharacteristic/ScopeBenefit + calculo do percentual de preenchimento

## Slice vertical

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo
(`tasks/slices/003-escopometro-requisitos-escopo.md`)

## Status final

done

## Decisoes preservadas

- Lista fechada de 22 checks para o percentual de preenchimento, cobrindo so as Etapas
  1-4 (unicas modeladas ate este slice) — ver `fill-percentage.util.ts`. "Dados da
  organizacao" da Etapa 1 fica fora (referencia reaproveitada, nao dado ativamente
  preenchido no Escopometro); "Direcionadores" da Etapa 2 entram (o PRD pede
  explicitamente). **Nao confirmado com o Bruno** — pendencia registrada.
- `calculateFillPercentage` e uma funcao pura (sem I/O), testada isoladamente; o label
  `"Percentual de preenchimento do Escopometro"` e fixo e nunca varia — testado
  explicitamente para nunca virar conformidade/maturidade/qualidade/prontidao/adequacao
  (regra critica do PRD secao 16).
- `ScopeDefinition` criado sob demanda (lazy) no primeiro autosave, mesma decisao das
  Tasks 012/015. `detailedDescription` reusa `sanitizeRichTextHtml` (Task 012).
- Nenhuma logica de sugestao automatica de escopo foi adicionada (regra critica do PRD
  secao 11) — o service so persiste o que o usuario envia.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 015.
- `requirements/001-prd-escopometro-sgsi.md` secoes 11, 16.
- `common/utils/sanitize-rich-text.util.ts` (Task 012) reaproveitado.

## Compliance de Security Constraints

- Risco medio / perfil `api-back`. Migration/schema de banco — aprovada implicitamente
  seguindo o padrao ja estabelecido nas Tasks 011/012/015 (mesmo fluxo: criar o arquivo,
  rodar no proximo deploy).

## Arquivos alterados

- Criados: `modules/sgsi-scope/scope-definition/entities/{scope-definition,scope-characteristic,scope-benefit}.entity.ts`,
  `modules/sgsi-scope/scope-definition/dto/*.dto.ts`,
  `modules/sgsi-scope/scope-definition/scope-definition.{service,controller}.ts` (+spec),
  `modules/sgsi-scope/scope-definition/fill-percentage.{util,service,controller}.ts`
  (+specs), `modules/sgsi-scope/scope-definition/scope-definition.module.ts`,
  `database/migrations/1700000005000-CreateScopeDefinitionTables.ts`.
- Modificados: `app.module.ts`, `contracts/openapi.yaml` (+6 paths, +6 schemas),
  `docs/database.md` (3 novas entidades + secao do percentual).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK, `npm run test` OK (16
  suites / 64 testes, incluindo 0%/parcial/100% do calculo e agregacao real).
- `contracts/openapi.yaml` validado com `js-yaml` (28 paths, 45 schemas).
- Migration nao executada contra Postgres real neste ambiente.

## Pendencias ou bloqueios

- Rodar a migration no proximo deploy a Hostinger.
- Confirmar com o Bruno a divisao de campos que entram no calculo do percentual.

## Proximo contexto recomendado

Task 017 (UI Etapa 3 - Requisitos & CGSI, frontend) ou proxima task do backlog conforme
`tasks/000-index.md`. O backend do Slice 003 (Tasks 015/016) esta completo; falta so a
UI das Etapas 3 e 4.
