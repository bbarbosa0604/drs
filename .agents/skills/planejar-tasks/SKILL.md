---
name: planejar-tasks
description: planejar backlog unico na raiz a partir de requirements, design-system, prints de telas, contracts openapi, guias globais e contexto das stacks web React/Vite ou Next.js, backend e mobile opcional. usar quando for necessario criar tasks classificadas por tipo, com dependencias cruzadas, vertical slices, contexto mínimo e contexto sob demanda.
---

Planeje o projeto inteiro com orquestracao na raiz, usando progressive disclosure.

## Estrutura alvo

- `AGENTS.md` (raiz)
- `GUIDE.md` (raiz)
- `.agents/context-map.md`
- `requirements/` (raiz)
- `design-system/front/` (raiz)
- `design-system/mobile/` (raiz)
- `contracts/openapi.yaml` (raiz)
- `tasks/` (raiz)
- `front-end/` (React/Vite), `next-js/` (Next.js), `backend/`, `mobile/` (opcional)

## Objetivo desta skill

Criar backlog unico e rastreavel na raiz, organizado primeiro por vertical slices de negocio e depois por tasks tecnicas classificadas em:

- `front`
- `back`
- `mobile`
- `shared`

Tasks `front` devem apontar a stack web concreta em `Stacks envolvidos`:

- `front-end` para React/Vite
- `next-js` para Next.js

Tasks `mobile` so devem existir quando o usuario confirmar que o projeto tera mobile.

## Fluxo obrigatorio

1. Ler contexto mínimo da raiz:
   - `AGENTS.md`
   - `GUIDE.md`
   - `.agents/context-map.md`
2. Antes de gerar qualquer task, perguntar e aguardar resposta do usuario:
   - se o projeto web sera React/Vite (`front-end/`) ou Next.js (`next-js/`)
   - se o projeto tera mobile (`sim` ou `nao`)
   - se a stack web for `next-js` e houver conteudo editavel, qual skill de CMS governa o projeto (`payload`, `proprio` ou `nenhum`)
3. Registrar as respostas como `Perfil do projeto`, incluindo `cms`.
4. Ler requirements e referencias visuais somente o necessario para identificar jornadas, capacidades e riscos.
5. Classificar `design-system/front/` e `design-system/mobile/` de forma independente.
6. Executar review verificavel da spec.
7. Decompor a demanda em vertical slices de negocio.
8. Para cada slice, definir:
   - objetivo de negocio;
   - entrega verificavel;
   - fora de escopo;
   - stacks envolvidas;
   - contrato necessario;
   - referencia visual necessaria;
   - contexto mínimo;
   - contexto sob demanda;
   - risco de contexto excessivo;
   - security posture enxuta (risco default e herdados).
9. Criar um arquivo por slice em `tasks/slices/`, usando identificador rastreavel e consolidando o escopo do slice.
10. Transformar slices em tasks no backlog unico.
11. Para cada task, materializar `## Security Constraints` completo:
    - escolher perfil interno (`docs-only`, `ui-front`, `api-back`, `auth-sensitive`, `cross-stack`, `infra-risk`);
    - expandir em listas concretas (tools, paths de escrita, human approval, contexto proibido, criterios de saida);
    - nao deixar so o nome do perfil; o usuario apenas revisa o bloco gerado.
12. Consolidar dependencias cruzadas.
13. Criar/atualizar `tasks/000-index.md`.
14. Criar tasks em `tasks/*.md`.
15. Apresentar resumo do planejamento, incluindo slices, arquivos de slice criados, riscos de contexto e security constraints relevantes.

## Leitura por progressive disclosure

### Sempre ler

- `AGENTS.md` da raiz
- `GUIDE.md` da raiz
- `.agents/context-map.md`

### Ler durante planejamento quando necessario

- `requirements/`, preferindo arquivos especificos
- `design-system/front/`, quando houver UI web
- `design-system/mobile/`, somente quando mobile for confirmado
- `contracts/openapi.yaml`, quando houver API ou integracao cliente-servidor

### Ler docs locais somente depois de decidir stacks envolvidas

