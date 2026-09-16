---
name: criar-cms-payload
description: implementar payload cms dentro da propria stack next-js via local api, com admin em /admin, route groups frontend e payload, collections globals e blocks modelados a partir de um inventario de conteudo, acesso ao cms isolado atras de ports em core e adapters na fronteira, criterios de performance seo acessibilidade e seguranca medidos em numero, e atualizacao do backlog unico do projeto. Use quando o usuario pedir criar cms com payload, adicionar payload ao next, modelar collections globals ou blocks, migrar conteudo de wordpress ou outro cms para payload, ou colocar admin do payload dentro do next.
---

Execute a implementacao de Payload CMS dentro da stack `next-js` somente dentro de uma task valida da raiz do projeto.

## Entrada obrigatoria

Task em `tasks/*.md` de um projeto sob `projetos/`, contendo:

- `Tipo: front` ou `Tipo: shared`
- `Stacks envolvidos` incluindo `next-js`
- `Perfil do projeto` com `cms: payload`
- `Modo de execucao`
- `Slice vertical` com caminho concreto para `tasks/slices/*.md`
- `Contexto mínimo`
- `Contexto sob demanda`
- `Orçamento de contexto`
- `## Security Constraints` materializado
- destino do banco em dev e em producao
- estrategia de cache e revalidacao das rotas afetadas
- referencia visual web quando houver UI publica

Se nao houver task da raiz, nao implemente codigo. Use ou recomende `gerar-tasks-adicionais` para criar a task/slice do CMS no backlog unico.

Se a task estiver na raiz do scaffold e nao em `projetos/<nome>/`, bloqueie. Ver `.agents/references/novo-projeto.md`.

## Regra de selecao

`criar-cms-payload` e `criar-cms-next` sao mutuamente exclusivas. Nunca execute as duas na mesma task, no mesmo slice ou no mesmo projeto sem nova decisao humana registrada.

A escolha e perguntada no planejamento e registrada em `Perfil do projeto` como `cms: payload | proprio | nenhum`. A skill le o perfil; nao decide sozinha.

Use `criar-cms-payload` quando ao menos um for verdadeiro:

- a task cita Payload, `payload.config.ts`, collection, global ou block
- o conteudo precisa de editor pronto, upload de midia, rascunho e versionamento sem construir UI de admin
- o modelo de conteudo tem mais de 3 entidades ou blocos compostos por pagina
- o projeto migra de um CMS existente (WordPress, Strapi, Contentful)

Use `criar-cms-next` quando ao menos um for verdadeiro:

- a task pede admin escrito a mao dentro do proprio Next
- nao ha autorizacao para adicionar Payload como dependencia
- o CMS e minimo e escreve em schema ja existente do projeto
- o projeto nao pode pinar a versao de Next exigida pelo peer range do Payload

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

- `next-js/docs/ai/PAYLOAD_CMS.md`: fronteira, onde o Payload vive, collection vs global vs block, criterio CMS vs codigo.
- `next-js/docs/ai/STYLING.md`: quando a entrega tiver estilo ou token.
- `next-js/docs/ai/SEO.md`, `next-js/docs/ai/PERFORMANCE.md` e `next-js/docs/ai/ACCESSIBILITY.md`: quando a entrega tiver rota publica.
- `next-js/docs/ai/SECURITY.md`: acesso, upload, secret e superficie publica.
- `design-system/front/`: somente para UI publica, e somente o trecho da secao em questao.
- `requirements/`: somente se a modelagem depender de regra de negocio ausente na task.

Nao carregue `requirements/`, `design-system/`, `contracts/` ou `docs/ai/` inteiros sem gatilho concreto.

## Norma e procedimento

`next-js/docs/ai/` define a norma. Esta skill define o procedimento e a prova. Nao repita a norma aqui; cite o doc pelo caminho e exija o numero medido.

## Fluxo obrigatorio

