# QA

## Objetivo

Este arquivo define a rotina minima de qualidade para o Next.js. O foco e manter mudancas pequenas, previsiveis e baratas de validar para humanos e agentes.

## Ferramentas

- `ESLint` para regras estaticas
- `TypeScript` para validacao estrutural
- `next build` para validar App Router, renderizacao e configuracao
- Testes unitarios e de interface quando o projeto configurar runner

Esta stack nao tem runner de teste configurado. Enquanto nao houver, `lint`, `typecheck` e `build` sao os unicos gates automaticos, e `quality:test` da raiz nao cobre esta stack: ele pula a pasta e sai verde. Nao tratar `quality:test` verde como evidencia de teste nesta stack.

## Comandos Obrigatorios Antes De Entregar

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Gates De Qualidade Web

Entrega com rota publica tambem passa pelos gates dos anexos, com numero registrado na task:

- performance e Core Web Vitals: `docs/ai/PERFORMANCE.md`
- metadata, dados estruturados e semantica de documento: `docs/ai/SEO.md`
- teclado, foco, contraste e nome acessivel: `docs/ai/ACCESSIBILITY.md`
- acesso, upload e secret quando houver CMS: `docs/ai/SECURITY.md`

Criterio sem numero medido nao e criterio.

## O Que Testar

- Components reutilizaveis quando tiverem comportamento relevante
- Hooks quando encapsularem estado, efeitos ou integracao
- Pages nos fluxos principais de renderizacao
- Services e adapters quando transformarem dados
- Boundaries de erro, loading e vazio quando forem parte do fluxo

## Regras De Qualidade

- Todo bug corrigido deve ganhar cobertura quando fizer sentido.
- Nao adicionar testes so para aumentar numero. Testar comportamento real.
- Evitar snapshots amplos e frageis.
- Preferir testes pequenos, focados e baratos de manter.
- Se um componente depende de router, store ou provider, montar o contexto minimo necessario.

## Checklist Rapido

- `typecheck` passando
- `build` passando
- Sem warning de lint
- Fluxo principal validado
- Gates web executados e numeros registrados na task quando houver rota publica
- Mudanca documentada se alterar arquitetura ou padrao
