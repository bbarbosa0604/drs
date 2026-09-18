# Task 019 - Camada de diagramas independente (ValueChainDiagram, TopologyDiagram, ArchitectureDiagram)

## Status

done

## Tipo

shared

## Stacks envolvidos

- next-js
- backend (contrato de dados que alimenta os diagramas)

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/value-chain`, `#/topology`, `#/architecture` (formato de dados que os diagramas consomem)

## Modo de execucao

cross-stack

## Referencia de design system

### Stack de referencia visual

front-end

### Tipo de referencia visual

artefato de design system

### Fonte primaria visual

- `design-system/front/brand/daryus-tokens.md`

### Regra de aderencia visual

- Cores de classificacao de escopo mapeadas nos tokens Daryus: grafite (dentro do escopo) -> `--color-brand-navy` ou tom escuro neutro; cinza claro (fora do escopo) -> tom neutro claro; contorno laranja (interface) -> `--color-brand-primary` (PRD secao 12).

## Contexto de negocio

### Por que

PRD exige que o dominio "nunca dependa diretamente de SVG" (secoes 12, 37) — os diagramas devem ser derivados de dados estruturados, com a tecnologia de renderizacao substituivel.

### O que

Definir a interface/contrato de dados comum (nos, arestas/conexoes, classificacao de escopo) e as 3 implementacoes de renderizacao (`ValueChainDiagram`, `TopologyDiagram`, `ArchitectureDiagram`) como modulos puros: recebem dados estruturados, calculam layout, renderizam (SVG como escolha inicial de tecnologia, mas isolada).

### Comportamento esperado

- cenario: dados de cadeia de valor mudam -> diagrama re-renderiza automaticamente, sem intervencao manual de layout.
- cenario: trocar a tecnologia de renderizacao (SVG -> Canvas) no futuro -> nao deveria exigir mudar o modelo de dados.

### Fora de escopo

- Entidades de dados (Task 020)
- UI das etapas 5/6 que consomem essa camada (Tasks 021/022)

## Casos de erro e borda

- Dados incompletos (no sem tipo, conexao para no inexistente) -> a camada de diagrama deve tratar graciosamente (omitir ou marcar como invalido), nao quebrar a renderizacao inteira

## Review da spec

- [x] Permissoes: nao se aplica (camada tecnica pura)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: abstracao obrigatoria dados->layout->render (PRD secoes 12, 37, 44)
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Definir tipos TypeScript compartilhados para o formato de dados de diagrama (nos, arestas, classificacao)
- Isolar a logica de layout/render em modulos proprios, testaveis sem DOM quando possivel

### Nao deve

- Nao acoplar a logica de classificacao de escopo a detalhes de SVG

## Entradas

- `requirements/001-prd-escopometro-sgsi.md#12, #13, #37, #44`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Slice 003 completo

## Slice vertical

### Identificador

Slice 004 - Escopometro: Scope Engine

### Arquivo

`tasks/slices/004-escopometro-scope-engine.md`

### Fora do slice

- Entidades e UI (Tasks 020-022)

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho   | Fonte                                        | Quando | Obrigatorio |
| --------- | -------------------------------------------- | ------ | ----------- |
| UI web    | `design-system/front/brand/daryus-tokens.md` | sempre | sim         |
| Front-end | `next-js/docs/ai/`                           | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: medio (cross-stack) — se o desenho de dados exigir muita ida-e-volta com o backend, considerar dividir em 2 tasks (contrato + render)

## Security Constraints

### Nivel de risco

baixo

### Perfil de origem

cross-stack

### Tools permitidas

- read: `next-js/`, `backend/` (so os schemas relevantes), `contracts/`, `design-system/front/`
- edit: `next-js/src/modules/sgsi-scope/diagrams/**`
- shell: `cd next-js && npm run lint`, `npm run typecheck`, `npm run build`
- git: local

### Paths permitidos para escrita

- `next-js/src/modules/sgsi-scope/diagrams/**`

### Acoes que exigem human approval

- [ ] nenhuma

### Contexto proibido

- codigo de outras stacks alem do necessario para o contrato de dados

### Criterios de saida

- [ ] lint/typecheck/build passam
- [ ] tipos de dados de diagrama documentados

## Criterios de conclusao

