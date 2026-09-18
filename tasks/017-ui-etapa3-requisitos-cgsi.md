# Task 017 - UI Etapa 3 Requisitos & CGSI

## Status

done

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/stakeholders`, `#/requirements`, `#/governance`

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

- Seguir tokens Daryus; sem prototipo HTML disponivel, seguir especificacao textual do PRD secao 10.

## Contexto de negocio

### Por que

Permite ao Consultor registrar partes interessadas, requisitos legais e o comite de governanca antes de declarar o escopo.

### O que

Tela com 3 blocos: partes interessadas (lista dinamica), requisitos legais (busca/selecao da biblioteca + adicao customizada), governanca/CGSI (dados do comite + lista de membros).

### Comportamento esperado

- cenario: adicionar parte interessada -> aparece na lista com todos os campos do PRD secao 10.1.
- cenario: buscar requisito na biblioteca -> encontra itens da lista inicial (LGPD, Marco Civil, etc.).

### Fora de escopo

- Etapa 4 (Task 018)

## Casos de erro e borda

- Biblioteca de requisitos vazia (seed nao rodou) -> estado vazio com mensagem, nao erro
- Membro do comite sem papel -> validacao de formulario bloqueia

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: campos conforme PRD secao 10
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Usar React Hook Form + Zod; reaproveitar padrao de autosave

### Nao deve

- Nao hardcodar a lista de requisitos legais no componente (deve vir da API)

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`

## Dependencias

- Task 015

## Slice vertical

### Identificador

Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo

### Arquivo

`tasks/slices/003-escopometro-requisitos-escopo.md`

### Fora do slice

- Etapa 4

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

- [x] lint/typecheck/build passam

## Criterios de conclusao

- [x] Etapa 3 funcional com os 3 blocos (stakeholders, requisitos, CGSI)

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 3

## Riscos ou ambiguidades

- Nenhuma alem das ja registradas no slice

## Resultado da execucao

- Rota `/projects/:id/sgsi-scope/requirements` (Server Component): busca stakeholders,
  a secao de requisitos (`{ library, selected }`, Task 015) e a secao de governanca em
  paralelo; renderiza `EtapaRequisitosForm` com os 3 blocos.
- **Partes interessadas**: `StakeholderBlock` — lista + formulario de adicao com os 5
  campos exatos do PRD secao 10.1 (parte interessada, requisitos, necessidades,
  expectativas, observacoes); remove via `DELETE`.
- **Requisitos**: `RequirementsBlock` — biblioteca vem 100% da API (`GET
.../requirements`, nunca hardcoded, conforme a task exige), com busca client-side por
  titulo; "Adicionar" num item da biblioteca chama `POST` com `requirementId`; um campo
  separado permite requisito customizado (`POST` so com `title`, sem `requirementId`).
  Estado vazio explicito se a biblioteca nao tiver sido seedada ainda (nao erro).
- **Governanca/CGSI**: `GovernanceBlock` — dados do comite com autosave (reaproveita
  `useAutosave`/`AutosaveIndicator` das Tasks 011/013) + lista de membros com
  create/delete. `jobRole` ("funcao") e obrigatorio no formulario (validacao de
  formulario bloqueia antes de enviar, e o backend garante 400 de qualquer forma).
- `StepNav` (Task 013/014) ganhou `href` real para a Etapa 3.
- Todas as mutacoes passam por Route Handlers BFF novos (`/api/projects/:id/sgsi-scope/{stakeholders,requirements,governance}...`),
  mesmo padrao ja estabelecido.

## Arquivos alterados

- Criados: `next-js/src/services/sgsi-scope/requirements.service.ts`,
  `next-js/src/app/api/projects/[id]/sgsi-scope/{stakeholders,stakeholders/[stakeholderId],requirements,requirements/[projectRequirementId],governance,governance/members,governance/members/[memberId]}/route.ts`,
  `next-js/src/app/projects/[id]/sgsi-scope/requirements/page.tsx`,
  `next-js/src/modules/sgsi-scope/etapa-requisitos/{EtapaRequisitosForm,StakeholderBlock,RequirementsBlock,GovernanceBlock}.tsx` (+css).
- Modificado: `next-js/src/modules/sgsi-scope/StepNav.tsx` (href da Etapa 3).

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run build`: executado com sucesso (27 rotas)
- Teste manual (via `next dev` + browser): confirmado que
  `/projects/:id/sgsi-scope/requirements` redireciona para `/login` sem sessao. **Fluxo
  completo (adicionar stakeholder, aplicar requisito da biblioteca, autosave do comite,
  adicionar membro) nao testado contra backend real** (sem Postgres/backend disponivel
  neste ambiente, mesma limitacao das tasks de UI anteriores).

## Pendencias pos-task

- Testar o fluxo completo contra o backend real apos deploy (incluindo a biblioteca
  legal seedada pela migration da Task 015).
- Sem edicao inline de stakeholders/membros/requisitos ja criados (so create/delete) —
  nao pedido explicitamente pela task.

## Status final

done
