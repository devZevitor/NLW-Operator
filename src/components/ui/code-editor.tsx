"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CodeEditor({
  className,
  value,
  onChange,
  placeholder,
  ...props
}: CodeEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = React.useRef<HTMLDivElement>(null);

  // Auto-resize logic
  React.useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight for shrinking
      textareaRef.current.style.height = "auto";
      // Set height to scrollHeight to expand
      const scrollHeight = textareaRef.current.scrollHeight;
      // Minimum height: 16 lines * 1.5rem (24px) + padding (32px) approx 416px, or use min-h class
      // We'll let min-h handle the minimum and this handle the growth
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const lineCount = value.split("\n").length;
  // Ensure we always render enough line numbers to match content + min 16 lines
  const minLines = 16;
  const displayLines = Math.max(lineCount, minLines);
  const lineNumbers = Array.from({ length: displayLines }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111] shadow-2xl",
        className
      )}
      {...props}
    >
      {/* Window Header */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] bg-[#111111] px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-amber-500" />
        <div className="h-3 w-3 rounded-full bg-emerald-500" />
      </div>

      {/* Editor Body */}
      <div className="relative flex flex-1">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="hidden w-12 flex-col items-end gap-0 overflow-hidden bg-[#111111] py-4 pr-3 text-right font-mono text-sm leading-6 text-zinc-700 select-none md:flex"
          aria-hidden="true"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-6 leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Vertical Divider */}
        <div className="hidden w-[1px] bg-[#2A2A2A] md:block" />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          // min-h-[25rem] corresponds to roughly 16 lines (16 * 1.5rem = 24rem) + padding
          className="min-h-[26rem] flex-1 resize-none overflow-hidden bg-[#0F0F0F] p-4 font-mono text-sm leading-6 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-0"
          placeholder={placeholder || "// Paste your code here..."}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
