import { codeToHtml } from "shiki";

export async function highlightCode(
  code: string,
  lang: string = "typescript",
  theme: string = "vesper",
): Promise<string> {
  return codeToHtml(code || "", {
    lang,
    theme,
    structure: "inline",
  });
}
