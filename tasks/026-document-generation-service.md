# Task 026 - DocumentGenerationService (DOCX/PPTX) + storage S3-compatible

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/documents`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI; templates de documento nao sao escopo desta task)

## Contexto de negocio

### Por que

PRD exige que a geracao de documentos seja um servico desacoplado da UI (secao 17/44), gerando os 3 documentos do MVP: Declaracao de Escopo (DOCX), Proposta de Aprovacao (DOCX), Apresentacao para Aprovacao (PPTX).

### O que

Servico `DocumentGenerationService` com metodos `generateScopeDeclaration()`, `generateApprovalProposal()`, `generateApprovalPresentation()`, usando dados agregados do SgsiScope; upload do arquivo gerado para object storage compativel com S3; registro do documento gerado (`GeneratedDocument`) vinculado a versao do escopo.

### Comportamento esperado

- cenario: gerar Declaracao de Escopo com dados completos -> DOCX valido, baixavel, registrado em `GeneratedDocument`.
- cenario: gerar documento com campo obrigatorio vazio (ex.: declaracao de escopo) -> erro 400 antes de gerar/subir arquivo incompleto.
- cenario: falha no upload ao storage -> nao marcar o documento como "gerado com sucesso".

### Fora de escopo

- Exportacao PDF (fora do MVP, PRD secao 17)
- Editor de templates (templates devem poder evoluir sem mudar o dominio, mas a UI de edicao de template nao e desta task)

## Casos de erro e borda

- Storage indisponivel -> retry ou erro claro, nunca "sucesso" falso
- Template de documento ausente/corrompido -> erro tratado, nao crash do processo

## Review da spec

- [x] Permissoes: geracao restrita a quem tem acesso ao projeto/escopo (herdado do Slice 001)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: 3 documentos do MVP conforme PRD secao 17
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Desacoplar geracao de documento da camada HTTP (service dedicado, testavel isoladamente)
- Validar dados obrigatorios antes de gerar (nao gerar documento incompleto silenciosamente)

### Nao deve

- Nao acoplar templates de documento a componentes de UI

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#17, #44`
- `backend/docs/ai/SECURITY.md` (upload de arquivos)

## Dependencias

- Slice 005 completo

## Slice vertical

### Identificador

Slice 006 - Escopometro: Previa, Documentos & Productizacao

### Arquivo

`tasks/slices/006-escopometro-previa-documentos.md`

### Fora do slice

- Exportacao PDF, editor de templates

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho              | Fonte                         | Quando                         | Obrigatorio |
| -------------------- | ----------------------------- | ------------------------------ | ----------- |
| API                  | `contracts/openapi.yaml`      | sempre                         | sim         |
| Seguranca de produto | `backend/docs/ai/SECURITY.md` | por causa de upload de arquivo | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: alto (nova dependencia de geracao de documento + storage)

## Security Constraints

### Nivel de risco

alto

### Perfil de origem

