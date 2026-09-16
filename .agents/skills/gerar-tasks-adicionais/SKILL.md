---
name: gerar-tasks-adicionais
description: gerar uma ou mais tasks adicionais no backlog unico da raiz a partir de uma nova solicitacao, incluindo novas referencias visuais ou prints de telas, respeitando a stack web escolhida (front-end React/Vite ou next-js), mobile opcional, classificacao por tipo (front, back, mobile, shared), dependencias cruzadas, contexto sob demanda e referencia ao contrato openapi quando aplicavel.
---

Gere change requests no backlog unico da raiz.

## Objetivo

Transformar nova demanda em tasks adicionais sem quebrar o planejamento existente.

## Contexto obrigatorio

- `AGENTS.md` e `GUIDE.md` da raiz
- `.agents/context-map.md`
- `tasks/000-index.md`
- tasks existentes em `tasks/` somente quando necessarias para deduplicar ou criar dependencias
- handoffs relevantes em `.agents/state/handoffs/`, quando a mudança continuar task ou slice já executado
- perfil do projeto registrado no indice (`front-end` ou `next-js`; mobile `sim` ou `nao`)

## Contexto sob demanda

- `requirements/`: somente quando a nova demanda apontar requisito ou ambiguidade de negocio
- `design-system/front/`: somente quando a change request tiver UI web
- `design-system/mobile/`: somente quando mobile existir e a change request tiver UI mobile
- `contracts/openapi.yaml`: somente quando houver API ou integracao cliente-servidor
- docs locais de stack: somente das stacks envolvidas

## Regras

- criar em `tasks/change-requests/`
- toda change request deve declarar slice vertical com caminho concreto para `tasks/slices/*.md` ou indicar que cria novo slice
- toda task adicional deve declarar contexto mínimo e contexto sob demanda
- toda task adicional deve declarar orçamento de contexto e estrategia de reducao
- toda change request deve materializar `## Security Constraints` completo (a skill escolhe perfil e expande listas; usuario so revisa)
- change request criada a partir de spec longa deve ser fatiada antes da execucao; nao transformar a spec inteira em uma unica task executavel
- não carregar histórico completo de tasks concluídas quando houver handoff relevante
- usar handoff para preservar decisões anteriores sem recarregar contexto excessivo
- se a mudança exigir reabrir múltiplos slices, gerar tasks separadas por slice
- quando a mudança criar novo slice, criar também um arquivo proprio em `tasks/slices/`
- quando a mudança alterar escopo de slice existente, atualizar o arquivo do slice correspondente
- classificar cada task com `Tipo`
- declarar `Stacks envolvidos`
- para task `front`, usar a stack web registrada no indice: `front-end` ou `next-js`
- nao criar task `mobile` se o indice indicar `mobile: nao`, salvo pedido explicito para adicionar mobile ao escopo
- quando a demanda envolver conteudo editavel e o indice nao declarar `cms`, perguntar ao usuario qual skill de CMS governa o projeto (`payload`, `proprio` ou `nenhum`) e registrar no perfil antes de criar a task
- nao inferir a skill de CMS; `criar-cms-payload` e `criar-cms-next` sao mutuamente exclusivas
- declarar `Contrato` quando aplicavel
- declarar `Modo de execucao`
- apontar a referencia visual correta por stack quando houver UI
- quando a nova demanda trouxer prints de telas, classificar a referencia visual como `prints de telas`, apontar os caminhos concretos em `design-system/front/` ou `design-system/mobile/` e registrar quais telas/estados cada print governa
- nao usar prints de uma stack para inferir a outra sem regra explicita no change request
- relacionar dependencias com tasks existentes
- ao detectar auth, secrets, API sensivel, contrato breaking ou infra na demanda, preferir perfis `auth-sensitive`, `api-back`, `cross-stack` ou `infra-risk` e materializar constraints mais restritivas (ver `.agents/references/security-constraints.md` sob demanda)

## Atualizacao do indice

Atualizar `tasks/000-index.md` quando a mudanca impactar ordem, dependencias, escopo global ou o conjunto de slices.

## Proibicoes

- nao implementar codigo
- nao duplicar task ja coberta
- nao ignorar impacto cross-stack
- nao criar backlog local por stack
- nao transformar handoff em task
- nao criar change request sem arquivo de slice correspondente quando a demanda criar novo slice
- nao criar change request sem Security Constraints materializado
- nao deixar apenas o nome do perfil de security sem listas concretas
