# Slice 001 - Fundacao da plataforma

## Status

planned

## Objetivo de negocio

Permitir que um DSR Admin ou Consultor autentique, crie/edite Organizacoes e Projetos, e que o sistema garanta isolamento e autorizacao por organizacao desde o inicio — base sobre a qual qualquer modulo (a comecar pelo Escopometro) sera ativado.

## Entrega verificavel

Um usuario autenticado consegue: logar, ver um dashboard com organizacoes/projetos recentes, criar uma organizacao, criar um projeto vinculado a ela, e ter certeza de que nao acessa dados de outra organizacao.

## Fora de escopo

- Ativacao do modulo Escopometro (Slice 002)
- Papeis Revisor e Cliente/Aprovador
- Geracao de documentos, diagramas, auditoria detalhada

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nenhum

## Stacks envolvidas

- next-js
- backend

## Contrato

- `contracts/openapi.yaml#/paths/...` (a criar: `/auth/*`, `/organizations`, `/projects`) — hoje vazio, Task 001 deve popular.

## Referencia visual por stack

### Web

- tipo: artefato de design system
- fonte primaria: `design-system/front/brand/daryus-tokens.md`, `design-system/front/brand/daryus-brandbook.pdf`

### Mobile

- tipo: nao se aplica
- fonte primaria: nao se aplica

## Permissoes e atores

- DSR Admin: administra organizacoes, projetos, usuarios, config da plataforma.
- Consultor/Especialista: cria projetos, edita dados dentro da organizacao/projeto autorizado.
- Todo acesso a organizacao/projeto exige checagem server-side de vinculo do usuario (`OrganizationMember`/`ProjectMember`).

## Casos de erro e borda

- Login invalido / sessao expirada.
- Usuario sem vinculo tentando acessar organizacao/projeto de terceiros (IDOR) -> 403, nao 404 silencioso enganoso nem vazamento de dado.
- Criacao de projeto sem organizacao valida.
- Dois usuarios editando a mesma organizacao simultaneamente (last-write-wins e aceitavel no MVP, mas deve ser explicito).

## Decisoes humanas confirmadas

- Backend separado, NestJS + TypeORM + PostgreSQL (ja scaffolded) — ver duvida sobre Prisma no `000-index.md`.
- MVP prioriza DSR Admin e Consultor/Especialista (PRD secao 3).

## Premissas adotadas

- Autenticacao via modulo `backend/src/modules/auth` (Passport JWT), sessao propagada ao Next.js via cookie httpOnly.
- Design tokens Daryus substituem a paleta generica do PRD.

## Tasks relacionadas

- `tasks/001-contrato-modelo-core.md` - contrato OpenAPI + modelagem de dados core
- `tasks/002-setup-typeorm-postgres.md` - setup TypeORM/Postgres + migrations
- `tasks/003-autenticacao.md` - autenticacao Passport JWT
- `tasks/004-autorizacao-multitenancy.md` - autorizacao multitenancy + RBAC
- `tasks/005-crud-organizacao.md` - CRUD Organizacao
- `tasks/006-crud-projeto.md` - CRUD Projeto
- `tasks/007-design-tokens-shell.md` - design tokens Daryus + shell de layout
- `tasks/008-dashboard.md` - Dashboard
- `tasks/009-telas-organizacao-projeto.md` - Telas de Organizacao e Projeto
- `tasks/010-docs-governanca.md` - CLAUDE.md + docs/architecture.md + docs/database.md

## Dependencias do slice

- Nenhuma

## Contexto minimo recomendado

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- este slice

## Contexto sob demanda recomendado

| Gatilho              | Fonte                                        | Quando carregar              | Obrigatorio? |
| -------------------- | -------------------------------------------- | ---------------------------- | ------------ |
| UI web               | `design-system/front/brand/daryus-tokens.md` | tasks 007, 008, 009          | sim          |
| API                  | `contracts/openapi.yaml#/paths/...`          | tasks 001, 003-006, 008, 009 | sim          |
| Front-end            | `next-js/docs/ai/`                           | tasks 007, 008, 009          | sim          |
| Backend              | `backend/docs/ai/`                           | tasks 001-006                | sim          |
| Seguranca de produto | `backend/docs/ai/SECURITY.md`                | tasks 003, 004               | sim          |

## Risco de contexto

- medio (10 tasks, mas cada uma single-stack e pequena)
- estrategia: cada task le apenas `backend/docs/ai/` OU `next-js/docs/ai/`, nunca ambos; task shared (001, 010) e a unica que cruza.

## Security posture do slice

- nivel de risco default: alto (auth + multitenancy)
- perfil de origem sugerido: auth-sensitive para 003/004; api-back para 001/002/005/006; ui-front para 007/008/009; docs-only para 010
- human approvals recorrentes do slice: migration/schema de banco (todas as tasks back que alterarem entidades)
- contexto proibido herdado: `.env` real do backend, secrets de producao, dumps de dados
- observacao: listas operacionais completas vivem em cada task

## Observacoes de rastreabilidade

- Conflito PRD (Prisma) x scaffold (TypeORM) registrado em `tasks/000-index.md`, secao "Duvidas para validacao humana".

## Status final

planned
