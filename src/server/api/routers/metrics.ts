import { asc, avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { codeAnalyses, roasts } from "@/db/schema";
import { db } from "@/lib/db";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const metricsRouter = createTRPCRouter({
  getStats: publicProcedure.query(async () => {
    try {
      const [stats] = await db
        .select({
          count: count(codeAnalyses.id),
          avgScore: avg(codeAnalyses.shameScore),
        })
        .from(codeAnalyses);

      return {
        totalRoasts: stats?.count ?? 0,
        averageScore: stats?.avgScore ? Number(stats.avgScore) : 0,
      };
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      return {
        totalRoasts: 0,
        averageScore: 0,
      };
    }
  }),

  getLeaderboardData: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ input }) => {
      try {
        const { limit } = input;
        const [statsResult, leaderboardResult] = await Promise.all([
          db
            .select({
              count: count(codeAnalyses.id),
              avgScore: avg(codeAnalyses.shameScore),
            })
            .from(codeAnalyses),

          db
            .select({
              id: roasts.id,
              shameScore: codeAnalyses.shameScore,
              language: roasts.language,
              originalCode: roasts.originalCode,
            })
            .from(codeAnalyses)
            .innerJoin(roasts, eq(codeAnalyses.roastId, roasts.id))
            .orderBy(asc(codeAnalyses.shameScore))
            .limit(limit),
        ]);

        const stats = statsResult[0];

        return {
          stats: {
            totalRoasts: stats?.count ?? 0,
            averageScore: stats?.avgScore ? Number(stats.avgScore) : 0,
          },
          leaderboard: leaderboardResult.map((item, index) => ({
            ...item,
            rank: index + 1,
          })),
        };
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        return {
          stats: { totalRoasts: 0, averageScore: 0 },
          leaderboard: [],
        };
      }
    }),
});
