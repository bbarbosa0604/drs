# Handoff - Task 026

## Identificador da task

Task 026 - DocumentGenerationService (DOCX/PPTX) + storage S3-compatible

## Slice vertical

Slice 006 - Escopometro: Previa, Documentos & Productizacao — segunda task do slice.

## Status final

done

## Decisoes preservadas

- **Aprovacao humana obtida antes de executar** (a Security Constraints da task exige
  isso para dependencia nova e storage/secrets): bibliotecas `docx` + `pptxgenjs`;
  storage = `LocalFilesystemStorageAdapter` atras de uma interface compativel com S3.
  Perguntei ao Bruno diretamente (via AskUserQuestion) antes de tocar em
  `package.json` ou criar qualquer arquivo — nao decidi isso por conta propria.
- Templates isolados (`templates/*.template.ts`) recebem so um `DocumentContext`
  (dados ja agregados pelo service) — nunca repository/entity direto. Evoluir o
  layout do documento e trocar o arquivo do template, sem tocar no service.
- `GeneratedDocumentEntity` so e persistida **depois** do `storage.putObject`
  resolver — nunca marca "gerado" se o upload falhar (PRD - Task 026, casos de erro).
- Download exige proxy autenticado: o backend usa bearer token (nunca chega ao bundle
  do client), entao um `<a href>` direto para o backend nunca funcionaria. Criei a
  rota BFF `/api/projects/:id/sgsi-scope/documents/:documentId/download` no next-js
  (fora do escopo original da Task 025) e ajustei `documents.service.ts` /
  `DocumentGenerationButtons.tsx` para nao depender mais de um `downloadUrl` vindo do
  backend.
- Teste do PPTX mocka `renderApprovalPresentationPptx`: `pptxgenjs` usa `import()`
  dinamico internamente mesmo sem midia nos slides, o que quebra sob ts-jest sem
  `--experimental-vm-modules` — limitacao do ambiente de teste, nao bug de producao
  (a API roda em Node puro). Comprovei isso gerando os 3 documentos de verdade via
  script Node contra o `dist/` compilado (fora do Jest): assinatura ZIP valida e
  conteudo esperado dentro do XML de cada arquivo.

## Contexto efetivamente usado

- Minimo padrao + `tasks/026-document-generation-service.md`,
  `tasks/slices/006-escopometro-previa-documentos.md`, handoff da Task 025 (contrato
  provisorio que a UI ja esperava).
- `requirements/001-prd-escopometro-sgsi.md` secao 17 (os 3 documentos, nomes de
  metodo sugeridos, "nao acoplar templates a UI").
- `backend/docs/ai/SECURITY.md` (upload de arquivo) — obrigatorio pela task.
- Padrao de codigo: `scope-definition.service.ts`/`limits.service.ts` como referencia
  de `resolveSgsiScopeId` e busca 1:1.

## Compliance de Security Constraints

- Risco alto / perfil `infra-risk`. Escrita em
  `backend/src/modules/document-generation/**` conforme o path nominal, **mais**
  desvios documentados: `common/enums/generated-document-kind.enum.ts` (mesma
  convencao das Tasks 012/020), `app.module.ts` (wiring obrigatorio),
  `.gitignore` da raiz (+`backend/storage/`, necessario para nao commitar documento
  gerado), e os 2 arquivos no next-js (`documents.service.ts`,
  `DocumentGenerationButtons.tsx`) + 1 rota BFF nova — necessarios porque o contrato
  provisorio da Task 025 previa um `downloadUrl` que o backend real nao pode fornecer
  com seguranca (ver "Decisoes preservadas").
- **Instalar dependencia nova** e **configurar storage** exigiam aprovacao humana —
  obtida explicitamente antes de qualquer `npm install` ou criacao de arquivo (ver
  secao dedicada no `tasks/026-document-generation-service.md`).
- Nenhuma credencial real de storage/producao usada ou solicitada.

## Arquivos alterados

Ver `tasks/026-document-generation-service.md`, secao "Arquivos alterados".

## Validacoes executadas

- `npm run test` (backend): 21 suites / 86 testes.
- `npm run lint` (backend, `--fix`), `npm run build` (`nest build`).
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` (next-js).
- `contracts/openapi.yaml`: parse OK (56 paths, 76 schemas).
- Manual (fora do Jest): os 3 documentos gerados de verdade, assinatura ZIP valida,
  conteudo confirmado via `unzip -p` + `grep`.

## Pendencias ou bloqueios

- Migration nao executada contra Postgres real (aprovacao humana necessaria).
- Sem teste de integracao HTTP end-to-end (guard+controller+service reais).
- `npm audit` reporta vulnerabilidades na arvore apos instalar as libs novas — nao
  investigado a fundo, revisar antes de deploy real.

## Proximo contexto recomendado

Task 027 (ultima do backlog atual) - `AuditLog` + versionamento `SgsiScopeVersion`
(protecao contra sobrescrita de versao aprovada).
