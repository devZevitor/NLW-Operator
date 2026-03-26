# Estrutura de Pastas

## Visão Geral
O projeto segue organização por responsabilidade: app (rotas), componentes (UI/features/layout), backend (tRPC), dados (Drizzle), utilitários e specs.

## Pastas Principais

### `src/app`
Responsabilidade:
- Definir rotas, layouts e páginas no App Router.

Relação com outras partes:
- Renderiza componentes de `src/components`.
- Consome API via helpers de `src/trpc`.

Padrões utilizados:
- Server Components por padrão.
- Uso pontual de `Suspense` para boundaries de loading.

### `src/app/api/trpc/[trpc]`
Responsabilidade:
- Expor endpoint HTTP do tRPC no Next.js.

Relação com outras partes:
- Encaminha requisições para `appRouter` em `src/server/api/root.ts`.

Padrões utilizados:
- Adapter `fetchRequestHandler` do tRPC.

### `src/components/ui`
Responsabilidade:
- Design system local e componentes reutilizáveis (button, badge, card, switch, table, code-editor etc.).

Relação com outras partes:
- Usado por pages e features.

Padrões utilizados:
- `tailwind-variants` para variantes.
- `cn()` (`clsx` + `tailwind-merge`) para merge de classes.
- `forwardRef` e exports nomeados.

### `src/components/features`
Responsabilidade:
- Compor componentes de domínio (ex.: editor inteligente e seção de input de roast).

Relação com outras partes:
- Combina UI primitives com regras de interação do caso de uso.

Padrões utilizados:
- Components client-side para interação (estado e eventos).

### `src/components/layout`
Responsabilidade:
- Elementos estruturais globais (ex.: navbar).

### `src/server/api`
Responsabilidade:
- Núcleo backend do tRPC.

Relação com outras partes:
- Recebe chamadas do endpoint em `src/app/api/trpc`.
- Chama banco via `src/lib/db.ts` e schema em `src/db`.

Padrões utilizados:
- Router central (`root.ts`).
- Procedures públicas e context factory (`trpc.ts`).

### `src/trpc`
Responsabilidade:
- Integração cliente/servidor para consumo de tRPC com React Query e hidratação.

Arquivos-chave:
- `client.tsx`: provider React.
- `react.tsx`: hooks tRPC client.
- `server.ts`: helper para RSC + hydrate.
- `query-client.ts`: configuração única de QueryClient.

### `src/db`
Responsabilidade:
- Modelagem e operações de dados.

Arquivos-chave:
- `tables/*`: tabelas e relations.
- `schema.ts`: export central.
- `seed.ts`: dados fake para desenvolvimento.

### `src/lib`
Responsabilidade:
- Infra utilitária compartilhada.

Arquivos-chave:
- `db.ts`: conexão Drizzle.
- `utils.ts`: helper `cn`.

### `drizzle`
Responsabilidade:
- Histórico de migrações e snapshots gerados pelo Drizzle Kit.

### `specs`
Responsabilidade:
- Documentação técnica de features e decisões antes da implementação.

Padrões utilizados:
- Workflow spec-first obrigatório.

### `docs`
Responsabilidade:
- Material didático e documentação arquitetural para aprendizado contínuo.
