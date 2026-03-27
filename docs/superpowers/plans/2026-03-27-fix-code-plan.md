# Fix Code Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar botão "Corrigir" no leaderboard que permite usuários melhorarem códigos e receberem nova análise.

**Architecture:** Criar página de edição `/roast/[id]/fix` que usa CodeBlock editável, nova mutation tRPC para processar melhoria, e atualizar entrada existente no banco.

**Tech Stack:** Next.js App Router, tRPC, Drizzle ORM, Groq AI

---

## Arquitetura de Arquivos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/app/leaderboard/components/leaderboard-entry.tsx` | Adicionar botão "Corrigir" |
| `src/app/roast/[id]/fix/page.tsx` | Página de edição + análise |
| `src/components/ui/code-block.tsx` | Adicionar modo editável |
| `src/server/api/routers/roast.ts` | Nova mutation `improve` |
| `src/lib/groq.ts` | Novo prompt para melhoria |

---

## Task 1: Adicionar botão "Corrigir" no LeaderboardEntry

**Files:**
- Modify: `src/app/leaderboard/components/leaderboard-entry.tsx`

- [ ] **Step 1: Ler arquivo atual**

O arquivo atual já tem a estrutura do card. Adicionar botão na área de header ao lado de language e lines.

- [ ] **Step 2: Adicionar botão Corrigir**

Adicionar botão após as informações de código:
```tsx
<Link
  href={`/roast/${id}/fix`}
  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-transparent px-3 py-1.5 font-mono text-xs text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
>
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
  corrigir
</Link>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/leaderboard/components/leaderboard-entry.tsx
git commit -m "feat: add Corrigir button to leaderboard entries"
```

---

## Task 2: Criar página de edição /roast/[id]/fix

**Files:**
- Create: `src/app/roast/[id]/fix/page.tsx`

- [ ] **Step 1: Criar diretório e arquivo**

Criar arquivo com estrutura básica:
```tsx
import { notFound } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";
import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";

interface FixPageProps {
  params: Promise<{ id: string }>;
}

export default async function FixPage({ params }: FixPageProps) {
  const { id } = await params;
  
  let roast;
  try {
    roast = await api.roast.getById({ id });
  } catch {
    notFound();
  }

  const { originalCode, language, analysis, rank } = roast;

  return (
    <HydrateClient>
      <div className="min-h-screen bg-[#0A0A0A] pb-20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-mono text-2xl text-zinc-50">
              Melhore este código
            </h1>
            <p className="mt-2 text-zinc-400">
              Score atual: {analysis.shameScore}/10 - Tente melhorar!
            </p>
          </div>

          {/* Original Code (read-only) */}
          <section className="mb-8">
            <h2 className="mb-4 font-mono text-sm text-zinc-500">
              Código Original
            </h2>
            <CodeBlock
              code={originalCode}
              lang={language}
              className="w-full max-h-[300px]"
            />
          </section>

          {/* Editable Code - Client Component */}
          <FixCodeForm 
            roastId={id}
            originalCode={originalCode}
            language={language}
            originalScore={analysis.shameScore}
          />
        </div>
      </div>
    </HydrateClient>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/fix/page.tsx
git commit -m "feat: add fix page route"
```

---

## Task 3: Criar componente Client de formulário de correção

**Files:**
- Create: `src/app/roast/[id]/fix/fix-code-form.tsx` (Client Component)

- [ ] **Step 1: Criar componente**

