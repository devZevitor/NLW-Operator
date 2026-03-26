import { api } from "@/trpc/server";
import { LeaderboardEntry } from "./components/leaderboard-entry";

export default async function LeaderboardPage() {
  const { leaderboard, stats } = await api.metrics.getLeaderboardData({
    limit: 20,
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 md:px-20 text-zinc-100 font-sans selection:bg-emerald-500/20">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl font-bold text-emerald-500">
            &gt;
          </span>
          <h1 className="font-mono text-3xl font-bold text-zinc-50">
            shame_leaderboard
          </h1>
        </div>

        <p className="font-mono text-sm text-zinc-500">
          {"// the most roasted code on the internet"}
        </p>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-600">
          <span>{stats.totalRoasts.toLocaleString()} submissions</span>
          <span>·</span>
          <span>avg score: {stats.averageScore.toFixed(1)}/10</span>
        </div>
      </section>

      <div className="flex flex-col gap-5">
        {leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-[#2A2A2A] bg-[#0A0A0A] p-8">
            <p className="font-mono text-zinc-500">
              No roasts yet. Be the first to bring shame!
            </p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <LeaderboardEntry
              key={entry.id}
              rank={entry.rank}
              score={entry.shameScore}
              code={entry.originalCode}
              language={entry.language}
              lines={entry.originalCode.split("\n").length}
            />
          ))
        )}
      </div>
    </div>
  );
}
