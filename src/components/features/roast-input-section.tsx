"use client";

import * as React from "react";
import { SmartEditor } from "@/components/features/smart-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const MAX_CHARS = 2000;

export function RoastInputSection() {
  const [code, setCode] = React.useState("");

  return (
    <section className="w-full max-w-4xl space-y-6">
      <SmartEditor
        placeholder="// Paste your code here..."
        value={code}
        onChange={setCode}
        maxLength={MAX_CHARS}
      />

      {/* Actions Bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-[#2A2A2A] bg-[#111111] px-4 py-2">
            <Switch id="roast-mode" />
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
          disabled={code.trim().length === 0 || code.length > MAX_CHARS}
        >
          $ roast_my_code
        </Button>
      </div>
    </section>
  );
}
