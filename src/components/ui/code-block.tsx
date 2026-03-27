"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { CodeContainer } from "@/components/ui/code-container";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code?: string;
  lang?: string;
  className?: string;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  /**
   * If true, wraps the code in a window-like container.
   * If false, renders only the code block with line numbers.
   * @default true
   */
  window?: boolean;
  /**
   * If true, shows line numbers on the left side.
   * @default true
   */
  showLineNumbers?: boolean;
  /**
   * If true, renders an editable textarea instead of syntax-highlighted code.
   * @default false
   */
  editable?: boolean;
  /**
   * The value of the code (used in editable mode).
   */
  value?: string;
  /**
   * Callback when the code value changes (used in editable mode).
   */
  onChange?: (value: string) => void;
}

export function CodeBlock({
  code = "",
  lang = "typescript",
  className,
  headerRight,
  headerLeft,
  window = true,
  showLineNumbers = true,
  editable = false,
  value,
  onChange,
}: CodeBlockProps) {
  const [internalCode, setInternalCode] = useState(code);
  const [html, setHtml] = useState("");

  const currentValue = editable ? (value ?? internalCode) : code;

  useEffect(() => {
    if (!editable) {
      codeToHtml(code || "", {
        lang,
        theme: "vesper",
        structure: "inline",
      }).then(setHtml);
    }
  }, [code, lang, editable]);

  useEffect(() => {
    if (editable && value !== undefined) {
      setInternalCode(value);
    }
  }, [value, editable]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalCode(newValue);
    onChange?.(newValue);
  };

  const lines = currentValue.split("\n");
  const lineNumbers = Array.from(
    { length: Math.max(lines.length, 1) },
    (_, i) => i + 1,
  );

  if (editable) {
    const editableContent = (
      <div
        className={cn(
          "relative flex min-w-full p-4 text-sm",
          !window && className,
        )}
      >
        {showLineNumbers && (
          <div className="select-none pr-4 text-right text-zinc-600">
            {lineNumbers.map((num) => (
              <div key={num} className="leading-relaxed font-mono">
                {num}
              </div>
            ))}
          </div>
        )}
        <textarea
          value={currentValue}
          onChange={handleChange}
          className="flex-1 font-mono leading-relaxed whitespace-pre bg-transparent resize-none focus:outline-none"
          spellCheck={false}
        />
      </div>
    );

    if (!window) {
      return editableContent;
    }

    return (
      <CodeContainer
        className={className}
        headerRight={headerRight}
        headerLeft={headerLeft}
      >
        {editableContent}
      </CodeContainer>
    );
  }

  const content = (
    <div
      className={cn(
        "relative flex min-w-full p-4 text-sm",
        !window && className,
      )}
    >
      {showLineNumbers && (
        <div className="select-none pr-4 text-right text-zinc-600">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-relaxed font-mono">
              {num}
            </div>
          ))}
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="flex-1 font-mono leading-relaxed whitespace-pre"
      />
    </div>
  );

  if (!window) {
    return content;
  }

  return (
    <CodeContainer
      className={className}
      headerRight={headerRight}
      headerLeft={headerLeft}
    >
      {content}
    </CodeContainer>
  );
}
