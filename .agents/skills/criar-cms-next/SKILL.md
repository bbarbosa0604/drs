---
name: criar-cms-next
description: mapear conteudo, fontes de dados e estruturas usadas por um front-end Next.js para implementar um CMS interno no proprio Next.js, com tela de login, tela de gerenciamento de conteudo, API interna do Next como fronteira obrigatoria, persistencia em Postgres e atualizacao do backlog unico, quando o projeto nao usar Payload CMS. Use quando o usuario pedir criar CMS proprio para servir conteudo do front-end, transformar conteudo estatico/JSON/arrays/componentes em dados editaveis, adicionar admin/login em next-js, ou conectar esse CMS a Postgres.
---

Execute a criacao de CMS para a stack `next-js` somente dentro de uma task valida da raiz.

## Entrada obrigatoria

Task em `tasks/*.md` contendo:

- `Tipo: front` ou `Tipo: shared`
- `Stacks envolvidos` incluindo `next-js`
- `Perfil do projeto` com `cms: proprio`
- `Modo de execucao`
- `Slice vertical` com caminho concreto para `tasks/slices/*.md`
- `Contexto minimo`
- `Contexto sob demanda`
- `Orcamento de contexto`
- referencia visual web quando houver UI customizada

Se nao houver task da raiz, nao implemente codigo. Use ou recomende `gerar-tasks-adicionais` para criar a task/slice do CMS no backlog unico.

## Regra de selecao

`criar-cms-next` e `criar-cms-payload` sao mutuamente exclusivas. Nunca execute as duas na mesma task, no mesmo slice ou no mesmo projeto sem nova decisao humana registrada.

A escolha e perguntada no planejamento e registrada em `Perfil do projeto` como `cms: payload | proprio | nenhum`. A skill le o perfil; nao decide sozinha.

Use `criar-cms-next` quando ao menos um for verdadeiro:

- a task pede admin escrito a mao dentro do proprio Next
- nao ha autorizacao para adicionar Payload como dependencia
- o CMS e minimo e escreve em schema ja existente do projeto
- o projeto nao pode pinar a versao de Next exigida pelo peer range do Payload

Use `criar-cms-payload` quando ao menos um for verdadeiro:

- a task cita Payload, `payload.config.ts`, collection, global ou block
- o conteudo precisa de editor pronto, upload de midia, rascunho e versionamento sem construir UI de admin
- o modelo de conteudo tem mais de 3 entidades ou blocos compostos por pagina
- o projeto migra de um CMS existente (WordPress, Strapi, Contentful)

Se o perfil nao declarar, bloqueie e peca decisao humana. Nao infira pela stack, pela existencia de Postgres nem pelo nome da task.

## Contexto inicial

Carregue primeiro apenas:

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- arquivo da task
- arquivo do slice indicado pela task
- `next-js/AGENTS.md`
- `next-js/docs/ai/AGENTS.md`

Depois declare quais fontes sob demanda serao lidas e por qual decisao:

- `design-system/front/`: para login, painel admin, formularios, tabelas, estados vazios, feedbacks e responsividade.
- `next-js/docs/ai/`: para arquitetura, seguranca, acessibilidade, padrao de componentes, services, hooks e estilo local.
- `contracts/openapi.yaml`: somente se a task envolver contrato externo ou integracao cliente-servidor fora da API interna do Next.
- `requirements/`: somente se a modelagem do conteudo depender de regra de negocio ausente na task.

Nao carregue `requirements/`, `design-system/`, `contracts/` ou `docs/ai/` inteiros sem gatilho concreto.

## Fluxo obrigatorio

1. Validar a task, o slice e a stack `next-js`.
2. Marcar a task como `in_progress`.
3. Mapear o front-end antes de editar codigo.
4. Inventariar conteudo e estruturas de dados.
5. Definir modelo do CMS e persistencia Postgres.
6. Definir fronteiras da API interna do Next.
7. Implementar banco, API, autenticacao, telas e consumo de conteudo.
8. Migrar ou semear o conteudo existente.
9. Validar build, tipos, lint, fluxo de login, CRUD e leitura publica.
10. Atualizar task, slice, `tasks/000-index.md` e handoff curto.

## Mapeamento do front-end

Use buscas focadas em `next-js/src` para encontrar:

- arrays/objetos exportados com conteudo;
- JSON, MD, MDX ou dados mockados;
- componentes que recebem listas, cards, depoimentos, planos, FAQ, banners, menus ou textos de pagina;
- chamadas `fetch`, services, hooks, contexts ou server actions relacionadas a conteudo;
- tipos/interfaces/DTOs que descrevem os dados renderizados;
- rotas publicas que consomem conteudo.

Produza um inventario tecnico antes da implementacao:

- entidade de conteudo;
- arquivo fonte atual;
- campos e tipos inferidos;
- relacoes entre entidades;
- telas/componentes consumidores;
- campos editaveis no CMS;
- validacoes necessarias;
- conteudo inicial para seed/migration;
- lacunas ou ambiguidades.

Se o front-end estiver amplo demais para mapear dentro do orcamento de contexto, bloqueie e recomende fatiar por entidade ou por rota publica.

## Modelo do CMS

