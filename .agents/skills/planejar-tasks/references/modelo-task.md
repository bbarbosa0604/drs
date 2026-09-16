# Modelo de task (raiz)

# Task XXX - <titulo>

## Status

planned

## Tipo

front | back | mobile | shared

## Stacks envolvidos

- front-end ou next-js
- backend
- mobile (quando aplicavel)

## Perfil do projeto

- stack web escolhida: front-end (React/Vite) | next-js (Next.js) | nao se aplica
- mobile: sim | nao
- cms: payload | proprio | nenhum | nao se aplica

## Contrato

- `contracts/openapi.yaml#/paths/...`
- ou `nao se aplica`

## Modo de execucao

single-stack | cross-stack

## Referencia de design system

### Stack de referencia visual

front-end | mobile | multiplas stacks | nao se aplica

### Tipo de referencia visual

artefato de design system | aplicacao-prototipo visual | prints de telas | nao se aplica

### Fonte primaria visual

- `design-system/front/...`
- `design-system/mobile/...`

### Regra de aderencia visual

- descrever a regra objetiva de aderencia para a implementacao
- se for `aplicacao-prototipo visual`, registrar explicitamente que a UI deve seguir fielmente a aplicacao de exemplo
- se for `prints de telas`, registrar explicitamente que a UI deve seguir fielmente os prints indicados, incluindo quais telas/estados cada imagem governa
- se houver UI em mais de uma stack, descrever a regra de aderencia por stack

## Contexto de negocio

### Por que

[1-2 frases: Qual problema esta task resolve e por que isso importa agora]

### O que

[Entregavel concreto e verificavel. Descrever com especificidade suficiente para validar quando estiver pronto]

### Comportamento esperado

- cenario
- resultado esperado

### Fora de escopo

- funcionalidade adjacente que explicitamente nao sera entregue nesta task

## Review da spec

- [ ] Permissoes definidas ou `nao se aplica`
- [ ] Casos de erro mapeados
- [ ] Decisoes de negocio confirmadas como humanas
- [ ] Criterios de aceite objetivos e verificaveis
- [ ] Casos de borda considerados
- [ ] Security Constraints materializadas (tools, human approval, contexto proibido, criterios de saida)

### Evidencias da review

- Permissoes:
- Casos de erro:
- Decisoes humanas confirmadas:
- Casos de borda:
- Security Constraints (perfil de origem e risco):

## Especificacao tecnica

### Deve

- padroes, bibliotecas, convencoes e restricoes obrigatorias

### Nao deve

- nao adicionar novas dependencias sem autorizacao explicita nesta task
- nao desviar dos padroes estabelecidos sem justificativa registrada

## Entradas

Listar apenas entradas realmente necessárias para esta task.

Não listar docs de stacks não envolvidas.
Não listar `design-system/mobile/` se mobile não se aplica.
Não listar `next-js/docs/ai/` se a stack escolhida for `front-end`, e vice-versa.
Não listar `contracts/openapi.yaml` se não houver API.

## Dependencias

- Task XXX
  ou
- Nenhuma

## Slice vertical

### Identificador do slice

Slice XXX - <nome curto>

### Arquivo do slice

- `tasks/slices/XXX-nome-do-slice.md`

### Objetivo de negócio

[descrever em 1-2 frases a entrega observável de negócio]

### Entrega verificável do slice

[descrever o comportamento que deve existir ao final da task]

### Fora do slice

- [listar funcionalidades próximas que não serão entregues nesta task]

## Contexto mínimo

Sempre ler:

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- esta task

## Contexto sob demanda

