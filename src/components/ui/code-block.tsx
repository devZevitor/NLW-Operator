import { codeToHtml } from "shiki";
import { CodeContainer } from "@/components/ui/code-container";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
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
}

export async function CodeBlock({
  code,
  lang = "typescript",
  className,
  headerRight,
  headerLeft,
  window = true,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
    structure: "inline",
  });

  const content = (
    <div
      className={cn(
        "relative overflow-x-auto p-4 text-sm",
        !window && className,
      )}
    >
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="font-mono leading-relaxed whitespace-pre"
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
