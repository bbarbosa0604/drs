# Handoff - Task 019

## Identificador da task

Task 019 - Camada de diagramas independente (ValueChainDiagram, TopologyDiagram,
ArchitectureDiagram)

## Slice vertical

Slice 004 - Escopometro: Scope Engine (`tasks/slices/004-escopometro-scope-engine.md`) —
primeira task do slice.

## Status final

done

## Decisoes preservadas

- Contrato de dados comum (`DiagramData` -> `DiagramLayout`) e generico: `classification`
  fecha em `'in-scope' | 'out-scope' | 'interface'` (as 3 cores do PRD secao 12), mas
  `group` e `string` livre — as entidades reais (`ValueChainBlock`, `TopologyNode` etc.)
  ainda nao existem (Task 020), entao nao ha enum fixo para acoplar agora.
- Layout e sempre uma funcao pura, testavel sem DOM: `sequential-layout.ts` (linhas por
  grupo, Cadeia de Valor) e `grouped-column-layout.ts` (colunas por grupo, Topologia e
  Arquitetura). Ambos usam `connections.ts` para resolver conexoes contra os nos ja
  posicionados e reportar `invalidConnectionIds` (conexao para no inexistente e omitida,
  nunca quebra o diagrama inteiro).
- Render (`DiagramSvg.tsx`) so conhece `DiagramLayout` — nao tem nenhuma regra de negocio
  nem sabe o que e "cadeia de valor" ou "topologia". Trocar SVG por outra tecnologia no
  futuro e trocar so este arquivo.
- Cores de classificacao de escopo (grafite/navy, cinza claro, contorno laranja) foram
  definidas como custom properties **locais** em `render/DiagramSvg.module.css` (nao em
  `next-js/src/app/globals.css`) porque a Security Constraints da task restringe escrita a
  `next-js/src/modules/sgsi-scope/diagrams/**`. Elas derivam de `--color-brand-navy`/
  `--color-brand-primary` (globais, ja existentes) via `var()`.
- `vitest` configurado no `next-js` por causa desta task (`npm run test`/`test:watch`).
  `next-js/docs/ai/QA.md` ainda nao foi corrigido para refletir isso — ficou pendencia
  registrada, no mesmo padrao de contradicao doc-local-desatualizado ja visto com
  `STYLING.md` (ver `CLAUDE.md`).

## Contexto efetivamente usado

- Minimo padrao + `tasks/019-camada-diagramas.md`, `tasks/slices/004-escopometro-scope-engine.md`.
- `design-system/front/brand/daryus-tokens.md` (nomes reais das CSS vars, confirmados em
  `next-js/src/app/globals.css`).
- `next-js/docs/ai/FRONTEND_PATTERNS.md`, `REPO_MAP.md`, `QA.md` (convencao de modulo e
  testes).
- `requirements/001-prd-escopometro-sgsi.md` secoes 12, 13, 37, 44 (dominio nunca depende
  de SVG; classificacao de escopo com 3 cores).

## Compliance de Security Constraints

- Risco baixo / perfil `cross-stack`. Escrita restrita a
  `next-js/src/modules/sgsi-scope/diagrams/**` — respeitada (a config do `vitest` e o
  script no `package.json` sao infraestrutura de validacao da propria task, nao produto).
  Nenhum acesso a `backend/` alem de confirmar que `contracts/openapi.yaml` ainda nao tem
  os paths de diagrama (esperado, ficam para a Task 020).

## Arquivos alterados

- Criados: `next-js/vitest.config.ts`,
  `next-js/src/modules/sgsi-scope/diagrams/{types.ts,index.ts,value-chain-diagram.ts,topology-diagram.ts,architecture-diagram.ts,ValueChainDiagram.tsx,TopologyDiagram.tsx,ArchitectureDiagram.tsx}`,
  `.../diagrams/layout/{geometry.ts,connections.ts,sequential-layout.ts,grouped-column-layout.ts}`,
  `.../diagrams/render/{DiagramSvg.tsx,DiagramSvg.module.css}`,
  `.../diagrams/__tests__/*.test.ts` (9 testes).
- Modificado: `next-js/package.json` (+scripts `test`/`test:watch`), `next-js/package-lock.json`,
  `docs/architecture.md` (secao "Diagramas" atualizada de "planejado" para o que foi
  implementado).

## Validacoes executadas

- `npm run test` (vitest): 9/9 passando.
- `npm run lint`, `npm run typecheck`, `npm run build` OK (33 rotas, sem alteracao de
  rota — camada consumida pelas Tasks 021/022, nao expoe UI propria ainda).

## Pendencias ou bloqueios

- `next-js/docs/ai/QA.md` desatualizado (diz que nao ha runner de teste configurado).
- Sem verificacao visual manual (nenhuma pagina consome os componentes ainda).
- Confirmar na Task 020 se `group` (string livre) mapeia direto para um campo das
  entidades novas ou precisa de adaptacao no service que monta `DiagramData`.

## Proximo contexto recomendado

Task 020 (Slice 004) - entidades `ValueChainBlock`/`TopologyNode`/`TopologyLink`/
`ArchitectureComponent`/`ArchitectureInterface` no backend + endpoints que alimentam
`DiagramData` desta camada. Depois, Tasks 021/022 (UI das Etapas 5/6) consomem
`ValueChainDiagram`/`TopologyDiagram`/`ArchitectureDiagram` direto de
`next-js/src/modules/sgsi-scope/diagrams`.
