# Especificação: Roast Creation Feature

## Visão Geral

Permitir que usuários enviem trechos de código para análise da IA (Gemini), recebendo uma pontuação de "shame score", feedback sarcástico e sugestões de melhoria.

## Requisitos Funcionais

### 1. Fluxo de Envio
- Usuário insere código no editor (já existe `RoastInputSection`)
- Toggle "roast mode" para habilitar modo sarcástico
- Botão "$ roast_my_code" submete o código
- Loading inline no botão durante processamento
- Redirect para `/roast/[id]` após análise completar

### 2. Integração com Gemini API
- Usar Gemini 2.0 Flash (free tier)
- Variação de prompt baseada no toggle roast mode
- Resposta estruturada em JSON com campos definidos

### 3. Tratamento de Erros
- Exibir erro na interface em caso de falha na API
- Permitir retry sem perder o código digitado
- bloquear temporariament caso 3 erros seguidos (30min de block)

## Arquitetura

### 3.1 Schema do Banco

```typescript
// roasts table (já existe)
{
  id: UUID,
  originalCode: text,
  language: text,
  sarcasmMode: boolean,
  createdAt: timestamp
}

// codeAnalyses table (já existe)
{
  id: UUID,
  roastId: UUID (FK),
  improvedCode: text,
  sarcasticPhrase: text,
  loc: integer,
  shameScore: integer (0-10),
  cruelPhrase: enum,
  createdAt: timestamp
}
```

### 3.2 tRPC Router

Criar `src/server/api/routers/roast.ts` com procedures:

```typescript
export const roastRouter = createRouter({
  create: publicProcedure
    .input(z.object({
      code: z.string().min(1).max(10000),
      language: z.string(),
      sarcasmMode: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      // 1. Chamar Gemini API
      // 2. Parsear resposta
      // 3. Salvar no banco
      // 4. Retornar ID do roast
    }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      // Buscar roast com análise
    }),
});
```

### 3.3 Integração Gemini

Criar `src/lib/gemini.ts`:

```typescript
interface GeminiRequest {
  code: string;
  language: string;
  sarcasmMode: boolean;
}

interface GeminiResponse {
  issues: Array<{
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
  }>;
  improvedCode: string;
  sarcasticPhrase: string;
  shameScore: number;
}

async function analyzeCode(request: GeminiRequest): Promise<GeminiResponse>
```

### 3.4 Fluxo de Dados

```
User Submit → tRPC Mutation → Validate Input → 
Gemini API → Parse Response → Save to DB → 
Return Roast ID → Redirect /roast/[id]
```

## Prompts para Gemini

### Modo Normal (não sarcástico)
```
Analise este código em {language} e retorne um JSON com:
- "issues": array de problemas com severity (critical/warning/info), title, description
- "improvedCode": versão melhorada do código
- "sarcasticPhrase": frase de feedback (tom neutro-técnico)
- "shameScore": inteiro 0-10 indicando nível de "vergonha" do código

Responda APENAS com JSON válido, sem markdown.
```

### Modo Roast (sarcástico)
```
Este código é terrível e você é um desenvolvedor sênior sarcástico que não tem medo de ferir sentimentos. 
Analise em {language} e retorne:
- "issues": problemas com descrições sarcásticas
- "improvedCode": versão corrigida
- "sarcasticPhrase": frase mega sarcástica
- "shameScore": 0-10 ( seja harsher no score)

Responda APENAS com JSON válido, sem markdown.
```

## Componentes de UI

### 1. RoastInputSection (existente, precisa de updates)
- Conectar ao tRPC mutation
- Adicionar estado de loading
- Tratar erro na UI

### 2. Roast Result Page (/roast/[id])
- Já existe com mock data
- Precisa buscar dados reais via tRPC query

### 3. Error Display
- Toast ou inline error
- Botão de retry

## Variáveis de Ambiente

```
GEMINI_API_KEY=... # obter em https://aistudio.google.com/app/apikey
```

## Etapas de Implementação

1. **Setup**: Adicionar GEMINI_API_KEY ao .env.example
2. **Lib**: Criar `src/lib/gemini.ts` com função de análise
3. **Router**: Criar `src/server/api/routers/roast.ts`
4. **Root**: Adicionar roast router ao root.ts
5. **UI**: Atualizar RoastInputSection com mutate
6. **Page**: Atualizar /roast/[id] para buscar dados reais
7. **Error**: Adicionar tratamento de erro no frontend

## Considerações de Segurança

- Não expor API key no client
- Validar input (max length, código malicioso)
- Rate limiting (opcional para MVP)

## Testes Sugeridos

- Unit: gemini.ts parse response
- Integration: tRPC mutation save to DB
- E2E: full flow submit → redirect → view result