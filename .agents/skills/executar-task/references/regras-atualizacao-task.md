# Regras de atualizacao da task (raiz)

## Status

- inicio: alterar o bloco `## Status` do arquivo da task para `in_progress`.
- fim: alterar o bloco `## Status` do arquivo da task para o mesmo valor do bloco `## Status final`.
- valores finais permitidos: `done` ou `blocked`.
- proibido finalizar apenas `tasks/000-index.md` ou apenas o handoff mantendo a task como `in_progress`.

## Reconciliacao obrigatoria de status

Antes de encerrar a execucao, conferir e corrigir os pontos abaixo:

- arquivo da task: bloco `## Status` deve estar como `done` ou `blocked`;
- arquivo da task: bloco `## Status final` deve repetir exatamente o mesmo valor;
- `tasks/000-index.md`: linha da task deve refletir o mesmo status final;
- handoff em `.agents/state/handoffs/TASK-XXX.md`: campo `status final` deve refletir o mesmo status final;
- arquivo do slice em `tasks/slices/*.md`: quando o slice for concluido ou bloqueado por esta task, `## Status` e `## Status final` devem refletir o resultado.

Se qualquer um desses pontos ficar diferente, a task ainda nao esta finalizada.

## Resultado da execucao

Registrar:

- resumo por stack
- relacao com o slice e impacto no status do slice
- decisoes tecnicas
- trade-offs
- relacao com contrato
- relacao com a referencia visual em `design-system/front/` e/ou `design-system/mobile/`

## Contexto utilizado

Registrar:

- contexto mínimo lido;
- contexto sob demanda carregado;
- fontes que foram evitadas por não se aplicarem;
- qualquer redução de escopo feita para evitar excesso de contexto.

## Security Constraints (compliance)

Registrar:

- nível de risco e perfil de origem (se houver);
- resumo de tools/paths usados versus allowlist;
- human approvals pedidos e se foram obtidos;
- se contexto proibido foi respeitado;
- resultado dos critérios de saída de segurança;
- se a task foi `blocked` por falha de constraints, o motivo.

## Handoff

Registrar:

- caminho do handoff criado ou atualizado;
- resumo de decisões preservadas;
- próximo contexto recomendado;
- pendências que devem ser consideradas na próxima task.

## Arquivos alterados

Listar caminhos absolutos ou relativos por stack.

## Validacoes executadas

Listar somente validacoes realmente executadas e resultado.

## Qualidade estrutural

Registrar quando aplicavel:

- se novas utils foram adicionadas em `utils/` dedicado
- se novas interfaces ou tipos reutilizaveis foram adicionados em `types/` ou `interfaces/`
- se componentes, hooks ou funcoes grandes foram quebrados por responsabilidade
- qualquer pendencia de componentizacao ou separacao de responsabilidades que ficou fora do escopo

## Aderencia ao design system

Registrar:

- fonte primaria visual usada por stack
- tipo de referencia visual usada por stack
- evidencias de fidelidade visual
- desvios aprovados ou riscos residuais

## Pendencias pos-task

Listar:

- pendencias tecnicas
- bloqueios residuais
- proximas acoes necessarias

## Status final

- `done`
- `blocked`

O bloco `## Status final` nao substitui o bloco `## Status` no topo da task. Ambos devem ser atualizados.