```tsx
"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FixCodeFormProps {
  roastId: string;
  originalCode: string;
  language: string;
  originalScore: number;
}

export function FixCodeForm({
  roastId,
  originalCode,
  language,
  originalScore,
}: FixCodeFormProps) {
  const [code, setCode] = useState(originalCode);
  const [result, setResult] = useState<{
    improved: boolean;
    newScore: number;
    sarcasticPhrase: string;
  } | null>(null);
  
  const router = useRouter();
  
  const improveMutation = api.roast.improve.useMutation({
    onSuccess: (data) => {
      setResult({
        improved: data.improved,
        newScore: data.newScore,
        sarcasticPhrase: data.sarcasticPhrase,
      });
      if (data.improved) {
        setTimeout(() => router.push(`/roast/${roastId}`), 2000);
      }
    },
  });

  const handleSubmit = () => {
    improveMutation.mutate({
      roastId,
      improvedCode: code,
    });
  };

  return (
    <div className="space-y-6">
      {/* Editable textarea */}
      <div>
        <h2 className="mb-4 font-mono text-sm text-zinc-500">
          Sua Versão Melhorada
        </h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full min-h-[200px] rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 font-mono text-sm text-zinc-300 focus:border-emerald-500 focus:outline-none"
          placeholder="Cole sua versão melhorada do código aqui..."
        />
      </div>

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={improveMutation.isPending}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {improveMutation.isPending ? "Analisando..." : "Analisar Melhoria"}
      </Button>

      {/* Error */}
      {improveMutation.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {improveMutation.error.message}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`rounded-lg border p-6 ${
            result.improved
              ? "border-emerald-500/20 bg-emerald-500/10"
              : "border-red-500/20 bg-red-500/10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">
              {result.improved ? "🎉" : "😔"}
            </span>
            <div>
              <h3 className="font-mono text-lg font-bold text-zinc-50">
                {result.improved ? "Melhorou!" : "Tentativa Falha"}
              </h3>
              <p className="font-mono text-sm text-zinc-400">
                Score: {originalScore} → {result.newScore}
              </p>
            </div>
          </div>
          <p className="text-zinc-300">"{result.sarcasticPhrase}"</p>
          
          {result.improved && (
            <p className="mt-4 text-sm text-emerald-400">
              Redirecionando para a página do roast...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Atualizar página para importar componente**

Adicionar import na página:
```tsx
import { FixCodeForm } from "./fix-code-form";
```

- [ ] **Step 3: Commit**

```bash
git add src/app/roast/[id]/fix/
git commit -m "feat: add fix code form component"
```

---

## Task 4: Adicionar modo editável ao CodeBlock

**Files:**
- Modify: `src/components/ui/code-block.tsx`

- [ ] **Step 1: Adicionar props de modo editável**

Adicionar interface:
```tsx
interface CodeBlockProps {
  // ... existing props
  editable?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
```

- [ ] **Step 2: Implementar modo editável**

Se `editable` for true, renderizar textarea ao invés de código formatado:
```tsx
{editable ? (
  <textarea
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    className="w-full min-h-[200px] rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 font-mono text-sm text-zinc-300 focus:border-emerald-500 focus:outline-none"
    placeholder="Cole seu código aqui..."
  />
) : (
  // existing code rendering
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/code-block.tsx
git commit -m "feat: add editable mode to CodeBlock"
```

---

## Task 5: Criar mutation `improve` no router

**Files:**
- Modify: `src/server/api/routers/roast.ts`

- [ ] **Step 1: Adicionar novo prompt no groq.ts**

Adicionar nova função:
```ts
const IMPROVE_PROMPT = (code: string, language: string, originalScore: number) => `
Linguagem: ${language}
Score original: ${originalScore}/10

Este código é uma TENTATIVA DE MELHORIA de código que foiroasteado.
Analise esta tentativa e retorne OBRIGATORIAMENTE:
- "issues": problemas na versão melhorada
- "highlights": apenas se realmente melhorou muito
- "improvedCode": versão final (pode ser o código enviado ou uma correção adicional)
- "sarcasticPhrase": feedback (mais sarcástico se não melhorar)
- "shameScore": 0-10

Se o código enviado realmente melhorar o score, seja mais gentil.
Se piorar ou não melhorar, seja MUITO mais sarcástico.

Código melhorado:
\`\`\`
${code}
\`\`\`

Responda APENAS com JSON válido.
`;
```

- [ ] **Step 2: Criar mutation improve**

Adicionar no roastRouter:
```ts
improve: publicProcedure
  .input(z.object({
    roastId: z.string().uuid(),
    improvedCode: z.string().min(1).max(10000),
  }))
  .mutation(async ({ input }) => {
    const { roastId, improvedCode } = input;

    // Get original roast
    const roast = await db.query.roasts.findFirst({
      where: (roasts, { eq }) => eq(roasts.id, roastId),
      with: { analysis: true },
    });

    if (!roast || !roast.analysis) {
      throw new Error("Roast not found");
    }

    const originalScore = roast.analysis.shameScore;

    // Analyze improved code (always with sarcasm for now)
    const analysis = await analyzeCode({
      code: improvedCode,
      language: roast.language,
      sarcasmMode: true, // Always sarcastic
    });

    const improved = analysis.shameScore > originalScore;

    // Update the entry
    await db
      .update(codeAnalyses)
      .set({
        improvedCode: analysis.improvedCode,
        sarcasticPhrase: improved 
          ? `Melhorou! ${analysis.sarcasticPhrase}`
          : analysis.sarcasticPhrase,
        shameScore: analysis.shameScore,
        cruelPhrase: getCruelPhrase(analysis.shameScore),
        issues: JSON.stringify(analysis.issues),
        highlights: JSON.stringify(analysis.highlights),
      })
      .where(eq(codeAnalyses.roastId, roastId));

    return {
      improved,
      newScore: analysis.shameScore,
      sarcasticPhrase: improved 
        ? `Melhorou! ${analysis.sarcasticPhrase}`
        : analysis.sarcasticPhrase,
    };
  }),
```

- [ ] **Step 3: Commit**

```bash
git add src/server/api/routers/roast.ts src/lib/groq.ts
git commit -m "feat: add improve mutation to roast router"
```

---

## Task 6: Testar a implementação

**Files:**
- Test: Browser manual

- [ ] **Step 1: Navegar para leaderboard**

```bash
npm run dev
```

- [ ] **Step 2: Verificar botão Corrigir**

Navegar para http://localhost:3000/leaderboard
Verificar se botão "corrigir" aparece em cada entrada

- [ ] **Step 3: Testar fluxo completo**

1. Clicar em "Corrigir"
2. Verificar redirect para /roast/{id}/fix
3. Editar código
4. Clicar "Analisar"
5. Verificar resultado

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "feat: complete fix code feature"
```

---

## Critérios de Validação

- [ ] Botão "Corrigir" visível em cada entrada do leaderboard
- [ ] Redirect para página de edição funciona
- [ ] Código editável funciona
- [ ] Análise IA retorna resultado correto
- [ ] Se melhorar: atualiza no banco e mostra sucesso
- [ ] Se piorar: salva com sarcasmMode
- [ ] Redirect para página de roast após melhoria
