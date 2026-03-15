import { sql } from "drizzle-orm";
import { z } from "zod";
import { codeAnalyses } from "@/db/schema";
import { db } from "@/lib/db";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const metricsRouter = createTRPCRouter({
  getStats: publicProcedure.query(async () => {
    try {
      const [stats] = await db
        .select({
          count: sql<number>`cast(count(${codeAnalyses.id}) as int)`,
          avgScore: sql<number>`cast(avg(${codeAnalyses.shameScore}) as int)`,
        })
        .from(codeAnalyses);

      return {
        totalRoasts: stats?.count ?? 0,
        averageScore: stats?.avgScore ?? 0,
      };
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      // Fallback for when DB is not ready or connection fails
      return {
        totalRoasts: 0,
        averageScore: 0,
      };
    }
  }),
});
