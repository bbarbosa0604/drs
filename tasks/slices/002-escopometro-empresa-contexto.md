# Slice 002 - Escopometro: ativacao, Empresa & Contexto

## Status

planned

## Objetivo de negocio

Permitir que um Consultor ative o modulo Escopometro SGSI num projeto e preencha as duas primeiras etapas (Empresa e Contexto), com salvamento automatico, sem perder trabalho.

## Entrega verificavel

Dentro de um projeto, o Consultor ativa o Escopometro, preenche dados da empresa (reaproveitando dados da Organizacao), controle documental, e o contexto organizacional (historico, direcionadores, questoes externas/internas). As alteracoes sao salvas automaticamente com feedback visual (Salvando/Salvo/Erro).

## Fora de escopo

- Etapas 3-8 do Escopometro (slices 003-006)
- Geracao de documentos
- Importacao de outros modulos (Identificometro/CJD) alem do JSON auxiliar

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nenhum

## Stacks envolvidas

- next-js
- backend

## Contrato

- `contracts/openapi.yaml#/paths/...` (a criar: `/projects/{id}/modules`, `/sgsi-scopes`, `/sgsi-scopes/{id}/context`)

## Referencia visual por stack

### Web

- tipo: artefato de design system
- fonte primaria: `design-system/front/brand/daryus-tokens.md`

### Mobile

- nao se aplica

## Permissoes e atores

- Consultor/Especialista: unico papel que preenche o Escopometro no MVP.
- Autorizacao herdada do Slice 001 (vinculo a organizacao/projeto).

## Casos de erro e borda

- Autosave falha (rede/servidor) -> exibir "Erro ao salvar" e permitir retry, nunca perder o texto ja digitado localmente.
- Ativar Escopometro num projeto que ja o tem ativo -> idempotente, nao duplicar ModuleInstance.
- Importacao JSON de referencia com `schemaVersion` incompativel -> rejeitar com mensagem clara, nao quebrar o formulario.
- Dados da Organizacao alterados depois de copiados para a Etapa 1 -> nao propagar retroativamente sem acao explicita do usuario (evitar sobrescrita silenciosa).

## Decisoes humanas confirmadas

- Regra critica do PRD: dados importados de outros modulos sao so referencia, nunca definem escopo automaticamente (deve aparecer na UI como aviso).
- Navegacao entre as 8 etapas e livre, sem obrigar conclusao sequencial.

## Premissas adotadas

- Editor de conteudo rico (historico) usa TipTap armazenando JSON estruturado (PRD secao 29), nao HTML livre.
- Autosave com debounce (~1-2s), sem necessidade de botao "Salvar" obrigatorio.

## Tasks relacionadas

- `tasks/011-ativacao-modulo-sgsiscope.md` - ativacao ModuleInstance + SgsiScope/SgsiScopeVersion/DocumentControl + autosave
- `tasks/012-contexto-organizacional.md` - OrganizationContext/OrganizationValue/ContextAspect
- `tasks/013-ui-etapa1-empresa.md` - UI Etapa 1 Empresa
- `tasks/014-ui-etapa2-contexto.md` - UI Etapa 2 Contexto

## Dependencias do slice

- Slice 001

## Contexto minimo recomendado

- `AGENTS.md`, `GUIDE.md`, `.agents/context-map.md`, `tasks/000-index.md`, este slice

## Contexto sob demanda recomendado

| Gatilho   | Fonte                                        | Quando carregar | Obrigatorio? |
| --------- | -------------------------------------------- | --------------- | ------------ |
| UI web    | `design-system/front/brand/daryus-tokens.md` | tasks 013, 014  | sim          |
| API       | `contracts/openapi.yaml#/paths/...`          | todas           | sim          |
| Front-end | `next-js/docs/ai/`                           | tasks 013, 014  | sim          |
| Backend   | `backend/docs/ai/`                           | tasks 011, 012  | sim          |

## Risco de contexto

- baixo — 4 tasks, escopo bem delimitado por etapa.

## Security posture do slice

- nivel de risco default: medio (dados institucionais, sem dado sensivel de terceiros ainda)
- perfil de origem sugerido: api-back (011, 012); ui-front (013, 014)
- human approvals recorrentes: migration/schema para novas entidades
- contexto proibido herdado: dados de outras organizacoes/projetos fora do escopo autorizado

## Observacoes de rastreabilidade

- Prototipo HTML v0.1.3 nao disponivel — UI segue especificacao textual do PRD (secoes 8-9).

## Status final

planned
