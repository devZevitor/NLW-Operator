# Roast Creation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement roast creation flow where users submit code, receive AI analysis (Gemini) with shame score and sarcastic feedback, and view results.

**Architecture:** tRPC mutation calls Gemini API, parses JSON response, saves to PostgreSQL via Drizzle, returns roast ID for redirect to result page.

**Tech Stack:** Gemini 2.0 Flash API, tRPC, Drizzle ORM, React Query

---

## File Structure

```
src/
├── lib/
│   └── gemini.ts                 # Gemini API integration
├── server/api/
│   ├── root.ts                   # Add roast router
│   └── routers/
│       └── roast.ts              # create + getById procedures
├── components/features/
│   └── roast-input-section.tsx   # Connect mutation + loading state
└── app/
    └── roast/[id]/
        └── page.tsx              # Fetch real data via query
```

---

## Tasks

### Task 1: Environment Setup

**Files:**
- Modify: `.env` - add GEMINI_API_KEY
- Modify: `.env.example` - document GEMINI_API_KEY

- [ ] **Step 1: Add GEMINI_API_KEY to .env**

```bash
# Check current .env content
cat .env
```

Add: `GEMINI_API_KEY=your_key_here`

- [ ] **Step 2: Update .env.example**

```bash
cat >> .env.example << EOF

# Gemini API - Get from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=
EOF
```

- [ ] **Step 3: Commit**

```bash
git add .env .env.example
git commit -m "chore: add GEMINI_API_KEY environment variable"
```

---

### Task 2: Create Gemini Integration Library

**Files:**
- Create: `src/lib/gemini.ts`

- [ ] **Step 1: Create src/lib/gemini.ts**

```typescript
import { z } from "zod";

export interface GeminiIssue {
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
}

export interface GeminiResponse {
  issues: GeminiIssue[];
  improvedCode: string;
  sarcasticPhrase: string;
  shameScore: number;
}

export interface AnalyzeCodeInput {
  code: string;
  language: string;
  sarcasmMode: boolean;
}

const RESPONSE_SCHEMA = z.object({
  issues: z.array(
    z.object({
      severity: z.enum(["critical", "warning", "info"]),
      title: z.string(),
      description: z.string(),
    })
  ),
  improvedCode: z.string(),
  sarcasticPhrase: z.string(),
  shameScore: z.number().min(0).max(10),
});

const NORMAL_PROMPT = (code: string, language: string) => `
Analise este código em ${language} e retorne um JSON com:
- "issues": array de problemas com severity (critical/warning/info), title, description
- "improvedCode": versão melhorada do código
- "sarcasticPhrase": frase de feedback (tom neutro-técnico)
- "shameScore": inteiro 0-10 indicando nível de "vergonha" do código

Código:
\`\`\`${language}
${code}
\`\`\`

Responda APENAS com JSON válido, sem markdown.
`;

