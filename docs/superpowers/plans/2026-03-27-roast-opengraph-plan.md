# Open Graph para Páginas de Roast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gerar imagens Open Graph dinâmicas para cada página de roast no DevRoast, permitindo compartilhamento visual atraente nas redes sociais.

**Architecture:** Criar endpoint de API dedicado usando Takumi ImageResponse que busca dados do roast via tRPC e renderiza template JSX em imagem PNG. Adicionar metadata OG na página de roast existente.

**Tech Stack:** Next.js App Router, Takumi ImageResponse, tRPC, Zod

---

## Arquitetura de Arquivos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `next.config.ts` | Configurar serverExternalPackages |
| `src/app/roast/[id]/opengraph/route.ts` | GET endpoint para gerar imagem |
| `src/app/roast/[id]/page.tsx` | Adicionar generateMetadata |

---

## Task 1: Configurar next.config.ts

**Files:**
- Modify: `next.config.ts:1-20`

- [ ] **Step 1: Edit next.config.ts**

Arquivo atual (primeiras 20 linhas):
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

Editar para:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/core"],
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "chore: add @takumi-rs/core to serverExternalPackages"
```

---

## Task 2: Instalar dependência Takumi

**Files:**
- Modify: `package.json` (auto via npm)

- [ ] **Step 1: Install Takumi**

```bash
npm install @takumi-rs/image-response
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @takumi-rs/image-response"
```

---

## Task 3: Criar rota de Open Graph

**Files:**
- Create: `src/app/roast/[id]/opengraph/route.ts`

- [ ] **Step 1: Criar arquivo de rota**

```typescript
import { ImageResponse } from "@takumi-rs/image-response";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export const runtime = "nodejs";

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  let roast;
  try {
    roast = await api.roast.getById({ id });
  } catch {
    return new Response("Not Found", { status: 404 });
  }

  if (!roast) {
    return new Response("Not Found", { status: 404 });
  }

  const { analysis, language, rank } = roast;
  const score = analysis.shameScore;
  const scoreStr = score.toFixed(1);
  const loc = analysis.loc || 0;

  const verdictColor = score < 5 ? "#EF4444" : score < 8 ? "#F59E0B" : "#10B981";
  const verdictText = analysis.cruelPhrase.toLowerCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Logo Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              color: "#10B981",
              fontSize: 24,
              fontFamily: "JetBrains Mono",
              fontWeight: 700,
            }}
          >
            &gt;
          </span>
          <span
            style={{
              color: "#E5E5E5",
              fontSize: 20,
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
            }}
          >
            devroast
          </span>
        </div>

        {/* Score Row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
          }}
        >
          <span
            style={{
              color: "#F59E0B",
              fontSize: 160,
              fontFamily: "JetBrains Mono",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {scoreStr}
          </span>
          <span
            style={{
              color: "#737373",
              fontSize: 56,
              fontFamily: "JetBrains Mono",
            }}
          >
            /10
          </span>
        </div>

        {/* Verdict Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: verdictColor,
            }}
          />
          <span
            style={{
              color: verdictColor,
              fontSize: 20,
              fontFamily: "JetBrains Mono",
            }}
          >
            {verdictText}
          </span>
        </div>

        {/* Lang Info */}
        <span
          style={{
            color: "#737373",
            fontSize: 16,
            fontFamily: "JetBrains Mono",
          }}
        >
          lang: {language} · {loc} lines
        </span>

        {/* Roast Quote */}
        <span
          style={{
            color: "#E5E5E5",
            fontSize: 22,
            fontFamily: "IBM Plex Mono",
            textAlign: "center",
            maxWidth: "100%",
          }}
        >
          "{analysis.sarcasticPhrase}"
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      format: "png",
      emoji: "twemoji",
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/opengraph/route.ts
git commit -m "feat: add opengraph endpoint for roast pages"
```

---

## Task 4: Adicionar metadata na página de roast

**Files:**
- Modify: `src/app/roast/[id]/page.tsx:45-55` (adicionar generateMetadata)

- [ ] **Step 1: Ler arquivo atual para encontrar local correto**

O arquivo atual começa na linha 45 com:
```typescript
export default async function RoastPage({ params }: RoastPageProps) {
```

Adicionar ANTES dessa função (após os imports):
```typescript
export async function generateMetadata({ params }: RoastPageProps) {
  const { id } = await params;

  let roast;
  try {
    roast = await api.roast.getById({ id });
  } catch {
    return {
      title: "Roast Not Found | DevRoast",
    };
  }

  if (!roast) {
    return {
      title: "Roast Not Found | DevRoast",
    };
  }

  return {
    title: `Score: ${roast.analysis.shameScore}/10 | DevRoast`,
    description: roast.analysis.sarcasticPhrase,
    openGraph: {
      images: [`/roast/${id}/opengraph`],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: add opengraph metadata to roast page"
```

---

## Task 5: Testar a implementação

**Files:**
- Test: Browser manual

- [ ] **Step 1: Iniciar servidor de desenvolvimento**

```bash
npm run dev
```

- [ ] **Step 2: Acessar endpoint de OG**

Navegar para: `http://localhost:3000/roast/{algum-id}/opengraph`

Verificar se:
- Imagem é retornada com content-type `image/png`
- Dados do roast aparecem corretamente (score, frase, linguagem)

- [ ] **Step 3: Testar compartilhamento**

Copiar URL `http://localhost:3000/roast/{id}` e verificar preview no:
- Twitter Card Validator
- Discord (embed)

- [ ] **Step 6: Commit final**

```bash
git add .
git commit -m "feat: complete opengraph for roast pages"
```

---

## Critérios de Validação

- [ ] Imagem OG retorna status 200 com content-type image/png
- [ ] Dados do roast aparecem na imagem (score, verdict, frase)
- [ ] Twitter Card mostra preview corretamente
- [ ] Discord mostra embed corretamente
- [ ] Erro 404 para roast inexistente
