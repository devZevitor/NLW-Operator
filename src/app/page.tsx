import { Suspense } from "react";
import { HomeLeaderboard } from "@/components/features/home-leaderboard";
import { LeaderboardSkeleton } from "@/components/features/home-leaderboard-skeleton";
import { RoastInputSection } from "@/components/features/roast-input-section";
import { MetricsDisplay } from "@/components/metrics-display";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  void api.metrics.getStats.prefetch();

  return (
    <HydrateClient>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-6 py-16 text-zinc-50">
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="flex flex-col items-center gap-2 text-4xl font-bold tracking-tight sm:flex-row sm:text-5xl md:text-6xl">
            <span className="text-emerald-500">$</span>
            <span>paste your code. get roasted.</span>
          </h1>
          <p className="max-w-2xl text-lg font-mono text-zinc-400">
            {
              "// drop your code below and we'll rate it — brutally honest or full roast mode"
            }
          </p>
        </section>

        {/* Code Editor Input - Client Component */}
        <RoastInputSection />

        {/* Live Metrics - Server Prefetched + Client Animated */}
        <section className="w-full">
          <Suspense
            fallback={
              <div className="h-32 w-full animate-pulse rounded-xl bg-zinc-900/50" />
            }
          >
            <MetricsDisplay />
          </Suspense>
        </section>

        {/* Leaderboard Section */}
        <Suspense fallback={<LeaderboardSkeleton />}>
          <HomeLeaderboard />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
