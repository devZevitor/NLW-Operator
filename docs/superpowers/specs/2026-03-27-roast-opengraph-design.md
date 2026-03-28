# Design: Open Graph para Páginas de Roast

## Visão Geral

Gerar imagens Open Graph dinâmicas para cada página de roast no DevRoast, permitindo compartilhamento visual atraente nas redes sociais.

## Decisões de Design

| Decisão | Opção Escolhida | Rationale |
|---------|-----------------|-----------|
| Estilo visual | Score + Frase minimalista | Foco no humor e score |
| Elementos | Score, Verdict, Linguagem, Frase sarcástica | Conforme design Pencil |
| Fundo | Escuro fixo (#0A0A0A) | Consistent com tema atual |
| Geração | Dinâmica (sob demanda) | Flexibilidade para dados em tempo real |

## Especificações Visuais

### Dimensões
- **Largura:** 1200px
- **Altura:** 630px
- **Formato:** PNG

### Cores (Fundo Escuro)
| Token | Valor |
|-------|-------|
| bg-page | #0A0A0A |
| accent-green | #10B981 |
| accent-amber | #F59E0B |
| accent-red | #EF4444 |
| text-primary | #E5E5E5 |
| text-tertiary | #737373 |

### Fontes
- **Primária:** JetBrains Mono
- **Secundária:** IBM Plex Mono (Geist)

### Layout (Topo → Baixo)
1. **Logo Row** (padding-top: 64px)
   - "> devroast" em verde (#10B981), tamanho 24px
   
2. **Score Row**
   - Score number: 160px, âmbar (#F59E0B), bold
   - "/10": 56px, cinza (#737373)
   - Gap: 4px
   
3. **Verdict Row**
   - Dot vermelho (12x12px, #EF4444)
   - Texto: lowercase, vermelho (#EF4444), 20px
   - Gap: 8px
   
4. **Lang Info**
   - "lang: {linguagem} · {linhas} lines"
   - 16px, cinza (#737373), JetBrains Mono
   
5. **Roast Quote** (largura total - 64px padding cada lado)
   - Aspas inteligentes com frase sarcástica
   - 22px, branco (#E5E5E5), IBM Plex Mono
   - Text align: center

## Arquitetura Técnica

### Estrutura de Arquivos
```
src/app/roast/[id]/
├── page.tsx              # Página existente
├── opengraph/
│   └── route.ts          # NOVO - GET endpoint para OG
```

### Dependências
```bash
npm install @takumi-rs/image-response
```

### next.config.ts (update)
```typescript
const config: NextConfig = {
  serverExternalPackages: ["@takumi-rs/core"],
};
```

### Rota de API

**Endpoint:** `GET /roast/[id]/opengraph`

**Input:**
- `id` (path param): UUID do roast

**Output:**
- Content-Type: `image/png`
- Cache-Control: `public, max-age=3600`

**Fluxo:**
1. Recebe requisição com ID do roast
2. Busca dados via tRPC (`api.roast.getById`)
3. Renderiza template JSX com Takumi
4. Retorna ImageResponse com dados do roast

### Dados Necessários
| Campo | Fonte | Uso |
|-------|-------|-----|
| shameScore | analysis.shameScore | Score central |
| cruelPhrase | analysis.cruelPhrase | Verdict text |
| language | roast.language | Info código |
| loc | analysis.loc | Linhas código |
| sarcasticPhrase | analysis.sarcasticPhrase | Quote |

### Metadata na Página

Em `src/app/roast/[id]/page.tsx`, adicionar:

```typescript
export async function generateMetadata({ params }: RoastPageProps) {
  const { id } = await params;
  const roast = await api.roast.getById({ id });
  
  return {
    openGraph: {
      images: [`/roast/${id}/opengraph`],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
```

## Implementação

### 1. Instalação
```bash
npm install @takumi-rs/image-response
```

### 2. Configuração next.config.ts
Adicionar `serverExternalPackages`

### 3. Criar rota opengraph
- `src/app/roast/[id]/opengraph/route.ts`
- Template JSX baseado no design Pencil
- Tratamento de erros (roast não encontrado)

### 4. Adicionar metadata
- Export `generateMetadata` na page.tsx

## Critérios de Sucesso

- [ ] Imagem OG gerada corretamente com dados do roast
- [ ] Preview funciona ao copiar link no Twitter/Discord
- [ ] Tempo de resposta < 2s
- [ ] Fallback para roast não encontrado
- [ ] Fonts carregadas corretamente na imagem
