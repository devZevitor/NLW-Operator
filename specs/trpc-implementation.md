# Especificação de Implementação do tRPC (Next.js App Router + React Query)

Esta especificação detalha a configuração do tRPC no projeto DevRoast, integrando-o com o Next.js App Router, Server Components e TanStack React Query para garantir type-safety end-to-end e suporte a SSR/Hydration.

## 1. Instalação de Dependências

Instalar os pacotes necessários para o servidor, cliente e integração com React Query.

```bash
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query superjson zod server-only
```

## 2. Estrutura de Diretórios Sugerida

A estrutura seguirá os padrões do projeto, mantendo a lógica de API separada dos componentes visuais.

```
src/
├── app/
│   └── api/
│       └── trpc/
│           └── [trpc]/
│               └── route.ts      # API Route Handler (GET/POST)
├── server/
│   └── api/
│       ├── root.ts               # App Router principal (root)
│       ├── trpc.ts               # Inicialização e procedimentos base
│       └── routers/              # Sub-routers (ex: post.ts, user.ts)
│           └── example.ts
└── trpc/
    ├── client.tsx                # Client Provider (QueryClient + tRPC Client)
    ├── react.tsx                 # Hooks do tRPC para Client Components
    └── server.ts                 # Helper para Server Components (RSC)
```

## 3. Configuração do Servidor (`src/server/api`)

### 3.1. Inicialização (`src/server/api/trpc.ts`)

Configurar a inicialização do tRPC, contexto e procedimentos base (`publicProcedure`, `protectedProcedure`). Utilizar `superjson` para serialização avançada (Datas, Maps, Sets).

```typescript
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

// TODO: Adicionar contexto (session, db) aqui quando necessário
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createRouter = t.router;
export const publicProcedure = t.procedure;
```

### 3.2. Router Principal (`src/server/api/root.ts`)

Centralizar todos os sub-routers.

```typescript
import { createCallerFactory, createRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example"; // Exemplo

export const appRouter = createRouter({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
```

### 3.3. Exemplo de Router (`src/server/api/routers/example.ts`)

Um router simples para teste.

```typescript
import { z } from "zod";
import { createRouter, publicProcedure } from "@/server/api/trpc";

export const exampleRouter = createRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
```

## 4. API Route Handler (`src/app/api/trpc/[trpc]/route.ts`)

Expor os endpoints do tRPC via Next.js Route Handlers.

```typescript
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  });

export { handler as GET, handler as POST };
```

## 5. Configuração do Cliente (`src/trpc`)

### 5.1. Hooks React (`src/trpc/react.tsx`)

Criar a instância do cliente tRPC para ser usada em Client Components.

```typescript
"use client";

import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/api/root";

export const api = createTRPCReact<AppRouter>();
```

### 5.2. Query Client & Provider (`src/trpc/client.tsx`)

Configurar o `QueryClientProvider` e o `api.Provider` para envolver a aplicação.

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import { api } from "./react";
import superjson from "superjson";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  );
}
```

**Uso no `src/app/layout.tsx`:**

```tsx
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
```

### 5.3. Server Helper (`src/trpc/server.ts`)

Configurar o helper para prefetching e chamadas diretas em Server Components (RSC), usando `cache` do React para memoizar o `createCaller`.

```typescript
import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCaller, type AppRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { makeQueryClient } from "./query-client"; // Extrair criação do QueryClient se necessário, ou criar inline

// Helper para criar o contexto e o caller
const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(makeQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
```
*Nota: Pode ser necessário ajustar a criação do `QueryClient` para ser compartilhada entre client/server files ou duplicada de forma segura.*

## 6. Utilização

### 6.1. Client Components

Uso padrão do React Query via tRPC.

```tsx
"use client";

import { api } from "@/trpc/react";

export function ClientGreeting() {
  const { data } = api.example.hello.useQuery({ text: "Client" });
  if (!data) return <div>Loading...</div>;
  return <div>{data.greeting}</div>;
}
```

### 6.2. Server Components (Prefetching)

Para SSR com hidratação no cliente.

```tsx
import { api, HydrateClient } from "@/trpc/server";
import { ClientGreeting } from "./client-greeting";

export default async function Page() {
  void api.example.hello.prefetch({ text: "Server" });

  return (
    <HydrateClient>
      <ClientGreeting />
    </HydrateClient>
  );
}
```
