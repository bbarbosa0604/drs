---
name: secao
description: Cria ou refatora um bloco de conteudo componivel no projeto `next-js/`, sempre como par `src/blocks/<Nome>/config.ts` (Payload) mais `src/components/sections/<Nome>/index.tsx` (render). Use quando a tarefa envolver hero, colagem, carrossel, grid de diferenciais, galeria, secao de contato ou qualquer trecho de pagina que o editor deva poder reordenar ou reutilizar.
metadata:
  short-description: Cria blocks de Payload pareados com secao de render
---

# Secao

Use esta skill para o padrao mais distintivo desta stack: um block do Payload sempre nasce com o componente de secao que o renderiza. Um sem o outro e erro.

## Quando usar

- novo block de pagina (hero, colagem, carrossel, grid, galeria, contato)
- secao existente que precisa virar block editavel
- ajuste de campos de um block ja existente

## Leitura inicial

- `AGENTS.md`
- `docs/ai/PAYLOAD_CMS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/ACCESSIBILITY.md`

## Workflow

### 1. Decida se e block ou codigo puro

- vira block quando o editor precisa escolher, reordenar ou editar o conteudo
- fica so em `components/sections/` sem block quando o conteudo nunca muda por CMS

### 2. Crie o par obrigatorio

- `src/blocks/<Nome>/config.ts`: campos do Payload, so o que muda sem deploy
- `src/components/sections/<Nome>/index.tsx`: renderiza os campos; token, proporcao de grid, curva de animacao e nivel de heading ficam aqui, nunca no config

### 3. Consuma pelo port

- a secao recebe dado ja mapeado pelo `core/content/`, nunca chama `payload` direto

### 4. Cuide de acessibilidade e semantica

- heading da secao segue a hierarquia da pagina, nunca escolhido pelo editor
- imagem com `alt` vindo do campo de upload; decorativo declarado

### 5. Feche com checks

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Exemplos

- "Criar secao de galeria com lightbox" -> block com lista de fotos e slot de posicao; componente cuida do grid, lightbox e foco preso
- "Adicionar campo de subtitulo ao hero" -> so no `config.ts`; componente ja aceita prop opcional