- `front-end/AGENTS.md` e `front-end/docs/ai/` quando a resposta for React/Vite e houver impacto front-end
- `next-js/AGENTS.md` e `next-js/docs/ai/` quando a resposta for Next.js e houver impacto front-end
- `backend/AGENTS.md` e `backend/docs/ai/` quando houver impacto backend
- `mobile/AGENTS.md` e `mobile/docs/ai/` somente quando mobile for confirmado e houver impacto mobile

Não carregar docs locais de stack não envolvida no slice.

## Perguntas obrigatorias ao usuario

Antes de escrever ou atualizar qualquer arquivo em `tasks/`, perguntar em uma unica mensagem:

1. O projeto web sera React/Vite (`front-end/`) ou Next.js (`next-js`)?
2. O projeto tera mobile? (`sim` ou `nao`)
3. Se a stack web for `next-js` e o projeto tiver conteudo editavel: qual skill de CMS governa o projeto?
   - `payload`: Payload CMS dentro do Next via Local API, implementado por `criar-cms-payload`
   - `proprio`: CMS escrito a mao no proprio Next, implementado por `criar-cms-next`
   - `nenhum`: conteudo vive em codigo

Nao inferir essas respostas a partir da existencia das pastas. As pastas sao scaffolds disponiveis, nao decisao de escopo do produto.

Nao inferir a skill de CMS pela stack, pela existencia de Postgres nem pelo nome da demanda. As duas skills de CMS sao mutuamente exclusivas.

## Review obrigatorio da spec

Antes de concluir o planejamento, transformar os itens abaixo em verificacoes explicitas no backlog e nas tasks. Nao tratar como checklist mental.

- Permissoes definidas: registrar papeis, perfis, escopos ou declarar `nao se aplica`
- Casos de erro mapeados: listar erros, estados vazios, estados de carregamento, negacao de permissao e falhas de integracao quando aplicavel
- Decisoes de negocio confirmadas como humanas: separar claramente requisito confirmado vs premissa assumida pela IA
- Criterios de aceite objetivos e verificaveis: escrever criterios observaveis, testaveis e sem linguagem subjetiva
- Casos de borda considerados: listar cenarios limite relevantes ou declarar explicitamente que nao ha novos casos de borda alem dos ja cobertos
- Security Constraints materializadas: cada task com tools, human approval, contexto proibido e criterios de saida preenchidos (nao apenas nome de perfil)

Se algum item acima estiver incompleto, nao encerrar o planejamento como se estivesse fechado. Registrar lacuna, risco ou duvida para validacao humana.

## Security Constraints (obrigatorio por task)

A skill de planejamento gera o bloco; o usuario so revisa.

1. Escolher perfil interno conforme risco e tipo da task (ver `.agents/references/security-constraints.md` sob demanda).
2. Materializar listas concretas na task a partir do perfil.
3. Registrar `Perfil de origem` so para rastreio; a allowlist materializada e a fonte de verdade da execucao.
4. Em risco medio/alto, nao aceitar allowlist generica ("qualquer path do backend") sem restringir ou registrar lacuna.
5. Distinguir de seguranca de produto (`SECURITY.md` / skill local): app-security continua sob demanda; agent-security vive na task.

## Regras de vertical slice

- planejar primeiro por entrega de negocio, depois por stack;
- cada slice deve ser pequeno o bastante para execucao em uma task ou em um conjunto minimo de subtarefas fortemente relacionadas;
- evitar slices que misturem multiplas jornadas independentes;
- cada slice deve existir como arquivo proprio em `tasks/slices/`;
- cada slice deve declarar fora de escopo;
- cada slice deve declarar contexto sob demanda;
- se um slice exigir contexto excessivo, dividir antes de gerar task.
- o arquivo do slice deve ser a fonte principal para objetivo de negocio, entrega verificavel, fora de escopo, riscos e relacao entre tasks.
- o `tasks/000-index.md` deve listar cada slice com link/caminho para seu arquivo correspondente.

## Regras de decomposicao

