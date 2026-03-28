"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SmartEditor } from "@/components/features/smart-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";

const MAX_CHARS = 10000;

export function RoastInputSection() {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [sarcasmMode, setSarcasmMode] = React.useState(false);
  const [language, setLanguage] = React.useState("plaintext");
  const [error, setError] = React.useState<string | null>(null);

  const createRoast = api.roast.create.useMutation({
    onSuccess: (data) => {
      router.push(`/roast/${data.roastId}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    if (!code.trim()) return;
    setError(null);
    createRoast.mutate({
      code: code,
      language: language,
      sarcasmMode,
    });
  };

  const isLoading = createRoast.isPending;
  const isDisabled = !code.trim() || code.length > MAX_CHARS || isLoading;

  return (
    <section className="w-full max-w-4xl space-y-6">
      <SmartEditor
        placeholder="// Paste your code here..."
        value={code}
        onChange={setCode}
        maxLength={MAX_CHARS}
        onLanguageChange={setLanguage}
      />

      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4">
          <p className="font-mono text-sm text-red-400">
            Error: {error}
          </p>
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-red-400"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-[#2A2A2A] bg-[#111111] px-4 py-2">
            <Switch
              id="roast-mode"
              checked={sarcasmMode}
              onCheckedChange={setSarcasmMode}
            />
            <label
              htmlFor="roast-mode"
              className="cursor-pointer font-mono text-sm font-medium text-emerald-500"
            >
              roast mode
            </label>
          </div>
          <span className="hidden font-mono text-xs text-zinc-500 sm:inline-block">
            {"// maximum sarcasm enabled"}
          </span>
        </div>

        <Button
          className="h-11 bg-emerald-500 px-8 font-mono font-bold text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          {isLoading ? "$ processing..." : "$ roast_my_code"}
        </Button>
      </div>
    </section>
  );
}