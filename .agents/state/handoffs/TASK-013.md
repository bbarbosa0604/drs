# Handoff - Task 013

## Identificador da task

Task 013 - UI Etapa 1 Empresa

## Slice vertical

Slice 002 - Escopometro: Empresa & Contexto (`tasks/slices/002-escopometro-empresa-contexto.md`)

## Status final

done

## Decisoes preservadas

- Ativacao do modulo acontece automaticamente ao abrir `/projects/:id/sgsi-scope`
  (idempotente, Task 011) — sem botao "Ativar" manual.
- **"Dados da organizacao" e somente leitura**: a task pedia campos "editaveis no
  contexto do escopo sem sobrescrever a Organizacao original", mas nenhum backend
  (Tasks 011/012) criou uma entidade de sobreposicao por escopo. Em vez de inventar
  persistencia paralela ou violar a regra de nao sobrescrever, os campos sao exibidos
  como referencia com link para `/organizations/:id` (edicao real). Pendente de
  confirmacao com o Bruno se isso e aceitavel ou se precisa de uma task de backend nova.
- "Elaborado por" (Controle documental) e sempre o usuario autenticado, somente leitura
  — mesmo gap da Task 009 (sem endpoint de listagem de usuarios para Consultor). "Aprovado
  por" e texto fixo ate a Task 027.
- Import de JSON de referencia e **inteiramente client-side, sem persistencia** — nao ha
  endpoint de backend para isso; mostra o conteudo bruto com o aviso obrigatorio do PRD
  (nunca preenche campo automaticamente).
- `useAutosave` foi feito generico (hook reutilizavel) de proposito, para as proximas
  etapas (Contexto, Requisitos, etc.) nao reimplementarem debounce/estado visual do zero.

## Contexto efetivamente usado

- Minimo padrao + handoff da Task 012 (mesmo slice) e Task 009 (padrao de formularios/BFF).
- `requirements/001-prd-escopometro-sgsi.md` secoes 8, 19, 31.
- `design-system/front/brand/daryus-tokens.md` (reuso dos tokens da Task 007).

## Compliance de Security Constraints

- Risco baixo / perfil `ui-front`. Nenhuma dependencia nova instalada. Nenhum acesso a
  `backend/` alem do contrato ja exposto.

## Arquivos alterados

- Criados: `services/sgsi-scope/sgsi-scope.service.ts`,
  `app/api/projects/[id]/sgsi-scope/document-control/route.ts`,
  `app/projects/[id]/sgsi-scope/page.tsx`, `modules/sgsi-scope/hooks/useAutosave.ts`,
  `modules/sgsi-scope/AutosaveIndicator.tsx` (+css),
  `modules/sgsi-scope/ImportReferenceJson.tsx` (+css),
  `modules/sgsi-scope/etapa-empresa/EtapaEmpresaForm.tsx` (+css).
- Modificado: `app/projects/[id]/page.tsx` (link de entrada para o Escopometro).

## Validacoes executadas

- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK (17 rotas).
- Manual: redirect `/projects/:id/sgsi-scope` -> `/login` sem sessao confirmado. Fluxo
  completo (ativacao real, autosave, import) nao testado contra backend real.

## Pendencias ou bloqueios

- Confirmar com o Bruno a necessidade real de campos de "Dados da organizacao" editaveis
  por escopo (exigiria nova entidade de backend).
- Testar o fluxo completo apos deploy com backend real.
- Revisar o layout com o Bruno (sem prototipo HTML de referencia para esta etapa).

## Proximo contexto recomendado

Task 014 (UI Etapa 2 - Contexto): reusar `useAutosave`, `AutosaveIndicator` e o padrao de
Route Handler BFF por secao. O backend da Etapa 2 (`OrganizationContext`/`ContextAspect`)
ja existe (Task 012) — so falta a UI.