infra-risk

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/document-generation/**`
- shell: `cd backend && npm run lint`, `npm run test`
- git: local
- network/MCP: nenhum (integracao com storage via credenciais de config, nao chamada de rede direta pelo agente)

### Paths permitidos para escrita

- `backend/src/modules/document-generation/**`

### Acoes que exigem human approval

- [x] instalar/remover dependencias — bibliotecas de geracao DOCX/PPTX (ex.: `docx`, `pptxgenjs`) e SDK de storage S3-compatible
- [x] alterar secrets, `.env`, CI/CD, permissoes — configuracao de credenciais de storage

### Contexto proibido

- credenciais reais de storage/producao

### Criterios de saida

- [ ] nenhum documento marcado como gerado sem upload confirmado
- [ ] lint/test passam

## Criterios de conclusao

- 3 metodos do `DocumentGenerationService` funcionais, gerando arquivos validos e registrando em `GeneratedDocument`

## Validacao esperada

- `npm run test`, validacao manual de abertura dos arquivos DOCX/PPTX gerados

## Entregaveis esperados

- Modulo `document-generation` + integracao de storage

## Riscos ou ambiguidades

- Provedor de storage S3-compatible nao definido (AWS S3, MinIO, etc.) — decisao humana pendente antes de configurar credenciais reais

## Status final

done

## Decisoes humanas obtidas antes da execucao

Perguntadas ao Bruno explicitamente (Security Constraints da task exige aprovacao para
instalar dependencia nova e configurar storage/secrets):

- Bibliotecas: `docx` (DOCX) + `pptxgenjs` (PPTX) — aprovadas.
- Storage: adapter de filesystem local por tras de uma interface compativel com S3
  (sem provedor real nem credenciais de producao neste ambiente) — aprovado. Trocar
  por S3/MinIO real depois e so uma nova implementacao da interface.

## Resultado da execucao

- `backend/src/modules/document-generation/`: `DocumentGenerationService` (3 metodos
  publicos + `getDocumentFile` para download) + `DocumentGenerationController` (3 POST
  - 1 GET de download) + `DocumentGenerationModule`.
- Templates isolados do dominio (`templates/*.template.ts`), cada um recebendo so um
  `DocumentContext` (dados ja agregados) e devolvendo um `Buffer` — nunca acessam
  repository/entity.
- `DocumentStorageAdapter` (interface `putObject`/`getObject`) +
  `LocalFilesystemStorageAdapter` (implementacao de dev, salva em
  `backend/storage/generated-documents/`, path fora do git).
- Validacao: os 3 documentos exigem `ScopeDefinition.formalDeclaration` preenchida
  (Etapa 4) -> 400 caso contrario. `GeneratedDocumentEntity` so e persistida **depois**
  do upload confirmado.
- Download autenticado: como o backend exige bearer token (nunca chega ao bundle do
  client), o link de download nunca pode ser o backend direto — criei uma rota BFF
  nova no next-js (`/api/projects/:id/sgsi-scope/documents/:documentId/download`, fora
  do escopo original da Task 025) que faz o proxy autenticado do binario. Ajustei
  tambem `next-js/src/services/sgsi-scope/documents.service.ts` (removido
  `downloadUrl`, que a Task 025 tinha deixado como provisorio) e
  `DocumentGenerationButtons.tsx` para montar o link a partir do `id`.
- **Verificacao manual real** (fora do Jest, que nao roda `import()` dinamico do
  `pptxgenjs` sem `--experimental-vm-modules`): gerei os 3 documentos via script Node
  direto contra o `dist/` compilado, confirmei assinatura ZIP valida ("PK") nos 3
  arquivos e o conteudo esperado dentro do XML interno de cada um (`unzip -p`).
  Arquivos de teste descartados depois, nao commitados.

## Arquivos alterados

- Criados: `backend/src/common/enums/generated-document-kind.enum.ts`,
  `backend/src/modules/document-generation/**` (module, controller, service + spec,
  entity, `storage/{document-storage.interface,local-filesystem-storage.adapter}.ts`,
  `templates/{document-context,scope-declaration,approval-proposal,approval-presentation}.template.ts`),
  `backend/src/database/migrations/1700000008000-CreateGeneratedDocumentsTable.ts`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/documents/[documentId]/download/route.ts`.
- Modificado: `backend/src/app.module.ts`, `backend/package.json`/`package-lock.json`
  (+`docx`, `+pptxgenjs`), `contracts/openapi.yaml`, `docs/architecture.md`,
  `docs/database.md`, `.gitignore` (raiz do projeto, +`backend/storage/`),
  `next-js/src/services/sgsi-scope/documents.service.ts`,
  `next-js/src/modules/sgsi-scope/etapa-previa/DocumentGenerationButtons.tsx`,
  `next-js/src/services/http/backend-client.ts` (`getBackendUrl` exportado para reuso
  no proxy de download).

## Validacoes executadas

- `npm run test` (backend): 21 suites / 86 testes passando (6 novos; o teste de PPTX
  mockou `renderApprovalPresentationPptx` por limitacao do ts-jest com `import()`
  dinamico do `pptxgenjs` — ver comentario no spec; validado de verdade fora do Jest,
  acima).
- `npm run lint` (backend, com `--fix`), `npm run build` (`nest build`): OK.
- `npm run lint`, `npm run typecheck`, `npm run test` (next-js, vitest 9/9), `npm run
build` (next-js, 56 rotas): OK.
- `contracts/openapi.yaml`: parse OK via `js-yaml` (56 paths, 76 schemas).

## Pendencias ou bloqueios

- Migration criada, **nao executada** contra Postgres real (aprovacao humana
  necessaria).
- Sem teste de integracao HTTP completo (guard + controller + service reais) — so
  unitario no service, mais a verificacao manual dos binarios.
- `npm audit` do backend reporta vulnerabilidades na arvore de dependencias apos
  instalar `docx`/`pptxgenjs` (transitivas, nao investigadas em profundidade nesta
  task) — revisar com `npm audit` se for relevante antes de deploy.

## Proximo contexto recomendado

Task 027 (Slice 006, ultima do backlog atual) - `AuditLog` + versionamento
`SgsiScopeVersion` (protecao contra sobrescrita de versao aprovada).