| Gatilho                        | Fonte                                             | Quando carregar                                              | Obrigatório? |
| ------------------------------ | ------------------------------------------------- | ------------------------------------------------------------ | ------------ |
| UI web                         | `design-system/front/...`                         | somente se esta task alterar UI web                          | sim/nao      |
| UI mobile                      | `design-system/mobile/...`                        | somente se esta task alterar UI mobile                       | sim/nao      |
| API                            | `contracts/openapi.yaml#/paths/...`               | somente se esta task consumir/criar endpoint                 | sim/nao      |
| Front-end                      | `front-end/docs/ai/...` ou `next-js/docs/ai/...`  | somente se a stack web estiver envolvida                     | sim/nao      |
| Backend                        | `backend/docs/ai/...`                             | somente se backend estiver envolvido                         | sim/nao      |
| Mobile                         | `mobile/docs/ai/...`                              | somente se mobile estiver envolvido                          | sim/nao      |
| Segurança de produto           | `docs/ai/SECURITY.md` ou skill local de segurança | somente se houver auth, permissões ou dados sensíveis        | sim/nao      |
| Security Constraints do agente | `.agents/references/security-constraints.md`      | somente se houver dúvida ao materializar/aplicar constraints | sim/nao      |

## Orçamento de contexto

- Fontes obrigatórias estimadas: N
- Fontes sob demanda estimadas: N
- Risco de contexto excessivo: baixo | médio | alto
- Estratégia para reduzir contexto: [ex.: carregar apenas path do contrato, usar handoff anterior, dividir em nova task]

## Security Constraints

> Preenchido pela skill de planejamento a partir de um perfil interno (`docs-only`, `ui-front`, `api-back`, `auth-sensitive`, `cross-stack`, `infra-risk`). O perfil e so origem; a lista abaixo e a fonte de verdade. O usuario revisa, nao monta do zero.
> Referencia sob demanda: `.agents/references/security-constraints.md`

### Nivel de risco

baixo | medio | alto

### Perfil de origem

docs-only | ui-front | api-back | auth-sensitive | cross-stack | infra-risk

### Tools permitidas

- read: [paths ou escopo]
- edit: [paths ou escopo]
- shell: [comandos explicitos, ex.: `cd backend && npm run lint`]
- git: [local | remote | nenhum]
- network/MCP: [nenhum | listar]
- skill: [skills locais permitidas ou nenhuma]

### Paths permitidos para escrita

- `caminho/...`
- proibido por omissao: tudo fora desta lista

### Acoes que exigem human approval

- [ ] instalar/remover dependencias
- [ ] alterar `contracts/openapi.yaml` (breaking)
- [ ] migration / schema de banco
- [ ] push remoto / abrir PR / comentar em issue
- [ ] alterar secrets, `.env`, CI/CD, permissoes
- [ ] expor endpoint publico novo ou remover guard
- [ ] outras: ...
- marcar `nao se aplica` quando a acao nao fizer parte desta task

### Contexto proibido

- `.env` real, tokens, chaves privadas, secrets de producao
- dumps de usuarios ou dados sensiveis de producao
- `node_modules/`, `dist/` (salvo trecho pontual autorizado nesta task)
- docs/codigo de stacks nao envolvidas
- historico bruto de conversa longa (usar handoff)
- requirements/design-system/contrato inteiros sem gatilho
- outras fontes especificas desta task:

### Criterios de saida / validacao de seguranca

- [ ] tools usadas ⊆ tools permitidas
- [ ] nenhuma escrita fora dos paths permitidos
- [ ] human approvals obtidos ou `nao se aplica`
- [ ] nenhum secret/credencial commitado ou logado
- [ ] se auth/dados sensiveis: skill/doc de seguranca da stack executada
- [ ] validacoes de stack (lint/test/build) conforme task
- [ ] handoff registra compliance das constraints

## Criterios de conclusao

- criterio verificavel
- evidenciar aderencia a `Referencia de design system` quando houver UI

## Instrucoes de implementacao

- diretriz

## Validacao esperada

- testes
- lint
- build
- typecheck
- validacao de contrato

## Entregaveis esperados

- arquivos
- codigo
- ajustes de contrato (quando aplicavel)

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

## Aderencia ao design system

_A ser preenchido na execucao, com comparacao objetiva entre implementacao e referencia visual por stack_

## Pendencias pos-task

_A ser preenchido na execucao_

## Status final

planned
