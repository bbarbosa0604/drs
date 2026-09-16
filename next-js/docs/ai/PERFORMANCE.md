# Performance

## Objetivo

Este arquivo define o orcamento de performance da stack e as regras que o sustentam. Performance aqui e limite com numero, nao intencao. Entrega que nao mediu nao passou.

## Orcamento

| Metrica                                                 | Limite                                      | Onde medir                                                                             |
| ------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| LCP                                                     | 2.5s                                        | Lighthouse mobile na rota                                                              |
| CLS                                                     | 0.1                                         | Lighthouse mobile na rota                                                              |
| INP                                                     | 200ms                                       | Lighthouse mobile ou campo                                                             |
| JS de aplicacao por rota (alem do runtime do framework) | 50 KB gzip                                  | soma o gzip dos scripts referenciados pela rota, exceto os chunks de runtime/framework |
| Runtime do framework (Next.js + React, App Router)      | ~170 KB gzip nesta stack (medido, nao meta) | mesmo metodo; o Next 16 nao imprime mais tabela `First Load JS` no `next build`        |

Estourar o orcamento exige registro na task com causa e plano, nunca ajuste silencioso do limite.

## Renderizacao E Cache

- Rota e estatica por padrao.
- Toda rota declara sua estrategia de cache. Rota sem estrategia declarada e bloqueio.
- Conteudo de CMS revalida por tag com `revalidateTag(tag, { expire: 0 })`, disparada
  pelo hook de alteracao do CMS, dentro do Route Handler que a mutation percorre. Ver
  `docs/ai/PAYLOAD_CMS.md` para o mecanismo; `{ expire: 0 }` e obrigatorio no Next.js 16,
  nao o perfil `"max"` (esse serve conteudo obsoleto por ate um ano).
- Publicar conteudo reflete na proxima requisicao. Nao usar janela de tempo longa como
  mecanismo principal de atualizacao quando o CMS puder disparar a tag diretamente.
- `force-dynamic` exige justificativa registrada na task.
- Nao buscar o mesmo dado duas vezes na mesma renderizacao.
- Streaming e `Suspense` quando um trecho lento nao deve segurar a rota inteira.

## Imagens

- Usar `next/image`. Nao usar `img` cru.
- Toda imagem tem `width` e `height`, ou `fill` com `sizes` declarado.
- `priority` somente na imagem de LCP da rota, uma por rota.
- Servir AVIF e WebP.
- Imagem de CMS declara dimensao vinda do proprio CMS, para nao gerar deslocamento de layout.
- Definir `quality` conscientemente em imagem grande.

## Fontes

- Fonte self-hosted. Nenhuma requisicao para host externo de fonte.
- Carregar por `next/font`, com `display: swap`.
- Subset apenas dos caracteres usados.
- Limitar familias e pesos ao que o design usa de fato.
- Declarar pilha de fallback com metrica proxima, para reduzir deslocamento.

## JavaScript

- Boundary de `use client` no menor arquivo possivel.
- Carregar carrossel, lightbox, modal e mapa sob demanda.
- Nao enviar biblioteca de animacao quando CSS resolver.
- Nao passar objeto grande de Server para Client Component.
- Script de terceiro carrega com estrategia adiada e entra na conta do orcamento.
- Conferir o custo de toda dependencia nova antes de adicionar.

## Animacoes De Entrada (Reveal)

- Fade/slide ao rolar usa CSS (`opacity`/`transform`) + `IntersectionObserver` nativo.
  Nao instalar biblioteca de animacao para isso (ver §JavaScript acima).
- Anima uma unica vez por elemento, na primeira entrada na viewport (desconectar o
  observer apos disparar). Reanimar a cada passagem pesa mais e parece menos sofisticado.
- `prefers-reduced-motion: reduce` sempre reduz a transicao a quase zero — o elemento
  ainda aparece, so sem o deslocamento. Nunca deixar o elemento preso em `opacity: 0`
  quando o motion esta reduzido.
- `@media (scripting: none)` mostra o conteudo direto (`opacity: 1`), para o caso raro de
  JS desabilitado — o estado inicial oculto nunca pode depender so do JS rodar.
- Cuidado com o wrapper que a animacao introduz: se o elemento animado tinha `width: 100%`
  (ou outro valor percentual) relativo ao pai, o novo wrapper precisa repetir a mesma
  classe de largura. Um `div` extra sem largura propria, dentro de um flex `row` (largura
  no eixo principal, sem `stretch` automatico), colapsa para `0x0` mesmo com
  `opacity: 1` — bug real encontrado e corrigido nesta stack, confirmado via
  `getBoundingClientRect()`, nao so lendo o codigo.
- Nunca animar `transform` (nem via `animation`, nem via `transition`) num ancestral de
  elemento `position: fixed`. Qualquer `transform` computado diferente de `none` (mesmo
  o estado final `translateY(0)` de uma animacao com `forwards`) vira esse ancestral em
  _containing block_ do fixed — um menu mobile `fixed inset-0` dentro de um header
  animado passa a cobrir so a area do header, nao mais a tela inteira. Mesma regra vale
  para `filter`, `perspective` e `will-change: transform`. Bug real: o fade-in de entrada
  do header quebrou o menu mobile em producao; corrigido trocando a keyframe para usar
  so `opacity`.
- A mesma regra de containing block vale para o wrapper de reveal em regime permanente
  (`.reveal--visible { transform: translate(0,0) }` fica aplicado enquanto o elemento
  existir, nao so durante uma transicao). Nunca envolver com o wrapper de reveal um
  componente que renderiza, por conta propria, um modal/dialog `position: fixed`
  (lightbox, popover, tooltip) — o modal vira descendente do wrapper e herda o
  containing block errado, ficando preso dentro da area do elemento em vez de cobrir a
  tela. Nesse caso, aplicar o reveal _dentro_ do componente (no elemento visual, nao no
  modal), nao envolvendo o componente por fora. Bug real: um lightbox de galeria abria
  contido na moldura da foto em vez de tela cheia.

## Checklist Rapido

- LCP, CLS e INP medidos e registrados na task
- `First Load JS` da rota dentro do orcamento
- Nenhuma imagem sem dimensao declarada
- Nenhuma requisicao de fonte externa
- Estrategia de cache declarada em toda rota
- Revalidacao por tag ligada ao CMS quando houver conteudo editavel
- Animacao de entrada em CSS + `IntersectionObserver`, nenhuma lib de animacao

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
