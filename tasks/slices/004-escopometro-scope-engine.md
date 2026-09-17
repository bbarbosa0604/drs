# Slice 004 - Escopometro: Scope Engine (Cadeia de Valor, Topologia & Arquitetura)

## Status

planned

## Objetivo de negocio

Permitir que o Consultor represente visualmente o ambiente do SGSI (cadeia de valor, topologia de rede/sistemas e arquitetura de componentes), classificando cada elemento como dentro, fora ou interface do escopo, com diagramas gerados a partir dos dados estruturados.

## Entrega verificavel

O Consultor cadastra blocos da cadeia de valor, nos e conexoes de topologia, componentes e interfaces de arquitetura — cada um com classificacao de escopo — e visualiza os diagramas correspondentes gerados automaticamente a partir desses dados (nao desenhados a mao).

## Fora de escopo

- Limites & Recursos (slice 005)
- Edicao manual de layout dos diagramas (posicionamento livre) — o MVP gera automaticamente
- CMDB completo / inventario de ativos (fora do MVP, PRD secao 34)

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nenhum

## Stacks envolvidas

- next-js
- backend

## Contrato

- `contracts/openapi.yaml#/paths/...` (a criar: `/sgsi-scopes/{id}/value-chain`, `/topology`, `/architecture`)

## Referencia visual por stack

### Web

- tipo: artefato de design system
- fonte primaria: `design-system/front/brand/daryus-tokens.md` (grafite = dentro do escopo, cinza claro = fora, contorno laranja = interface — PRD secao 12, mapeado para os tokens Daryus)

### Mobile

- nao se aplica

## Permissoes e atores

- Consultor/Especialista, herdado do Slice 001.

## Casos de erro e borda

- No/bloco sem classificacao de escopo definida -> diagrama deve tratar como estado "nao classificado" visualmente distinto, nunca assumir IN_SCOPE por padrao.
- Conexao/interface referenciando no inexistente (removido) -> validar integridade referencial antes de renderizar.
- Diagrama com volume grande de nos -> nao e requisito de performance do MVP, mas nao deve quebrar a renderizacao (limite razoavel documentado na task).

## Decisoes humanas confirmadas

- "O modelo de dados nao deve depender de SVG" e "o dominio nunca deve depender diretamente de SVG" (PRD secoes 12, 37) — abstracao de diagrama e mandatoria, SVG/Canvas e so a camada de renderizacao.

## Premissas adotadas

- `ValueChainDiagram`, `TopologyDiagram`, `ArchitectureDiagram` sao modulos puros (dados estruturados -> layout -> render), reutilizaveis depois nos documentos gerados (slice 006).

## Tasks relacionadas

- `tasks/019-camada-diagramas.md` - camada de diagramas independente (shared)
- `tasks/020-entidades-scope-engine.md` - ValueChainBlock/TopologyNode/TopologyLink/ArchitectureComponent/ArchitectureInterface
- `tasks/021-ui-etapa5-cadeia-valor.md` - UI Etapa 5 + diagrama
- `tasks/022-ui-etapa6-topologia-arquitetura.md` - UI Etapa 6 + diagramas

## Dependencias do slice

- Slice 003

## Contexto minimo recomendado

- `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, este slice

## Contexto sob demanda recomendado

| Gatilho   | Fonte                                        | Quando carregar               | Obrigatorio? |
| --------- | -------------------------------------------- | ----------------------------- | ------------ |
| UI web    | `design-system/front/brand/daryus-tokens.md` | tasks 021, 022                | sim          |
| API       | `contracts/openapi.yaml#/paths/...`          | todas                         | sim          |
| Front-end | `next-js/docs/ai/`                           | tasks 019 (parcial), 021, 022 | sim          |
| Backend   | `backend/docs/ai/`                           | task 020                      | sim          |

## Risco de contexto

- medio — task 019 (diagramas) e cross-stack e deve ser dividida se exigir contexto amplo demais.

## Security posture do slice

- nivel de risco default: baixo/medio
- perfil de origem sugerido: cross-stack (019); api-back (020); ui-front (021, 022)
- human approvals recorrentes: migration/schema para novas entidades
- contexto proibido herdado: dados de outras organizacoes/projetos

## Observacoes de rastreabilidade

- Nenhum conflito adicional alem dos ja registrados no `000-index.md`.

## Status final

planned