const SARCASM_PROMPT = (code: string, language: string) => `
Este código é terrível e você é um desenvolvedor sênior sarcástico que não tem medo de ferir sentimentos. 
Analise em ${language} e retorne:
- "issues": problemas com descrições sarcásticas
- "improvedCode": versão corrigida
- "sarcasticPhrase": frase mega sarcástica
- "shameScore": 0-10 (seja harsher no score)

Código:
\`\`\`${language}
${code}
\`\`\`

Responda APENAS com JSON válido, sem markdown.
`;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<GeminiResponse> {
  const { code, language, sarcasmMode } = input;
  
  const prompt = sarcasmMode 
    ? SARCASM_PROMPT(code, language)
    : NORMAL_PROMPT(code, language);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: sarcasmMode ? 1.2 : 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  try {
    const parsed = JSON.parse(text);
    return RESPONSE_SCHEMA.parse(parsed);
  } catch (parseError) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Invalid JSON response from Gemini");
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/gemini.ts
git commit -m "feat: add Gemini API integration library"
```

---

### Task 3: Create tRPC Roast Router

**Files:**
- Create: `src/server/api/routers/roast.ts`
- Modify: `src/server/api/root.ts` - add roastRouter

- [ ] **Step 1: Create src/server/api/routers/roast.ts**

```typescript
import { z } from "zod";
import { codeAnalyses, roasts } from "@/db/schema";
import { db } from "@/lib/db";
import { analyzeCode } from "@/lib/gemini";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

function getCruelPhrase(score: number): "CRITICAL" | "BAD" | "MEDIOCRE" | "DECENT" {
  if (score <= 2) return "CRITICAL";
  if (score <= 5) return "BAD";
  if (score <= 8) return "MEDIOCRE";
  return "DECENT";
}

export const roastRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      code: z.string().min(1).max(10000),
      language: z.string(),
      sarcasmMode: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const { code, language, sarcasmMode } = input;

      // Call Gemini API
      const analysis = await analyzeCode({
        code,
        language,
        sarcasmMode,
      });

      // Save roast
      const [roast] = await db
        .insert(roasts)
        .values({
          originalCode: code,
          language,
          sarcasmMode,
        })
        .returning({ id: roasts.id });

      // Save analysis
      const [savedAnalysis] = await db
        .insert(codeAnalyses)
        .values({
          roastId: roast.id,
          improvedCode: analysis.improvedCode,
          sarcasticPhrase: analysis.sarcasticPhrase,
          loc: code.split("\n").length,
          shameScore: analysis.shameScore,
          cruelPhrase: getCruelPhrase(analysis.shameScore),
        })
        .returning({ id: codeAnalyses.id });

      return {
        roastId: roast.id,
        analysisId: savedAnalysis.id,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const roast = await db.query.roasts.findFirst({
        where: (roasts, { eq }) => eq(roasts.id, input.id),
        with: {
          analysis: true,
        },
      });

      if (!roast || !roast.analysis) {
        throw new Error("Roast not found");
      }

      return {
        id: roast.id,
        originalCode: roast.originalCode,
        language: roast.language,
        sarcasmMode: roast.sarcasmMode,
        createdAt: roast.createdAt,
        analysis: {
          id: roast.analysis.id,
          improvedCode: roast.analysis.improvedCode,
          sarcasticPhrase: roast.analysis.sarcasticPhrase,
          shameScore: roast.analysis.shameScore,
          cruelPhrase: roast.analysis.cruelPhrase,
          loc: roast.analysis.loc,
        },
      };
    }),
});
```

- [ ] **Step 2: Update src/server/api/root.ts**

```typescript
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { metricsRouter } from "@/server/api/routers/metrics";
import { roastRouter } from "@/server/api/routers/roast";

