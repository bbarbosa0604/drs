---
name: executar-task
description: executar o escopo local de uma task da raiz dentro de next-js, respeitando o backlog unico, o `Perfil do projeto`, o `## Security Constraints` da task e as skills atomicas desta stack.
---

Execute somente o escopo local `next-js` de uma task da raiz.

## Contexto obrigatorio

1. `../AGENTS.md`
2. `../GUIDE.md`
3. `../.agents/context-map.md`
4. `../tasks/000-index.md`
5. task selecionada em `../tasks/*.md`
6. `AGENTS.md`
7. `docs/ai/AGENTS.md`

## Progressive disclosure local

Executar apenas o escopo local `next-js` da task da raiz.

Ler somente:

- contexto minimo da task;
- `docs/ai/` desta stack relevantes ao escopo (malha base + anexo declarado com gatilho);
- fontes sob demanda que a task declarar para esta stack.

Nao carregar contexto de outras stacks. Nao replanejar backlog. Nao expandir escopo.

## Regras de roteamento para skills atomicas

Quando a tarefa combinar claramente com uma skill atomica desta stack, usar essa skill sem esperar invocacao explicita:

- rota/App Router -> `pagina`
- componente reutilizavel -> `componente`
- block do Payload + secao de render -> `secao`
- dialog/lightbox -> `modal`
- formulario publico -> `formulario`
- header/footer/shell -> `layout`
- campo/access/relacao numa collection ja existente -> `colecao`
- nova fonte de dado, port ou adapter -> `porta`
- metadata/JSON-LD/sitemap -> `seo`
- validacao e gates -> `qa`
- revisao de seguranca -> `seguranca`

Se a task pedir fundacao completa de Payload (`payload.config.ts`, primeira collection, primeira migration), isso e escopo da skill da raiz `criar-cms-payload`, nao desta. Bloquear e apontar para ela se acionado fora de uma task ja fundada.

## Regras de Security Constraints

- validar `## Security Constraints` da task antes de qualquer edicao;
- tools e paths usados devem ser subconjunto do declarado na task;
- acao marcada como human approval bloqueia ate confirmacao humana;
- nunca carregar contexto proibido pela task.

## Regras de escopo

- executar apenas a parte `next-js` da task
- nao replanejar backlog global
- nao criar task fora da raiz
- nao expandir escopo silenciosamente

## Regras de status

- iniciar marcando a task da raiz como `in_progress` quando aplicavel
- registrar resultado tecnico local para consolidacao
- status final permitido: `done` ou `blocked`

## Regras de bloqueio

Marcar `blocked` quando houver impedimento real:

- dependencia nao concluida
- ambiguidade impeditiva
- `Perfil do projeto` sem `cms` declarado numa task de conteudo editavel
- contrato ausente/incompleto para integracao externa
- limitacao de ambiente (banco indisponivel, dependencia nao instalavel)

## Regras de validacao

Rodar `npm run lint`, `npm run typecheck` e `npm run build`. Quando a task tocar rota publica, rodar tambem os gates de `docs/ai/PERFORMANCE.md`, `SEO.md` e `ACCESSIBILITY.md` e registrar o numero medido. Esta stack nao tem runner de teste; nao declarar teste que nao existe.

## Resultado esperado

Atualizacao rastreavel da task da raiz com:

- resultado local
- arquivos alterados
- validacoes executadas, com numero quando aplicavel
- pendencias

## Arquivos de referencia

- `references/regras-de-execucao.md`
- `references/regras-atualizacao-task.md`
