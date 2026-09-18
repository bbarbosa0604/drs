# Slice 003 - Escopometro: Requisitos, CGSI & Declaracao de Escopo

## Status

done

## Objetivo de negocio

Permitir que o Consultor registre partes interessadas, requisitos legais/contratuais, o comite de governanca (CGSI) e, na etapa central do modulo, declare formalmente o escopo do SGSI com fundamentacao, caracteristicas e beneficios — sempre como decisao humana, nunca automatica.

## Entrega verificavel

O Consultor cadastra stakeholders e requisitos (usando uma biblioteca inicial de referencias legais brasileiras), configura o CGSI (comite + membros), e preenche a declaracao de escopo, fundamentacao executiva, descricao detalhada, caracteristicas e beneficios. O indicador de percentual de preenchimento reflete esses campos.

## Fora de escopo

- Cadeia de valor, topologia, arquitetura (slice 004)
- Avaliacao automatica de adequacao/conformidade do escopo (fora do MVP, PRD secao 34)
- Biblioteca de requisitos legais totalmente administravel via UI (fica como premissa "semi-hardcoded revisavel" no MVP)

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nenhum

## Stacks envolvidas

- next-js
- backend

## Contrato

- `contracts/openapi.yaml#/paths/...` (a criar: `/sgsi-scopes/{id}/stakeholders`, `/requirements`, `/governance`, `/scope-definition`)

## Referencia visual por stack

### Web

- tipo: artefato de design system
- fonte primaria: `design-system/front/brand/daryus-tokens.md`

### Mobile

- nao se aplica

## Permissoes e atores

- Consultor/Especialista, herdado do Slice 001.

## Casos de erro e borda

- Declaracao de escopo vazia ao tentar avancar para exportacao (etapa 8) -> deve ser sinalizado no indicador de preenchimento, sem bloquear navegacao livre.
- Requisito legal duplicado na biblioteca -> permitir, mas avisar (nao e erro de negocio, e decisao do especialista).
- Percentual de preenchimento nunca deve ser exibido/rotulado como "conformidade ISO 27001" ou "maturidade" (regra critica do PRD secao 16).

## Decisoes humanas confirmadas

- "O sistema pode auxiliar a organizar informacoes, mas nao deve concluir automaticamente qual deve ser o escopo" (PRD secao 11) — nenhuma logica de auto-preenchimento de declaracao de escopo.
- Indicador de preenchimento mede so presenca de dados, nunca qualidade/adequacao.

## Premissas adotadas

- Biblioteca legal inicial (Constituicao, LGPD, Marco Civil, Lei Carolina Dieckmann, PI, Direitos Autorais, Codigo Civil, CDC, Decreto Comercio Eletronico, orientacoes ANPD) e seed de dados administravel por DSR Admin no backend, nao hardcoded no componente front.

## Tasks relacionadas

- `tasks/015-stakeholders-requisitos-cgsi.md` - Stakeholder/Requirement/GovernanceCommittee/GovernanceMember
- `tasks/016-declaracao-escopo-percentual.md` - ScopeDefinition/ScopeCharacteristic/ScopeBenefit + calculo do percentual
- `tasks/017-ui-etapa3-requisitos-cgsi.md` - UI Etapa 3
- `tasks/018-ui-etapa4-escopo.md` - UI Etapa 4 + indicador de preenchimento

## Dependencias do slice

- Slice 002

## Contexto minimo recomendado

- `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, este slice

## Contexto sob demanda recomendado

| Gatilho   | Fonte                                        | Quando carregar | Obrigatorio? |
| --------- | -------------------------------------------- | --------------- | ------------ |
| UI web    | `design-system/front/brand/daryus-tokens.md` | tasks 017, 018  | sim          |
| API       | `contracts/openapi.yaml#/paths/...`          | todas           | sim          |
| Front-end | `next-js/docs/ai/`                           | tasks 017, 018  | sim          |
| Backend   | `backend/docs/ai/`                           | tasks 015, 016  | sim          |

## Risco de contexto

- baixo

## Security posture do slice

- nivel de risco default: medio
- perfil de origem sugerido: api-back (015, 016); ui-front (017, 018)
- human approvals recorrentes: migration/schema para novas entidades; seed de dados legais
- contexto proibido herdado: dados de outras organizacoes/projetos

## Observacoes de rastreabilidade

- Nenhum conflito adicional identificado alem dos ja registrados no `000-index.md`.

## Status final

done
