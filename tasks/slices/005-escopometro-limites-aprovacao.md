# Slice 005 - Escopometro: Limites, Recursos & Aprovacao

## Status

planned

## Objetivo de negocio

Permitir que o Consultor registre os limites fisicos e de recursos do SGSI (localidades, colaboradores/areas, ativos tecnologicos, prestadores de servico) e formalize a aprovacao do escopo com historico de revisoes.

## Entrega verificavel

O Consultor cadastra localidades, grupos de colaboradores, ativos e prestadores (cada um com classificacao de escopo), registra o metodo/plataforma de aprovacao e visualiza o historico de revisoes (versao, data, responsavel, descricao da alteracao).

## Fora de escopo

- Previa consolidada e exportacao de documentos (slice 006)
- Assinatura eletronica complexa (fora do MVP, PRD secao 34)
- Workflow corporativo avancado de aprovacao (fora do MVP)

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nenhum

## Stacks envolvidas

- next-js
- backend

## Contrato

- `contracts/openapi.yaml#/paths/...` (a criar: `/sgsi-scopes/{id}/locations`, `/employee-groups`, `/assets`, `/providers`, `/approval`, `/revisions`)

## Referencia visual por stack

### Web

- tipo: artefato de design system
- fonte primaria: `design-system/front/brand/daryus-tokens.md`

### Mobile

- nao se aplica

## Permissoes e atores

- Consultor/Especialista registra os dados; o registro de aprovacao (secao 14.5) e feito pelo Consultor em nome do processo no MVP (Cliente/Aprovador fica para depois, conforme PRD secao 3).

## Casos de erro e borda

- Registro de aprovacao sem responsavel/data -> nao deve travar preenchimento, mas deve refletir no indicador de preenchimento.
- Revisao registrada sem versao associada -> validar vinculo com `SgsiScopeVersion` (slice 006 cria o modelo de versionamento completo; aqui so o historico basico de revisao por etapa).

## Decisoes humanas confirmadas

- Cinco subsecoes da etapa 7 (localidades, colaboradores/areas, ativos, prestadores, aprovacao) + revisoes, conforme PRD secao 14.

## Premissas adotadas

- Nenhuma alem das ja registradas no `000-index.md`.

## Tasks relacionadas

- `tasks/023-entidades-limites-recursos.md` - ScopeLocation/ScopeEmployeeGroup/ScopeAsset/ScopeProvider/ScopeApproval/ScopeRevision
- `tasks/024-ui-etapa7-limites-recursos.md` - UI Etapa 7 (5 subsecoes + aprovacao + revisoes)

## Dependencias do slice

- Slice 004

## Contexto minimo recomendado

- `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, este slice

## Contexto sob demanda recomendado

| Gatilho   | Fonte                                        | Quando carregar | Obrigatorio? |
| --------- | -------------------------------------------- | --------------- | ------------ |
| UI web    | `design-system/front/brand/daryus-tokens.md` | task 024        | sim          |
| API       | `contracts/openapi.yaml#/paths/...`          | ambas           | sim          |
| Front-end | `next-js/docs/ai/`                           | task 024        | sim          |
| Backend   | `backend/docs/ai/`                           | task 023        | sim          |

## Risco de contexto

- baixo

## Security posture do slice

- nivel de risco default: baixo/medio
- perfil de origem sugerido: api-back (023); ui-front (024)
- human approvals recorrentes: migration/schema para novas entidades
- contexto proibido herdado: dados de outras organizacoes/projetos

## Observacoes de rastreabilidade

- Nenhum conflito adicional.

## Status final

planned