- toda task deve ser executavel e com escopo claro
- toda task deve declarar `Tipo`
- toda task deve declarar `Stacks envolvidos`
- task `front` deve declarar `front-end` ou `next-js`, nunca os dois, salvo requisito explicito de migracao/comparacao
- task `mobile` deve ser criada apenas se mobile foi confirmado
- tasks de integracao cliente-servidor devem declarar `Contrato`
- toda task deve declarar `Modo de execucao`
- toda task deve declarar `Slice vertical`
- toda task deve apontar para um arquivo concreto em `tasks/slices/*.md`
- toda task deve declarar `Contexto mínimo`
- toda task deve declarar `Contexto sob demanda`
- toda task deve declarar `Orçamento de contexto`
- toda task deve declarar `## Security Constraints` materializado
- dependencias cruzadas devem ser explicitas
- toda task deve deixar verificavel:
  - qual fonte visual em `design-system/front/` ou `design-system/mobile/` governa a implementacao
  - quais permissoes impactam o fluxo
  - quais casos de erro e borda precisam ser tratados
  - quais criterios objetivos definem conclusao
  - quais tools/paths/human approvals/contexto proibido limitam a execucao

## Regras para `design-system/`

- `design-system/front/` governa a referencia visual de tasks `front` tanto para `front-end` quanto para `next-js`, e da porcao web de tasks `shared`
- `design-system/mobile/` governa a referencia visual de tasks `mobile` e da porcao mobile de tasks `shared`
- cada subpasta pode conter artefatos de design system, uma aplicacao-prototipo visual ou prints de telas
- task com UI de `front` deve apontar para caminhos concretos em `design-system/front/`
- task com UI de `mobile` deve apontar para caminhos concretos em `design-system/mobile/`
- task `shared` com UI em front e mobile deve registrar separadamente as fontes visuais de cada stack
- quando a subpasta relevante contiver uma aplicacao-prototipo visual, decompor tasks de UI para preservar fidelidade de layout, hierarquia, componentes, copy, estados e fluxo visual dessa aplicacao
- quando a subpasta relevante contiver prints de telas, decompor tasks de UI para preservar fidelidade ao que estiver visivel nos prints: layout, hierarquia, componentes, copy, estados capturados, densidade, espacamentos e comportamento inferivel apenas quando a task declarar essa inferencia
- prints de telas devem ser referenciados por caminhos concretos e, quando houver varios, associados as telas/fluxos/estados que cada imagem governa
- se os prints nao cobrirem um estado necessario, registrar lacuna ou premissa na task em vez de inventar a UI desse estado
- nao resumir a referencia visual como "seguir o design system"; apontar caminhos e telas/componentes concretos em `design-system/front/` ou `design-system/mobile/`
- nao usar a referencia visual de uma stack para cobrir ausencia da outra por iniciativa propria
- se houver conflito entre requirements e a referencia visual, explicitar o conflito na task em vez de inferir sozinho qual lado vence

## Regras de contrato

- `contracts/openapi.yaml` e fonte de verdade para API
- se contrato estiver ausente/incompleto, criar task `shared` para definir/ajustar contrato antes da implementacao cliente-servidor

## Modo de subagentes

Durante o planejamento:

- gerar propostas por stack aplicavel em paralelo (web escolhida, back e mobile quando confirmado)
- consolidar na raiz sem duplicar escopo
- manter coesao entre tasks `shared` e tasks por stack
- nao carregar contexto de stack nao envolvida no slice

## Arquivos de referencia

- `references/regras-de-planejamento.md`
- `references/modelo-index-tasks.md`
- `references/modelo-slice.md`
- `references/modelo-task.md`
- `.agents/references/security-constraints.md` (sob demanda, ao materializar constraints)

## Proibicoes

- nao implementar codigo de produto
- nao criar backlog separado por stack
- nao inventar requisito ausente
- nao ignorar contrato quando houver API
- nao carregar contexto amplo sem gatilho explicito
- nao criar task sem Security Constraints materializado
- nao deixar apenas o nome do perfil de security sem listas concretas
- nao pedir ao usuario para montar Security Constraints do zero