- Modulos `ValueChainDiagram`, `TopologyDiagram`, `ArchitectureDiagram` implementados como funcao pura de dados -> render, com tipos compartilhados

## Validacao esperada

- `npm run lint`, `npm run typecheck`, testes unitarios de layout com dados de exemplo

## Entregaveis esperados

- `next-js/src/modules/sgsi-scope/diagrams/` (3 componentes + tipos)

## Riscos ou ambiguidades

- Se o escopo desta task crescer demais (3 diagramas de uma vez), dividir em tasks por diagrama na execucao

## Status final

done

## Resultado da execucao

- Contrato de dados comum (`types.ts`): `DiagramNode`/`DiagramConnection`/`DiagramData`
  (entrada) e `PositionedNode`/`PositionedConnection`/`DiagramLayout` (saida).
  `classification` fecha em `'in-scope' | 'out-scope' | 'interface'`; `group` e livre (as
  entidades reais da Task 020 ainda nao existem, entao o agrupamento nao foi acoplado a um
  enum fixo).
- Layout puro e testavel sem DOM: `layout/sequential-layout.ts` (linhas por `group`, usado
  pela Cadeia de Valor) e `layout/grouped-column-layout.ts` (colunas por `group`, usado por
  Topologia e Arquitetura), ambos sobre `layout/connections.ts` (resolve conexoes e reporta
  `invalidConnectionIds` para no inexistente sem quebrar o restante).
- Render isolado e substituivel: `render/DiagramSvg.tsx` + `render/DiagramSvg.module.css`
  (cores de classificacao derivadas dos tokens Daryus, escopadas no CSS module do proprio
  diagrama, nao em `globals.css`, por causa da restricao de path de escrita da task).
- 3 componentes publicos (`ValueChainDiagram`, `TopologyDiagram`, `ArchitectureDiagram`) +
  barrel `index.ts`.
- Runner de teste (`vitest`) configurado no `next-js` pela primeira vez —
  `next-js/docs/ai/QA.md` ainda diz "esta stack nao tem runner de teste configurado"; esse
  doc ficou desatualizado por esta task e deveria ser corrigido numa proxima passada (mesmo
  padrao de contradicao ja visto com `STYLING.md`, ver `CLAUDE.md`).

## Arquivos alterados

- Criados: `next-js/vitest.config.ts`,
  `next-js/src/modules/sgsi-scope/diagrams/{types.ts,index.ts,value-chain-diagram.ts,topology-diagram.ts,architecture-diagram.ts,ValueChainDiagram.tsx,TopologyDiagram.tsx,ArchitectureDiagram.tsx}`,
  `.../diagrams/layout/{geometry.ts,connections.ts,sequential-layout.ts,grouped-column-layout.ts}`,
  `.../diagrams/render/{DiagramSvg.tsx,DiagramSvg.module.css}`,
  `.../diagrams/__tests__/{sequential-layout.test.ts,grouped-column-layout.test.ts,diagrams.test.ts}`.
- Modificado: `next-js/package.json` (scripts `test`/`test:watch`; `vitest` como
  devDependency ja estava adicionado, sem uso, de uma preparacao anterior desta mesma
  task), `next-js/package-lock.json`, `docs/architecture.md` (secao "Diagramas"
  formalizada com o que foi implementado).

## Validacoes executadas

- `npm run test` (vitest): 9 testes, 3 arquivos, todos passando (layout puro, sem DOM).
- `npm run lint` OK, `npm run typecheck` OK, `npm run build` OK (33 rotas, sem alteracao —
  esta task nao adiciona rota, so a camada consumida pelas Tasks 021/022).

## Pendencias ou bloqueios

- `next-js/docs/ai/QA.md` desatualizado (diz que nao ha runner de teste configurado).
- Render validado apenas via `viewBox`/estrutura SVG e testes de layout; nao houve
  verificacao visual manual no browser (sem dados reais ainda — Task 020 cria as
  entidades e os endpoints que alimentam `DiagramData`).
- `group` ficou como `string` livre nos tipos porque as entidades da Task 020 ainda nao
  existem; ao criar `ValueChainBlock`/`TopologyNode`/etc., confirmar se o valor de
  `group` mapeia 1:1 para um campo da entidade ou precisa de adaptacao no service que
  monta `DiagramData`.
