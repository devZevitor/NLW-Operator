# Padrões de Integração tRPC

## Estrutura
- **Backend Logic (`src/server/api`)**: Onde residem os routers e procedures.
- **Client/Server Helpers (`src/trpc`)**:
  - `server.ts`: Helper para Server Components (`api`, `HydrateClient`).
  - `react.tsx`: Hooks para Client Components.
  - `client.tsx`: Provider global.

## Server Components (RSC) & Prefetching
Para carregar dados no servidor e hidratar no cliente (SSR):
1. Importar `api` e `HydrateClient` de `@/trpc/server`.
2. Usar `void api.router.procedure.prefetch()` no componente assíncrono.
3. Envolver o retorno em `<HydrateClient>`.

```tsx
import { api, HydrateClient } from "@/trpc/server";

export default async function Page() {
  void api.example.hello.prefetch();

  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

## Client Components
- Usar `api.router.procedure.useQuery()` ou `useSuspenseQuery()`.
- Para animações de números (métricas), usar `@number-flow/react`.
- Manter componentes interativos (como inputs ou toggles) isolados em "ilhas" de interatividade (`"use client"`).
