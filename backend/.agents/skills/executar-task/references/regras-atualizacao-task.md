# Regras para atualização do arquivo da task

Ao executar uma task, atualize o arquivo da própria task usando a estrutura já existente no repositório.

Use as regras abaixo para preencher os principais campos.

## Status
No começo da execução:
- altere o bloco `## Status` da task da raiz para `in_progress`

Ao final:
- altere o bloco `## Status` da task da raiz para o mesmo valor de `Status final`
- use apenas `done` ou `blocked`
- não finalize apenas o handoff ou `tasks/000-index.md` mantendo a task como `in_progress`

Antes de encerrar, confira:
- `## Status` da task
- `## Status final` da task
- linha da task em `tasks/000-index.md`, quando a stack local for responsavel por consolidar status
- handoff relacionado, quando a stack local for responsavel por gerar ou atualizar handoff

Se `## Status` continuar `in_progress`, a execução ainda não está finalizada.

## Resultado da execução
Escreva notas objetivas sobre:
- o que foi implementado
- o que não foi implementado
- decisões técnicas tomadas
- trade-offs relevantes
- artefatos do scaffold removidos, substituídos ou adaptados, quando aplicável

## Arquivos alterados
Liste todos os arquivos:
- modificados
- criados
- removidos
- substituídos

Prefira um caminho por linha.

## Validações executadas
Liste apenas validações realmente executadas.
Para cada uma, informe o resultado.

Exemplos:
- `testes automatizados: executados com sucesso`
- `lint: executado sem erros`
- `build: executado com sucesso`
- `revisão visual contra design system: validada manualmente`
- `typecheck: não executado neste contexto`

## Pendências pós-task
Liste:
- itens de continuação
- limitações conhecidas
- melhorias adiadas
- ambiguidades descobertas
- dívida técnica conscientemente não tratada por estar fora de escopo

## Status final
Use apenas:
- `done`
- `blocked`

`Status final` não substitui o bloco `## Status`; os dois devem ficar com o mesmo valor ao final.

## Critérios de conclusão
Quando fizer sentido, atualize os critérios de conclusão indicando se cada item foi atendido ou não.
Não marque um critério como atendido se ele não tiver sido realmente verificado.