export const appRouter = createTRPCRouter({
  metrics: metricsRouter,
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
```

- [ ] **Step 3: Commit**

```bash
git add src/server/api/routers/roast.ts src/server/api/root.ts
git commit -m "feat: add roast router with create and getById procedures"
```

---

### Task 4: Update SmartEditor to expose detected language + Update RoastInputSection with Mutation

**Files:**
- Modify: `src/components/features/smart-editor.tsx` - add onLanguageChange callback
- Modify: `src/components/features/roast-input-section.tsx` - connect mutation + loading state

- [ ] **Step 1: Update SmartEditor to expose language**

```tsx
// Add to SmartEditorProps interface:
interface SmartEditorProps {
  // ... existing props
  onLanguageChange?: (language: string) => void;
}

// Inside component, after language detection/selection:
React.useEffect(() => {
  onLanguageChange?.(currentLanguage);
}, [currentLanguage, onLanguageChange]);
```

- [ ] **Step 2: Update RoastInputSection with tRPC mutation**

```tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SmartEditor } from "@/components/features/smart-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";

const MAX_CHARS = 10000;

export function RoastInputSection() {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [sarcasmMode, setSarcasmMode] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const createRoast = api.roast.create.useMutation({
    onSuccess: (data) => {
      router.push(`/roast/${data.roastId}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    if (!code.trim()) return;
    setError(null);
    createRoast.mutate({
      code: code,
      language: "javascript", // TODO: Get from smart-editor
      sarcasmMode,
    });
  };

  const isLoading = createRoast.isPending;
  const isDisabled = !code.trim() || code.length > MAX_CHARS || isLoading;

  return (
    <section className="w-full max-w-4xl space-y-6">
      <SmartEditor
        placeholder="// Paste your code here..."
        value={code}
        onChange={setCode}
        maxLength={MAX_CHARS}
      />

      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4">
          <p className="font-mono text-sm text-red-400">
            Error: {error}
          </p>
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-red-400"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-[#2A2A2A] bg-[#111111] px-4 py-2">
            <Switch
              id="roast-mode"
              checked={sarcasmMode}
              onCheckedChange={setSarcasmMode}
            />
            <label
              htmlFor="roast-mode"
              className="cursor-pointer font-mono text-sm font-medium text-emerald-500"
            >
              roast mode
            </label>
          </div>
          <span className="hidden font-mono text-xs text-zinc-500 sm:inline-block">
            {"// maximum sarcasm enabled"}
          </span>
        </div>

        <Button
          className="h-11 bg-emerald-500 px-8 font-mono font-bold text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          {isLoading ? "$ processing..." : "$ roast_my_code"}
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/features/roast-input-section.tsx
git commit -m "feat: connect RoastInputSection to tRPC mutation"
```

---

### Task 5: Update Roast Result Page with Real Data

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Update page to fetch real data**

```tsx
import { AlertTriangle, Info, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiffLine } from "@/components/ui/diff";
import { ScoreRing } from "@/components/ui/score-ring";
import { api, HydrateClient } from "@/trpc/server";

interface RoastPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "critical":
      return <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />;
    case "warning":
      return <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />;
    default:
      return <Info className="mt-1 h-5 w-5 shrink-0 text-blue-500" />;
  }
}

export default async function RoastPage({ params }: RoastPageProps) {
  const { id } = await params;

  let roast;
  try {
    roast = await api.roast.getById.query({ id });
  } catch {
    notFound();
  }

  const { originalCode, language, createdAt, analysis } = roast;

  return (
    <HydrateClient>
      <div className="min-h-screen bg-[#0A0A0A] pb-20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Score Hero */}
          <div className="mb-16 flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex justify-center lg:justify-start">
              <ScoreRing score={analysis.shameScore} />
            </div>
            <div className="flex flex-1 flex-col gap-6 text-center lg:text-left">
              <div className="flex items-center justify-center gap-4 lg:justify-start">
                <Badge variant="destructive" dot className="px-3 py-1 text-sm">
                  verdict: {analysis.cruelPhrase.toLowerCase()}
                </Badge>
              </div>
              <h1 className="font-mono text-3xl font-medium leading-tight text-zinc-50 md:text-4xl lg:text-5xl">
                "{analysis.sarcasticPhrase}"
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 lg:justify-start">
                <span className="font-mono">lang: {language}</span>
                <span>·</span>
                <span className="font-mono">{analysis.loc} lines</span>
                <div className="hidden lg:block h-1 w-1 rounded-full bg-zinc-700" />
                <span className="font-mono text-zinc-500">
                  {createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Submitted Code Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="font-bold text-emerald-500">//</span>
                <span className="font-bold text-zinc-50">your_submission</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111111]">
                <div className="flex overflow-x-auto p-4">
                  <div className="flex flex-col select-none border-r border-zinc-800 pr-4 text-right font-mono text-sm text-zinc-600">
                    {originalCode.split("\n").map((_, i) => (
                      <span key={i} className="leading-6">
                        {i + 1}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col pl-4 font-mono text-sm text-zinc-300">
                    <pre className="m-0">
                      {originalCode.split("\n").map((line, i) => (
                        <div key={i} className="leading-6 whitespace-pre">
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-zinc-800" />

            {/* Improved Code Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="font-bold text-emerald-500">//</span>
                <span className="font-bold text-zinc-50">suggested_fix</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111111]">
                <div className="flex overflow-x-auto p-4">
                  <div className="flex flex-col select-none border-r border-zinc-800 pr-4 text-right font-mono text-sm text-zinc-600">
                    {analysis.improvedCode.split("\n").map((_, i) => (
                      <span key={i} className="leading-6">
                        {i + 1}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col pl-4 font-mono text-sm text-zinc-300">
                    <pre className="m-0">
                      {analysis.improvedCode.split("\n").map((line, i) => (
                        <div key={i} className="leading-6 whitespace-pre">
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/\[id\]/page.tsx
git commit -m "feat: update roast result page to fetch real data"
```

---

## Final Verification

- [ ] All commits pushed
- [ ] Run `npm run lint` to check for errors
- [ ] Verify env variables are set
- [ ] Test flow locally: submit code → redirect → view result

---

## Plan Complete

Plan saved to `docs/superpowers/plans/2026-03-26-roast-creation.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?