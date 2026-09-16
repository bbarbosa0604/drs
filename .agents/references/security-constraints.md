# Security Constraints no SDD

Use esta referencia quando planejar ou executar tasks com limites de tools, human approval, contexto proibido ou criterios de saida de seguranca do agente.

Esta referencia governa **seguranca operacional do agente** (o que a IA pode fazer e carregar). Nao substitui `docs/ai/SECURITY.md` das stacks, que governa **seguranca de produto** (JWT, DTO, guards, secrets de app).

## Principio

Toda task da raiz deve carregar um bloco `## Security Constraints` **completo e materializado**.

- A skill `planejar-tasks` (ou `gerar-tasks-adicionais`) escolhe um perfil interno de risco e **expande** o perfil em listas concretas na task.
- O usuario **revisa** o bloco; nao monta o bloco do zero.
- A skill `executar-task` **le e aplica** o que esta na task. Nao reinterpreta so o nome do perfil.

O nome do perfil pode ser registrado como origem (`gerado a partir de auth-sensitive`), mas a fonte de verdade operacional e a lista materializada.

## Os cinco pilares

1. **Secao Security Constraints** — bloco formal na task (obrigatorio) e posture enxuta no slice (opcional, herdada).
2. **Tools permitidas** — allowlist. Tudo fora da lista e proibido por omissao.
3. **Acoes com human approval** — gate humano bloqueante antes da acao.
4. **Contexto proibido** — denylist mais forte que progressive disclosure.
5. **Criterios de saida / validacao** — checklist para fechar `done` com compliance.

## Categorias de tools (host-agnostico)

Prefira categorias e exemplos de comando em vez de nomes de tools de um host especifico (Grok, Claude, etc.).

| Categoria | Significado |
|---|---|
| `read` | ler/listar/buscar arquivos em paths permitidos |
| `edit` | criar/alterar arquivos em paths permitidos |
| `shell:<cmds>` | comandos de shell explicitamente listados |
| `git:local` | status, diff, log, commit local (sem push) |
| `git:remote` | push, pull, fetch (quase sempre human approval) |
| `network/MCP` | chamadas externas ou integracoes MCP |
| `skill:<nome>` | skills locais permitidas |

## Perfis default (atalho interno da skill de planejamento)

A skill escolhe um perfil e **materializa** na task. Nao deixe so o nome do perfil.

### `docs-only`

- Quando: governanca do scaffold, markdown, skills, tasks, docs de processo.
- Risco: baixo.
- Tools: `read` + `edit` em paths de governanca (`.agents/`, `tasks/`, `AGENTS.md`, `GUIDE.md`, `docs/development/`).
- Shell: normalmente nenhum, ou apenas checks documentais se a task exigir.
- Human approval: push/PR remoto se a sessao for publicar; demais `nao se aplica` se so markdown local.
- Contexto proibido: codigo de produto sem gatilho, `.env` real, `node_modules/`, stacks de produto.

### `ui-front`

- Quando: task front sem auth/PII.
- Risco: baixo ou medio.
- Tools: `read`/`edit` na stack web envolvida (`front-end/` ou `next-js/`) + design-system front apontado; shell `lint|test|build|typecheck` na stack.
- Human approval: novas dependencias; desvio consciente de design system; push/PR.
- Contexto proibido: stacks nao envolvidas, secrets, backend inteiro sem API nesta task.

### `api-back`

- Quando: endpoint, service, repository, migration sem foco em auth.
- Risco: medio.
- Tools: `read`/`edit` em `backend/` (paths da task) + path do contrato se houver; shell `lint|test|test:e2e|build` em `backend/`.
- Human approval: migration/schema; endpoint publico novo; novas deps; alteracao breaking de OpenAPI; push/PR.
- Contexto proibido: `.env` real, dumps, stacks front/mobile se nao envolvidas.

### `auth-sensitive`

- Quando: login, JWT, roles, permissoes, PII, dados sensiveis.
- Risco: alto.
- Tools: como `api-back` + skill local de seguranca/auth da stack; docs `SECURITY.md` da stack.
- Human approval: claims/expiracao JWT; handling de secret; migration de users/roles; endpoint publico ou remocao de guard; deps; push/PR.
- Contexto proibido: tokens reais, dumps de usuarios, secrets de producao, stacks nao envolvidas.

### `cross-stack`

- Quando: task `shared` com integracao cliente-servidor.
- Risco: medio ou alto.
- Tools: apenas nas stacks listadas em `Stacks envolvidos` + contrato.
- Human approval: breaking change de contrato; ordem de deploy; deps em mais de uma stack; push/PR.
- Contexto proibido: stack nao listada; requirements/design-system inteiros sem gatilho.

