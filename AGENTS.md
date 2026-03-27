# Projeto: DevRoast (NLW Operator)

## Visão Geral
DevRoast é uma plataforma de code review com humor, onde snippets de código são analisados e recebem uma pontuação de "shame score". O projeto é Next.js full-stack com tRPC + Drizzle ORM.

## Stack Principal
- Framework: Next.js 16 (App Router)
- Linguagem: TypeScript
- API: tRPC v11 + SuperJSON + Zod
- Banco: PostgreSQL + Drizzle ORM + Drizzle Kit
- Estado de dados: TanStack React Query
- UI: Tailwind CSS v4 + tailwind-variants + base-ui
- Qualidade: Biome

## Regras Obrigatórias para Agentes

1. Ler specs antes de codar:
- Sempre verificar os arquivos em `specs/` antes de implementar qualquer feature.
- Se não houver spec da feature, criar primeiro a spec em Markdown e parar para revisão.

2. Workflow spec-first:
- Passo 1: Criar/atualizar spec em `specs/<feature>.md`.
- Passo 2: Revisar impacto arquitetural (frontend, backend, dados, tRPC).
- Passo 3: Só então implementar código.

3. Server-first no App Router:
- Componentes devem ser Server Components por padrão.
- Usar `"use client"` apenas quando necessário (estado local, efeitos, eventos, APIs de browser).

4. API tipada:
- Qualquer comunicação frontend-backend deve priorizar tRPC.
- Validar entradas com Zod nas procedures.
- Manter nomes de routers/procedures semânticos e previsíveis.

5. Banco e dados:
- Modelagem em `src/db/tables` e export central em `src/db/schema.ts`.
- Alterações de schema devem gerar migração via Drizzle Kit.
- Nunca acessar banco diretamente em componentes de UI.

6. Padrões de UI:
- Componentes reutilizáveis em `src/components/ui`.
- Usar `tailwind-variants` para variantes.
- Usar `cn()` (`clsx` + `tailwind-merge`) para merge de classes.
- Seguir composição (`Card`, `CardHeader`, `CardContent`, etc.).

7. Convenções de código:
- Imports absolutos via `@/`.
- Exports nomeados.
- Componentes em `kebab-case.tsx`.
- Variáveis em `camelCase`.

8. Servidores e execução:
- NUNCA criar/iniciar servidores automaticamente.
- NUNCA executar `npm run dev` ou comandos similares por conta própria.
- Sempre pedir ao usuário para testar/executar servidores.

9. Segurança e qualidade:
- Não commitar secrets.
- Tratar fallback para indisponibilidade de banco/API.
- Rodar lint/format quando alterar arquivos relevantes.

10. Documentação Contextual:
- Padrões específicos de diretórios devem ser documentados em um arquivo `AGENTS.md` dentro da própria pasta (ex: `src/trpc/AGENTS.md`).
- Sempre verifique se existe um `AGENTS.md` local ao trabalhar em um diretório específico.

## Estrutura de Pastas (Resumo)
- `src/app`: rotas e layouts (Next.js App Router)
- `src/app/api/trpc/[trpc]/route.ts`: endpoint tRPC
- `src/server/api`: contexto, root router e routers
- `src/trpc`: providers e helpers (client/server) - Consulte `src/trpc/AGENTS.md`
- `src/db`: schema, tabelas e seed
- `src/lib`: utilitários e conexão com DB
- `src/components/ui`: design system local
- `src/components/features`: componentes de feature

## Como Implementar Nova Feature (Checklist)
- [ ] Spec criada em `specs/`
- [ ] Impacto em dados e API mapeado
- [ ] Router/procedure tRPC definida
- [ ] UI e estado implementados
- [ ] Carregamento/fallback e erros tratados
- [ ] Documentação atualizada (se necessário)

## Observações de Projeto
- O projeto nasceu em contexto de evento (NLW) e evolui com suporte de agentes.
- O objetivo é usar agentes para acelerar com entendimento técnico, não para delegação cega.

---

## Armazenamento de JSON no Banco (Campos issues/highlights)

### O Problema
Ao salvar arrays/objetos JavaScript diretamente no banco usando Drizzle (ex: `issues: arrayJS`), o PostgreSQL converte objetos para string `"[object Object],[object Object]"`, não como JSON válido.

### Como Resolver
**Sempre usar `JSON.stringify()`** ao salvar campos JSON no banco:

```typescript
// ✅ CORRETO - salvar como JSON string
await db.insert(codeAnalyses).values({
  issues: JSON.stringify(analysis.issues),
  highlights: JSON.stringify(analysis.highlights),
});

// ❌ ERRADO - salvar array diretamente
await db.insert(codeAnalyses).values({
  issues: analysis.issues,  //结果是 "[object Object],..."
});
```

**Ao ler do banco**, usar parser para converter string JSON de volta para array:

```typescript
function parseJsonField(field: unknown): unknown[] {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    if (field.trim() === "") return [];
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// Uso no router:
issues: parseJsonField(roast.analysis.issues) as Issue[],
```

###Seed e Dados
- O seed (`src/db/seed.ts`) DEVE usar `JSON.stringify()` para campos JSON
- Sempre verificar o formato dos dados no banco após modificar o seed
- Se dados antigos estiverem corrompidos, reexecutar o seed
