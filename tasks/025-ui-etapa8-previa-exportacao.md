# Task 025 - UI Etapa 8 Previa & Exportacao

## Status

planned

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

planned
