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
