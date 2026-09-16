# Regras de modelagem Payload

Use esta referencia ao decidir a forma do conteudo no CMS: o que vira collection, global ou block, que campos entram, como o acesso e declarado e como a publicacao dispara revalidacao.

## Collection, Global Ou Block

Collection quando:

- existem muitos registros do mesmo tipo;
- cada registro tem identidade propria;
- o editor precisa listar, filtrar ou paginar;
- o conteudo pode virar rota.

Global quando:

- existe um unico registro;
- o conteudo e configuracao ou area fixa da interface;
- nao faz sentido listar nem paginar.

Block quando:

- o trecho e componivel dentro de uma pagina;
- o editor escolhe, reordena ou repete;
- o mesmo trecho aparece em paginas diferentes com conteudo diferente.

Na duvida entre collection e global: se algum dia pode existir o segundo registro, e collection.

## Campos Obrigatorios Por Tipo

Conteudo roteavel:

- `slug` unico e indexado
- `title`
- campos de SEO proprios, com fallback para o global de SEO

Conteudo publicavel:

- estado de publicacao
- data de publicacao
- data de criacao e de atualizacao

Conteudo listavel em ordem definida pelo editor:

- campo de ordenacao explicito, nao ordem de criacao

Midia:

- texto alternativo obrigatorio, com decorativo declarado explicitamente
- largura e altura persistidas, para evitar deslocamento de layout
- tipos permitidos e limite de tamanho declarados

## Acesso

- Declarar acesso por operacao em toda collection e global: leitura, criacao, atualizacao e exclusao.
- Sem declaracao, negar. Nao confiar no default.
- Leitura publica retorna somente conteudo publicado.
- Coleta de dado de visitante nao tem leitura publica.
- Campo sensivel usa acesso proprio de campo quando o documento for legivel.
- Collection `users` sempre tem campo `role` (minimo `admin`/`editor`, default `editor`):
  `create`/`delete` da collection so admin; `update` e o proprio documento ou admin; o
  campo `role` tem `access.update` proprio restrito a admin, para impedir autopromocao
  mesmo em edicao do proprio perfil. `admin.hidden` esconde `users` da nav de quem nao e
  admin — visibilidade, nao substitui o `access` real.

## Publicacao E Revalidacao

- Alteracao publicada dispara revalidacao por tag da rota afetada.
- A tag e derivada da entidade, nao escrita a mao em cada lugar.
- Rascunho nunca aparece em leitura publica.
- Despublicar remove do sitemap e da listagem publica.
- Rota sem estrategia de cache declarada e bloqueio, nao escolha implicita.

## Upload E Midia

- Um lugar so para midia, com relacao a partir das demais entidades.
- Campo que referencia a collection de upload e sempre `type: "upload"`, nunca
  `type: "relationship"` — os dois guardam o mesmo dado, mas so `upload` mostra previa da
  imagem e abre a galeria de midia no seletor do admin.
- Tamanhos derivados gerados no upload, nao no render.
- Texto alternativo e decisao editorial; dimensao e decisao tecnica.
- Arquivo de midia fora do controle de versao.

## Blocks

- Todo block tem par obrigatorio: configuracao no CMS e componente de secao.
- Block sem componente e componente de secao sem block sao erro.
- O nome do block e o nome do componente devem coincidir.
- Nivel de heading, proporcao de grid, curva de animacao e icone ficam no componente, nunca como campo.
- Comecar pelo menor conjunto de campos que entrega a secao. Campo novo e barato; campo removido quebra conteudo salvo.

## Migration E Seed

- Schema em producao muda por migration versionada e reversivel.
- Sincronizacao automatica de schema serve para desenvolvimento, nunca para producao.
- Conteudo existente entra como seed, preservando nomes e ordem.
- Seed e idempotente: rodar duas vezes nao duplica registro.
- Registrar na task o que foi semeado e o que permaneceu em codigo.

## Anti-Padroes

- Abrir campo no CMS para valor que quebra a interface se editado errado.
- Modelar uma collection por secao de pagina quando a secao e block.
- Guardar HTML pronto em campo de texto.
- Duplicar a mesma entidade em duas collections por conveniencia de tela.
- Deixar ordenacao implicita pela data de criacao quando o editor precisa ordenar.
- Criar global para conteudo que vai crescer.
- Modelar campo de midia como `relationship` em vez de `upload`.
- Deixar `users` sem `role`, permitindo que qualquer autenticado gerencie outras contas.
