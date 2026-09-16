# SEO

## Objetivo

Este arquivo define o minimo de SEO tecnico e semantica de documento para rotas publicas desta stack. Interface bonita que o buscador nao entende e entrega incompleta. O foco e metadata correta por rota, dados estruturados validos e estrutura de documento sem ambiguidade.

## Metadata

- Definir `metadataBase` uma vez, no layout raiz.
- Toda rota indexavel exporta `metadata` ou `generateMetadata`.
- `title` usa template no layout raiz e valor proprio por rota.
- `description` e propria da rota, nunca repetida entre rotas.
- Canonical absoluto em toda rota indexavel.
- Rota que nao deve ser indexada declara `robots` com `noindex`, nunca depende so do `robots.txt`.
- Texto de metadata vindo de CMS passa por fallback quando o campo estiver vazio.

## Meta Dinamico Do Cms

- Plugin de SEO do Payload (`@payloadcms/plugin-seo`) so cria os campos `meta.title`/
  `meta.description`/`meta.image` no admin. Ele **nao** liga isso ao `generateMetadata`
  do Next sozinho — essa ponte e sempre codigo manual, escrito uma vez por rota.
- `generateMetadata` le o mesmo port/adapter que a pagina ja usa para o conteudo,
  nunca uma segunda chamada a Payload. Reusar a mesma funcao cacheada (`unstable_cache`
  com `tags`) evita fetch duplicado e herda o `revalidateTag` que ja dispara no
  `hooks.afterChange` da collection/global.
- Todo campo de meta tem fallback de codigo para quando o admin nunca preencheu
  (documento novo, campo vazio) — nunca deixar `title`/`description` vazios na pagina.
- Ativar `tabbedUI: true` no plugin: separa a aba "SEO" da aba de conteudo, sem misturar
  campos operacionais com campos de negocio no mesmo formulario.

## Open Graph E Twitter

- Declarar `openGraph` com `title`, `description`, `url`, `siteName`, `locale` e imagem.
- Imagem de compartilhamento com dimensao declarada e texto alternativo.
- Declarar `twitter` com `card`, `title`, `description` e imagem.
- Nao apontar imagem de Open Graph para arquivo que depende de sessao ou de query.

## Dados Estruturados

- Emitir JSON-LD em bloco `script` do tipo `application/ld+json`.
- Um bloco por tipo de entidade. Nao empilhar tipos sem relacao no mesmo bloco.
- Usar somente dado que aparece na pagina. Nao declarar avaliacao, preco ou evento inexistente.
- Validar no teste de resultados enriquecidos antes de entregar e registrar o resultado na task.

## Sitemap E Robots

- `app/sitemap.ts` lista somente rota publica e indexavel.
- `app/robots.ts` declara as regras e aponta o sitemap.
- Bloquear `/admin` e `/api` em ambos.
- Rota gerada a partir de CMS entra no sitemap somente quando publicada.
- `lastModified` vem da data de atualizacao do conteudo, quando houver.

## Semantica De Documento

- Exatamente um `h1` por rota.
- Sem salto de nivel de heading. `h2` nao vira `h4`.
- Um `main` por documento, mais `header`, `nav` e `footer` quando existirem.
- Nivel de heading e decisao de codigo, nunca campo editavel no CMS.
- Lista e tabela usam o elemento semantico correspondente, nao `div` com aparencia de lista.
- `lang` correto no elemento raiz.

## Checklist Rapido

- `generateMetadata` ou `metadata` em toda rota indexavel
- Canonical absoluto presente
- Open Graph e Twitter completos, com imagem dimensionada
- JSON-LD validado, sem erro
- `sitemap.ts` e `robots.ts` existem, com `/admin` e `/api` bloqueados
- Exatamente um `h1`, sem salto de nivel
- Landmarks presentes, com um unico `main`

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
