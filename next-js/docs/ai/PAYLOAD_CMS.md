# Payload CMS

## Quando Esta Stack Usa Payload

O CMS do projeto e decidido no planejamento e registrado em `Perfil do projeto` como `cms: payload | proprio | nenhum`.

- `payload`: este documento vale, e a implementacao usa a skill `criar-cms-payload`
- `proprio`: este documento nao vale, e a implementacao usa a skill `criar-cms-next`
- `nenhum`: conteudo vive em codigo

As duas skills sao mutuamente exclusivas. Criterio completo em `.agents/skills/criar-cms-payload/SKILL.md`.

## Onde O Payload Vive

Payload roda dentro do proprio Next, pela Local API. Nao existe servico separado nem fronteira HTTP interna.

- `src/payload.config.ts` concentra a configuracao
- `src/app/(frontend)/` agrupa as rotas publicas
- `src/app/(payload)/admin/` serve o painel
- `src/app/(payload)/api/` serve REST e GraphQL do proprio Payload
- `src/collections/`, `src/globals/` e `src/blocks/` guardam o modelo de conteudo

## Import Map Do Admin

`payload generate:importmap` (CLI standalone) quebra em ambientes com Node 24.x
(`ERR_REQUIRE_ASYNC_MODULE`, o loader tsx do CLI nao trata o top-level await de
`@payloadcms/richtext-lexical`). Nao e bug do projeto, e incompatibilidade de ambiente.

- O gerador funciona perfeitamente **dentro do runtime do Next** (Payload chama
  `generateImportMap` a cada init, sempre que `admin.importMap.autoGenerate` nao for
  `false`) — so o CLI isolado quebra.
