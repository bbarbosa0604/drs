# Task 014 - UI Etapa 2 Contexto

## Status

planned

## Tipo

front

## Stacks envolvidos

- next-js

## Perfil do projeto

- stack web escolhida: next-js (Next.js) | cms: nenhum

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/context`

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

- Seguir tokens Daryus; editor de conteudo rico deve ter aparencia profissional/consultoria (PRD secao 35).

## Contexto de negocio

### Por que

Registrar o contexto organizacional (historico, direcionadores, questoes externas/internas) e pre-requisito para a declaracao de escopo mais adiante.

### O que

Editor de conteudo rico (TipTap) para historico; formulario para negocio/missao/visao/valores; listas dinamicas de questoes externas e internas (titulo, descricao, observacoes).

### Comportamento esperado

- cenario: usuario formata texto no editor (negrito, listas) -> conteudo salvo como JSON estruturado.
- cenario: adicionar questao externa -> aparece na lista correspondente, separada das internas.

### Fora de escopo

- Etapa 3 em diante

## Casos de erro e borda

- Editor com conteudo muito longo -> nao ha limite definido no PRD; registrar como nao-bloqueante para o MVP
- Questao sem titulo -> validacao de formulario impede salvar

## Review da spec

- [x] Permissoes: herdadas do Slice 001
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: uso de TipTap/ProseMirror (PRD secao 29), nao `execCommand`
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Integrar TipTap (ou ProseMirror equivalente) armazenando JSON, nunca `document.execCommand`
- Reaproveitar padrao de autosave da Task 013

### Nao deve

- Nao renderizar HTML nao sanitizado vindo do editor

## Entradas

- `contracts/openapi.yaml`
- `design-system/front/brand/daryus-tokens.md`
- `requirements/001-prd-escopometro-sgsi.md#9, #29`

## Dependencias

- Task 012, Task 013

## Slice vertical

### Identificador

Slice 002 - Escopometro: Empresa & Contexto

### Arquivo

`tasks/slices/002-escopometro-empresa-contexto.md`

### Fora do slice

- Etapa 3 em diante

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

- [x] instalar/remover dependencias — adicionar TipTap/ProseMirror ao `next-js/package.json`

### Contexto proibido

- `backend/` alem do contrato exposto

### Criterios de saida

- [ ] lint/typecheck/build passam
- [ ] conteudo rico sanitizado na exibicao

## Criterios de conclusao

- Etapa 2 funcional com editor rico, direcionadores e questoes externas/internas

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual

## Entregaveis esperados

- Tela/rota da Etapa 2 em `next-js/src/modules/sgsi-scope/`

## Riscos ou ambiguidades

- Escolha exata de biblioteca de editor (TipTap vs outra ProseMirror) fica a criterio da implementacao, TipTap e o sugerido pelo PRD

## Status final

planned
