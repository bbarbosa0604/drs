# Component Reuse

## `src/app/`

Usado para estrutura de rotas:

- layouts
- pages
- loading states
- error boundaries
- metadata e route-level composition

Nao deve virar deposito de componentes reutilizaveis.

## `components/`

Usado para componentes reutilizaveis e composicoes:

- components base de UI
- components de dominio
- sections de tela reutilizaveis
- componentes client quando houver interacao

Devem continuar pequenos e focados.

## `services/`

Usado para integracoes e regras de acesso:

- clientes HTTP
- chamadas de API
- adapters
- normalizacao de erro

Nao deve conhecer detalhes de layout.

## `core/`

Usado para o dominio da aplicacao:

- entidades de conteudo
- ports de leitura e escrita
- tipos que a UI consome

Nao deve importar infraestrutura nem conhecer o formato do CMS.

## `adapters/`

Usado para implementar os ports contra a infraestrutura:

- acesso a Local API do CMS
- mappers de documento para entidade
- filtro de publicacao e chave de cache

Nao deve ser importado por page nem por component.

## `hooks/`

Usado para comportamento de client components:

- estado de formulario
- estado local de tela
- integracao com stores
- efeitos dependentes de browser APIs

Nao deve ser usado em Server Components.

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