1. Validar a task, o slice, a stack `next-js`, o perfil `cms: payload` e que o projeto esta sob `projetos/`.
2. Marcar a task como `in_progress`.
3. Inventariar o conteudo antes de editar codigo, usando `references/modelo-inventario-conteudo.md`.
4. Decidir, por entidade, entre collection, global e block, usando `references/regras-modelagem-payload.md`.
5. Conferir o peer range real antes de instalar qualquer coisa.
6. Instalar dependencias com versao pinada, apos human approval.
7. Criar `src/payload.config.ts` e os route groups `(frontend)` e `(payload)`. A
   collection `users` sempre nasce com campo `role` (admin/editor) e `access`/`admin.hidden`
   por papel — norma em `next-js/docs/ai/PAYLOAD_CMS.md § Usuarios E Papeis`, nunca
   opcional. `src/app/(payload)/admin/importMap.js` nunca vira `.ts` — norma em
   `next-js/docs/ai/PAYLOAD_CMS.md § Import Map Do Admin`. `i18n.supportedLanguages`
   declara `pt` (nao so `translations.pt`) e toda collection/global/block/campo ganha
   `labels`/`label` em portugues — norma em
   `next-js/docs/ai/PAYLOAD_CMS.md § Idioma Do Painel`, nunca opcional. Envolver o
   `next.config.ts` existente com `withPayload(nextConfig)` **preservando** o `headers()`
   que ja vem do template do scaffold — nunca substituir por um config novo sem ele.
8. Declarar entidades e ports em `src/core/content/`.
9. Implementar os adapters e mappers em `src/adapters/payload/`.
10. Consumir o port nas pages, sem importar a ferramenta fora dos adapters.
11. Migrar ou semear o conteudo existente.
12. Executar os gates, registrar os numeros, e atualizar task, slice, `tasks/000-index.md` e handoff.

## Arquitetura obrigatoria

```text
src/
  core/content/{types.ts,ports.ts}
  adapters/payload/{mappers/}
  app/(frontend)/
  app/(payload)/admin/[[...segments]]/
  app/(payload)/api/[...slug]/
  collections/  globals/  blocks/
  payload.config.ts
```

Regras de fronteira, verificadas por grep na validacao:

- `src/core/` nao importa `payload` nem infraestrutura;
- fora de `src/core/`, so `src/adapters/`, `src/payload.config.ts` e a infraestrutura de
  rotas do proprio painel em `src/app/(payload)/` importam `payload` ou `@payloadcms/*` —
  essa ultima e exigida pela integracao oficial, nao e violacao;
- `(frontend)`, page publica e componente consomem o port, nunca a Local API direta;
- nenhum Client Component acessa banco, CMS ou secret.

Nao crie camada de caso de uso quando nao houver regra de negocio. A page chama o port direto. Detalhes da norma em `next-js/docs/ai/PAYLOAD_CMS.md`.

## Modelagem de conteudo

- Inventario antes de qualquer collection. Sem inventario, nao modele.
- Collection para muitos registros do mesmo tipo; global para registro unico; block para trecho componivel.
- Todo block tem par obrigatorio: `src/blocks/<Nome>/config.ts` e `src/components/sections/<Nome>/index.tsx`.
- Campo que quebra a interface se editado errado fica em codigo, nao no CMS.
- Na duvida, o campo fica em codigo. Abrir campo depois e barato; retirar campo aberto quebra conteudo salvo.
- Acesso declarado por operacao em toda collection e global.

Regras completas em `references/regras-modelagem-payload.md`.

## Instalacao e versoes

Ordem obrigatoria:

1. Ler o peer range real de `@payloadcms/next` antes de escolher a versao de Next.
2. Pinar a versao de Next compativel, exata, sem faixa.
3. Pinar `payload` e todos os pacotes `@payloadcms/*` na mesma versao exata.
4. Declarar os peers que o Payload exige.
5. Instalar somente apos human approval.

Proibido `--force` e `--legacy-peer-deps`. Conflito de peer e decisao humana, nao flag.

Se a versao de Next exigida quebrar outra dependencia do projeto, bloqueie e registre o conflito na task.

## Seguranca obrigatoria

- Acesso explicito por operacao em toda collection e global. Sem declaracao, negar.
- `PAYLOAD_SECRET` e `DATABASE_URL` fora do client bundle e fora de `NEXT_PUBLIC_*`.
- Acesso a Local API somente em `adapters/`.
- Upload com tipos permitidos e limite de tamanho declarados.
- Mutation publica com limite de taxa e protecao contra abuso. Ausencia e bloqueio.
- Leitura publica retorna somente conteudo publicado.
- `/admin` fora do sitemap e marcado como nao indexavel.
- Erro normalizado, sem vazar detalhe interno.
- `.env.example` versionado sem valor real; `.env` nunca versionado.
- Richtext renderizado por serializer, nunca como HTML cru.
- Collection `users` com `role` (admin/editor no minimo): so admin cria/apaga usuario e
  muda `role` de alguem; editor nunca se autopromove, nem editando o proprio perfil.
