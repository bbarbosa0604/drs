# Regras de criterios de aceite

Use esta referencia ao fechar uma entrega com rota publica. Ela nao define a norma: a norma esta em `next-js/docs/ai/`. Ela define o limite, a forma de provar e onde registrar.

Criterio sem numero medido nao passou.

## Performance

Norma: `next-js/docs/ai/PERFORMANCE.md`.

| Criterio                                               | Limite     | Como provar                                                                                        |
| ------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------- |
| LCP                                                    | 2.5s       | Lighthouse mobile na rota do slice                                                                 |
| CLS                                                    | 0.1        | Lighthouse mobile na rota do slice                                                                 |
| INP                                                    | 200ms      | Lighthouse mobile na rota do slice                                                                 |
| JS de aplicacao por rota, alem do runtime do framework | 50 KB gzip | soma o gzip dos scripts da rota, exceto chunks de runtime/framework (ver `docs/ai/PERFORMANCE.md`) |
| Imagem sem dimensao                                    | zero       | grep por `<img ` em `src/app` e `src/components`                                                   |
| Requisicao de fonte externa                            | zero       | grep por `fonts.googleapis.com` e `fonts.gstatic.com`                                              |
| Rota sem estrategia de cache                           | zero       | leitura das rotas alteradas                                                                        |

## SEO e semantica

Norma: `next-js/docs/ai/SEO.md`.

| Criterio                     | Limite       | Como provar                                      |
| ---------------------------- | ------------ | ------------------------------------------------ |
| Rota indexavel sem metadata  | zero         | inspecao do HTML servido por `title` e canonical |
| Canonical ausente            | zero         | inspecao do HTML servido                         |
| Erro em dados estruturados   | zero         | validador de resultados enriquecidos             |
| `sitemap.ts` e `robots.ts`   | existem      | leitura de `/sitemap.xml` e `/robots.txt`        |
| `/admin` e `/api` indexaveis | zero         | leitura de `/robots.txt` e do sitemap            |
| `h1` por rota                | exatamente 1 | grep no HTML renderizado                         |
| Salto de nivel de heading    | zero         | leitura da arvore de headings                    |
| `main` por documento         | exatamente 1 | grep no HTML renderizado                         |

## Acessibilidade

Norma: `next-js/docs/ai/ACCESSIBILITY.md`.

| Criterio                                               | Limite        | Como provar                       |
| ------------------------------------------------------ | ------------- | --------------------------------- |
| Violacao axe critica ou seria                          | zero          | axe na rota do slice              |
| Score de acessibilidade                                | 95 ou mais    | Lighthouse na rota do slice       |
| Contraste de texto normal                              | 4.5:1         | conferencia dos pares de token    |
| Contraste de texto grande e UI                         | 3:1           | conferencia dos pares de token    |
| Fluxo principal por teclado                            | 100% operavel | roteiro manual registrado na task |
| Collection de upload sem texto alternativo obrigatorio | zero          | leitura do config                 |

## Seguranca

Norma: `next-js/docs/ai/SECURITY.md`.

| Criterio                                  | Limite | Como provar                                                                 |
| ----------------------------------------- | ------ | --------------------------------------------------------------------------- |
| Secret no bundle                          | zero   | grep em `.next/static` por `PAYLOAD_SECRET`, `DATABASE_URL`, `postgres://`  |
| Import da ferramenta fora dos adapters    | zero   | grep por `getPayload` e import de `payload` em `src/app` e `src/components` |
| Infraestrutura dentro do dominio          | zero   | grep por `payload` em `src/core`                                            |
| Collection ou global sem acesso declarado | zero   | leitura do config                                                           |
| Mutation publica sem limite de taxa       | zero   | leitura do handler                                                          |
| Upload sem tipos e limite declarados      | zero   | leitura do config                                                           |
| Rascunho visivel em leitura publica       | zero   | teste com documento em rascunho                                             |

## Regra De Registro

- Cada linha aplicavel vira uma entrada em `## Validacoes executadas` da task, com o numero medido e a data.
- Limite estourado exige causa e plano registrados na task, nunca ajuste silencioso do limite.
- Criterio nao aplicavel e marcado como `nao se aplica`, com o motivo.
- Gate nao executado nao pode ser registrado como aprovado.

## Quando Bloquear

- rota publica entregue sem nenhuma medicao registrada
- violacao de acessibilidade critica ou seria em fluxo principal
- qualquer criterio de seguranca com limite zero violado
- mutation publica sem limite de taxa
- rota sem estrategia de cache declarada
