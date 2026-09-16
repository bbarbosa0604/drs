# Architecture

## Fluxo Principal

Esta stack tem dois fluxos de dados. Cada task usa o que corresponde a origem do dado.

API externa:

`Route/Page -> Components -> Services -> API`

Conteudo local com CMS:

`Route/Page -> Port (core) -> Adapter (adapters/payload) -> Local API`

Detalhamento:

- `src/app/` monta rotas, layouts, pages e boundaries do App Router.
- `components/` concentra componentes reutilizaveis e composicoes de UI.
- `hooks/` encapsula estado de apresentacao e integracoes de client components.
- `services/` centraliza integracoes, adaptacao de dados e regras de acesso.
- `services/http/` concentra o cliente HTTP compartilhado quando houver API externa.
- `services/adapters/` converte resposta externa para modelo interno.
- `core/` guarda entidades de dominio e ports, sem conhecer infraestrutura.
- `adapters/` implementa os ports contra a infraestrutura real.

## Regra De Fronteira

- `core/` nao importa cliente de banco, SDK de CMS nem modulo de infraestrutura.
- Somente `adapters/` e a configuracao do CMS conhecem a ferramenta de persistencia.
- Page e component consomem o port, nunca a ferramenta.
- Nenhum Client Component acessa banco, CMS ou secret.
- Nao criar camada de caso de uso quando nao houver regra de negocio: a page chama o port direto.

## Server E Client Components

- Preferir Server Components para telas sem interatividade local.
- Usar Client Components somente quando houver estado, eventos, hooks de browser, stores ou APIs do navegador.
- Manter boundaries de `"use client"` pequenas e propositais.
- Nao mover uma pagina inteira para client component se apenas um trecho precisa de interatividade.

## Estado

- Estado local pertence ao menor client component possivel.
- Estado compartilhado deve ficar em stores ou providers apenas quando varios modulos realmente dependerem dele.
- Estado derivado de API deve ser encapsulado em services, hooks ou mecanismos oficiais do Next.js conforme o caso.

## Rotas

- `src/app/layout.tsx` define estrutura raiz.
- `src/app/page.tsx` define a rota inicial.
- Novas rotas devem seguir o App Router, com `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` e `not-found.tsx` quando aplicavel.

## Estrutura De Pastas

- `components/`: componentes reutilizaveis e composicoes de dominio.
- `constants/`: constantes compartilhadas.
- `hooks/`: hooks de client components.
- `core/`: entidades de dominio e ports, sem dependencia de infraestrutura.
- `adapters/`: implementacoes de port na fronteira com a infraestrutura.
- `blocks/`: configuracao de bloco de conteudo, quando houver CMS.
- `patterns/`: implementacoes pequenas de patterns recorrentes.
- `services/`: integracoes e regras de acesso externo.
- `types/`: contratos tipados usados em toda a aplicacao.
- `utils/`: utilitarios puros e sem dependencia de UI.

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