- Campo que referencia `media` e sempre `type: "upload"`, nunca `type: "relationship"`.
- Headers HTTP de seguranca em `next.config.ts § headers()` (clickjacking, MIME sniff,
  HSTS, referrer, permissions) — norma completa e checklist de teste em
  `next-js/docs/ai/SECURITY.md § Headers De Seguranca Http`. Testar `/` e `/admin` com
  `curl -I` e navegador real antes de declarar concluido.

Norma em `next-js/docs/ai/SECURITY.md`.

## Qualidade web obrigatoria

Esta skill nao redefine norma de performance, SEO ou acessibilidade. Ela exige a prova.

Toda entrega com rota publica registra na task o resultado de cada gate com numero medido. Criterio sem numero nao passou.

Tabela de criterios, limites e forma de provar em `references/regras-criterios-de-aceite.md`.

## Migracao de conteudo

- Preservar o conteudo atual como seed inicial.
- Manter nomes, ordem e comportamento visual onde a task nao pedir mudanca.
- Remover mock apenas depois que a leitura pelo port estiver funcionando.
- Manter fallback seguro para conteudo nao publicado ou ausente.
- Registrar na task o que foi migrado e o que permaneceu estatico.
- Nunca portar HTML, CSS ou JS de origem legada. Migre valores, nao implementacao.

## Validacao

Comandos da stack:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm ls` para conferir que nenhum peer ficou quebrado

Verificacoes mecanicas:

- grep em `.next/static` por `PAYLOAD_SECRET`, `DATABASE_URL` e `postgres://`: zero ocorrencia;
- grep por `getPayload` e por import de `payload` em `src/app/(frontend)` e `src/components`:
  zero ocorrencia. Import type-only de `payload` dentro de `src/app/(payload)/` (layout,
  admin, api) e esperado, exigido pela integracao oficial;
- grep por `payload` em `src/core`: zero ocorrencia;
- leitura do config: acesso declarado em toda collection e global.

Validacao manual:

- login valido e invalido em `/admin`;
- acesso bloqueado a `/admin` sem sessao;
- CRUD de ao menos uma entidade do slice;
- renderizacao publica consumindo o port;
- revalidacao da rota apos publicar alteracao;
- documento em rascunho nao aparece na leitura publica;
- login como usuario `editor` de teste (descartavel): criar/apagar usuario falha,
  autopromocao a `admin` nao muda o campo `role`, collection `users` nao aparece na nav.

Se o banco nao estiver disponivel, registre o bloqueio e valide tudo que nao depender dele.

## Atualizacao obrigatoria

Ao finalizar, atualize:

- arquivo da task com status, resumo, decisoes, arquivos alterados, validacoes com numero e pendencias;
- arquivo do slice quando status, riscos, entregas ou dependencias mudarem;
- `tasks/000-index.md`;
- handoff curto em `.agents/state/handoffs/`.

## Bloqueios

Marque a task como `blocked` quando:

- nao existir task valida da raiz do projeto;
- a task estiver na raiz do scaffold e nao em `projetos/<nome>/`;
- a task nao apontar `next-js`;
- `Perfil do projeto` nao declarar `cms: payload`;
- a task pedir admin escrito a mao, caso de `criar-cms-next`;
- o peer range for incompativel e nao houver decisao humana de pin;
- nao houver destino de banco declarado;
- nao houver estrategia de cache e revalidacao declarada;
- houver mutation publica sem limite de taxa;
- collection `users` sem campo `role` e `access`/`admin.hidden` por papel;
- campo que referencia `media` modelado como `type: "relationship"` em vez de `type: "upload"`;
- `src/app/(payload)/admin/importMap.js` renomeado para `.ts` — quebra o admin em silencio (ver `next-js/docs/ai/PAYLOAD_CMS.md § Import Map Do Admin`);
- a referencia visual obrigatoria estiver ausente ou ambigua para UI critica;
- o inventario nao fechar dentro do orcamento de contexto;
- um gate de qualidade reprovar sem plano de correcao registrado.

## Arquivos de referencia

- `references/regras-modelagem-payload.md`
- `references/regras-criterios-de-aceite.md`
- `references/modelo-inventario-conteudo.md`
- `next-js/docs/ai/PAYLOAD_CMS.md`
- `next-js/docs/ai/SECURITY.md`
- `next-js/docs/ai/PERFORMANCE.md`
- `next-js/docs/ai/SEO.md`
- `next-js/docs/ai/ACCESSIBILITY.md`
- `next-js/docs/ai/STYLING.md`
- `.agents/references/novo-projeto.md` (sob demanda, ao validar onde o projeto vive)
- `.agents/references/security-constraints.md` (sob demanda, ao materializar constraints)
