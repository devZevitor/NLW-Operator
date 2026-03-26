import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { api, HydrateClient } from "@/trpc/server";

interface RoastPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoastPage({ params }: RoastPageProps) {
  const { id } = await params;

  let roast: Awaited<ReturnType<typeof api.roast.getById>> | undefined;
  try {
    roast = await api.roast.getById({ id });
  } catch {
    notFound();
  }

  const { originalCode, language, createdAt, analysis } = roast;

  return (
    <HydrateClient>
      <div className="min-h-screen bg-[#0A0A0A] pb-20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Score Hero */}
          <div className="mb-16 flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex justify-center lg:justify-start">
              <ScoreRing score={analysis.shameScore} />
            </div>
            <div className="flex flex-1 flex-col gap-6 text-center lg:text-left">
              <div className="flex items-center justify-center gap-4 lg:justify-start">
                <Badge variant="destructive" dot className="px-3 py-1 text-sm">
                  verdict: {analysis.cruelPhrase.toLowerCase()}
                </Badge>
              </div>
              <h1 className="font-mono text-3xl font-medium leading-tight text-zinc-50 md:text-4xl lg:text-5xl">
                "{analysis.sarcasticPhrase}"
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 lg:justify-start">
                <span className="font-mono">lang: {language}</span>
                <span>·</span>
                <span className="font-mono">{analysis.loc} lines</span>
                <div className="hidden lg:block h-1 w-1 rounded-full bg-zinc-700" />
                <span className="font-mono text-zinc-500">
                  {createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Submitted Code Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="font-bold text-emerald-500">{/* */}</span>
                <span className="font-bold text-zinc-50">your_submission</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111111]">
                <div className="flex overflow-x-auto p-4">
                  <div className="flex flex-col select-none border-r border-zinc-800 pr-4 text-right font-mono text-sm text-zinc-600">
                    {originalCode.split("\n").map((_, i) => (
                      <span key={String(i)} className="leading-6">
                        {i + 1}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col pl-4 font-mono text-sm text-zinc-300">
                    <pre className="m-0">
                      {originalCode.split("\n").map((line, i) => (
                        <div key={String(i)} className="leading-6 whitespace-pre">
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-zinc-800" />

            {/* Improved Code Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="font-bold text-emerald-500">{/* */}</span>
                <span className="font-bold text-zinc-50">suggested_fix</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111111]">
                <div className="flex overflow-x-auto p-4">
                  <div className="flex flex-col select-none border-r border-zinc-800 pr-4 text-right font-mono text-sm text-zinc-600">
                    {analysis.improvedCode.split("\n").map((_, i) => (
                      <span key={String(i)} className="leading-6">
                        {i + 1}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col pl-4 font-mono text-sm text-zinc-300">
                    <pre className="m-0">
                      {analysis.improvedCode.split("\n").map((line, i) => (
                        <div key={String(i)} className="leading-6 whitespace-pre">
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
