import { z } from "zod";

export interface GeminiIssue {
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
}

export interface GeminiResponse {
  issues: GeminiIssue[];
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
  issues: z.array(
    z.object({
      severity: z.enum(["critical", "warning", "info"]),
      title: z.string(),
      description: z.string(),
    })
  ),
  improvedCode: z.string(),
  sarcasticPhrase: z.string(),
  shameScore: z.number().min(0).max(10),
});

const NORMAL_PROMPT = (code: string, language: string) => `
Analise este código em ${language} e retorne um JSON com:
- "issues": array de problemas com severity (critical/warning/info), title, description
- "improvedCode": versão melhorada do código
- "sarcasticPhrase": frase de feedback (tom neutro-técnico)
- "shameScore": inteiro 0-10 indicando nível de "vergonha" do código

Código:
\`\`\`${language}
${code}
\`\`\`

Responda APENAS com JSON válido, sem markdown.
`;

const SARCASM_PROMPT = (code: string, language: string) => `
Este código é terrível e você é um desenvolvedor sênior sarcástico que não tem medo de ferir sentimentos. 
Analise em ${language} e retorne:
- "issues": problemas com descrições sarcásticas
- "improvedCode": versão corrigida
- "sarcasticPhrase": frase mega sarcástica
- "shameScore": 0-10 (seja harsher no score)

Código:
\`\`\`${language}
${code}
\`\`\`

Responda APENAS com JSON válido, sem markdown.
`;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<GeminiResponse> {
  const { code, language, sarcasmMode } = input;
  
  const prompt = sarcasmMode 
    ? SARCASM_PROMPT(code, language)
    : NORMAL_PROMPT(code, language);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: sarcasmMode ? 1.2 : 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  try {
    const parsed = JSON.parse(text);
    return RESPONSE_SCHEMA.parse(parsed);
  } catch (_parseError) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Invalid JSON response from Gemini");
  }
}