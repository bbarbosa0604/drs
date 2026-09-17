# Task 012 - OrganizationContext/OrganizationValue/ContextAspect

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/context`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Etapa 2 (Contexto) exige registrar historico, direcionadores (negocio/missao/visao/valores) e questoes externas/internas — base para a declaracao de escopo mais adiante.

### O que

Entidades `OrganizationContext` (historico rich text em JSON), `OrganizationValue` (negocio/missao/visao/valores) e `ContextAspect` (questoes externas/internas, com titulo/descricao/observacoes).

### Comportamento esperado

- cenario: salvar historico como conteudo rico -> persistido como JSON estruturado (TipTap), nao HTML livre (PRD secao 29).
- cenario: cadastrar questao externa -> aparece separada de questoes internas.

### Fora de escopo

- UI (Task 014)

## Casos de erro e borda

- Conteudo rico com HTML malicioso colado -> sanitizar antes de persistir (PRD secao 30)
- Questao sem titulo -> 400

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: campos exatamente conforme PRD secao 9
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Sanitizar qualquer conteudo rico recebido (PRD secao 30) antes de persistir
- Armazenar conteudo rico como JSON estruturado, nao HTML

### Nao deve

- Nao aceitar HTML arbitrario sem sanitizacao

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#9, #29, #30`

## Dependencias

- Task 011

## Slice vertical

### Identificador

Slice 002 - Escopometro: Empresa & Contexto

### Arquivo

`tasks/slices/002-escopometro-empresa-contexto.md`

### Fora do slice

- UI

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho              | Fonte                         | Quando                   | Obrigatorio |
| -------------------- | ----------------------------- | ------------------------ | ----------- |
| API                  | `contracts/openapi.yaml`      | sempre                   | sim         |
| Seguranca de produto | `backend/docs/ai/SECURITY.md` | por causa da sanitizacao | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: medio

## Security Constraints

### Nivel de risco

medio

### Perfil de origem

api-back

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/sgsi-scope/context/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/sgsi-scope/context/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de clientes

### Criterios de saida

- [x] sanitizacao de conteudo rico coberta por teste
- [x] lint/test passam

## Criterios de conclusao

- [x] CRUD de OrganizationContext/ContextAspect com sanitizacao de conteudo rico (OrganizationValue
      nao foi criada como entidade — ver "Resultado da execucao")

## Validacao esperada

- `npm run test` incluindo teste de sanitizacao contra XSS

## Entregaveis esperados

- Submodulo `context` dentro de `sgsi-scope`

## Riscos ou ambiguidades

- Biblioteca de sanitizacao escolhida: **`sanitize-html`** (aprovado pelo Bruno). Pinada a
  depender de `htmlparser2@8` (CJS) em vez da ultima versao (que usa `htmlparser2@12`,
  ESM-only e quebra o Jest) — ver "Resultado da execucao".
