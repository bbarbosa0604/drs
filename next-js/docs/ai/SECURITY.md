# Security

## Objetivo

Este arquivo define as regras minimas de seguranca para o Next.js. Interface protegida melhora UX, mas seguranca real sempre depende do backend. O front deve evitar expor segredos, reduzir superficie de ataque e enviar dados de forma previsivel.

## Regras Obrigatorias

- Nunca salvar segredos reais em `localStorage`, `sessionStorage`, codigo fonte ou variaveis `NEXT_PUBLIC_*`.
- Variaveis `NEXT_PUBLIC_*` sao publicas por definicao. Use apenas para valores seguros de exposicao.
- Segredos server-side devem ficar fora do client bundle.
- Nao confiar em guards de UI como controle de seguranca real. Toda autorizacao critica deve ser validada no backend.
- Nao usar `dangerouslySetInnerHTML` sem sanitizacao forte e justificativa explicita.
- Tratar tokens e sessoes como dados sensiveis. Evitar logs, prints e persistencia desnecessaria.
- Nao expor mensagens de erro internas, stack traces ou respostas completas de APIs em components.

## Auth E Sessao

- Preferir fluxo com cookies `httpOnly` quando o backend suportar.
- Se o projeto usar bearer token, manter o token no menor escopo possivel.
- Nunca colocar tokens em params de URL.
- Fazer logout limpando estado local, caches e dados sensiveis de tela.
- Separar claramente logica server-side e client-side de sessao.

## Consumo De API

- Centralizar requests em `services/http/`.
- Normalizar erros no client HTTP antes de chegar na UI.
- Nao concatenar URLs manualmente em components.
- Sempre tratar estados de erro, loading e expiracao de sessao.

## Boas Praticas De UI

- Escapar conteudo renderizado dinamicamente.
- Restringir upload por tipo e tamanho antes do envio.
- Evitar mostrar dados sensiveis completos em tabelas, modais e logs de debug.
- Revisar dependencias antes de adicionar bibliotecas novas.

## Headers De Seguranca Http

Padrao do scaffold (CR-035): toda rota — site publico **e** `/admin` — responde com um
conjunto minimo de headers HTTP de seguranca, configurados uma vez em
`next.config.ts § headers()`, nunca por pagina.

- `X-Frame-Options: DENY` + `Content-Security-Policy` com `frame-ancestors 'none'`:
  as duas camadas de defesa contra clickjacking (a segunda e o padrao atual; a primeira
  e o fallback para navegador que nao le CSP). Sem isso, qualquer origem externa pode
  embutir o site (ou o `/admin`) num iframe invisivel e sequestrar clique — vetor real,
  testado de verdade: um iframe de outra origem tentando carregar a pagina recebe bloqueio
  do proprio navegador, com o motivo citado no console (`"Framing ... violates ...
frame-ancestors"`).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` desabilitando recurso de navegador nao usado (camera, microfone,
  geolocalizacao), `Strict-Transport-Security` — sem custo de compatibilidade conhecido,
  sempre incluir.
- `Content-Security-Policy` completo alem de `frame-ancestors`: `default-src 'self'`
  como base, com `script-src`/`style-src` mantendo `'unsafe-inline'` porque o hydration
  do Next e o admin do Payload dependem de script/estilo inline — apertar para nonce
  exige middleware dedicado e testar toda pagina do site **e** do admin antes de
  declarar pronto; documentar a lacuna, nunca fingir CSP mais forte do que o testado.
- Testar sempre nos dois lados (`/` e `/admin`) antes de declarar concluido: build de
  producao real, `curl -I` confirmando os headers, e navegador real checando console por
  violacao de CSP — um CSP errado quebra a pagina em silencio (tela branca, sem erro de
  rede), nunca supor que "parece certo" basta.
- **Testar tambem em `next dev`, nao so em build de producao** — erro real encontrado
  depois de validar so a producao: o React em modo dev usa `eval()` para debug ("React
  will never use eval() in production mode", mensagem do proprio React), e uma CSP sem
  `'unsafe-eval'` em `script-src` quebra o `next dev` (Turbopack) com "eval() is not
  supported", mesmo com a producao passando limpa. Adicionar `'unsafe-eval'` **so** com
  `process.env.NODE_ENV !== "production"` — nunca em producao, onde o React garante que
  nao precisa.

## CMS E Conteudo

- Toda collection e global declara acesso explicito por operacao. Sem declaracao, negar.
- `PAYLOAD_SECRET` e `DATABASE_URL` nunca em variavel `NEXT_PUBLIC_*` nem no client bundle.
- Acesso a Local API somente em `adapters/`. Nenhuma page ou component importa a ferramenta.
- Upload declara tipos permitidos e limite de tamanho.
- Mutation publica exige limite de taxa e protecao contra abuso.
- Leitura publica retorna somente conteudo publicado.
- Richtext e renderizado por serializer proprio, nunca como HTML cru.
- `/admin` fica fora do sitemap e marcado como nao indexavel.

## Checklist Rapido

- Headers de seguranca (`X-Frame-Options`, CSP com `frame-ancestors 'none'`, HSTS,
  `nosniff`, `Referrer-Policy`, `Permissions-Policy`) presentes em `next.config.ts`,
  confirmados com `curl -I` em `/` e `/admin`
- Nenhum segredo em `NEXT_PUBLIC_*`
- Nenhum `dangerouslySetInnerHTML` sem sanitizacao
- Erros sensiveis nao expostos ao usuario
- Tokens fora de URL e sem logs
- Dados server-side nao vazam para client components
- Nenhum secret de CMS encontrado no bundle gerado
- Ferramenta de persistencia importada somente nos adapters
- Acesso declarado em toda collection e global
- Mutation publica com limite de taxa

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
