# Fluxo de Dados (End-to-End)

## Fluxo Principal Atual (Métricas)

Fluxo em cadeia:

Frontend Server Component
-> tRPC server helper (`api.metrics.getStats.prefetch`)
-> `appRouter` (`metrics.getStats`)
-> Drizzle ORM
-> PostgreSQL
-> Hydration no cliente
-> Client Component (`useSuspenseQuery`) com animação

## Fluxo Detalhado Passo a Passo

1. Requisição da página home:
- `src/app/page.tsx` executa no servidor.

2. Prefetch de dados:
- `void api.metrics.getStats.prefetch()` em `src/trpc/server.ts`.

3. Execução da procedure:
- Router `metrics` em `src/server/api/routers/metrics.ts`.

4. Consulta ao banco:
- `db.select(...).from(codeAnalyses)` via Drizzle.

5. Retorno e serialização:
- Dados passam pelo transformer `superjson`.

6. Hidratação:
- `HydrateClient` injeta cache para o cliente.

7. Consumo no cliente:
- `src/components/metrics-display.tsx` usa `api.metrics.getStats.useSuspenseQuery()`.
- NumberFlow anima os valores finais.

## Fluxo Alternativo (Client Components via HTTP)

Quando um Client Component chama uma procedure sem prefetch:

Client Component
-> tRPC client (`httpBatchLink`)
-> `POST /api/trpc`
-> `fetchRequestHandler`
-> `appRouter`
-> procedure
-> resposta JSON
-> React Query cache

## Tratamento de Falhas
- A procedure `metrics.getStats` possui fallback para indisponibilidade do banco.
- Em caso de erro, retorna `{ totalRoasts: 0, averageScore: 0 }`.
- Isso evita quebra da UI enquanto infraestrutura não está pronta.

## Estado do Fluxo por Feature
- Métricas: fluxo completo e real (frontend -> backend -> banco).
- Leaderboard e roast detalhado: atualmente com dados mockados na camada de UI.

## Fluxo Alvo para Próximas Features

Para novas funcionalidades, manter padrão:

1. Definir input/output com Zod na procedure.
2. Implementar query/mutation no router tRPC.
3. Persistir e ler via Drizzle.
4. Consumir com prefetch + hydrate (quando fizer sentido) e hooks React Query no cliente.
