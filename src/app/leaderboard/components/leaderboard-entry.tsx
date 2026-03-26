import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

interface LeaderboardEntryProps {
  rank: number;
  score: number;
  code: string;
  language: string;
  lines: number;
}

export async function LeaderboardEntry({
  rank,
  score,
  code,
  language,
  lines,
}: LeaderboardEntryProps) {
  const rankColor =
    rank === 1
      ? "text-amber-500"
      : rank === 2
        ? "text-zinc-300"
        : rank === 3
          ? "text-amber-700"
          : "text-zinc-500";
  const scoreColor =
    score < 5
      ? "text-red-500"
      : score < 8
        ? "text-amber-500"
        : "text-emerald-500";

  return (
    <div className="w-full flex flex-col border border-[#2A2A2A] bg-[#0A0A0A]">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-[13px]">
            <span className="text-zinc-600">#</span>
            <span className={cn("font-bold", rankColor)}>{rank}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[13px]">
            <span className="text-zinc-600 text-xs">score:</span>
            <span className={cn("font-bold", scoreColor)}>{score}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-zinc-500">{language}</span>
          <span className="text-zinc-600">{lines} lines</span>
        </div>
      </div>

      <div className="flex min-h-[120px] w-full overflow-hidden bg-[#111111]">
        <div className="flex w-10 flex-col items-end gap-1.5 border-r border-[#2A2A2A] bg-[#0F0F0F] py-3.5 px-2.5 font-mono text-xs text-zinc-600 select-none">
          {Array.from({ length: lines }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Line numbers are static
            <span key={i} className="leading-relaxed">
              {i + 1}
            </span>
          ))}
        </div>

        <div className="flex-1">
          <CodeBlock
            code={code}
            lang={language}
            window={false}
            className="rounded-none border-none p-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
