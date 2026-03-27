import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { codeAnalyses, type Highlight, type Issue, roasts } from "@/db/schema";
import { db } from "@/lib/db";
import { analyzeCode } from "@/lib/groq";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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

function getCruelPhrase(
  score: number,
): "CRITICAL" | "BAD" | "MEDIOCRE" | "DECENT" {
  if (score <= 2) return "CRITICAL";
  if (score <= 5) return "BAD";
  if (score <= 8) return "MEDIOCRE";
  return "DECENT";
}

export const roastRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.string(),
        sarcasmMode: z.boolean().default(false),
      }),
    )
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
          issues: JSON.stringify(analysis.issues),
          highlights: JSON.stringify(analysis.highlights),
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

      const [rankResult] = await db
        .select({
          rank: sql<number>`cast(count(*) as int) + 1`,
        })
        .from(codeAnalyses)
        .where(sql`${codeAnalyses.shameScore} > ${roast.analysis.shameScore}`);

      return {
        id: roast.id,
        originalCode: roast.originalCode,
        language: roast.language,
        sarcasmMode: roast.sarcasmMode,
        createdAt: roast.createdAt,
        analysis: {
          id: roast.analysis.id,
          improvedCode: roast.analysis.improvedCode ?? "",
          sarcasticPhrase: roast.analysis.sarcasticPhrase,
          shameScore: roast.analysis.shameScore,
          cruelPhrase: roast.analysis.cruelPhrase,
          loc: roast.analysis.loc,
          issues: parseJsonField(roast.analysis.issues) as Issue[],
          highlights: parseJsonField(roast.analysis.highlights) as Highlight[],
        },
        rank: rankResult?.rank ?? 1,
      };
    }),

  improve: publicProcedure
    .input(
      z.object({
        roastId: z.string().uuid(),
        improvedCode: z.string().min(1).max(10000),
      }),
    )
    .mutation(async ({ input }) => {
      const { roastId, improvedCode } = input;

      const roast = await db.query.roasts.findFirst({
        where: (roasts, { eq }) => eq(roasts.id, roastId),
        with: { analysis: true },
      });

      if (!roast || !roast.analysis) {
        throw new Error("Roast not found");
      }

      const originalScore = roast.analysis.shameScore;

      const analysis = await analyzeCode({
        code: improvedCode,
        language: roast.language,
        sarcasmMode: true,
      });

      const improved = analysis.shameScore > originalScore;

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
});
