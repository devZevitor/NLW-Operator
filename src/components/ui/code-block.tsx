import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  lang?: string;
  fileName?: string;
}

export async function CodeBlock({
  code,
  lang = "typescript",
  fileName,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
    structure: "inline", 
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#111111]">
      <div className="flex items-center justify-between border-b border-border bg-[#111111] px-4 py-3">
        <div className="flex gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20" />
        </div>
        {fileName && (
          <span className="font-mono text-xs text-muted-foreground">
            {fileName}
          </span>
        )}
        <div className="w-10" />
      </div>
      <div className="relative overflow-x-auto p-4 text-sm">
        {/* Render generated HTML */}
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="font-mono leading-relaxed whitespace-pre"
        />
      </div>
    </div>
  );
}
