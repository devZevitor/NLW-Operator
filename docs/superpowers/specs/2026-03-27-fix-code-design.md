# Design: Botão "Corrigir" no Leaderboard

## Visão Geral

Permitir que usuários tentem melhorar códigos do shame leaderboard. Se a melhoria for válida (score melhorar), atualiza a entrada. Se piorar, ativa sarcasmMode automaticamente.

## Decisões de Design

| Decisão | Opção Escolhida | Rationale |
|---------|-----------------|-----------|
| Ação do botão | Redirect para página de roast | Mais espaço para edição |
| Pós-submissão | Salvar no banco | Persistir melhorias |
| Tipo de registro | Atualizar entrada existente | Mantém histórico no mesmo ID |

## Fluxo

```
1. Usuário clica "Corrigir" no leaderboard
        ↓
2. Redirect para /roast/{id}/fix
        ↓
3. Código original exibido para edição
        ↓
4. Usuário edita e clica "Analisar"
        ↓
5. IA analisa com sarcasmMode: true (por padrão)
        ↓
6. Se score novo > score original:
   - Atualiza entrada existente
   - Mostra resultado com "Melhorou!"
   ↓
7. Se score novo <= score original:
   - Ativa sarcasmMode automaticamente
   - Salva com score novo
   - Mostra "Tentativa falha" com roast sarcástico
```

## Especificações

### Botão "Corrigir"

- Localização: No card de cada código do leaderboard
- Estilo: Botão outline, ícone de lápis/ferramenta
- Label: "Corrigir" ou ícone

### Página de Edição (`/roast/[id]/fix`)

**Layout:**
- Código original (somente leitura) em CodeBlock
- Código editável (textarea) abaixo
- Botão "Analisar"
- Loading state durante análise
- Resultado: mostra comparação de scores

**Comportamento:**
- Se score melhorar: atualiza no banco, mostra "Melhorou! Score: X → Y"
- Se piorar: ativa sarcasmMode, salva, mostra resultado sarcástico

### Alterações no Router

**Nova mutation `improve`:**
```typescript
improve: publicProcedure
  .input(z.object({
    roastId: z.string().uuid(),
    improvedCode: z.string(),
  }))
  .mutation(async ({ input }) => {
    // 1. Busca código original
    // 2. Chama IA com sarcasmMode (score piorou) ou normal (score melhorou)
    // 3. Compara scores
    // 4. Atualiza entrada existente
  })
```

### Prompt de IA

Usar `SARCASM_PROMPT` existente, mas com contexto de "tentativa de melhoria":

```
Este código é uma TENTATIVA DE MELHORIA de um código que foiroasteado.
Analise e retorne:
- Se realmente melhorou: score pode ser mais alto
- Se piorou: seja ainda mais sarcástico
```

### Critérios de Melhoria

- **Melhorou**: `novoShameScore > originalShameScore`
- **Piorou**: `novoShameScore <= originalShameScore` → ativa sarcasmMode

## Componentes

| Arquivo | Descrição |
|---------|-----------|
| `src/app/leaderboard/components/leaderboard-entry.tsx` | Adicionar botão |
| `src/app/roast/[id]/fix/page.tsx` | NOVA página de edição |
| `src/components/ui/code-block.tsx` | Adicionar modo editável |
| `src/server/api/routers/roast.ts` | Nova mutation `improve` |
| `src/lib/groq.ts` | Novo prompt ou modificar existente |

## Critérios de Sucesso

- [ ] Botão "Corrigir" visível em cada entrada do leaderboard
- [ ] Redirect para página de edição funciona
- [ ] Código editável funciona (CodeBlock com modo edit)
- [ ] Análise IA retorna resultado correto
- [ ] Se melhorar: atualiza no banco e mostra sucesso
- [ ] Se piorar: ativa sarcasmMode e salva
- [ ] Página redireciona para resultado após submissão
