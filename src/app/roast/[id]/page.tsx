import { diffLines } from "diff";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { ShareButton } from "@/components/ui/share-button";
import { api, HydrateClient } from "@/trpc/server";

interface RoastPageProps {
  params: Promise<{
    id: string;
  }>;
}

function cleanCode(code: string): string {
  return code
    .split("\n")
    .filter((line) => line.trim() !== "" || line === "")
    .map((line) => (line.trim() === "" && line !== "" ? "" : line))
    .join("\n");
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 border-red-500/20 text-red-400";
    case "warning":
      return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    default:
      return "bg-blue-500/10 border-blue-500/20 text-blue-400";
  }
}

function getSeverityLabel(severity: string) {
  switch (severity) {
    case "critical":
      return "critical";
    case "warning":
      return "warning";
    default:
      return "info";
  }
}

export async function generateMetadata({ params }: RoastPageProps) {
  const { id } = await params;

  let roast;
  try {
    roast = await api.roast.getById({ id });
  } catch {
    return {
      title: "Roast Not Found | DevRoast",
    };
  }

  if (!roast) {
    return {
      title: "Roast Not Found | DevRoast",
    };
  }

  return {
    title: `Score: ${roast.analysis.shameScore}/10 | DevRoast`,
    description: roast.analysis.sarcasticPhrase,
    openGraph: {
      images: [`/roast/${id}/opengraph`],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RoastPage({ params }: RoastPageProps) {
  const { id } = await params;

  let roast: Awaited<ReturnType<typeof api.roast.getById>> | undefined;
  try {
    roast = await api.roast.getById({ id });
  } catch {
    notFound();
  }

  const { originalCode, language, createdAt, analysis, rank } = roast;

  const cleanedOriginal = cleanCode(originalCode);
  const cleanedImproved = cleanCode(analysis.improvedCode);
  const diff = diffLines(cleanedOriginal, cleanedImproved);

  const diffHtml = await Promise.all(
    diff.map(async (part) => {
      const html = await codeToHtml(part.value, {
        lang: language,
        theme: "vesper",
        structure: "inline",
      });
      return { ...part, html };
    }),
  );

  const totalRoasts = await api.metrics.getStats();
  const totalCount = totalRoasts.totalRoasts ?? 0;
  const percentile = Math.round(((rank - 1) / Math.max(totalCount, 1)) * 100);

  const issues = analysis.issues ?? [];
  const highlights = analysis.highlights ?? [];

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
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Badge variant="destructive" dot className="px-3 py-1 text-sm">
                  verdict: {analysis.cruelPhrase.toLowerCase()}
                </Badge>
                <Badge className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300">
                  rank: #{rank}
                </Badge>
                <ShareButton
                  url={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/roast/${id}`}
                />
              </div>
              <h1 className="font-mono text-3xl font-medium leading-tight text-zinc-50 md:text-4xl lg:text-5xl">
                "{analysis.sarcasticPhrase}"
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 lg:justify-start">
                <span className="font-mono">lang: {language}</span>
                <span>·</span>
                <span className="font-mono">{analysis.loc} lines</span>
                <span>·</span>
                <span className="font-mono text-emerald-400">
                  top {percentile}%
                </span>
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
              <CodeBlock
                code={cleanedOriginal}
                lang={language}
                className="w-full max-h-[400px]"
              />
            </section>

            <div className="h-px w-full bg-zinc-800" />

            {/* Detailed Analysis Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="font-bold text-emerald-500">{/* */}</span>
                <span className="font-bold text-zinc-50">
                  detailed_analysis
                </span>
              </div>
              {issues.length === 0 && highlights.length === 0 ? (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                  <p className="font-mono text-sm text-zinc-500">
                    código não apresentou problemas significativos
                  </p>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-6">
                  {issues.length > 0 && (
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                      {issues.map((issue, idx) => (
                        <div
                          key={`${issue.title}-${idx}`}
                          className={`w-full rounded-lg border p-4 ${getSeverityColor(issue.severity)}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono font-bold uppercase">
                              {getSeverityLabel(issue.severity)}
                            </span>
                          </div>
                          <h3 className="font-mono font-medium text-sm mb-1">
                            {issue.title}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            {issue.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {highlights.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 font-mono text-sm">
                        <span className="font-bold text-emerald-500">
                          {/* */}
                        </span>
                        <span className="font-bold text-zinc-50">
                          pontos_positivos
                        </span>
                      </div>
                      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                        {highlights.map((highlight, idx) => (
                          <div
                            key={`${highlight.title}-${idx}`}
                            className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4"
                          >
                            <h3 className="font-mono font-medium text-sm mb-1 text-emerald-400">
                              {highlight.title}
                            </h3>
                            <p className="text-xs text-zinc-400">
                              {highlight.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>

            <div className="h-px w-full bg-zinc-800" />

            {/* Suggested Fix Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="font-bold text-emerald-500">{/* */}</span>
                <span className="font-bold text-zinc-50">suggested_fix</span>
              </div>
              <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#111111]">
                <div className="flex flex-col font-mono text-sm p-4">
                  {diffHtml.map((part, idx) => {
                    const htmlLines = part.html.split("\n");
                    const valueLines = part.value.split("\n");
                    return htmlLines.map((htmlLine, lineIdx) => {
                      const originalLine = valueLines[lineIdx];
                      if (
                        !originalLine ||
                        (originalLine.trim() === "" && originalLine !== "")
                      ) {
                        return null;
                      }
                      return (
                        <div
                          key={`${idx}-${lineIdx}`}
                          className={`leading-6 ${
                            part.added
                              ? "bg-emerald-500/10"
                              : part.removed
                                ? "bg-red-500/10 opacity-60"
                                : ""
                          }`}
                        >
                          <span
                            className={`whitespace-pre ${
                              part.added
                                ? "text-emerald-400"
                                : part.removed
                                  ? "text-red-400"
                                  : "text-zinc-300"
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: htmlLine || "&nbsp;",
                            }}
                          />
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
