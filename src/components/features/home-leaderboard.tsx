import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { api } from "@/trpc/server";

export async function HomeLeaderboard() {
  const { leaderboard, stats } = await api.metrics.getLeaderboardData({
    limit: 3,
  });

  return (
    <div className="w-full max-w-5xl space-y-8 pt-8">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-emerald-500 text-xl font-bold">
            {"//"}
          </span>
          <h2 className="font-mono text-xl font-bold text-zinc-50">
            shame_leaderboard
          </h2>
        </div>
        <Link
          href="/leaderboard"
          className="flex items-center gap-2 rounded border border-[#2A2A2A] px-3 py-1 font-mono text-xs text-zinc-400 transition-colors hover:border-emerald-500 hover:text-emerald-500"
        >
          $ view_all &gt;&gt;
        </Link>
      </div>

      <p className="font-mono text-sm text-zinc-500">
        {
          "// the worst code on the internet, ranked by shame (lowest score wins)"
        }
      </p>

      <div className="flex flex-col gap-5">
        {leaderboard.length === 0 ? (
          <div className="flex flex-col border border-[#2A2A2A] bg-[#0A0A0A] p-8">
            <p className="font-mono text-center text-zinc-500">
              No roasts yet. Be the first to bring shame!
            </p>
          </div>
        ) : (
          leaderboard.map((item) => {
            const linesOfCode = item.originalCode.split("\n").length;
            return (
              <Link
                key={item.id}
                href={`/roast/${item.id}`}
                className="block w-full"
              >
                <div className="w-full flex flex-col border border-[#2A2A2A] bg-[#0A0A0A] hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <div className="flex min-h-[120px] w-full overflow-hidden bg-[#111111]">
                    <div className="flex w-10 flex-col items-end gap-1.5 border-r border-[#2A2A2A] bg-[#0F0F0F] py-3.5 px-2.5 font-mono text-xs text-zinc-600 select-none">
                      {Array.from({ length: linesOfCode }).map((_, i) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: Line numbers are static
                          key={i}
                          className="leading-relaxed"
                        >
                          {i + 1}
                        </span>
                      ))}
                    </div>

                    <div className="flex-1">
                      <CodeBlock
                        code={item.originalCode}
                        lang={item.language}
                        window={true}
                        showLineNumbers={false}
                        className="w-full rounded-none border-none"
                        headerRight={
                          <div className="flex items-center gap-4 font-mono text-xs">
                            <span className="text-zinc-400">Code preview</span>
                            <span className="text-zinc-500">
                              {item.language}
                            </span>
                            <span className="text-zinc-600">
                              {linesOfCode} lines
                            </span>
                            <Link
                              href={`/roast/${item.id}/fix`}
                              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-transparent px-3 py-1.5 font-mono text-xs text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                            >
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              corrigir
                            </Link>
                          </div>
                        }
                        headerLeft={
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 font-mono text-[13px]">
                              <span className="text-zinc-600">#</span>
                              <span className="font-bold text-amber-500">
                                {item.rank}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-[13px]">
                              <span className="text-zinc-600 text-xs">
                                score:
                              </span>
                              <span className="font-bold text-red-500">
                                {item.shameScore}
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#2A2A2A] text-xs font-mono text-zinc-600">
        <span>Total Roasts Served: {stats.totalRoasts}</span>
        <span>Average Shame: {stats.averageScore.toFixed(1)}/10</span>
      </div>
    </div>
  );
}
