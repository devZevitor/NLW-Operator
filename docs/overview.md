# DevRoast: Visão Geral Técnica

## Objetivo do Projeto
O DevRoast é uma aplicação web onde desenvolvedores colam snippets de código para receber uma análise com tom humorístico e uma pontuação de qualidade ("shame score").

O projeto resolve dois problemas principais:
- Cria um fluxo rápido para avaliar snippets de código.
- Transforma feedback técnico em uma experiência gamificada (leaderboard e métricas).

## Visão Geral da Arquitetura
O projeto usa Next.js App Router como framework full-stack:
- Frontend: páginas, componentes de UI e interações no navegador.
- Backend: rotas de API tRPC, contexto de servidor, procedures e acesso ao banco.
- Persistência: PostgreSQL via Drizzle ORM.

Arquitetura atual em alto nível:

1. Camada de apresentação:
- Páginas em `src/app`.
- Componentes em `src/components`.

2. Camada de aplicação/API:
- tRPC em `src/server/api`.
- Endpoint HTTP em `src/app/api/trpc/[trpc]/route.ts`.

3. Camada de dados:
- Schema Drizzle em `src/db`.
- Cliente de banco em `src/lib/db.ts`.

## O Que É Frontend e o Que É Backend Aqui

Frontend (UI + experiência):
- `src/app/page.tsx`, `src/app/leaderboard/page.tsx`, `src/app/roast/[id]/page.tsx`
- `src/components/ui/*`, `src/components/features/*`, `src/components/layout/*`

Backend (API + regras + banco):
- `src/server/api/trpc.ts` (bootstrap do tRPC)
- `src/server/api/root.ts` (router raiz)
- `src/server/api/routers/metrics.ts` (procedure real)
- `src/lib/db.ts` + `src/db/*` (persistência)

## Como o Next.js Está Sendo Usado como Full-Stack

1. Renderização híbrida:
- Páginas Server Components por padrão (ex.: home em `src/app/page.tsx`).
- Componentes Client quando há interatividade (ex.: editor, switch, métricas animadas).

2. API no mesmo repositório:
- O endpoint tRPC vive dentro do próprio app Next (`/api/trpc`).

3. Pré-busca e hidratação:
- Home faz prefetch server-side (`api.metrics.getStats.prefetch()`).
- Dados são hidratados no cliente com `HydrateClient`.

4. Evolução incremental:
- Parte da UI ainda usa mock data (ex.: leaderboard e roast details), enquanto métricas já consultam banco real.

## Estado Atual do Projeto
- Integração real com banco para métricas (contagem e média de score).
- Estrutura pronta para expansão de features com tRPC.
- Base de design system local com componentes reutilizáveis.
- Projeto em estágio ideal para aprendizado prático de full-stack moderno com TypeScript.
