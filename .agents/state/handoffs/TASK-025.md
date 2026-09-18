# Handoff - Task 025

## Identificador da task

Task 025 - UI Etapa 8 Previa & Exportacao

## Slice vertical

Slice 006 - Escopometro: Previa, Documentos & Productizacao — primeira task do slice.

## Status final

done

## Decisoes preservadas

- **Sem endpoint de preview agregado** (gap real do backlog, nao decisao silenciosa):
  a pagina faz `Promise.all` de 8 endpoints ja existentes e so compoe a exibicao — nao
  recalcula regra de dominio nenhuma, so agrupa por classificacao para exibir
  (`classified-items.ts`). Documentado em `docs/architecture.md`.
- Estilo de "relatorio profissional" (borda, sombra, cabecalho com regua navy) so nesta
  pagina — todas as outras Etapas usam o estilo de formulario simples; aqui a task pede
  explicitamente aparencia de documento de consultoria.
- Botoes de geracao de documento chamam endpoints que **ainda nao existem** (Task
  026 cria). Isso foi usado para testar de verdade o caso de erro exigido pela task
  ("falha na geracao -> mensagem clara, nunca spinner infinito") — o 404 e genuino
  hoje, nao simulado.
- **Aprovacao humana obtida antes desta task avancar para a Task 026**: bibliotecas
  `docx` + `pptxgenjs`, storage = adapter de filesystem local por tras de interface
  S3-compativel (sem credenciais reais). Perguntei ao Bruno porque a Security
  Constraints da Task 026 exige aprovacao humana explicita para instalar dependencia
  nova e configurar storage/secrets — nao decidi isso por conta propria.

## Contexto efetivamente usado

- Minimo padrao + `tasks/025-ui-etapa8-previa-exportacao.md`,
  `tasks/slices/006-escopometro-previa-documentos.md`.
- `requirements/001-prd-escopometro-sgsi.md` secoes 15, 17 (conteudo da previa, os 3
  documentos do MVP).
- Servicos existentes (`scope-definition.service.ts`, `scope-engine.service.ts`,
  `limits.service.ts`, `sgsi-scope.service.ts`, `organizations.service.ts`,
  `projects.service.ts`) reaproveitados sem alteracao.

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Escrita em `next-js/src/modules/sgsi-scope/**`
  (+ `app/`, `services/`, mesmo padrao aceito desde a Task 013). **Nao** editei
  `contracts/openapi.yaml` (fora do path desta task — o contrato real de `/documents`
  e da Task 026).

## Arquivos alterados

Ver `tasks/025-ui-etapa8-previa-exportacao.md`, secao "Arquivos alterados".

## Validacoes executadas

- `npm run lint`, `npm run typecheck`, `npm run test` (vitest 9/9), `npm run build` (55
  rotas): OK.
- Manual: redirect para `/login` sem sessao confirmado no browser.

## Pendencias ou bloqueios

- Sem endpoint de preview agregado (ver "Decisoes preservadas").
- Botoes de geracao ainda chamam endpoints que so existirao apos a Task 026 — o
  contrato de `documents.service.ts` e provisorio.
- Testar fluxo completo contra backend com Postgres real.

## Proximo contexto recomendado

Task 026 - `DocumentGenerationService`. Decisoes ja aprovadas pelo Bruno: `docx` +
`pptxgenjs`; storage = filesystem local por tras de interface S3-compativel.
