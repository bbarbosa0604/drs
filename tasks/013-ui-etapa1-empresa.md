# Task 013 - UI Etapa 1 Empresa

## Status

done

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}` (dados de empresa + DocumentControl)

## Modo de execucao

single-stack

## Referencia de design system

### Stack de referencia visual

front-end

### Tipo de referencia visual

artefato de design system

### Fonte primaria visual

- `design-system/front/brand/daryus-tokens.md`

### Regra de aderencia visual

- Seguir tokens Daryus (Task 007); nao ha prototipo HTML disponivel (lacuna registrada em `000-index.md`) — layout segue a especificacao textual do PRD secao 8.

## Contexto de negocio

### Por que

E a primeira etapa do fluxo do Escopometro; reaproveita dados da Organizacao e registra controle documental.

### O que

Tela com: dados da organizacao (reaproveitados, editaveis no contexto do escopo sem sobrescrever a Organizacao original), controle documental (classificacao, versao, datas, elaborado/aprovado por), e importacao de referencia JSON com aviso explicito de que dados importados nao definem o escopo automaticamente.

### Comportamento esperado

- cenario: abrir Etapa 1 pela primeira vez -> campos de organizacao pre-preenchidos a partir da Organizacao vinculada.
- cenario: importar JSON de referencia -> exibe banner "informacoes importadas servem apenas como referencia" (PRD secao 8.3), nunca preenche a declaracao de escopo automaticamente.
- cenario: autosave em andamento -> indicador "Salvando.../Salvo/Erro ao salvar" visivel (PRD secao 19).

### Fora de escopo

- Etapa 2 em diante

## Casos de erro e borda

- Import JSON invalido/schemaVersion incompativel -> mensagem de erro clara, nao quebra a tela
- Falha de autosave -> nao perder o que o usuario digitou (manter estado local ate confirmar salvamento)

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: regra de "importacao e so referencia" deve estar visivel na UI, nao so em backend
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Usar React Hook Form + Zod
- Exibir estado de autosave de forma nao-intrusiva (PRD secao 19)

### Nao deve

- Nao deixar o usuario dependente de um botao "Salvar" manual como unico mecanismo (PRD secao 19)

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`
- `requirements/001-prd-escopometro-sgsi.md#8, #19, #31`

## Dependencias

- Task 011, Task 007

## Slice vertical

### Identificador

Slice 002 - Escopometro: Empresa & Contexto

### Arquivo

`tasks/slices/002-escopometro-empresa-contexto.md`

### Fora do slice

- Etapa 2 em diante

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho | Fonte                                        | Quando | Obrigatorio |
| ------- | -------------------------------------------- | ------ | ----------- |
| UI web  | `design-system/front/brand/daryus-tokens.md` | sempre | sim         |
| API     | `contracts/openapi.yaml`                     | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

ui-front

### Tools permitidas

- read: `next-js/`, `design-system/front/`, `contracts/`
- edit: `next-js/src/modules/sgsi-scope/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/modules/sgsi-scope/**`, `next-js/src/app/**`

### Acoes que exigem human approval

- [ ] nenhuma

### Contexto proibido

- `backend/` alem do contrato exposto

### Criterios de saida

- [x] lint/typecheck/build passam

## Criterios de conclusao

- [x] Etapa 1 funcional com reaproveitamento de dados (somente leitura, ver pendencia),
      controle documental (autosave real), import JSON com aviso, autosave visivel

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual do fluxo

## Entregaveis esperados

- Tela/rota da Etapa 1 em `next-js/src/modules/sgsi-scope/`

## Riscos ou ambiguidades

- Ausencia do prototipo HTML pode gerar diferenca de layout em relacao ao que o Bruno espera — revisar com ele ao final desta task
- **Gap de backlog encontrado**: a task pede dados da organizacao "editaveis no contexto
  do escopo sem sobrescrever a Organizacao original", mas nenhuma task de backend
  (011/012) criou uma entidade de sobreposicao por escopo para os campos de "Dados da
  organizacao" (PRD secao 8.1). So existe a Organizacao canonica (Task 002/005). Decisao
  adotada: renderizar esses campos **somente leitura** (referencia), com link para editar
  a Organizacao real, em vez de inventar uma persistencia paralela ou violar a regra de
  "nao sobrescrever". Registrado como pendencia para uma task de backend futura, se o
  Bruno confirmar que a edicao por escopo e realmente necessaria.
