---
name: porta
description: Cria ou ajusta um port e seu adapter no projeto `next-js/`, em `core/content/` e `adapters/`. Use quando a tarefa envolver nova fonte de dado (Payload, API externa ou outra), nova entidade de dominio, mapper de documento externo, ou isolar acesso direto a uma ferramenta de infraestrutura que apareceu fora da fronteira.
metadata:
  short-description: Cria ports e adapters no padrao hexagonal do next-js
---

# Porta

Use esta skill para manter a fronteira que isola o front da ferramenta de dado. Ela existe porque `core/` nunca pode importar infraestrutura, e so `adapters/` pode.

## Quando usar

- nova entidade de conteudo precisando de port
- nova fonte de dado (Payload, API externa, outro CMS)
- mapper de documento externo para entidade de dominio
- `getPayload`, `fetch` externo ou cliente de banco aparecendo fora de `adapters/`

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/PAYLOAD_CMS.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Declare a entidade e o port

- entidade de dominio em `core/content/types.ts`
- interface do port em `core/content/ports.ts`, so com o que o front realmente consome
- `core/` nunca importa `payload`, cliente de banco ou SDK externo

### 2. Implemente o adapter

- `adapters/payload/` (ou `adapters/<fonte>/` para outra fonte) implementa o port
- mapper em `adapters/<fonte>/mappers/` converte o formato externo para a entidade
- filtro de publicacao e tag de cache ficam no adapter, nunca no port

### 3. Nao crie camada de caso de uso sem necessidade

- se nao houver regra de negocio real, a page chama o port direto
- camada de caso de uso so quando houver orquestracao de mais de uma fonte ou regra que nao pertence nem ao port nem ao adapter

### 4. Feche com checks e grep de fronteira

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- grep por `getPayload` e `from "payload"` em `src/app`, `src/components` e `src/core`: deve retornar zero fora de `adapters/` e `payload.config.ts`

## Exemplos

- "Buscar depoimentos de uma API externa nova" -> port em `core/content/`, adapter proprio em `adapters/depoimentos/`, mapper convertendo o payload externo
- "Componente importando payload direto" -> mover o acesso para um adapter e trocar o componente para consumir o port
