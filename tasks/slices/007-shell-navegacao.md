# Slice 007 - Shell e navegacao

## Status

done

## Objetivo de negocio

Dar a qualquer usuario autenticado um menu lateral persistente para navegar entre os modulos do DSR (hoje: Dashboard, Organizacoes, Projetos), preparado para crescer conforme novos modulos (ex.: Escopometro como item proprio, Documentos, Auditoria) forem adicionados.

## Entrega verificavel

Toda rota autenticada (exceto `/login`) renderiza um menu lateral fixo com marca Daryus e os links Dashboard/Organizacoes/Projetos, com o item da rota atual destacado. O componente de menu suporta tanto links diretos quanto grupos colapsaveis (com chevron), mesmo que hoje nenhum item use grupo — a estrutura fica pronta para os proximos modulos sem exigir refatoracao do componente.

## Fora de escopo

- Menu mobile tipo drawer/hamburguer (por ora, o menu lateral apenas empilha acima do conteudo em telas estreitas, sem toggle).
- Persistir estado de grupo aberto/fechado entre sessoes (fica em memoria do componente).
- Novos modulos de navegacao alem de Dashboard/Organizacoes/Projetos (ficam para quando esses modulos existirem de fato).

## Perfil do projeto

- stack web escolhida: next-js (Next.js)
- mobile: nao
- cms: nao se aplica

## Stacks envolvidas

- next-js

## Contrato

- nao se aplica (nenhuma mudanca de API)

## Referencia visual por stack

### Web

- tipo: aplicacao-prototipo visual (referencia funcional trazida pelo usuario, produto "Fasters OS" — inspiracao de layout, nao arquivo versionado no repositorio)
- fonte primaria: `design-system/front/brand/daryus-tokens.md` (cores/tipografia oficiais aplicadas ao layout de referencia)

### Mobile

- tipo: nao se aplica
- fonte primaria: nao se aplica

## Permissoes e atores

- nao se aplica (menu visivel para qualquer usuario autenticado; nenhum item e restrito por papel nesta entrega)

## Casos de erro e borda

- Rota atual sem correspondencia exata a um item do menu (ex.: `/organizations/123`): o item pai (`Organizacoes`) permanece destacado via prefixo de path.
- Tela estreita (mobile): menu empilha acima do conteudo em vez de sobrepor ou cortar.
- `/login`: nao deve renderizar o menu lateral (mantido full-bleed, como antes desta entrega).

## Decisoes humanas confirmadas

- Layout de referencia trazido pelo usuario (print da aplicacao "Fasters OS") deve inspirar o padrao de menu lateral com marca no topo e grupos colapsaveis, adaptado a paleta Daryus (navy no lugar do preto do exemplo).
- A funcionalidade deve ser commitada no repositorio do proprio DSR (`bbarbosa0604/drs`), nao no repositorio do gerador de scaffold — engano corrigido nesta rodada.

## Premissas adotadas

- Como o backlog 001-027 esta fechado e nenhuma task cobria shell/navegacao, esta entrega abre um slice e uma task novos (007/028) em vez de anexar a um slice existente do Escopometro.
- Sem verificacao visual end-to-end contra o backend real (producao) nesta entrega — ver pendencia na Task 028.

## Tasks relacionadas

- `tasks/028-menu-lateral-navegacao.md` - implementa o `Sidebar` e integra ao `AppShell`

## Dependencias do slice

- Nenhuma

## Contexto minimo recomendado

- `AGENTS.md`
- `GUIDE.md`
- `.agents/context-map.md`
- `tasks/000-index.md`
- este slice

## Contexto sob demanda recomendado

| Gatilho   | Fonte                                        | Quando carregar                 | Obrigatorio? |
| --------- | -------------------------------------------- | ------------------------------- | ------------ |
| UI web    | `design-system/front/brand/daryus-tokens.md` | sempre, esta task altera UI web | sim          |
| Front-end | `next-js/AGENTS.md`, `next-js/docs/ai/`      | sempre, stack web envolvida     | sim          |

## Risco de contexto

- baixo
- estrategia de fatiamento ou reducao de contexto: task unica, escopo restrito a `next-js/src/components/shell/`

## Security posture do slice

- nivel de risco default: baixo
- perfil de origem sugerido: ui-front
- human approvals recorrentes do slice: push remoto para `bbarbosa0604/drs`
- contexto proibido herdado: `.env`/`.env.local`, tokens de sessao, dados reais de organizacoes/projetos em producao
- observacao: listas operacionais vivem na task, nao so aqui

## Observacoes de rastreabilidade

- Esta entrega foi implementada por engano no repositorio `fasters-projects/scaffolds` (commit `2bdf7fe`) e revertida la (`0245288`) antes de ser refeita aqui, no repositorio correto do DSR.

## Status final

done
