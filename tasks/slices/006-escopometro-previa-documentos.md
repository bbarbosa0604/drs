# Slice 006 - Escopometro: Previa, Documentos & Productizacao

## Status

planned

## Objetivo de negocio

Permitir que o Consultor visualize uma previa consolidada do Escopometro e gere os documentos oficiais (Declaracao de Escopo, Proposta de Aprovacao em DOCX, Apresentacao em PPTX), com auditoria de operacoes relevantes e versionamento que protege versoes aprovadas contra sobrescrita silenciosa.

## Entrega verificavel

O Consultor abre a Etapa 8, ve a previa consolidada (organizacao, projeto, versao, declaracao, estatisticas, elementos incluidos/excluidos, interfaces, recursos, diagramas), gera os 3 documentos do MVP, e toda alteracao relevante fica registrada em `AuditLog`. Uma versao aprovada nao pode ser sobrescrita sem gerar nova versao/revisao controlada.

## Fora de escopo

- Exportacao em PDF (fica para depois, PRD secao 17)
- Bibliotecas administraveis completas (requisitos legais, templates) alem do que ja existe nos slices anteriores
- IA para apoio a redacao (evolucao futura, PRD secao 33)

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nenhum

## Stacks envolvidas

- next-js
- backend

## Contrato

- `contracts/openapi.yaml#/paths/...` (a criar: `/sgsi-scopes/{id}/preview`, `/documents`, `/audit-log`, `/sgsi-scopes/{id}/versions`)

## Referencia visual por stack

### Web

- tipo: artefato de design system
- fonte primaria: `design-system/front/brand/daryus-tokens.md`

### Mobile

- nao se aplica

## Permissoes e atores

- Consultor/Especialista gera documentos e ve a previa.
- DSR Admin pode consultar `AuditLog` (alem do consultor, se aplicavel — a confirmar na task 027).

## Casos de erro e borda

- Geracao de documento com campos obrigatorios vazios (ex.: declaracao de escopo em branco) -> bloquear geracao com mensagem clara, nao gerar documento incompleto silenciosamente.
- Tentativa de alterar uma `SgsiScopeVersion` com status aprovado -> sistema cria nova versao/revisao em vez de sobrescrever (PRD secao 20/44).
- Falha no storage S3-compatible ao salvar documento gerado -> nao marcar como "gerado" no historico se o upload falhar.
- Requisicao de auditoria para organizacao/projeto que o usuario nao tem acesso -> 403 (mesma regra de IDOR do Slice 001).

## Decisoes humanas confirmadas

- Tres documentos do MVP: Declaracao de Escopo (DOCX), Proposta de Aprovacao (DOCX), Apresentacao para Aprovacao (PPTX) — PRD secao 17.
- Geracao de documentos desacoplada da UI via `DocumentGenerationService` (PRD secao 17/44).

## Premissas adotadas

- Storage: object storage compativel com S3 (sem provedor especifico definido — a task 026 deve tratar como configuravel/local em dev).
- `AuditLog` cobre criacao, alteracao, exclusao, mudanca de status, geracao de documento, submissao para revisao, aprovacao (PRD secao 21).

## Tasks relacionadas

- `tasks/025-ui-etapa8-previa-exportacao.md` - UI Etapa 8
- `tasks/026-document-generation-service.md` - DocumentGenerationService + storage
- `tasks/027-auditoria-versionamento.md` - AuditLog + versionamento SgsiScopeVersion

## Dependencias do slice

- Slice 005

## Contexto minimo recomendado

- `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, este slice

## Contexto sob demanda recomendado

| Gatilho              | Fonte                                        | Quando carregar | Obrigatorio? |
| -------------------- | -------------------------------------------- | --------------- | ------------ |
| UI web               | `design-system/front/brand/daryus-tokens.md` | task 025        | sim          |
| API                  | `contracts/openapi.yaml#/paths/...`          | todas           | sim          |
| Front-end            | `next-js/docs/ai/`                           | task 025        | sim          |
| Backend              | `backend/docs/ai/`                           | tasks 026, 027  | sim          |
| Seguranca de produto | `backend/docs/ai/SECURITY.md`                | task 027        | sim          |

## Risco de contexto

- medio — geracao de documentos e storage podem exigir dependencias novas (human approval).

## Security posture do slice

- nivel de risco default: medio/alto (auditoria, versionamento, upload de arquivos)
- perfil de origem sugerido: ui-front (025); infra-risk (026); auth-sensitive (027)
- human approvals recorrentes: instalar dependencia de geracao DOCX/PPTX; configurar storage S3-compatible; migration/schema
- contexto proibido herdado: credenciais reais de storage/producao

## Observacoes de rastreabilidade

- Nenhum conflito adicional.

## Status final

planned
