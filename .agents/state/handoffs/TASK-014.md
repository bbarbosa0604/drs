# Handoff - Task 014

## Identificador da task

Task 014 - UI Etapa 2 Contexto

## Slice vertical

Slice 002 - Escopometro: Empresa & Contexto (`tasks/slices/002-escopometro-empresa-contexto.md`)

## Status final

done

## Decisoes preservadas

- **TipTap** (aprovado) para o editor de historico. Configurado sem `codeBlock`,
  `code` inline ou `horizontalRule` — allowlist do toolbar espelha o que o backend
  (`sanitizeRichTextHtml`, Task 012) realmente aceita, para o usuario nao formatar algo
  que desaparece ao salvar.
- Formato de transporte continua `{ html: string }` (decisao ja tomada na Task 012) — o
  TipTap resolve a exigencia do PRD de "nao usar `document.execCommand`" internamente
  (documento estruturado ProseMirror), mesmo persistindo como HTML no backend.
- "Direcionadores" reusa o `PATCH /api/organizations/:id` inteiro (Task 009) em vez de um
  endpoint parcial proprio — o DTO de Organizacao exige `name`, entao o autosave sempre
  envia o objeto completo (ja em memoria), so o campo editado muda de fato.
- Questoes externas/internas: so create/delete implementados (sem edicao inline) — nao
  pedido explicitamente pela spec, mantendo escopo minimo.
- `StepNav` extraido para componente compartilhado (Task 013 tinha os passos inline);
  agora Etapas 1 e 2 sao navegaveis livremente entre si (PRD secao 7).

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 013.
- `requirements/001-prd-escopometro-sgsi.md` secoes 9, 29.
- `backend/src/common/utils/sanitize-rich-text.util.ts` (Task 012) para alinhar a
  allowlist do editor com a allowlist de sanitizacao do servidor.

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Dependencia nova (TipTap) instalada com aprovacao
  explicita. Conteudo rico sempre sanitizado no servidor antes de persistir (Task 012);
  o client so restringe o toolbar, nao substitui a sanitizacao real.

## Arquivos alterados

- Criados: `services/sgsi-scope/context.service.ts`,
  `app/api/projects/[id]/sgsi-scope/context/{history,aspects,aspects/[aspectId]}/route.ts`,
  `app/projects/[id]/sgsi-scope/context/page.tsx`, `modules/sgsi-scope/StepNav.tsx`,
  `modules/sgsi-scope/RichTextEditor.tsx` (+css),
  `modules/sgsi-scope/etapa-contexto/{EtapaContextoForm,AspectList}.tsx` (+css).
- Modificados: `modules/sgsi-scope/etapa-empresa/EtapaEmpresaForm.tsx` (usa `StepNav`),
  `package.json`/`package-lock.json` (TipTap).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK (20 rotas).
- Manual: redirect `/projects/:id/sgsi-scope/context` -> `/login` sem sessao confirmado.
  Editor/autosave/CRUD nao testados contra backend real.

## Pendencias ou bloqueios

- Testar o fluxo completo contra o backend real apos deploy.
- Avaliar se vale a pena um endpoint de PATCH parcial proprio para Direcionadores.
- Edicao inline de questoes existentes ainda nao implementada.

## Proximo contexto recomendado

Task 015 (Stakeholders/Requisitos & CGSI, backend — Etapa 3): mesmo padrao de submodulo
dentro de `sgsi-scope` (Task 011/012) e reuso de `ProjectAccessGuard`.
