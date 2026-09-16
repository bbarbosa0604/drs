---
name: seguranca
description: Revisa ou reforca aspectos de seguranca no projeto `next-js/`. Use quando a tarefa tocar autenticacao do admin, access control de collection, upload, formulario publico, variaveis de ambiente, richtext ou exposicao de dado nao publicado.
metadata:
  short-description: Revisa seguranca do next-js e do Payload
---

# Seguranca

Use esta skill para uma passada focada em seguranca no `next-js/`. As regras continuam vindo de `AGENTS.md`, `docs/ai/SECURITY.md` e `docs/ai/PAYLOAD_CMS.md`.

## Quando usar

Use esta skill quando houver:

- login do admin, sessao ou rota `/admin`
- access control de collection ou global
- upload de midia
- formulario publico ou mutation exposta
- ajuste de `.env`, `PAYLOAD_SECRET` ou `DATABASE_URL`
- renderizacao de richtext ou conteudo vindo do CMS
- pedido direto de review de seguranca

## Leitura inicial

- `AGENTS.md`
- `docs/ai/SECURITY.md`
- `docs/ai/PAYLOAD_CMS.md`
- `docs/ai/QA.md`

## Workflow

### 1. Mapeie a superficie de risco

Veja se a mudanca encosta em:

- secret no client bundle
- collection/global sem `access` declarado
- mutation publica sem limite de taxa
- richtext renderizado sem serializer
- `/admin` indexavel

### 2. Revise os riscos mais comuns desta stack

Cheque:

- `getPayload` ou import de `payload` fora de `adapters/`
- leitura publica retornando conteudo nao publicado
- upload sem tipo/limite de tamanho declarado
- erro bruto do Payload vazando para a UI
- `dangerouslySetInnerHTML` sem sanitizacao

### 3. Se houver mudanca de codigo, valide

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- grep em `.next/static` por `PAYLOAD_SECRET`, `DATABASE_URL`, `postgres://`: zero ocorrencia

## Como reportar

- priorize risco real e facil de explorar
- se nao achar problema, diga explicitamente
- se houver ponto sem cobertura, mencione como risco residual

## Exemplos

- "Revisar formulario de contato" -> honeypot, limite de taxa, validacao server-side, `access` de `leads`
- "Auditar collection nova" -> conferir `access` por operacao, upload e se algum campo sensivel esta com leitura publica
