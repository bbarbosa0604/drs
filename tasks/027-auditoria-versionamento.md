# Task 027 - AuditLog + versionamento SgsiScopeVersion (protecao contra sobrescrita)

## Status

planned

## Tipo

back

## Stacks envolvidos

- backend

## Perfil do projeto

- stack web escolhida: next-js | backend separado: sim

## Contrato

- `contracts/openapi.yaml#/paths/sgsi-scopes/{id}/versions`, `#/audit-log`

## Modo de execucao

single-stack

## Referencia de design system

nao se aplica (task sem UI)

## Contexto de negocio

### Por que

PRD exige rastreabilidade completa (secao 21) e que "uma versao aprovada nao deve ser silenciosamente sobrescrita" (secao 20/44) — sem isso, o produto perde credibilidade como ferramenta de consultoria/certificacao.

### O que

Entidade `AuditLog` (organizacao, projeto, usuario, entidade, entidadeId, acao, timestamp, metadata) registrando criacao/alteracao/exclusao/mudanca de status/geracao de documento/submissao para revisao/aprovacao; logica de versionamento que cria nova `SgsiScopeVersion` (ou revisao controlada) em vez de sobrescrever uma versao com status aprovado.

### Comportamento esperado

- cenario: qualquer alteracao relevante no Escopometro -> gera entrada em `AuditLog`.
- cenario: tentar editar uma `SgsiScopeVersion` com status aprovado -> sistema cria nova versao automaticamente ou bloqueia a edicao direta, nunca sobrescreve em silencio.
- cenario: consultar historico de auditoria de um projeto -> so acessivel a quem tem vinculo (guard da Task 004).

### Fora de escopo

- UI de auditoria (nao especificada no PRD como tela propria do MVP; se necessaria, registrar como pendencia)

## Casos de erro e borda

- Volume alto de eventos de auditoria -> nao e requisito de performance do MVP, mas a query de listagem deve suportar paginacao basica
- Falha ao gravar AuditLog -> nao deve impedir a operacao principal, mas deve ser logada como erro interno (trade-off a documentar)

## Review da spec

- [x] Permissoes: consulta de auditoria restrita por vinculo a organizacao/projeto (e potencialmente so DSR Admin — a confirmar)
- [x] Casos de erro mapeados (acima)
- [x] Decisoes humanas confirmadas: lista de operacoes auditadas conforme PRD secao 21; regra de nao sobrescrever versao aprovada (secao 20/44)
- [x] Criterios de aceite objetivos (ver Criterios de conclusao)
- [x] Casos de borda considerados (acima)
- [x] Security Constraints materializadas (abaixo)

## Especificacao tecnica

### Deve

- Centralizar a gravacao de `AuditLog` num service/interceptor reutilizavel, nao espalhar chamadas manuais em cada controller
- Implementar a checagem de "versao aprovada nao editavel diretamente" no service de `SgsiScopeVersion`, nao na UI

### Nao deve

- Nao permitir que a UI seja a unica barreira contra sobrescrita de versao aprovada (a garantia real e no backend)

## Entradas

- `contracts/openapi.yaml`
- `requirements/001-prd-escopometro-sgsi.md#20, #21, #44`
- `backend/docs/ai/SECURITY.md`

## Dependencias

- Slice 005 completo, Task 011 (SgsiScopeVersion base)

## Slice vertical

### Identificador

Slice 006 - Escopometro: Previa, Documentos & Productizacao

### Arquivo

`tasks/slices/006-escopometro-previa-documentos.md`

### Fora do slice

- UI de auditoria dedicada

## Contexto minimo

`AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, esta task

## Contexto sob demanda

| Gatilho              | Fonte                         | Quando                             | Obrigatorio |
| -------------------- | ----------------------------- | ---------------------------------- | ----------- |
| API                  | `contracts/openapi.yaml`      | sempre                             | sim         |
| Seguranca de produto | `backend/docs/ai/SECURITY.md` | sempre (auditoria e dado sensivel) | sim         |

## Orcamento de contexto

- Fontes obrigatorias: 5 | sob demanda: 2 | risco: medio

## Security Constraints

### Nivel de risco

alto

### Perfil de origem

auth-sensitive

### Tools permitidas

- read: `backend/`, `contracts/`
- edit: `backend/src/modules/audit-log/**`, `backend/src/modules/sgsi-scope/versioning/**`
- shell: `cd backend && npm run migration:generate`, `npm run lint`, `npm run test`
- git: local

### Paths permitidos para escrita

- `backend/src/modules/audit-log/**`, `backend/src/modules/sgsi-scope/versioning/**`, `backend/src/database/migrations/**`

### Acoes que exigem human approval

- [x] migration/schema de banco

### Contexto proibido

- dados reais de usuarios/clientes de producao

### Criterios de saida

- [ ] teste comprova bloqueio de sobrescrita de versao aprovada
- [ ] lint/test passam

## Criterios de conclusao

- `AuditLog` grava todas as operacoes listadas no PRD secao 21; versao aprovada nunca e sobrescrita silenciosamente (testado)

## Validacao esperada

- `npm run test` incluindo teste especifico de tentativa de sobrescrita de versao aprovada

## Entregaveis esperados

- Modulo `audit-log` + logica de versionamento protegida

## Riscos ou ambiguidades

- Definir se consulta de `AuditLog` e exclusiva de DSR Admin ou tambem visivel ao Consultor do proprio projeto — registrar como duvida se nao decidido ate a execucao

## Status final

planned
