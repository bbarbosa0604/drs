---
name: formulario
description: Cria ou refatora formularios publicos no projeto `next-js/`, usando Server Action e Zod. Use quando a tarefa envolver formulario de contato, captura de lead, validacao de campo, estado de envio, honeypot, limite de taxa ou gravacao em collection do Payload.
metadata:
  short-description: Cria formularios com Server Action e Zod
---

# Formulario

Use esta skill para construir formularios publicos do jeito desta stack: validacao no servidor, submit isolado da camada visual e protecao contra abuso desde o primeiro rascunho.

## Quando usar

- formulario publico novo (contato, captura de lead)
- validacao com Zod
- submit via Server Action
- honeypot, limite de taxa ou mensagens de erro

## Leitura inicial

- `AGENTS.md`
- `docs/ai/SECURITY.md`
- `docs/ai/PAYLOAD_CMS.md`
- `docs/ai/ACCESSIBILITY.md`

## Workflow

### 1. Valide sempre no servidor

- schema Zod define a estrutura e a regra de entrada
- Server Action recebe `FormData`, valida, so entao grava
- nunca confiar em validacao client como controle real

### 2. Proteja a mutation publica

- honeypot: campo invisivel, se preenchido responde sucesso e descarta
- limite de taxa por IP; acima do limite, erro generico, sem revelar o numero
- gravar via `adapters/payload/`, nunca `payload` direto no componente ou na Server Action de UI

### 3. Cuide do fluxo do usuario

- estado de carregando, erro e sucesso explicitos
- mensagem de erro associada ao campo (`aria-describedby`), foco no primeiro erro
- nao vazar erro interno da API/banco para a UI

### 4. Feche com checks

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Exemplos

- "Criar formulario de contato" -> Zod valida, Server Action grava lead via port, honeypot e limite de taxa ativos, feedback acessivel
- "Formulario aceitando spam" -> conferir honeypot, limite de taxa e se a validacao esta so no client