Preserve o padrao existente do projeto. Se ja houver Prisma, Drizzle, Kysely, SQL direto ou outro ORM, use o padrao existente.

Se nao houver padrao de persistencia, prefira Prisma para Next.js + Postgres por oferecer schema, migrations e tipos gerados. Registre essa decisao na task.

Modele o CMS a partir do inventario:

- uma tabela por entidade editavel, salvo quando uma estrutura JSONB for claramente mais simples e justificavel;
- slugs unicos quando o conteudo for roteavel;
- campos `status`, `publishedAt`, `createdAt` e `updatedAt` quando houver publicacao;
- campos de ordenacao para listas exibidas no front-end;
- tabelas relacionais para colecoes aninhadas com CRUD proprio;
- seeds a partir do conteudo estatico atual;
- validacao compartilhada no servidor, preferencialmente com biblioteca ja usada no projeto.

Use `DATABASE_URL` para Postgres. Nunca exponha credenciais em variaveis `NEXT_PUBLIC_*`.

## Arquitetura obrigatoria

O front-end do Next deve conversar com a API interna do Next. A API interna conversa com o CMS/banco.

Regras:

- nenhum Client Component acessa Postgres, ORM, SDK de CMS ou secrets diretamente;
- nenhum codigo de UI importa cliente de banco ou modulo server-only de persistencia;
- rotas publicas consomem conteudo por `/api/content/...` ou equivalente declarado;
- telas admin consomem `/api/admin/...` ou equivalente declarado;
- Route Handlers ficam em `src/app/api/...` quando o projeto usa App Router;
- API routes ficam em `src/pages/api/...` quando o projeto usa Pages Router;
- a camada de dados fica em modulo server-only, por exemplo `src/server/`, `src/lib/server/` ou padrao local equivalente;
- mutations do CMS exigem autenticacao e validacao server-side;
- leituras publicas retornam somente campos publicados e seguros.

Nao burle a fronteira da API interna por conveniencia. Se uma excecao for inevitavel, registre o motivo, impacto e escopo na task antes de concluir.

## Autenticacao e seguranca

Use autenticacao existente se o projeto ja tiver uma solucao.

Se nao houver autenticacao:

- implemente login admin com senha armazenada como hash forte;
- use cookie de sessao `httpOnly`, `secure` em producao e `sameSite`;
- proteja rotas `/api/admin/*` e paginas admin;
- valide permissao em toda mutation, nao apenas na UI;
- normalize erros para nao vazar dados sensiveis;
- adicione protecao contra entrada invalida e payload excessivo;
- nao versionar `.env` com segredos reais.

Bloqueie se a task exigir autenticacao insegura ou expor credenciais ao browser.

## UI obrigatoria

Implemente no minimo:

- tela de login;
- tela de gerenciamento de conteudo;
- listagem por entidade ou secao;
- criar, editar e excluir quando a entidade for editavel;
- estados de carregamento, erro, vazio e sucesso;
- feedback apos salvar;
- acessibilidade de formularios, labels, foco, teclado e mensagens de erro;
- layout responsivo seguindo `design-system/front/`.

Para entidades complexas, comece pelo menor CRUD que entregue o slice vertical e registre limites restantes na task.

## Migracao de conteudo

Ao substituir conteudo estatico por CMS:

- preserve o conteudo atual como seed inicial;
- mantenha nomes, ordem e comportamento visual onde a task nao pedir mudanca;
- remova mocks apenas depois que a leitura via API interna estiver funcionando;
- mantenha fallback seguro para conteudo nao publicado ou ausente;
- registre na task quais fontes foram migradas e quais permaneceram estaticas.

## Validacao

Execute as validacoes disponiveis da stack:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Quando houver testes configurados, execute tambem os testes relevantes.

Valide manualmente ou por automacao:

- login invalido e login valido;
- acesso bloqueado a rotas admin sem sessao;
- CRUD de ao menos uma entidade do slice;
- leitura publica via API interna;
- renderizacao do front-end consumindo a API;
- seed/migration em banco Postgres ou ambiente equivalente configurado.

Se Postgres nao estiver disponivel localmente, registre o bloqueio e valide tudo que nao depender do banco real.

## Atualizacao obrigatoria

Ao finalizar, atualize:

- arquivo da task com status, resumo, decisoes, arquivos alterados, validacoes e pendencias;
- arquivo do slice quando status, riscos, entregas ou dependencias mudarem;
- `tasks/000-index.md`;
- handoff curto em `.agents/state/handoffs/`.

O handoff deve preservar apenas task, slice, status, decisoes, contexto usado, arquivos alterados, validacoes, pendencias e proximo contexto recomendado.

## Bloqueios

Marque a task como `blocked` quando:

- nao existir task valida da raiz;
- a task nao apontar `next-js`;
- `Perfil do projeto` nao declarar `cms: proprio`;
- a task pedir Payload, caso de `criar-cms-payload`;
- o escopo exigir mapear front-end inteiro sem slice pequeno;
- a fonte visual obrigatoria estiver ausente ou ambigua para UI critica;
- a estrutura de dados nao puder ser inferida com seguranca;
- nao houver decisao segura de autenticacao;
- o acesso a Postgres for necessario e nao houver configuracao suficiente para validar;
- o contrato externo for obrigatorio e estiver ausente ou inconsistente.
