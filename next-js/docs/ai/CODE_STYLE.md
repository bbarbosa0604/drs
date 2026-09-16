# Code Style

## Convencoes Gerais

- TypeScript estrito.
- Sem `any`.
- Um modulo, uma responsabilidade.
- Imports via alias `@/` sempre que fizer sentido.
- Tailwind v4 para estilo. Tokens declarados em `@theme`. Ver `docs/ai/STYLING.md`.

## Regras TypeScript

- Preferir `interface` para contratos de objeto reutilizaveis.
- Preferir `type` para unioes e composicoes pequenas.
- Adaptar dados externos antes de usa-los na UI.
- Evitar tipos amplos demais em components de base.
- Tipar props de components explicitamente.

## Regras De Componentes

- Server Component por padrao.
- Client Component somente quando necessario.
- Manter `"use client"` no menor arquivo possivel.
- Evitar passar objetos grandes sem necessidade entre server e client boundaries.

## Regras De Estilo

- Usar token semantico existente antes de escrever valor arbitrario.
- Nao criar CSS Module novo. Estilo local vive em classe utilitaria.
- Usar `clsx` para classe condicional, nao concatenacao de string.
- Evitar `style` inline, salvo valor calculado em runtime.
- Escrever classe de layout antes de classe de cor, para leitura previsivel.

## Regras De Import

- Ordem sugerida:
  1. bibliotecas externas
  2. alias internos `@/`
  3. estilos locais

- Evitar caminhos relativos longos como `../../../`.
- Centralizar dependencias compartilhadas em `constants/`, `types/` e `utils/`.

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
