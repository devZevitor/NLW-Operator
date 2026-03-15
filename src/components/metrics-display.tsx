"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export function MetricsDisplay() {
  const [stats] = api.metrics.getStats.useSuspenseQuery();
  const [displayedStats, setDisplayedStats] = useState({
    totalRoasts: 0,
    averageScore: 0,
  });

  useEffect(() => {
    // Small delay to ensure the animation is visible after hydration
    const timer = setTimeout(() => {
      setDisplayedStats({
        totalRoasts: stats.totalRoasts,
        averageScore: stats.averageScore,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [stats]);

  return (
    <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mx-auto mt-12">
      <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
        <span className="text-4xl font-bold text-emerald-400 mb-2 font-mono">
          <NumberFlow
            value={displayedStats.totalRoasts}
            format={{ notation: "compact" }}
          />
        </span>
        <span className="text-zinc-400 text-sm uppercase tracking-wider font-medium">
          Codes Roasted
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
        <span className="text-4xl font-bold text-red-400 mb-2 font-mono">
          <NumberFlow
            value={displayedStats.averageScore}
            format={{
              style: "decimal",
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }}
          />
        </span>
        <span className="text-zinc-400 text-sm uppercase tracking-wider font-medium">
          Average Shame Score
        </span>
      </div>
    </div>
  );
}
