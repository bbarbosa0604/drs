# Modelo de slice vertical (raiz)

# Slice XXX - <nome curto>

## Status

planned

## Objetivo de negocio

[descrever em 1-2 frases a entrega observavel para o usuario ou operacao]

## Entrega verificavel

[descrever o comportamento de negocio que deve existir ao final do slice]

## Fora de escopo

- [funcionalidades proximas que nao pertencem a este slice]

## Perfil do projeto

- stack web escolhida: front-end (React/Vite) | next-js (Next.js) | nao se aplica
- mobile: sim | nao
- cms: payload | proprio | nenhum | nao se aplica

## Stacks envolvidas

- front-end | next-js
- backend
- mobile

## Contrato

- `contracts/openapi.yaml#/paths/...`
- ou `nao se aplica`

## Referencia visual por stack

### Web

- tipo: artefato de design system | aplicacao-prototipo visual | prints de telas | nao se aplica
- fonte primaria: `design-system/front/...` | `nao se aplica`

### Mobile

- tipo: artefato de design system | aplicacao-prototipo visual | prints de telas | nao se aplica
- fonte primaria: `design-system/mobile/...` | `nao se aplica`

## Permissoes e atores

- [papeis, perfis, escopos ou `nao se aplica`]

## Casos de erro e borda

- [erros e cenarios limite consolidados do slice]

## Decisoes humanas confirmadas

- [itens confirmados pelo usuario]

## Premissas adotadas

- [premissas assumidas pela IA e que precisam permanecer visiveis]

## Tasks relacionadas

- `tasks/XXX-....md` - papel da task dentro do slice

## Dependencias do slice

- Slice XXX
  ou
- Nenhuma

## Contexto minimo recomendado

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- este slice

## Contexto sob demanda recomendado

| Gatilho   | Fonte                                            | Quando carregar                                         | Obrigatorio? |
| --------- | ------------------------------------------------ | ------------------------------------------------------- | ------------ |
| UI web    | `design-system/front/...`                        | somente se alguma task do slice alterar UI web          | sim/nao      |
| UI mobile | `design-system/mobile/...`                       | somente se alguma task do slice alterar UI mobile       | sim/nao      |
| API       | `contracts/openapi.yaml#/paths/...`              | somente se alguma task do slice consumir/criar endpoint | sim/nao      |
| Front-end | `front-end/docs/ai/...` ou `next-js/docs/ai/...` | somente se a stack web estiver envolvida                | sim/nao      |
| Backend   | `backend/docs/ai/...`                            | somente se backend estiver envolvido                    | sim/nao      |
| Mobile    | `mobile/docs/ai/...`                             | somente se mobile estiver envolvido                     | sim/nao      |

## Risco de contexto

- baixo | medio | alto
- estrategia de fatiamento ou reducao de contexto:

## Security posture do slice

Postura herdada pelas tasks do slice. Cada task deve materializar `## Security Constraints` completo e pode restringir mais; relaxar exige decisao humana registrada.

- nivel de risco default: baixo | medio | alto
- perfil de origem sugerido: docs-only | ui-front | api-back | auth-sensitive | cross-stack | infra-risk
- human approvals recorrentes do slice:
- contexto proibido herdado:
- observacao: listas operacionais vivem na task, nao so aqui

## Observacoes de rastreabilidade

- [conflitos entre requisitos, contrato e referencia visual]

## Status final

planned
