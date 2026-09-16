---
name: colecao
description: Cria ou ajusta collection, global ou campo no Payload CMS do projeto `next-js/`. Use quando a tarefa envolver novo campo, ajuste de access control, upload, relacao, draft/publicacao ou pequena mudanca de modelo depois que a fundacao do CMS ja existe.
metadata:
  short-description: Ajusta collections e globals do Payload
---

# Colecao

Use esta skill para mudanca pontual de modelo de conteudo, depois que a fundacao do Payload ja existe. Para implantar o CMS pela primeira vez num projeto, use a skill da raiz `criar-cms-payload`, nao esta.

## Quando usar

- novo campo numa collection ou global existente
- ajuste de `access` por operacao
- adicionar relacao, upload ou bloco a uma collection
- decidir se um conteudo novo e collection, global ou block

## Leitura inicial

- `AGENTS.md`
- `docs/ai/PAYLOAD_CMS.md`
- `docs/ai/SECURITY.md`

## Workflow

### 1. Decida a forma do conteudo

- collection para muitos registros com identidade propria
- global para registro unico de configuracao
- block quando o campo faz parte de uma secao componivel (nesse caso, ver skill `secao`)

### 2. Aplique o criterio CMS vs codigo

- editavel sem deploy: texto, imagem, alt, ordem, link, dado de contato, campo de SEO
- fica em codigo: token, proporcao, animacao, logica de carrossel, estrutura semantica

### 3. Declare acesso e publicacao

- `access` explicito por operacao; sem declaracao, negar
- leitura publica so retorna `_status: published`
- alteracao publicada dispara `revalidateTag` no hook (ver `docs/ai/PAYLOAD_CMS.md`)

### 4. Feche com checks

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Exemplos

- "Adicionar campo de video ao hero" -> campo no `config.ts` do block correspondente, tipo e obrigatoriedade definidos, componente ja preparado para prop opcional
- "Permitir editor destacar um diferencial" -> campo `featured` booleano com `access.update` restrito a autenticado
