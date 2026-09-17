# Task 005 - CRUD Organizacao

## Status

done

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/organizations`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

Organizacao e a entidade central reutilizavel entre projetos (PRD secao 5) — precisa existir antes de qualquer projeto.

### O que

CRUD de Organizacao com os campos do PRD secao 5 (razao social, segmento, colaboradores, abrangencia geografica, produtos/servicos, logotipo, historico, negocio, missao, visao, valores).

### Comportamento esperado

- cenario: DSR Admin ou Consultor cria organizacao -> registro persistido, usuario criador vira `OrganizationMember`.
- cenario: edicao de organizacao por usuario sem vinculo -> 403 (Task 004).

### Fora de escopo

- Upload de logotipo em storage definitivo (pode usar campo de URL/placeholder nesta task; storage S3 e tratado a fundo na Task 026)

## Casos de erro e borda

- Nome/razao social vazio -> 400
- Exclusao de organizacao com projetos ativos -> usar soft delete (PRD secao 28) e bloquear se houver dependencia critica (a decidir: bloquear ou cascatear soft delete — registrar como pendencia se ambiguo)

## Review da spec

- [x] Permissoes: criacao/edicao exige vinculo (DSR Admin ou Consultor membro)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: campos exatamente conforme PRD secao 5
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Reusar guard da Task 004 em todas as rotas
- Implementar soft delete (`deletedAt`)

### Nao deve

- Nao expor endpoint de listagem sem filtro por vinculo do usuario

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#5`

## Dependencias

- Task 004

## Slice vertical

### Identificador

Slice 001 - Fundacao da plataforma

### Arquivo

`tasks/slices/001-fundacao-plataforma.md`

### Fora do slice

- Storage definitivo de logotipo

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho | Fonte                    | Quando | Obrigatorio |
| ------- | ------------------------ | ------ | ----------- |
| API     | `contracts/openapi.yaml` | sempre | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 1 | risco: baixo

## Security Constraints

### Nivel de risco

medio

### Perfil de origem

api-back

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/organizations/**`
- shell: `cd backend && npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/organizations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco (se campos exigirem coluna nova alem da Task 002)

### Contexto proibido

- dados reais de organizacoes/clientes

### Criterios de saida

- [x] guard de acesso aplicado
- [x] lint/test passam

## Criterios de conclusao

- [x] CRUD completo de Organizacao com todos os campos do PRD secao 5, protegido por guard

## Validacao esperada

- `npm run test`

## Entregaveis esperados

- Modulo `organizations` (controller, service, DTOs)

## Riscos ou ambiguidades

- Politica de exclusao adotada (nao confirmada por humano ainda): bloquear DELETE com `409 Conflict` enquanto existir qualquer projeto nao deletado vinculado a organizacao, em vez de cascatear soft delete. Ver `OrganizationsService.remove` e pendencia abaixo.

## Resultado da execucao

- Nenhuma migration nova foi necessaria: todos os campos do PRD secao 5 ja existiam em `OrganizationEntity` desde a Task 002.
- `OrganizationInputDto` reflete exatamente o schema `OrganizationInput` do contrato (mesmo DTO usado em `POST` e `PATCH`, com `name` sempre obrigatorio).
- `OrganizationsService.findAllForUser` retorna todas as organizacoes para `UserRole.ADMIN` e apenas as organizacoes com `OrganizationMember` para os demais usuarios (nunca lista sem filtro de vinculo).
- `OrganizationsService.create` persiste a organizacao e cria automaticamente o `OrganizationMember` do usuario criador com papel `CONSULTANT`, mesmo quando o criador e DSR Admin.
- Rotas `:organizationId` (`GET`/`PATCH`/`DELETE`) usam `OrganizationAccessGuard` (Task 004) alem do `JwtAuthGuard` global do controller; `GET /organizations` e `POST /organizations` exigem apenas autenticacao.
- `DELETE /organizations/:organizationId` retorna `204 No Content` e bloqueia com `409 Conflict` quando ha projetos (nao deletados) vinculados — decisao registrada como pendencia, nao confirmada com o Bruno.

## Arquivos alterados

- Criado: `backend/src/modules/organizations/dto/organization-input.dto.ts`
- Criado: `backend/src/modules/organizations/organizations.service.ts`
- Criado: `backend/src/modules/organizations/organizations.service.spec.ts`
- Criado: `backend/src/modules/organizations/organizations.controller.ts`
- Modificado: `backend/src/modules/organizations/organizations.module.ts` (controller/service registrados; `ProjectEntity` importada apenas para leitura na checagem de exclusao)

## Validacoes executadas

- `npm run lint`: executado sem erros
- `npm run typecheck`: executado sem erros
- `npm run test`: executado com sucesso (7 suites, 26 testes)
- `npm run build`: executado com sucesso

## Pendencias pos-task

- Confirmar com o Bruno a politica de exclusao de organizacao com projetos ativos (bloquear vs. cascatear soft delete). Assumido "bloquear" como default seguro.
- Endpoint nao foi testado contra Postgres real (apenas testes unitarios com repositorio mockado); recomenda-se smoke test manual apos deploy.

## Status final

done