- Mesmo gap ja conhecido da Task 009: nao ha endpoint para listar usuarios para um
  Consultor comum, entao "elaborado por" no Controle documental e sempre o usuario
  autenticado (somente leitura), nao um seletor; "aprovado por" fica como texto fixo ate a
  Task 027 (fluxo de aprovacao).

## Resultado da execucao

- Rota `/projects/:id/sgsi-scope` (Server Component): ativa o modulo automaticamente
  (idempotente, Task 011) ao abrir a pagina — nao exige um botao "Ativar" separado —,
  busca o projeto (para achar `organizationId`), a organizacao e o `SgsiScope` em
  paralelo, e renderiza `EtapaEmpresaForm` (client component).
- `EtapaEmpresaForm` (`next-js/src/modules/sgsi-scope/etapa-empresa/`): nav simples com as
  8 etapas (so "Empresa" ativa, as demais so rotulo — Etapas 2-8 ainda nao tem UI); secao
  "Dados da organizacao" somente leitura (ver pendencia); secao "Controle documental" com
  autosave real via `useAutosave` (debounce 800ms) + `AutosaveIndicator`
  (Salvando.../Salvo/Erro ao salvar, PRD secao 19); secao de import JSON.
- `useAutosave` (`modules/sgsi-scope/hooks/useAutosave.ts`): hook generico
  (debounce + estado visual), reutilizavel pelas proximas etapas (Contexto, Requisitos,
  etc.) sem repetir a logica.
- `ImportReferenceJson`: le o arquivo no client, faz `JSON.parse`, mostra o conteudo bruto
  num `<pre>` com o aviso obrigatorio (PRD secao 8.3) — nunca preenche campo algum
  automaticamente. JSON invalido mostra mensagem de erro sem quebrar a tela (`try/catch`
  em volta do `JSON.parse`). Sem backend: nenhuma task ainda expoe um endpoint de
  importacao, entao isso e inteiramente client-side/efemero (nao persiste).
- Autosave chama `PATCH /api/projects/:id/sgsi-scope/document-control` (novo Route
  Handler, mesmo padrao BFF das Tasks 008/009) — o client component nunca acessa o
  backend nem o token diretamente.
- Adicionado link "Abrir Escopometro SGSI" na pagina de edicao de Projeto (Task 009) para
  dar um ponto de entrada real a esta tela.

## Arquivos alterados

- Criados: `next-js/src/services/sgsi-scope/sgsi-scope.service.ts`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/document-control/route.ts`,
  `next-js/src/app/projects/[id]/sgsi-scope/page.tsx`,
  `next-js/src/modules/sgsi-scope/hooks/useAutosave.ts`,
  `next-js/src/modules/sgsi-scope/AutosaveIndicator.tsx` (+css),
  `next-js/src/modules/sgsi-scope/ImportReferenceJson.tsx` (+css),
  `next-js/src/modules/sgsi-scope/etapa-empresa/EtapaEmpresaForm.tsx` (+css).
- Modificado: `next-js/src/app/projects/[id]/page.tsx` (link para o Escopometro).

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run build`: executado com sucesso (17 rotas)
- Teste manual (via `next dev` + browser): confirmado que `/projects/:id/sgsi-scope`
  redireciona para `/login` sem sessao. **Fluxo completo (ativacao real, autosave contra o
  backend, import) nao testado contra backend real** (sem Postgres/backend disponivel
  neste ambiente, mesma limitacao das Tasks 008/009).

## Pendencias pos-task

- Confirmar com o Bruno se "Dados da organizacao" da Etapa 1 realmente precisa de
  sobreposicao editavel por escopo (exigiria uma task de backend nova) ou se somente
  leitura + link para editar a Organizacao e suficiente.
- Testar o fluxo completo (ativacao, autosave, import) contra o backend real apos deploy.
- Revisar o layout com o Bruno — nao ha prototipo HTML desta etapa disponivel.

## Status final

done
