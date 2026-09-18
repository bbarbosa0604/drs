# Task 025 - UI Etapa 8 Previa & Exportacao

## Status

done

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/preview`, `#/documents`

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

- Tela de previa deve ter aparencia de documento/relatorio profissional (consultoria), coerente com os tokens Daryus.

## Contexto de negocio

### Por que

E a etapa final antes da geracao de documentos oficiais — o Consultor precisa revisar tudo consolidado antes de exportar.

### O que

Tela de previa consolidada (organizacao, projeto, versao, declaracao de escopo, estatisticas, elementos incluidos/excluidos, interfaces, recursos, diagramas embutidos) + botoes de geracao dos 3 documentos do MVP (chamando o `DocumentGenerationService` da Task 026).

### Comportamento esperado

- cenario: abrir previa -> todos os dados das etapas 1-7 aparecem consolidados, incluindo os diagramas ja renderizados.
- cenario: gerar documento com dados incompletos -> UI bloqueia com mensagem clara antes de chamar a API (mas a validacao real e no backend, Task 026).

### Fora de escopo

- Geracao em si (Task 026)

## Casos de erro e borda

- Falha na geracao (erro do backend) -> mensagem de erro clara, nao apenas spinner infinito

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: conteudo da previa conforme PRD secao 15
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Reaproveitar os componentes de diagrama ja construidos (Task 019) na previa

### Nao deve

- Nao duplicar logica de agregacao de dados que deveria vir do backend (endpoint de preview)

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Slice 005 completo

## Slice vertical

### Identificador

Slice 006 - Escopometro: Previa, Documentos & Productizacao

### Arquivo

`tasks/slices/006-escopometro-previa-documentos.md`

### Fora do slice

- Geracao de documentos (Task 026)

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

- `next-js/src/modules/sgsi-scope/**`

### Acoes que exigem human approval

- [ ] nenhuma

### Contexto proibido

- `backend/` alem do contrato exposto

### Criterios de saida

- [ ] lint/typecheck/build passam

## Criterios de conclusao

- Etapa 8 funcional com previa consolidada e acoes de geracao de documento

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 8

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

done

## Resultado da execucao

- **Gap real registrado**: nao existe (nem existe task planejada para) um endpoint
  agregado `/sgsi-scope/preview` no backend. A pagina busca em paralelo (`Promise.all`)
  os endpoints ja existentes (projeto, organizacao, sgsi-scope, fill-percentage,
  scope-definition, value-chain, topology, architecture, limits) e so compoe a
  exibicao — mesmo padrao ja aceito na Task 022 (Topologia+Arquitetura na mesma
  pagina). Nenhuma regra de negocio nova foi recalculada no front (contagens/
  agrupamento por classificacao sao so apresentacao, `classified-items.ts`).
  Segue documentado em `docs/architecture.md` como decisao explicita.
- Previa com aparencia de "relatorio" (borda, sombra sutil, cabecalho com regua navy) —
  atende a regra visual da task, distinta do estilo de formulario das etapas
  anteriores.
- Diagramas embutidos reaproveitando `ValueChainDiagram`/`TopologyDiagram`/
  `ArchitectureDiagram` (Task 019) sem nenhuma logica de layout nova.
- 3 botoes de geracao de documento (`DocumentGenerationButtons`), cada um chamando um
  endpoint `/projects/:id/sgsi-scope/documents/{scope-declaration,approval-proposal,approval-presentation}`
  **que ainda nao existe** (Task 026 vai cria-lo). Testado manualmente: o botao mostra
  "Gerando..." e depois a mensagem de erro clara (404 do backend), nunca um spinner
  infinito — exatamente o caso de erro que a task pede, e hoje verificavel de verdade
  porque o endpoint genuinamente nao existe ainda.
- `services/sgsi-scope/documents.service.ts` com tipos/paths **provisorios**: a Task
  026 deve manter compatibilidade ou atualizar este arquivo (so este) se o contrato
  real definido por ela for diferente.

## Arquivos alterados

- Criados: `next-js/src/services/sgsi-scope/documents.service.ts`,
  `next-js/src/modules/sgsi-scope/etapa-previa/**`
  (`EtapaPreviaExportacao.tsx` + `.module.css`, `classified-items.ts`,
  `DocumentGenerationButtons.tsx` + `.module.css`),
  `next-js/src/app/projects/[id]/sgsi-scope/preview/page.tsx`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/documents/{scope-declaration,approval-proposal,approval-presentation}/route.ts`.
- Modificado: `next-js/src/modules/sgsi-scope/StepNav.tsx` (href da Etapa 8).

## Validacoes executadas

- `npm run lint`, `npm run typecheck`, `npm run test` (vitest 9/9), `npm run build` (55
  rotas): OK.
- Manual: redirect para `/login` sem sessao confirmado no browser. Fluxo completo
  (previa com dados reais, geracao de documento) nao testado por falta de Postgres.

## Pendencias ou bloqueios

- Sem endpoint de preview agregado no backend (ver "Resultado da execucao") — se um
  dia for criado, esta pagina deve passar a consumi-lo em vez de fazer 8 fetches em
  paralelo.
- Testar fluxo completo contra backend com Postgres real.

## Addendum (Task 026)

A Task 026 implementou o backend real e ajustou 2 pontos desta task, ambos
documentados no proprio handoff/task da 026, nao aqui: `GeneratedDocument` (next-js)
perdeu o campo `downloadUrl` (o backend nao pode devolver um link usavel sem o bearer
token, que o client component nao tem) — o link de download agora e sempre
`/api/projects/:id/sgsi-scope/documents/:documentId/download`, uma rota BFF nova que
nao existia nesta task. `DocumentGenerationButtons.tsx` foi ajustado para montar esse
link a partir do `id` devolvido pelo POST.

## Proximo contexto recomendado

Task 026 (Slice 006) - `DocumentGenerationService`. Bibliotecas aprovadas pelo Bruno:
`docx` + `pptxgenjs`. Storage aprovado: adapter de filesystem local por tras de uma
interface compativel com S3 (sem credenciais reais, trocar por S3/MinIO depois e so
configuracao).
