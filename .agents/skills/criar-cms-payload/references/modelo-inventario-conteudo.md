# Modelo de inventario de conteudo

# Inventario de conteudo - <projeto / slice>

## Fonte de conteudo

- origem: codigo estatico | JSON | MD/MDX | CMS existente | export de site | outra
- caminhos concretos analisados:
- o que nao foi analisado e por que:

## Inventario por entidade

| Entidade | Origem atual | Campos e tipos | Relacoes | Consumidores | Editavel no CMS? | Validacao | Seed inicial |
| -------- | ------------ | -------------- | -------- | ------------ | ---------------- | --------- | ------------ |
|          |              |                |          |              | sim/nao          |           |              |

Uma linha por entidade. `Consumidores` aponta a tela ou o componente que renderiza hoje.

## Mapa de destino

| Entidade | Destino                              | Motivo |
| -------- | ------------------------------------ | ------ |
|          | collection / global / block / codigo |        |

Aplicar o criterio de `regras-modelagem-payload.md`. Registrar o motivo quando a escolha nao for obvia.

## Blocks e componentes pareados

| Block | Config                        | Componente de secao                        |
| ----- | ----------------------------- | ------------------------------------------ |
|       | `src/blocks/<Nome>/config.ts` | `src/components/sections/<Nome>/index.tsx` |

Block sem componente ou componente sem block e erro. Listar os dois lados.

## O que fica em codigo

- item e motivo

Tudo que quebra a interface se editado errado: token, proporcao de grid, curva e duracao de animacao, logica de carrossel e lightbox, icone, estrutura semantica e nivel de heading.

## Rotas e cache

| Rota | Origem do conteudo | Estrategia de cache                       | Tag de revalidacao |
| ---- | ------------------ | ----------------------------------------- | ------------------ |
|      |                    | estatica / revalidacao por tag / dinamica |                    |

Rota sem estrategia declarada bloqueia a task.

## Lacunas e ambiguidades

- lacuna e impacto

## Decisoes que exigem humano

- decisao, opcoes e recomendacao

Nao seguir para modelagem com decisao humana em aberto que mude a forma do conteudo.
