# Arquitetura do Projeto

## 1. Next.js como Framework Full-Stack
O DevRoast usa Next.js App Router para unificar:
- Interface web (páginas e componentes React).
- API backend (endpoint tRPC em `/api/trpc`).
- Renderização híbrida (server e client).

Resultado prático: um único codebase com contratos de tipos compartilhados.

## 2. Server Components vs Client Components

### Server Components (padrão)
Exemplo: `src/app/page.tsx`.

Responsabilidades:
- Executar lógica no servidor.
- Fazer prefetch de dados.
- Renderizar HTML inicial mais leve para o cliente.

Vantagens:
- Menos JavaScript enviado ao navegador.
- Melhor performance inicial.

### Client Components (quando necessário)
Exemplos:
- `src/components/features/roast-input-section.tsx`
- `src/components/features/smart-editor.tsx`
- `src/components/metrics-display.tsx`

Usados quando existe:
- Estado local (`useState`).
- Efeitos (`useEffect`).
- Eventos de usuário (cliques, digitação).

## 3. SSR vs CSR no Projeto

### SSR / RSC
- Home (`src/app/page.tsx`) faz prefetch server-side de métricas.
- tRPC server helper (`src/trpc/server.ts`) integra RSC + hidratação.

### CSR
- Renderização interativa de componentes cliente após hidratação.
- Exemplo: animação de métricas com NumberFlow em `src/components/metrics-display.tsx`.

Modelo adotado: SSR para buscar/preparar dados + CSR para interação rica.

## 4. Suspense e Loading States

Uso atual:
- `Suspense` em `src/app/page.tsx` envolvendo `MetricsDisplay`.
- Fallback visual: bloco com `animate-pulse` e fundo escuro.

Observação:
- Ainda não existe um componente de skeleton dedicado e reutilizável.
- O fallback atual já cumpre o papel mínimo de loading state.

## 5. Uso de Skeletons
Hoje o projeto usa um placeholder simples no fallback do Suspense.

Recomendação arquitetural:
- Criar componentes de skeleton em `src/components/ui` para padronizar loading states.
- Exemplo futuro: `metrics-skeleton.tsx`, `leaderboard-skeleton.tsx`.

## 6. Como o Backend Vive Dentro do Next

Camada backend implementada em:
- `src/server/api/trpc.ts`: contexto, inicialização do tRPC e procedures base.
- `src/server/api/root.ts`: composição de routers.
- `src/server/api/routers/metrics.ts`: query de métricas no banco.
- `src/app/api/trpc/[trpc]/route.ts`: adapter HTTP do tRPC.

Banco:
- `src/lib/db.ts`: instância Drizzle conectada ao PostgreSQL.
- `src/db/tables/*`: definição de schema.

## 7. Estado Arquitetural Atual
- Fundamentos backend prontos (tRPC + Drizzle + PostgreSQL).
- Uma rota funcional de leitura (`metrics.getStats`).
- Parte de páginas ainda em mock (leaderboard e roast detail), ideal para estudo incremental de integração real.
