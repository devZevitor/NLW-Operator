import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/ui/code-block";
import { api, HydrateClient } from "@/trpc/server";
import { FixCodeForm } from "./fix-code-form";

interface FixPageProps {
  params: Promise<{ id: string }>;
}

export default async function FixPage({ params }: FixPageProps) {
  const { id } = await params;

  let roast;
  try {
    roast = await api.roast.getById({ id });
  } catch {
    notFound();
  }

  const { originalCode, language, analysis } = roast;

  return (
    <HydrateClient>
      <div className="min-h-screen bg-[#0A0A0A] pb-20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-mono text-2xl text-zinc-50">
              Melhore este código
            </h1>
            <p className="mt-2 text-zinc-400">
              Score atual: {analysis.shameScore}/10 - Tente melhorar!
            </p>
          </div>

          {/* Original Code (read-only) */}
          <section className="mb-8">
            <h2 className="mb-4 font-mono text-sm text-zinc-500">
              Código Original
            </h2>
            <CodeBlock
              code={originalCode}
              lang={language}
              className="w-full max-h-[300px]"
            />
          </section>

          {/* Editable Code - Client Component */}
          <FixCodeForm
            roastId={id}
            originalCode={originalCode}
            language={language}
            originalScore={analysis.shameScore}
          />
        </div>
      </div>
    </HydrateClient>
  );
}
