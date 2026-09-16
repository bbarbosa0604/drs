# Development Workflow

## Criacao De Rotas E Paginas

1. Criar a rota em `src/app/`.
2. Usar `page.tsx` para a entrada principal da rota.
3. Adicionar `layout.tsx`, `loading.tsx`, `error.tsx` ou `not-found.tsx` somente quando o fluxo precisar.
4. Reutilizar components existentes antes de criar novos.
5. Manter a page como Server Component por padrao.

## Uso De Client Components

1. Criar client component separado quando houver estado, evento ou browser API.
2. Adicionar `"use client"` apenas no arquivo que realmente precisa.
3. Manter props serializaveis quando cruzarem boundary server/client.
4. Evitar mover services e regras de negocio para dentro de components interativos.

## Uso De Services

1. Criar o service em `services/`.
2. Se houver payload externo, criar adapter em `services/adapters/`.
3. Tipar entrada e saida em `types/`.
4. Consumir o service na page, server action, route handler ou hook conforme o caso.

## Uso De Ports E Adapters

1. Definir a entidade de dominio em `core/content/types.ts`.
2. Declarar a operacao no port em `core/content/ports.ts`.
3. Implementar o port em `adapters/payload/`, usando a Local API.
4. Criar o mapper de documento para entidade em `adapters/payload/mappers/`.
5. Consumir o port na page, sem importar a ferramenta de persistencia.

## Uso De Estado Compartilhado

1. Usar store/provider apenas para estado compartilhado entre modulos.
2. Manter a API do estado pequena e previsivel.
3. Usar selectors ou composicao para reduzir acoplamento entre components.

## Validacao Antes De Entregar

1. Rodar `npm run lint`.
2. Rodar `npm run typecheck`.
3. Rodar `npm run build` quando houver mudanca em rotas, config ou comportamento de renderizacao.
4. Executar os gates web e registrar os numeros na task quando houver rota publica. Ver `docs/ai/QA.md`.

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
