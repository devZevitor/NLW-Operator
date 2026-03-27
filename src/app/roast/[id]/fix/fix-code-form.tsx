"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

interface FixCodeFormProps {
  roastId: string;
  originalCode: string;
  language: string;
  originalScore: number;
}

export function FixCodeForm({
  roastId,
  originalCode,
  language,
  originalScore,
}: FixCodeFormProps) {
  const [code, setCode] = useState(originalCode);
  const [result, setResult] = useState<{
    improved: boolean;
    newScore: number;
    sarcasticPhrase: string;
  } | null>(null);

  const router = useRouter();

  const improveMutation = api.roast.improve.useMutation({
    onSuccess: (data) => {
      setResult({
        improved: data.improved,
        newScore: data.newScore,
        sarcasticPhrase: data.sarcasticPhrase,
      });
      if (data.improved) {
        setTimeout(() => router.push(`/roast/${roastId}`), 2000);
      }
    },
  });

  const handleSubmit = () => {
    improveMutation.mutate({
      roastId,
      improvedCode: code,
    });
  };

  return (
    <div className="space-y-6">
      {/* Editable textarea */}
      <div>
        <h2 className="mb-4 font-mono text-sm text-zinc-500">
          Sua Versão Melhorada
        </h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full min-h-[200px] rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 font-mono text-sm text-zinc-300 focus:border-emerald-500 focus:outline-none"
          placeholder="Cole sua versão melhorada do código aqui..."
        />
      </div>

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={improveMutation.isPending}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {improveMutation.isPending ? "Analisando..." : "Analisar Melhoria"}
      </Button>

      {/* Error */}
      {improveMutation.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {improveMutation.error.message}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`rounded-lg border p-6 ${
            result.improved
              ? "border-emerald-500/20 bg-emerald-500/10"
              : "border-red-500/20 bg-red-500/10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">{result.improved ? "🎉" : "😔"}</span>
            <div>
              <h3 className="font-mono text-lg font-bold text-zinc-50">
                {result.improved ? "Melhorou!" : "Tentativa Falha"}
              </h3>
              <p className="font-mono text-sm text-zinc-400">
                Score: {originalScore} → {result.newScore}
              </p>
            </div>
          </div>
          <p className="text-zinc-300">"{result.sarcasticPhrase}"</p>

          {result.improved && (
            <p className="mt-4 text-sm text-emerald-400">
              Redirecionando para a página do roast...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
