# Task 022 - UI Etapa 6 Topologia & Arquitetura + diagramas

## Status

done

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/topology`, `#/architecture`

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

- Mesmo mapeamento de cores de classificacao de escopo da Task 019/021.

## Contexto de negocio

### Por que

Permite ao Consultor mapear a topologia tecnica e a arquitetura de componentes do ambiente do SGSI.

### O que

Duas subsecoes: Topologia (cadastro de nos com os 11 tipos do PRD secao 13.1, conexoes com origem/destino/descricao/tipo) e Arquitetura (componentes com nome/camada/descricao/classificacao, interfaces com origem/destino/descricao). Cada uma com seu diagrama (`TopologyDiagram`, `ArchitectureDiagram`) gerado automaticamente.

### Comportamento esperado

- cenario: adicionar no de topologia tipo "Firewall" -> aparece no diagrama com icone/estilo proprio (se definido) ou estilo padrao por classificacao.
- cenario: criar interface de arquitetura entre 2 componentes -> diagrama de arquitetura reflete a conexao.

### Fora de escopo

- Etapa 7 em diante

## Casos de erro e borda

- No/componente sem classificacao -> exibido como "nao classificado" no diagrama, nao como dentro do escopo por padrao

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: 11 tipos de no do PRD secao 13.1 usados literalmente
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Consumir `TopologyDiagram`/`ArchitectureDiagram` da Task 019

### Nao deve

- Nao duplicar logica de layout na UI

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Task 019, Task 020

## Slice vertical

### Identificador

Slice 004 - Escopometro: Scope Engine

### Arquivo

`tasks/slices/004-escopometro-scope-engine.md`

### Fora do slice

- Etapa 7

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

- Etapa 6 funcional com as 2 subsecoes e seus diagramas sincronizados

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 6

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Status final

done

## Resultado da execucao

- Uma rota (`/projects/:id/sgsi-scope/topology`) com 2 subsecoes (Topologia,
  Arquitetura), cada uma com seu diagrama (`TopologyDiagram`/`ArchitectureDiagram`,
  Task 019) + listas com create/edit/delete in-place, reaproveitando o padrao
  `*Row.tsx` da Task 021.
- Nos de topologia agrupados no diagrama por `type` (11 tipos do PRD secao 13.1);
  componentes de arquitetura agrupados por `layer` (com fallback "Sem camada" quando
  vazio) — ambos via `computeGroupedColumnLayout` (Task 019).
- Formulario de conexao/interface so aparece quando ha pelo menos 1 no/componente
  cadastrado (dropdown depende de opcoes existirem); mensagem explicita quando vazio.
- Exclusao de no/componente ainda referenciado (409 do backend, Task 020) e propagada
  como erro visivel na linha, sem remover otimisticamente do estado local (diferente do
  padrao de bloco/link/interface, que remove otimista e so falha silenciosamente no
  raro caso de erro de rede).

## Arquivos alterados

- Criados: `next-js/src/modules/sgsi-scope/etapa-topologia-arquitetura/**`
  (`EtapaTopologiaArquiteturaForm.tsx` + `.module.css`, `EntityRow.module.css`,
  `{TopologyNodeRow,TopologyLinkRow,ArchitectureComponentRow,ArchitectureInterfaceRow}.tsx`),
  `next-js/src/app/projects/[id]/sgsi-scope/topology/page.tsx`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/{topology/nodes[/:id],topology/links[/:id],architecture/components[/:id],architecture/interfaces[/:id]}/route.ts`.

## Validacoes executadas

- `npm run lint`, `npm run typecheck`, `npm run test` (vitest 9/9), `npm run build` (41
  rotas): OK.
- Manual: redirect para `/login` sem sessao confirmado no browser para
  `/projects/:id/sgsi-scope/topology` (backend real em `:3000`, sem Postgres). Fluxo
  completo nao testado por falta de banco.

## Pendencias ou bloqueios

- Testar fluxo completo (CRUD de nos/links/componentes/interfaces + os 2 diagramas)
  contra backend com Postgres real.
- Slice 004 (Tasks 019-022) esta 100% `done`.

## Proximo contexto recomendado

Task 023 (Slice 005) - entidades ScopeLocation/ScopeEmployeeGroup/ScopeAsset/
ScopeProvider/ScopeApproval/ScopeRevision (Etapa 7 + fluxo de aprovacao/revisao).
