# Handoff - Task 012

## Identificador da task

Task 012 - OrganizationContext/OrganizationValue/ContextAspect

## Slice vertical

Slice 002 - Escopometro: Empresa & Contexto (`tasks/slices/002-escopometro-empresa-contexto.md`)

## Status final

done

## Decisoes preservadas

- `OrganizationValue` **nao foi criada**: os campos "negocio/missao/visao/valores" (PRD
  secao 9.2) sao identicos aos que `Organization` ja tem desde a Task 002/005. Etapa 2
  "Direcionadores" reusa `GET`/`PATCH /organizations/:id` direto — nao confirmado com o
  Bruno, mas segue a instrucao explicita do PRD de reaproveitar dados ja existentes.
- Sanitizacao: `sanitize-html` (aprovado). **Mantido na versao mais recente e segura
  (2.17.7)**, apesar dela depender de `htmlparser2@12` (ESM, quebra o Jest por padrao) —
  a correcao foi ajustar `jest.transformIgnorePatterns`, **nao** fixar numa versao antiga
  vulneravel (2.17.1 tem 3 CVEs moderados de bypass de sanitizacao que a 2.17.7 corrige).
- `OrganizationContext.history` guarda `{ html: string }` (JSON envelope com HTML
  sanitizado), nao a arvore ProseMirror/TipTap completa — o editor de rich text ainda nao
  foi escolhido (Task 014, frontend). Revisitar se o formato escolhido exigir mais.
- `ContextAspect` sem soft delete — decisao deliberada (registro filho de lista, nao
  entidade-tenant principal).
- `OrganizationContext` e criado sob demanda no primeiro autosave (upsert), nao na
  ativacao do modulo (Task 011) — mantem a ativacao enxuta.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 011.
- `requirements/001-prd-escopometro-sgsi.md` secoes 9, 29, 30.
- `backend/docs/ai/SECURITY.md` (sanitizacao).

## Compliance de Security Constraints

- Risco medio / perfil `api-back`. Duas aprovacoes humanas obtidas: (1) instalar
  `sanitize-html`, (2) migration/schema de banco. Sanitizacao coberta por 3 testes de XSS.

## Arquivos alterados

- Criados: `common/enums/context-aspect-type.enum.ts`, `common/utils/sanitize-rich-text.util.ts`,
  `modules/sgsi-scope/context/entities/{organization-context,context-aspect}.entity.ts`,
  `modules/sgsi-scope/context/dto/*.dto.ts`, `modules/sgsi-scope/context/context.service.ts`
  (+spec), `modules/sgsi-scope/context/context.controller.ts`,
  `modules/sgsi-scope/context/context.module.ts`,
  `database/migrations/1700000003000-CreateContextTables.ts`.
- Modificados: `app.module.ts`, `package.json` (+dep, +`jest.transformIgnorePatterns`),
  `contracts/openapi.yaml` (+4 paths, +6 schemas), `docs/database.md` (novas entidades).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK, `npm run test` OK (10
  suites / 41 testes, incluindo 3 testes de sanitizacao XSS).
- Smoke test manual do build compilado (`node dist/.../sanitize-rich-text.util.js`).
- `contracts/openapi.yaml` validado com `js-yaml`.
- Migration nao executada contra banco real neste ambiente.

## Pendencias ou bloqueios

- Rodar a migration no proximo deploy a Hostinger.
- Confirmar com o Bruno a decisao de nao criar `OrganizationValue`.
- Revisitar o formato de `OrganizationContext.history` quando a Task 014 escolher o
  editor de rich text do frontend.

## Proximo contexto recomendado

Task 013 (UI Etapa 1 - Empresa, frontend) ou Task 015/016 (Requisitos & CGSI, backend,
dependendo da ordem escolhida) — verificar `tasks/000-index.md` para a proxima task na
sequencia do Slice 002. Reusar o padrao desta task (submodulo dentro de `sgsi-scope`,
rotas por secao, `ProjectAccessGuard`) para as proximas entidades do Escopometro.
