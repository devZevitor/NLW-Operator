import { groq } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { z } from "zod";

export interface GroqIssue {
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
}

export interface GroqHighlight {
  title: string;
  description: string;
}

export interface GroqResponse {
  issues: GroqIssue[];
  highlights: GroqHighlight[];
  improvedCode: string;
  sarcasticPhrase: string;
  shameScore: number;
}

export interface AnalyzeCodeInput {
  code: string;
  language: string;
  sarcasmMode: boolean;
}

const RESPONSE_SCHEMA = z.object({
  issues: z
    .array(
      z.object({
        severity: z.enum(["critical", "warning", "info"]),
        title: z.string(),
        description: z.string(),
      }),
    )
    .min(1, { message: "Deve ter pelo menos 1 issue" }),
  highlights: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional()
    .default([]),
  improvedCode: z.string().min(1, { message: "Deve conter código melhorado" }),
  sarcasticPhrase: z.string(),
  shameScore: z.number().min(0).max(10),
});

const NORMAL_PROMPT = (code: string, language: string) => `
A linguagem informada é uma detecção automática e pode estar incorreta. 
Analise o código e, se parecer ser de outra linguagem, ignore a linguagem informada e analise como a linguagem real.

Linguagem informada: ${language}

Analise este código e retorne um JSON com OBRIGATORIAMENTE:
- "issues": array de PROBLEMAS/PONTOS DE MELHORIA (mínimo 1 item, pode ser severity "info" se não houver problemas críticos) com severity (critical/warning/info), title, description
- "highlights": array de pontos positivos (apenas se o código realmente for bom, com pouquissimos erros E pontos muito positivos - pode ser array vazio se não houver)
- "improvedCode": versão MELHORADA/CORRIGIDA do código (NUNCA pode estar vazio - retorne o código original corrigido se não souber melhorar)
- "sarcasticPhrase": frase de feedback (tom neutro-técnico)
- "shameScore": inteiro 0-10 indicando nível de "vergonha" do código

IMPORTANTE: 
- issues DEVE ter pelo menos 1 item - se o código for bom, use severity "info"
- improvedCode NUNCA pode estar vazio - retorne o código com correções mesmo que mínimo

Código:
\`\`\`
${code}
\`\`\`

Responda APENAS com JSON válido, sem markdown.
`;

const SARCASM_PROMPT = (code: string, language: string) => `
A linguagem informada é uma detecção automática e pode estar incorreta. 
Analise o código e, se parecer ser de outra linguagem, ignore a linguagem informada e analise como a linguagem real.

Linguagem informada: ${language}

Este código é terrível e você é um desenvolvedor sênior sarcástico que não tem medo de ferir sentimentos. 
Analise e retorne OBRIGATORIAMENTE:
- "issues": array de problemas (mínimo 1 item) com descrições sarcásticas
- "highlights": pontos positivos APENAS se pouquissimos erros E pontos muito positivos
- "improvedCode": versão corrigida do código (NUNCA vazio)
- "sarcasticPhrase": frase mega sarcástica
- "shameScore": 0-10 (seja harsher no score)

IMPORTANTE:
- issues DEVE ter pelo menos 1 item
- improvedCode NUNCA pode estar vazio

Código:
\`\`\`
${code}
\`\`\`

Responda APENAS com JSON válido, sem markdown.
`;

export async function analyzeCode(
  input: AnalyzeCodeInput,
): Promise<GroqResponse> {
  const { code, language, sarcasmMode } = input;

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const prompt = sarcasmMode
    ? SARCASM_PROMPT(code, language)
    : NORMAL_PROMPT(code, language);

  const result = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt,
    temperature: sarcasmMode ? 1.2 : 0.7,
    output: Output.json(),
  });

  const text = result.text;

  console.log("[Groq] Raw response:", text);

  if (!text) {
    throw new Error("Empty response from Groq");
  }

  try {
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleanedText);

    const result = RESPONSE_SCHEMA.safeParse(parsed);

    if (!result.success) {
      console.warn(
        "Groq validation failed, attempting fallback:",
        result.error,
      );

      const fallbackIssues =
        parsed.issues &&
        Array.isArray(parsed.issues) &&
        parsed.issues.length > 0
          ? parsed.issues
          : [
              {
                severity: "info" as const,
                title: "Análise automática",
                description: "Código analisado. Verifique as sugestões abaixo.",
              },
            ];

      const fallbackImprovedCode =
        parsed.improvedCode &&
        typeof parsed.improvedCode === "string" &&
        parsed.improvedCode.length > 0
          ? parsed.improvedCode
          : code;

      return {
        issues: fallbackIssues,
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
        improvedCode: fallbackImprovedCode,
        sarcasticPhrase: parsed.sarcasticPhrase || "Código analisado.",
        shameScore:
          typeof parsed.shameScore === "number" ? parsed.shameScore : 5,
      };
    }

    return result.data;
  } catch (_parseError) {
    console.error("Failed to parse Groq response:", text);
    throw new Error("Invalid JSON response from Groq");
  }
}