### `infra-risk`

- Quando: CI/CD, env, secrets de deploy, permissoes de infra.
- Risco: alto.
- Tools: minimo necessario; preferir bloquear e pedir humano cedo.
- Human approval: **quase tudo** (alterar pipeline, secrets, permissoes, deploy).
- Contexto proibido: credenciais reais; copiar secrets para logs ou handoff.

## Regras de materializacao

Ao gerar a task, a skill deve preencher:

1. `Nivel de risco`
2. `Perfil de origem` (opcional, so rastreio)
3. `Tools permitidas` (lista concreta)
4. `Paths permitidos para escrita`
5. `Acoes que exigem human approval` (marcadas ou `nao se aplica` item a item)
6. `Contexto proibido`
7. `Criterios de saida / validacao de seguranca`

Se risco for `medio` ou `alto` e a allowlist ficar generica demais ("qualquer coisa no backend"), o planejamento nao deve ser tratado como fechado: registrar lacuna ou restringir antes de concluir.

## Enforcement na execucao

`executar-task` deve:

1. Validar presenca e completude de `## Security Constraints`.
2. Se ausente/incompleto → `blocked` (tasks novas). Tasks legadas sem bloco: registrar risco e, se risco aparente medio/alto, bloquear ou pedir constraints antes de seguir.
3. Declarar tools/paths que pretende usar e confrontar com a allowlist.
4. Se a acao estiver em human approval → **parar e pedir confirmacao** antes de executar.
5. Antes de carregar fonte sob demanda → checar **contexto proibido**.
6. No fechamento → verificar criterios de saida de seguranca; falha → nao marcar `done` silenciosamente.
7. Registrar compliance no relatorio, na task e no handoff.

## Relacao com progressive disclosure

| Conceito | Pergunta |
|---|---|
| Contexto minimo | O que sempre se le no inicio? |
| Contexto sob demanda | O que pode ser lido se houver gatilho? |
| Contexto proibido | O que **nunca** pode entrar, mesmo com curiosidade? |
| Orçamento de contexto | Quantas fontes ainda sao seguras de carregar? |

Contexto proibido vence qualquer gatilho informal. So entra se a task for explicitamente reescrita e o humano aprovar o relaxamento.

## Relacao com app-security

- Agent-security: este documento + bloco na task.
- App-security: `*/docs/ai/SECURITY.md` e skills locais (`seguranca`, `auth`, etc.).

Em tasks `auth-sensitive` ou com dados sensiveis, aplicar **os dois**: constraints do agente na execucao e review de seguranca de produto no codigo.

## Anti-padroes

- Deixar so `perfil: auth-sensitive` sem listas.
- Allowlist vazia ou "todas as tools".
- Human approval so como nota de rodape apos a acao.
- Copiar secrets para handoff "para a proxima sessao".
- Misturar checklist de JWT/helmet dentro de "tools permitidas".
- Omitir o bloco em task de "risco baixo" — o bloco existe; o conteudo fica curto.

## Exemplo minimo (docs-only)

```markdown
## Security Constraints

### Nivel de risco
baixo

### Perfil de origem
docs-only

### Tools permitidas
- read em `.agents/`, `tasks/`, `AGENTS.md`, `GUIDE.md`
- edit apenas nos paths listados em `Paths permitidos para escrita`
- shell: nenhum

### Paths permitidos para escrita
- `.agents/**`
- `tasks/**`
- `AGENTS.md`
- `GUIDE.md`

### Acoes que exigem human approval
- [ ] instalar/remover dependencias — nao se aplica
- [ ] alterar `contracts/openapi.yaml` — nao se aplica
- [ ] migration / schema — nao se aplica
- [ ] push remoto / abrir PR — sim, se a sessao for publicar
- [ ] alterar secrets, `.env`, CI/CD — nao se aplica
- [ ] expor endpoint publico novo — nao se aplica

### Contexto proibido
- `.env` real e secrets
- `node_modules/`, `dist/`
- codigo de produto em `front-end/`, `next-js/`, `backend/`, `mobile/` sem gatilho
- historico bruto de conversa longa (usar handoff)

### Criterios de saida / validacao de seguranca
- [ ] tools usadas ⊆ tools permitidas
- [ ] nenhuma escrita fora dos paths permitidos
- [ ] human approvals obtidos ou nao se aplica
- [ ] nenhum secret commitado ou logado
- [ ] handoff registra compliance das constraints
```
