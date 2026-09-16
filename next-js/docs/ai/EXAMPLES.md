# Examples

## App Router

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/loading.tsx` quando houver carregamento por segmento
- `src/app/error.tsx` quando houver boundary de erro recuperavel

## Component

- `src/components/Button`
- `src/components/StatusBadge`
- `src/components/PageHeader`

## Hook

- `src/hooks/useSession`
- `src/hooks/useDashboardFilters`

## Service

- `src/services/http/apiClient.ts`
- `src/services/dashboard/getDashboardSummary.ts`
- `src/services/adapters/adaptUser.ts`

## Core E Adapters

- `src/core/content/types.ts`
- `src/core/content/ports.ts`
- `src/adapters/payload/payload.flower.repo.ts`
- `src/adapters/payload/mappers/toFlower.ts`

## Payload

- `src/payload.config.ts`
- `src/collections/Flowers.ts`
- `src/globals/SiteSettings.ts`
- `src/blocks/HeroBanner/config.ts`
- `src/components/sections/HeroBanner/index.tsx`

## Patterns

- Strategy: `src/patterns/strategy/statusStrategy.ts`
- Factory: `src/patterns/factory/createApiClient.ts`
- Adapter: `src/services/adapters/adaptUser.ts`
- Observer: store ou provider compartilhado quando houver estado global real
- Decorator: `src/utils/decorators/withRetry.ts`

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
