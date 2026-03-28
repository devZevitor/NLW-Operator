"use client";

import { useState } from "react";
import { CodeContainer } from "@/components/ui/code-container";
import { cn } from "@/lib/utils";

interface EditableCodeBlockProps {
  code?: string;
  lang?: string;
  className?: string;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  window?: boolean;
  showLineNumbers?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function EditableCodeBlock({
  code = "",
  lang = "typescript",
  className,
  headerRight,
  headerLeft,
  window = true,
  showLineNumbers = true,
  value,
  onChange,
}: EditableCodeBlockProps) {
  const [internalCode, setInternalCode] = useState(code);

  const currentValue = value ?? internalCode;

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
      <textarea
        value={currentValue}
        onChange={handleChange}
        className="flex-1 font-mono leading-relaxed whitespace-pre bg-transparent resize-none focus:outline-none"
        spellCheck={false}
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