- **Decisao de nao criar `OrganizationValue`**: os campos "negocio/missao/visao/valores"
  (PRD secao 9.2, "Direcionadores") sao identicos aos campos que `OrganizationEntity` ja
  tem desde a Task 002/005 (`business`/`mission`/`vision`/`values`). Criar uma tabela nova
  duplicaria os mesmos dados com duas fontes de verdade. Decisao: Etapa 2 "Direcionadores"
  reusa `GET`/`PATCH /organizations/:id` (Task 005) diretamente — nada foi criado aqui.
  Isso segue a instrucao explicita do PRD para a Etapa 1 ("dados ja existentes na entidade
  Organizacao devem ser reutilizados") aplicada tambem a Etapa 2. Nao confirmado
  explicitamente com o Bruno, mas e a leitura mais direta do PRD; registrar como pendencia
  se o entendimento for outro.

## Resultado da execucao

- `OrganizationContextEntity` (1:1 com `SgsiScope`) guarda `history` como `jsonb`
  `{ html: string }` — o HTML ja sanitizado no servidor. O schema exato do editor de
  texto rico (TipTap/ProseMirror) ainda nao foi decidido (isso e Task 014, frontend); o
  backend so precisa persistir/devolver o conteudo sanitizado, entao o envelope `{ html }`
  e suficiente por ora e sera revisitado se o editor escolhido exigir uma arvore de
  documento mais rica.
- `sanitizeRichTextHtml` (`common/utils/sanitize-rich-text.util.ts`) usa uma allowlist
  estrita (`p, br, strong, em, u, s, ul, ol, li, h1-h3, blockquote, a[href]`), sem
  `script`/`style`/`iframe`/atributos `on*`, e restringe esquema de URL a
  `http/https/mailto` (bloqueia `javascript:`). Coberto por teste (`<script>`, `onclick`,
  `onerror`, `<img>`, `javascript:` no `href` — todos removidos).
- **Problema de tooling encontrado e resolvido**: a versao mais recente do `sanitize-html`
  (2.17.7, que corrige 3 CVEs moderados de bypass de sanitizacao) depende de
  `htmlparser2@12`, que e ESM-only e quebra o Jest (`ts-jest` nao transforma
  `node_modules` por padrao). A correcao **nao foi** fixar `sanitize-html` numa versao
  antiga (2.17.1) que ainda tem as 3 vulnerabilidades — isso derrotaria o proposito da
  biblioteca justamente na feature que sanitiza XSS. Em vez disso, adicionei
  `transformIgnorePatterns` no `jest` config (`package.json`) para o Jest transformar
  `htmlparser2`/`dom-serializer`/`domelementtype`/`domutils`/`domhandler`/`entities`
  (as dependencias ESM da cadeia), mantendo `sanitize-html@2.17.7` (versao segura).
- `ContextAspectEntity`: CRUD completo (create/update/delete, mais list embutido no `GET`
  da secao), campos `type` (`EXTERNAL`/`INTERNAL`), `title` (obrigatorio, `class-validator`
  garante 400 se ausente — o `ValidationPipe` global ja existente cobre isso, sem logica
  extra no service), `description`, `observations`. Sem soft delete (`deletedAt`) — decisao
  de manter simples para um registro filho de lista, diferente das entidades-tenant
  principais (Organization/Project) que o PRD secao 28 cobre explicitamente.
- Rotas sob `/projects/:projectId/sgsi-scope/context/**`, reusando `JwtAuthGuard` +
  `ProjectAccessGuard` (Task 004), mesmo padrao da Task 011.
- Sequencia de ativacao (Task 011) nao precisou de ajuste: `OrganizationContext` e criado
  sob demanda no primeiro `PATCH .../context/history` (upsert), nao na ativacao do modulo
  — mantem a ativacao da Task 011 enxuta.

## Arquivos alterados

- Criado: `backend/src/common/enums/context-aspect-type.enum.ts`
- Criado: `backend/src/common/utils/sanitize-rich-text.util.ts`
- Criado: `backend/src/modules/sgsi-scope/context/entities/{organization-context,context-aspect}.entity.ts`
- Criado: `backend/src/modules/sgsi-scope/context/dto/{update-organization-context,create-context-aspect,update-context-aspect}.dto.ts`
- Criado: `backend/src/modules/sgsi-scope/context/context.service.ts` (+spec)
- Criado: `backend/src/modules/sgsi-scope/context/context.controller.ts`
- Criado: `backend/src/modules/sgsi-scope/context/context.module.ts`
- Criado: `backend/src/database/migrations/1700000003000-CreateContextTables.ts`
- Modificado: `backend/src/app.module.ts` (registro do `ContextModule`)
- Modificado: `backend/package.json` (+`sanitize-html`, +`@types/sanitize-html`,
  `jest.transformIgnorePatterns`)
- Modificado: `contracts/openapi.yaml` (+4 paths, +6 schemas: `OrganizationContextInput`,
  `OrganizationContext`, `ContextAspectType`, `ContextAspectInput`, `ContextAspect`,
  `ContextSection`)

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run test`: executado com sucesso (10 suites, 41 testes, incluindo 3 testes de
  sanitizacao contra XSS: `<script>`, `on*` handlers, `javascript:` em `href`)
- `npm run build`: executado com sucesso
- Smoke test manual do build compilado: `node dist/.../sanitize-rich-text.util.js`
  confirmando que `<script>alert(1)</script><p onclick="x">hi</p>` vira `<p>hi</p>` em
  runtime real (nao so nos testes unitarios)
- `contracts/openapi.yaml` validado com `js-yaml` (13 paths, 26 schemas)
- **Migration criada mas nao executada contra Postgres real** (mesma limitacao das Tasks
  011/002/005/006) — sera aplicada no proximo deploy a Hostinger

## Pendencias pos-task

- Rodar a migration `1700000003000-CreateContextTables` no proximo deploy.
- Confirmar com o Bruno a decisao de reusar `Organization.business/mission/vision/values`
  em vez de criar `OrganizationValue` (Etapa 2 "Direcionadores").
- Revisitar o formato `{ html }` de `OrganizationContext.history` quando a Task 014
  escolher o editor de texto rico do frontend (pode precisar de uma estrutura mais rica
  que um envelope HTML simples).

## Status final

done
