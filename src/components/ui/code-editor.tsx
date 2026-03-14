"use client";

import hljs from "highlight.js";
import * as React from "react";
import Editor from "react-simple-code-editor";
import "highlight.js/styles/atom-one-dark.css";
import { cn } from "@/lib/utils";

interface CodeEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  headerRight?: React.ReactNode;
}

export function CodeEditor({
  className,
  value,
  onChange,
  language = "plaintext",
  placeholder,
  headerRight,
  ...props
}: CodeEditorProps) {
  const [lineCount, setLineCount] = React.useState(1);
  const lineNumbersRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setLineCount(value.split("\n").length);
  }, [value]);

  const highlight = React.useCallback(
    (code: string) => {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    },
    [language],
  );

  const handleScroll = (
    e: React.UIEvent<HTMLTextAreaElement> | React.UIEvent<HTMLDivElement>,
  ) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = (e.target as HTMLElement).scrollTop;
    }
  };

  // Ensure we always render enough line numbers to match content + min 16 lines
  const minLines = 16;
  const displayLines = Math.max(lineCount, minLines);
  const lineNumbers = Array.from({ length: displayLines }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111] shadow-2xl",
        className,
      )}
      {...props}
    >
      {/* Window Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#111111] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
        </div>
        {headerRight && <div className="flex items-center">{headerRight}</div>}
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

        {/* Editor */}
        <div className="flex-1 overflow-hidden bg-[#0F0F0F] relative">
          <Editor
            value={value}
            onValueChange={onChange}
            highlight={highlight}
            padding={16}
            onScroll={handleScroll}
            className="font-mono text-sm leading-6 min-h-[26rem]"
            textareaClassName="focus:outline-none"
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: 14,
              backgroundColor: "#0F0F0F",
              color: "#e4e4e7", // text-zinc-200
            }}
            placeholder={placeholder || "// Paste your code here..."}
          />
        </div>
      </div>
    </div>
  );
}
