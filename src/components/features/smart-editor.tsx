"use client";

import hljs from "highlight.js";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { CodeEditor } from "@/components/ui/code-editor";

const LANGUAGES = [
  { value: "auto", label: "Auto Detect" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "XML" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "bash", label: "Bash" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
];

// Create a subset for auto-detection to improve accuracy and performance
const DETECTION_SUBSET = LANGUAGES.map((l) => l.value).filter(
  (l) => l !== "auto" && l !== "plaintext",
);

interface SmartEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  maxLength?: number;
  onLanguageChange?: (language: string) => void;
}

export function SmartEditor({
  value,
  onChange,
  className,
  placeholder,
  maxLength,
  onLanguageChange,
}: SmartEditorProps) {
  const [language, setLanguage] = React.useState("auto");
  const [detectedLanguage, setDetectedLanguage] = React.useState("plaintext");

  // Debounced detection
  React.useEffect(() => {
    if (language !== "auto") return;

    const timer = setTimeout(() => {
      if (!value.trim()) {
        setDetectedLanguage("plaintext");
        return;
      }
      const result = hljs.highlightAuto(value, DETECTION_SUBSET);
      setDetectedLanguage(result.language || "plaintext");
    }, 500);

    return () => clearTimeout(timer);
  }, [value, language]);

  const currentLanguage = language === "auto" ? detectedLanguage : language;

  React.useEffect(() => {
    onLanguageChange?.(currentLanguage);
  }, [currentLanguage, onLanguageChange]);

  return (
    <CodeEditor
      value={value}
      onChange={onChange}
      language={currentLanguage}
      placeholder={placeholder}
      className={className}
      maxLength={maxLength}
      headerRight={
        <div className="relative flex items-center gap-2">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none rounded-md border border-[#2A2A2A] bg-[#0A0A0A] py-1 pl-3 pr-8 text-xs font-mono text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-zinc-700 cursor-pointer transition-colors"
            >
              <option value="auto">
                Auto Detect{" "}
                {language === "auto" && value.trim()
                  ? `(${detectedLanguage})`
                  : ""}
              </option>
              {LANGUAGES.filter((lang) => lang.value !== "auto").map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500">
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      }
    />
  );
}