- O caminho de escrita e **hardcoded para `.js`**
  (`resolveImportMapFilePath.js` do pacote `payload`), nunca `.ts`. O arquivo do projeto
  e sempre `src/app/(payload)/admin/importMap.js` — nunca renomear para `.ts`, ou o
  auto-generate escreve num arquivo que ninguem importa, e o painel quebra em silencio
  (nenhum erro no log, so falha de render depois, tipo "PayloadComponent not found in
  importMap").
- Tipar o `.js` sem `allowJs` no projeto inteiro: criar `importMap.d.ts` ao lado
  (`export declare const importMap: ImportMap;`), nao `importMap.ts`.
- Para forcar a regeneracao (novo componente de admin customizado, campo novo que precisa
  de UI propria): criar uma rota dev-only que chama
  `generateImportMap(payload.config, { force: true })` dentro do runtime do Next —
  mesmo padrao de reaproveitar o runtime ja usado para seed de conteudo, nao um script
  CLI novo.

## Fronteira Obrigatoria

O front conhece o dominio, nunca o CMS.

- `src/core/content/types.ts`: entidades de dominio
- `src/core/content/ports.ts`: interface de leitura e escrita que o front consome
- `src/adapters/payload/`: implementacao dos ports usando a Local API
- `src/adapters/payload/mappers/`: converte documento do Payload em entidade de dominio

Regras:

- `src/core/` nao importa `payload` nem nada de infraestrutura
- fora de `src/core/`, so tres lugares importam `payload` ou `@payloadcms/*`:
  `src/adapters/payload/`, `src/payload.config.ts`, e a infraestrutura de rotas do
  proprio painel em `src/app/(payload)/` (layout, admin, api) — essa ultima e exigida
  pela integracao oficial do Payload com o Next.js, nao e violacao de fronteira
- `(frontend)`, `components/` e paginas publicas nunca importam `payload`; conteudo
  sempre passa pelo port
- page, layout e componente do lado publico consomem o port, nunca a Local API direta
- nenhum Client Component acessa banco, CMS ou secret
- nao existe camada de caso de uso quando nao houver regra de negocio; a page chama o port direto

## Collection, Global Ou Block

- Collection: muitos registros do mesmo tipo, com identidade propria e listagem.
- Global: registro unico de configuracao ou de area fixa da interface.
- Block: trecho componivel dentro de uma pagina, escolhido e reordenado pelo editor.

Todo block tem par obrigatorio: a configuracao no CMS e o componente de secao que a renderiza. Block sem componente e componente sem block sao erro.

## Campo De Midia

Campo que referencia a collection de upload (`media`) e sempre `type: "upload"`, nunca
`type: "relationship"`. Os dois guardam o mesmo dado (o id do documento de media) e o
adapter le o mesmo formato populado em ambos — a diferenca e so a UI do admin:
`relationship` mostra um seletor por nome/id; `upload` mostra a previa da imagem no campo
e abre a galeria de midia (com miniatura) ao escolher. `type: "relationship"` fica
reservado para relacao entre collections de conteudo que nao sejam upload.

## Idioma Do Painel

Padrao do scaffold: o admin inteiro em portugues, para qualquer projeto com publico
final brasileiro. Dois mecanismos distintos, os dois precisam ser tratados — corrigir so
um deixa o painel misto.

- Textos proprios do Payload (botoes, menus, validacao, datas, "Salvar", "Publicar"): por
  padrao **so `en` existe em `config.i18n.supportedLanguages`**, mesmo com
  `translations.pt` customizado no config — confirmado lendo
  `node_modules/payload/dist/config/sanitize.js`. Sem declarar `pt` ali, o idioma "pt" nem
  existe para o admin escolher, e qualquer override de traducao fica sem efeito.
  Importar `pt` de `@payloadcms/translations/languages/pt`, declarar
  `i18n.supportedLanguages: { pt }` e `i18n.fallbackLanguage: "pt"`. Com so `pt` suportado
  nao existe seletor de idioma nem chance de o admin cair em ingles.
- Nomes de collection, global, campo e opcao de `select` sao **texto do projeto, nao do
  Payload** — o sistema de `i18n` nunca traduz `name`, so os textos fixos da interface.
  Sem `labels: { singular, plural }` na collection/global e `label` em cada campo, o
  rotulo cai no nome tecnico derivado do `name` (`gallery-photos` vira "Gallery Photos" na
  nav, `title` vira "Title" no formulario), mesmo com o resto do painel em portugues.
  Toda collection, global, block e campo (exceto os que ja usam `name` identico ao rotulo
  desejado) declara `label`/`labels` em portugues.
- As collections internas do proprio Payload (`payload-kv`, `payload-locked-documents`,
  `payload-preferences`, `payload-migrations`) tem `admin.hidden: true` fixado pelo
  proprio pacote — ficam de fora da nav e do idioma, sem exigir tratamento do projeto.

## Componentes Visuais Do Admin

`admin.components.graphics.Logo` (tela de login) e `admin.components.graphics.Icon`
(nav colapsada) trocam a marca padrao do Payload pela do projeto. Duas armadilhas reais,
nao hipoteticas — encontradas construindo este padrao:

- O admin **nao carrega** o CSS do projeto (`app/(frontend)/globals.css`), so
  `@payloadcms/next/css` — confirmado lendo `app/(payload)/layout.tsx`. Classe utilitaria
  do projeto (Tailwind ou qualquer outro) nao tem efeito ali. Componente de logo/icone
  precisa de tamanho e cor explicitos (atributo SVG, `style` inline ou `<style>` proprio),
  nunca `className` do design system do site.
- O Payload tem tema claro/escuro nativo (`html[data-theme="light"|"dark"]`, cookie
  `payload-theme`), independente do tema do site. Cor fixa no logo/icone customizado
  quebra em um dos dois temas (texto escuro sobre fundo escuro, ou claro sobre claro) —
  bug real, so aparece com o cookie de tema no valor oposto ao testado, entao **testar
  os dois temas explicitamente antes de declarar pronto**, nunca confiar numa unica
  captura. Resolver com CSS puro (`html[data-theme="dark"] .minha-classe { color: ... }`),
  nao com prop de cor fixa — mesmo padrao que o proprio `PayloadLogo` do Payload usa
  (`@payloadcms/ui/dist/graphics/Logo`, `var(--theme-elevation-1000)`, que ja resolve
  sozinho por tema); usar as cores da marca no lugar do token generico do Payload.
- Referenciar o componente por string (`"caminho#exportName"`), path do projeto com o
  alias (`@/...`) — nunca caminho relativo direto. Precisa existir no
  `importMap.js`, gerado automaticamente (ver `§ Import Map Do Admin` acima), nunca
  editado a mao.

## Usuarios E Papeis

Toda collection `users` declara um campo `role` (no minimo `admin` e `editor`),
obrigatorio, com valor padrao `editor`. Regras fixas:

- `access.create` e `access.delete` da collection: so `role: admin`. Editor nao gerencia equipe.
- `access.update`: admin edita qualquer usuario; qualquer autenticado edita o proprio documento.
- O campo `role` tem `access.update` proprio, restrito a admin — impede autopromocao mesmo
  quando o usuario edita o proprio documento.
- `admin.hidden` na collection `users`: `true` para quem nao e admin. So visibilidade de
  navegacao; o controle real e o `access` acima, nunca o inverso.
- No primeiro deploy (ou ao introduzir o campo depois que a primeira conta ja existe), a
  conta ja existente precisa ser promovida a `admin` manualmente (Local API com
  `overrideAccess`, ou update direto no banco) — sem isso ninguem e admin e ninguem pode
  promover ninguem, porque o proprio campo bloqueia autopromocao.
- Rotulo de navegacao "Globals" pode ser renomeado para "Singles" via
  `config.i18n.translations.<locale>.general.globals`, para facilitar o entendimento do
  usuario final. Convencao do projeto, nao obrigatorio.

## Criterio CMS Vs Codigo

- E CMS o que muda sem deploy: texto, imagem, texto alternativo, ordem, link, dado de contato, campo de SEO.
- E codigo o que quebra a interface se editado errado: token, proporcao de grid, curva e duracao de animacao, logica de carrossel e lightbox, icone, estrutura semantica e nivel de heading.

Na duvida, o campo fica em codigo. Abrir campo depois e barato; retirar campo aberto quebra conteudo ja salvo.

## Acesso E Publicacao

- Toda collection e global declara acesso explicito por operacao. Sem declaracao, negar.
- Leitura publica retorna somente conteudo publicado.
- Rascunho e versionamento ligados onde houver revisao editorial.
- Alteracao publicada dispara revalidacao por tag da rota afetada.
- Upload declara tipos permitidos e limite de tamanho, e exige texto alternativo.

## Segredos

- Segredos de Payload, banco, e-mail, pagamento e integrações ficam em `.env` ou secret
  manager. Nunca criar campo editável de segredo em collection/global do CMS.
- Variáveis secretas nunca usam `NEXT_PUBLIC_*`, nunca entram no bundle client e nunca são
  registradas em logs ou mensagens públicas.
- Configurações não sensíveis podem viver no CMS; validar acesso por operação e separar
  configuração pública de credenciais privadas.

## Notificacao Por E-mail

Quando uma collection precisa avisar alguem por e-mail (formulario de contato, pedido,
qualquer evento que o dono do site precisa saber na hora): usar **React Email**
(`@react-email/components` + `@react-email/render`) para o corpo do e-mail, nunca string
HTML escrita a mao.

- HTML de e-mail nao e HTML de site: a maioria dos clientes (Outlook desktop em especial,
  que usa o motor de renderizacao do Word) nao suporta flexbox, grid, nem stylesheet
  externo — so tabela e estilo inline. Escrever isso a mao e caro e fragil; os
  componentes do React Email geram esse HTML por baixo, sem exigir conhecer a
  particularidade de cada cliente.
- Renderiza so no servidor (`render()` dentro do hook, nunca em Client Component) — nao
  entra no bundle do site publico. Medido: adicionar o pacote nao mudou 1 byte do bundle
  JS da home.
- Template mora em `src/emails/`, componente puro (props de entrada, sem acessar
  `payload` ou banco direto) — o hook busca o dado e passa como prop.
- Hook que dispara o envio fica em arquivo `.tsx` separado da collection (ex.:
  `collections/notifyNewLead.tsx`), porque renderiza JSX; a config da collection
  (`collections/Leads.ts`) continua `.ts`, sem JSX — mesmo padrao de manter config livre
  de logica de apresentacao.
- Enviar sempre `html` **e** `text` (versao texto puro, via `render(elemento,
{ plainText: true })`) — alguns clientes de e-mail e filtros de spam preferem ou exigem
  a versao texto.
- Sem logo em imagem enquanto o site nao tiver URL publica (https) — cliente de e-mail
  nao carrega imagem de `localhost`. Cabecalho com o nome da marca estilizado em texto
  (cor/peso/tamanho da paleta do projeto) funciona em qualquer cliente sem depender de
  imagem; trocar por `<Img src="https://dominio-real/logo.png">` quando o site for
  publicado.
- Paleta do e-mail identica aos tokens do site (`docs/ai/STYLING.md`) — nao e um
  template generico, e a mesma marca em outro canal.

## Revalidacao Instantanea

Payload roda no mesmo processo do Next, via Local API. Isso elimina o atraso de webhook
externo: o hook do CMS pode chamar a revalidacao do Next diretamente, na mesma requisicao
que salva o conteudo.

- Cada collection e global que alimenta o front declara uma tag propria (o nome da
  entidade, por exemplo `flowers`, `site-settings`).
- `hooks.afterChange` e `hooks.afterDelete` chamam `revalidateTag(<tag>, { expire: 0 })` de
  `next/cache`, sincronamente, antes de responder ao editor. `{ expire: 0 }` e obrigatorio:
  expira o dado imediatamente, sem servir versao obsoleta. Next.js 16 exige o segundo
  argumento; `revalidateTag(<tag>)` sozinho e erro de tipo.
- O hook funciona porque roda dentro do Route Handler que a mutation percorre (REST,
  GraphQL ou o painel admin, que chama REST por baixo). Ele so alcanca esse contexto
  quando a escrita passa por um desses caminhos. Escrita feita fora de um Route Handler ou
  Server Action (por exemplo, script de seed rodado fora do runtime do Next) nao revalida
  sozinha; se precisar, chame a mesma rota HTTP internamente.
- Nunca usar `updateTag`: e exclusivo de Server Action e nao funciona dentro do hook do
  Payload, que roda em Route Handler.
- O adapter le com a mesma tag, para que a invalidacao alcance exatamente quem consome
  aquela entidade, sem enumerar rota por rota.
- Publicar deve refletir na proxima requisicao publica, nao em um intervalo de tempo.
  `{ expire: 0 }` ja garante isso; nao usar perfil `"max"` (stale-while-revalidate), que
  serve conteudo antigo por ate um ano enquanto revalida em segundo plano.
- O Data Cache de `next build` persiste em disco (`.next/cache`) entre builds distintos.
  Revalidar em `next dev` invalida o cache daquele processo de dev, nao o cache que um
  `next build` anterior ja gravou em disco. Se o conteudo mudou entre um build e outro,
  rode `rm -rf .next/cache` antes do proximo `next build`, ou a build nova reaproveita o
  snapshot antigo em vez de buscar o conteudo publicado atual.

## O Que Nao Fazer

- Nao importar `payload` fora de `src/adapters/` e da configuracao.
- Nao expor `/admin` a indexacao.
- Nao renderizar richtext como HTML cru sem serializer.
- Nao deixar nivel de heading como campo editavel.
- Nao criar mutation publica sem limite de taxa e protecao contra abuso.
- Nao usar sincronizacao automatica de schema em producao.
- Nao deixar toda conta autenticada gerenciar outras contas — `users` sem `role` e
  `access` proprios da collection e falha de seguranca, nao so falta de feature.

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
