# Regras de execucao local (next-js)

Complementa `SKILL.md`. Nao substitui `../.agents/skills/executar-task/references/regras-de-execucao.md` da raiz; e o recorte desta stack.

## Ordem obrigatoria

1. ler contexto minimo
2. ler a task e o slice
3. confirmar `Perfil do projeto` (stack `next-js`, `cms`)
4. identificar a skill atomica correspondente ao escopo, se houver
5. executar somente o escopo `next-js`
6. validar (lint, typecheck, build, gates web quando aplicavel)
7. atualizar a task e devolver resultado local

## Nao fazer

- nao instalar dependencia sem human approval quando a task exigir
- nao criar collection/global fora do modelo declarado no `Modelo de conteudo planejado` sem registrar decisao
- nao importar `payload` fora de `adapters/`
- nao inventar numero de gate de qualidade; medir ou marcar como pendente
