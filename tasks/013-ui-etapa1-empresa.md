# Task 013 - UI Etapa 1 Empresa

## Status

planned

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

- [ ] lint/typecheck/build passam

## Criterios de conclusao

- Etapa 1 funcional com reaproveitamento de dados, controle documental, import JSON com aviso, autosave visivel

## Validacao esperada

- `npm run lint`, `npm run typecheck`, `npm run build`, teste manual do fluxo

## Entregaveis esperados

- Tela/rota da Etapa 1 em `next-js/src/modules/sgsi-scope/`

## Riscos ou ambiguidades

- Ausencia do prototipo HTML pode gerar diferenca de layout em relacao ao que o Bruno espera — revisar com ele ao final desta task

## Status final

planned
