import { LeaderboardEntry } from "./components/leaderboard-entry";

interface Entry {
  rank: number;
  score: number;
  code: string;
  language: string;
  lines: number;
}

const entries: Entry[] = [
  {
    rank: 1,
    score: 1.2,
    code: `const isEven = (n) => {\n  if (n == 0) return true;\n  if (n == 1) return false;\n  return isEven(n - 2);\n};`,
    language: "javascript",
    lines: 5,
  },
  {
    rank: 2,
    score: 1.5,
    code: `function sleep(ms) {\n  const start = Date.now();\n  while (Date.now() - start < ms) {}\n}`,
    language: "javascript",
    lines: 4,
  },
  {
    rank: 3,
    score: 1.8,
    code: `try {\n  doSomething();\n} catch (e) {\n  console.log(e);\n  throw e;\n}`,
    language: "typescript",
    lines: 6,
  },
  {
    rank: 4,
    score: 2.1,
    code: `if (user.role === 'admin' || user.role === 'superadmin' || user.role === 'manager' || user.role === 'owner') {\n  return true;\n}`,
    language: "javascript",
    lines: 3,
  },
  {
    rank: 5,
    score: 2.4,
    code: `// TODO: fix this later\n// TODO: really fix this later\n// TODO: please for the love of god fix this later\nconst x = 1;`,
    language: "javascript",
    lines: 4,
  },
];

export default function LeaderboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 md:px-20 text-zinc-100 font-sans selection:bg-emerald-500/20">
      {/* Hero Section */}
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
          <span>2,847 submissions</span>
          <span>·</span>
          <span>avg score: 4.2/10</span>
        </div>
      </section>

      {/* Leaderboard Entries */}
      <div className="flex flex-col gap-5">
        {entries.map((entry) => (
          <LeaderboardEntry
            key={entry.rank}
            rank={entry.rank}
            score={entry.score}
            code={entry.code}
            language={entry.language}
            lines={entry.lines}
          />
        ))}
      </div>
    </div>
  );
}
