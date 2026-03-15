import { AlertTriangle, Info, Share2, XCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiffLine } from "@/components/ui/diff";
import { ScoreRing } from "@/components/ui/score-ring";

interface RoastPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock data based on the design
const MOCK_ROAST = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  score: 3.5,
  verdict: "needs_serious_help",
  title:
    "this code looks like it was written during a power outage... in 2005.",
  language: "javascript",
  lines: 7,
  submittedCode: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
  issues: [
    {
      id: 1,
      severity: "critical",
      title: "Use of var",
      description:
        "var is function-scoped and can lead to hoisting issues. Use let or const instead.",
    },
    {
      id: 2,
      severity: "warning",
      title: "Loop Optimization",
      description:
        "Consider using reduce() for array summation instead of a for loop.",
    },
    {
      id: 3,
      severity: "info",
      title: "Type Safety",
      description: "No type checking on items or price. Consider TypeScript.",
    },
    {
      id: 4,
      severity: "critical",
      title: "Magic Strings/Numbers",
      description:
        "Avoid hardcoding values if applicable (not seen here but good practice).",
    },
  ],
  diff: [
    {
      type: "context",
      content: "function calculateTotal(items) {",
      lineNumber: 1,
    },
    { type: "removed", content: "  var total = 0;", lineNumber: 2 },
    {
      type: "removed",
      content: "  for (var i = 0; i < items.length; i++) {",
      lineNumber: 3,
    },
    {
      type: "removed",
      content: "    total = total + items[i].price;",
      lineNumber: 4,
    },
    { type: "removed", content: "  }", lineNumber: 5 },
    {
      type: "added",
      content: "  return items.reduce((acc, item) => acc + item.price, 0);",
      lineNumber: 2,
    },
    { type: "context", content: "}", lineNumber: 6 }, // Adjusted line number for context
  ],
} as const;

export default async function RoastPage({ params }: RoastPageProps) {
  // In a real app, we would fetch the roast by params.id
  const { id } = await params;
  const roast = MOCK_ROAST;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Score Hero */}
        <div className="mb-16 flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex justify-center lg:justify-start">
            <ScoreRing score={roast.score} />
          </div>
          <div className="flex flex-1 flex-col gap-6 text-center lg:text-left">
            <div className="flex items-center justify-center gap-4 lg:justify-start">
              <Badge variant="destructive" dot className="px-3 py-1 text-sm">
                verdict: {roast.verdict}
              </Badge>
            </div>
            <h1 className="font-mono text-3xl font-medium leading-tight text-zinc-50 md:text-4xl lg:text-5xl">
              "{roast.title}"
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 lg:justify-start">
              <span className="font-mono">lang: {roast.language}</span>
              <span>·</span>
              <span className="font-mono">{roast.lines} lines</span>
              <div className="hidden lg:block h-1 w-1 rounded-full bg-zinc-700" />
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <Share2 className="h-4 w-4" />
                Share Roast
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Submitted Code Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="font-bold text-emerald-500">//</span>
              <span className="font-bold text-zinc-50">your_submission</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111111]">
              <div className="flex overflow-x-auto p-4">
                <div className="flex flex-col select-none border-r border-zinc-800 pr-4 text-right font-mono text-sm text-zinc-600">
                  {roast.submittedCode.split("\n").map((_, i) => (
                    <span key={i} className="leading-6">
                      {i + 1}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col pl-4 font-mono text-sm text-zinc-300">
                  <pre className="m-0">
                    {roast.submittedCode.split("\n").map((line, i) => (
                      <div key={i} className="leading-6 whitespace-pre">
                        {line}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-zinc-800" />

          {/* Analysis Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="font-bold text-emerald-500">//</span>
              <span className="font-bold text-zinc-50">detailed_analysis</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {roast.issues.map((issue) => (
                <Card
                  key={issue.id}
                  className="border-zinc-800 bg-[#111111] transition-colors hover:border-zinc-700"
                >
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                    {issue.severity === "critical" ? (
                      <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                    ) : issue.severity === "warning" ? (
                      <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                    ) : (
                      <Info className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
                    )}
                    <div className="space-y-1">
                      <CardTitle className="text-base font-medium text-zinc-50">
                        {issue.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-400">{issue.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="h-px w-full bg-zinc-800" />

          {/* Diff Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="font-bold text-emerald-500">//</span>
              <span className="font-bold text-zinc-50">suggested_fix</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111111]">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
                <span className="font-mono text-xs text-zinc-400">
                  your_code.ts → improved_code.ts
                </span>
              </div>
              <div className="py-2">
                {roast.diff.map((line, i) => (
                  <DiffLine
                    key={i}
                    type={line.type as "added" | "removed" | "context"}
                    lineNumber={line.lineNumber}
                  >
                    {line.content}
                  </DiffLine>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
