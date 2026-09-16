---
name: qa
description: Valida mudancas no projeto `next-js/` com o fluxo de qualidade do repositorio. Use quando precisar revisar regressao, rodar lint/typecheck/build, medir os gates de performance, SEO e acessibilidade, ou confirmar readiness antes de considerar uma task pronta.
metadata:
  short-description: Executa QA do next-js com lint, typecheck e build
---

# QA

Use esta skill para revisar qualidade no `next-js/`. O objetivo e rodar os checks reais do repo e apontar risco concreto, nao so listar comando executado.

## Quando usar

- houve mudanca de codigo no `next-js/`
- o usuario pediu QA, validacao ou review de regressao
- precisa confirmar se a alteracao esta pronta para fechar a task
- algum gate de qualidade falhou e precisa de diagnostico

## Leitura inicial

- `AGENTS.md`
- `docs/ai/QA.md`
- `docs/ai/PERFORMANCE.md`
- `docs/ai/SECURITY.md` se a mudanca tocar auth, formulario ou CMS

## Workflow

### 1. Entenda o alcance da mudanca

Mapeie se a alteracao afetou:

- rota publica (SEO, performance, acessibilidade entram no gate)
- collection/global/block do Payload (seguranca e modelagem entram)
- so componente interno sem rota nova

### 2. Rode os checks padrao

Dentro de `next-js/`, rode:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Esta stack nao tem runner de teste configurado. Nao trate `quality:test` da raiz como
evidencia: ele pula esta stack e sai verde sem testar nada (ver `docs/ai/QA.md`).

### 3. Rode os gates web quando houver rota publica

- performance: `First Load JS` e Core Web Vitals, ver `docs/ai/PERFORMANCE.md`
- SEO: metadata, JSON-LD, sitemap
- acessibilidade: axe, contraste, teclado, ver `docs/ai/ACCESSIBILITY.md`

Registrar o numero medido, nao so a intencao.

### 4. Revise o que pode ter ficado sem cobertura

- fronteira violada: `getPayload` ou import de `payload` fora de `adapters/`
- formulario alterado sem checagem de validacao, honeypot ou limite de taxa
- imagem sem `next/image` ou sem `alt`

## Como reportar

- reporte primeiro o risco ou falha
- se tudo passar, diga isso explicitamente com os numeros medidos
- se algum gate nao puder rodar, explique o bloqueio

## Exemplos

- "Validar uma secao nova" -> lint, typecheck, build, mais os gates web se a secao for publica
- "Checar um formulario alterado" -> confirmar validacao server-side, honeypot, limite de taxa e mensagens de erro acessiveis
