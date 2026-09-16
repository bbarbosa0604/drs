# Modelo de task de change request (raiz)

# CR-XXX - <titulo>

## Status

planned

## Tipo

front | back | mobile | shared

## Stacks envolvidos

- front-end
- backend
- mobile

## Contrato

- `contracts/openapi.yaml#/paths/...`
- ou `nao se aplica`

## Modo de execucao

single-stack | cross-stack

## Perfil do projeto

- stack web escolhida: front-end (React/Vite) | next-js (Next.js) | nao se aplica
- mobile: sim | nao
- cms: payload | proprio | nenhum | nao se aplica

## Referencia de design system

### Stack de referencia visual

front-end | mobile | multiplas stacks | nao se aplica

### Tipo de referencia visual

artefato de design system | aplicacao-prototipo visual | prints de telas | nao se aplica

### Fonte primaria visual

- `design-system/front/...`
- `design-system/mobile/...`

### Regra de aderencia visual

- se for `prints de telas`, registrar quais telas/estados cada print governa
- se houver UI em mais de uma stack, descrever a regra de aderencia por stack

## Origem da solicitacao

## Objetivo

## Escopo

- item

## Fora de escopo

- item

## Entradas

- `requirements/...`
- `design-system/front/...`
- `design-system/mobile/...`
- `contracts/openapi.yaml`
- tasks relacionadas

## Slice vertical

### Identificador do slice

Slice XXX - <nome curto>

### Arquivo do slice

- `tasks/slices/XXX-nome-do-slice.md`

### Objetivo de negocio

### Entrega verificavel do slice

### Fora do slice

- item

## Contexto mínimo

Sempre ler:

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- esta task
- arquivo do slice em `tasks/slices/*.md`

## Contexto sob demanda

| Gatilho           | Fonte                                                                                         | Quando carregar                                                        | Obrigatório? |
| ----------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------ |
| Processo/contexto | `.agents/references/context-engineering.md`                                                   | somente se houver duvida sobre slice, handoff ou orçamento de contexto | sim/nao      |
| UI web            | `design-system/front/...`                                                                     | somente se esta task alterar UI web                                    | sim/nao      |
| UI mobile         | `design-system/mobile/...`                                                                    | somente se esta task alterar UI mobile                                 | sim/nao      |
| API               | `contracts/openapi.yaml#/paths/...`                                                           | somente se esta task consumir/criar endpoint                           | sim/nao      |
| Stack local       | `front-end/docs/ai/...`, `next-js/docs/ai/...`, `backend/docs/ai/...` ou `mobile/docs/ai/...` | somente para stacks envolvidas                                         | sim/nao      |

## Orçamento de contexto

- Fontes obrigatórias estimadas: N
- Fontes sob demanda estimadas: N
- Risco de contexto excessivo: baixo | médio | alto
- Estratégia para reduzir contexto:

## Security Constraints

> Preenchido pela skill a partir de um perfil interno expandido em listas concretas. Usuario revisa. Ver `.agents/references/security-constraints.md`.

### Nivel de risco

baixo | medio | alto

### Perfil de origem

docs-only | ui-front | api-back | auth-sensitive | cross-stack | infra-risk

### Tools permitidas

- read: [paths ou escopo]
- edit: [paths ou escopo]
- shell: [comandos explicitos]
- git: [local | remote | nenhum]
- network/MCP: [nenhum | listar]
- skill: [skills locais permitidas ou nenhuma]

### Paths permitidos para escrita

- `caminho/...`

### Acoes que exigem human approval

- [ ] instalar/remover dependencias
- [ ] alterar `contracts/openapi.yaml` (breaking)
- [ ] migration / schema de banco
- [ ] push remoto / abrir PR / comentar em issue
- [ ] alterar secrets, `.env`, CI/CD, permissoes
- [ ] expor endpoint publico novo ou remover guard
- [ ] outras: ...

### Contexto proibido

- `.env` real, tokens, secrets de producao
- dumps e dados sensiveis de producao
- stacks nao envolvidas
- historico bruto de conversa longa
- outras:

### Criterios de saida / validacao de seguranca

- [ ] tools usadas ⊆ tools permitidas
- [ ] nenhuma escrita fora dos paths permitidos
- [ ] human approvals obtidos ou `nao se aplica`
- [ ] nenhum secret commitado ou logado
- [ ] handoff registra compliance das constraints

## Dependencias

- Task XXX

## Criterios de conclusao

- criterio

## Instrucoes de implementacao

- diretriz

## Validacao esperada

- validacao

## Entregaveis esperados

- item

## Riscos ou ambiguidades

- item

## Resultado da execucao

_A ser preenchido na execucao_

## Contexto utilizado

_A ser preenchido na execucao_

## Handoff

_A ser preenchido na execucao com caminho para `.agents/state/handoffs/TASK-XXX.md`_

## Arquivos alterados

_A ser preenchido na execucao_

## Validacoes executadas

_A ser preenchido na execucao_

## Pendencias pos-task

_A ser preenchido na execucao_

## Status final

planned
