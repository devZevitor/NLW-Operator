# tRPC no DevRoast

## 1. Estrutura Implementada

Arquivos centrais:
- `src/server/api/trpc.ts`: inicialização (`initTRPC`), contexto, `publicProcedure`, `createTRPCRouter`.
- `src/server/api/root.ts`: router raiz (`appRouter`).
- `src/server/api/routers/metrics.ts`: router funcional com `getStats`.
- `src/app/api/trpc/[trpc]/route.ts`: endpoint HTTP para GET/POST.

## 2. Router

O projeto adota router modular:
- `appRouter` agrega sub-routers (`metrics`).
- Facilita escalabilidade para novos domínios (`roasts`, `leaderboard`, `analysis`, etc.).

## 3. Procedures

Hoje existe `publicProcedure` com uma query:
- `metrics.getStats`: calcula total e média de score no banco.

Pontos importantes:
- Procedure está pronta para validações Zod em entradas futuras.
- Fallback evita erro fatal quando banco está indisponível.

## 4. Client tRPC

No cliente, o tRPC é criado em `src/trpc/react.tsx` e provisionado por `TRPCReactProvider` em `src/trpc/client.tsx`.

Configuração relevante:
- `httpBatchLink`: agrupa chamadas HTTP.
- `loggerLink`: logging em desenvolvimento.
- `superjson`: serialização consistente com o servidor.

## 5. Integração com React Query

A integração está ativa e bem estruturada:
- `QueryClient` customizado em `src/trpc/query-client.ts`.
- `staleTime` padrão para reduzir refetch agressivo.
- dehydrate/hydrate com `superjson`.
- consumo no cliente via `useSuspenseQuery`.

## 6. Integração com Server Components

O projeto usa helpers de RSC:
- `src/trpc/server.ts` usa `createHydrationHelpers`.
- Permite prefetch server-side + cache hidratado no cliente.

Benefício:
- Melhor TTFB e UX em componentes que dependem de dados.

## 7. tRPC vs REST vs GraphQL

### tRPC
- Contratos inferidos automaticamente do backend para o frontend.
- Sem schema SDL externo e sem geração manual de cliente.
- Ótimo para times TypeScript full-stack.

### REST
- Contratos geralmente documentados externamente (OpenAPI, docs manuais).
- Mais flexível para ecossistemas heterogêneos.
- Requer mais disciplina para manter tipos alinhados no frontend.

### GraphQL
- Schema fortemente tipado e introspectável.
- Bom para cenários com múltiplos clientes e agregação de dados complexa.
- Introduz camada adicional de complexidade operacional.

Resumo prático para este projeto:
- tRPC foi uma escolha eficiente porque o repositório é TypeScript de ponta a ponta e precisa de produtividade com segurança de tipos.

## 8. Próximos Passos Recomendados

1. Criar routers para `roasts` e `leaderboard`.
2. Adicionar mutations com validação Zod.
3. Implementar procedures protegidas quando houver autenticação.
4. Padronizar tratamento de erro de domínio (não apenas fallback genérico).
