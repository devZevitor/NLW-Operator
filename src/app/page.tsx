import Link from "next/link";
import { Suspense } from "react";
import { RoastInputSection } from "@/components/features/roast-input-section";
import { MetricsDisplay } from "@/components/metrics-display";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, HydrateClient } from "@/trpc/server";

// Static data for leaderboard preview
const leaderboardData = [
  {
    rank: "#1",
    score: 2.1,
    code: "function calculateTotal(items) { var total = 0; ...",
    lang: "javascript",
  },
  {
    rank: "#2",
    score: 6.4,
    code: "def process_data(data): return [x for x in ...",
    lang: "python",
  },
  {
    rank: "#3",
    score: 9.2,
    code: 'pub fn main() { println!("Hello, world!"); }',
    lang: "rust",
  },
];

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

        {/* Leaderboard Preview */}
        <section className="w-full max-w-5xl space-y-8 pt-8">
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
            {"// the worst code on the internet, ranked by shame"}
          </p>

          <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0A0A0A]">
            <Table>
              <TableHeader className="bg-[#111111]">
                <TableRow className="border-b border-[#2A2A2A] hover:bg-[#111111]">
                  <TableHead className="w-[80px] text-zinc-500 font-mono">
                    Rank
                  </TableHead>
                  <TableHead className="w-[100px] text-zinc-500 font-mono">
                    Score
                  </TableHead>
                  <TableHead className="text-zinc-500 font-mono">
                    Preview
                  </TableHead>
                  <TableHead className="text-right text-zinc-500 font-mono">
                    Language
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((item) => (
                  <TableRow
                    key={item.rank}
                    className="border-b border-[#2A2A2A] hover:bg-[#111111]"
                  >
                    <TableCell className="font-mono font-medium text-zinc-300">
                      {item.rank}
                    </TableCell>
                    <TableCell
                      className={`font-mono font-bold ${
                        item.score < 5
                          ? "text-red-500"
                          : item.score < 8
                            ? "text-amber-500"
                            : "text-emerald-500"
                      }`}
                    >
                      {item.score}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-500 truncate max-w-[200px] sm:max-w-[400px]">
                      {item.code}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-zinc-400">
                      {item.lang}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
