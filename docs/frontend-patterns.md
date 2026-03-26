# Padrões de Frontend no Projeto

## 1. Composição de Componentes
O design system segue composição em vez de componentes monolíticos.

Exemplos:
- Card: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.
- Table: `Table`, `TableHeader`, `TableRow`, `TableCell`.

Benefício:
- Estrutura mais flexível para montar layouts diferentes sem duplicar lógica.

## 2. Uso de base-ui

Estado atual:
- `Switch` é implementado com `@base-ui/react`.

Ponto de atenção importante:
- Base UI usa atributos de presença (`data-checked`, `data-unchecked`), não `data-state=...`.

Benefício:
- Acessibilidade pronta com liberdade total de estilo.

## 3. Uso de tailwind-merge (`cn`)

Padrão:
- `cn()` combina `clsx` + `tailwind-merge` em `src/lib/utils.ts`.

Uso recorrente:
- Merge de classes base + variantes + `className` recebido por props.

Benefício:
- Evita conflito de classes utilitárias e reduz inconsistência visual.

## 4. Uso de tailwind-variants

Padrão:
- Componentes como `Button`, `Badge`, `Switch`, `DiffLine` modelam variantes com `tv()`.

Exemplos de variantes:
- `variant`: default, destructive, outline, etc.
- `size`: sm, default, lg.

Benefício:
- API de componente previsível, escalável e tipada.

## 5. Highlight de Código: Shiki + highlight.js

Uso atual dividido por cenário:
- `Shiki` em `CodeBlock` (render assíncrono, alta fidelidade visual).
- `highlight.js` em `CodeEditor`/`SmartEditor` (edição cliente + auto-detecção de linguagem).

Decisão prática:
- Shiki para exibição estática de alta qualidade.
- highlight.js para experiência de edição responsiva no browser.

## 6. Animação de Métricas com NumberFlow

Uso atual:
- `src/components/metrics-display.tsx` anima total de roasts e média de score.

Padrão:
- Estado inicial 0.
- Atualização para valor real após hidratação.

Benefício:
- Feedback visual mais claro de mudança de dados.

## 7. Padrões de Responsividade e Tema

Características atuais:
- Layout dark-first com estética terminal.
- Uso consistente de `font-mono` em blocos de código e elementos da proposta visual.
- Breakpoints Tailwind (`sm`, `md`, `lg`) para adaptação progressiva.

## 8. Boas Práticas para Evoluir o Frontend

1. Manter componentes de domínio em `src/components/features`.
2. Manter primitives em `src/components/ui` sem acoplamento a regra de negócio.
3. Criar skeletons reutilizáveis para manter consistência de loading.
4. Evitar lógica de dados dentro de componentes visuais puros.
