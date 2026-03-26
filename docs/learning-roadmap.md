# Roadmap de Estudo (Baseado no DevRoast)

Perfil alvo: dev backend junior com cerca de 2 anos de Node.js, consolidando fundamentos full-stack com TypeScript.

## Como Usar Este Roadmap
- Estude em ciclos curtos (1 a 2 semanas por bloco).
- Sempre aplique no próprio projeto.
- Use agentes para acelerar pesquisa, mas escreva e revise a parte crítica manualmente.

## Ordem Recomendada

1. Next.js moderno (App Router)
2. Server vs Client Components
3. tRPC
4. Suspense e loading states
5. Skeleton UI
6. tailwindMerge e tailwindVariants
7. base-ui
8. Shiki
9. NumberFlow

---

## 1) tRPC
Conceito:
- Camada de API tipada end-to-end entre frontend e backend.

Por que e importante:
- Evita divergencia de contratos e melhora produtividade com TypeScript.

O que estudar primeiro:
- Router, procedure, input validation com Zod.
- Integracao com React Query.
- Prefetch em Server Components.

Documentacao:
- https://trpc.io/docs

Aplicacao no DevRoast:
- Entender `metrics.getStats` e criar nova procedure para leaderboard real.

## 2) Next.js moderno (App Router)
Conceito:
- Modelo baseado em rotas por pasta, server-first e renderizacao hibrida.

Por que e importante:
- E a base arquitetural do projeto.

O que estudar primeiro:
- `layout.tsx`, `page.tsx`, route handlers.
- Diferenca entre render no servidor e no cliente.

Documentacao:
- https://nextjs.org/docs/app

Aplicacao no DevRoast:
- Mapear como home, leaderboard e roast detail sao montados.

## 3) Server vs Client Components
Conceito:
- Server Components executam no servidor; Client Components no browser.

Por que e importante:
- Impacta performance, bundle e experiencia do usuario.

O que estudar primeiro:
- Quando usar `"use client"`.
- Limites: hooks e eventos so no cliente.

Documentacao:
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

Aplicacao no DevRoast:
- Comparar `src/app/page.tsx` com `src/components/features/smart-editor.tsx`.

## 4) Suspense
Conceito:
- Boundary de carregamento para dados/componentes assincronos.

Por que e importante:
- Melhora UX sem bloquear toda a tela.

O que estudar primeiro:
- Fallbacks.
- Integracao com `useSuspenseQuery`.

Documentacao:
- https://react.dev/reference/react/Suspense

Aplicacao no DevRoast:
- Estudar o bloco de metricas na home.

## 5) Skeleton UI
Conceito:
- Placeholder visual durante carregamento.

Por que e importante:
- Reduz percepcao de lentidao e layout shift.

O que estudar primeiro:
- Diferenca entre spinner, pulse e skeleton dedicado.

Documentacao:
- https://uxdesign.cc/skeleton-screens-vs-spinners-70a5a9f89eb5

Aplicacao no DevRoast:
- Extrair fallback atual para componentes skeleton reutilizaveis.

## 6) tailwindMerge
Conceito:
- Resolve conflitos de classes Tailwind no merge dinamico.

Por que e importante:
- Evita bugs visuais em componentes com variantes.

O que estudar primeiro:
- Como `cn()` combina `clsx` e `tailwind-merge`.

Documentacao:
- https://github.com/dcastil/tailwind-merge

Aplicacao no DevRoast:
- Ler e refatorar um componente usando `cn` corretamente.

## 7) tailwindVariants
Conceito:
- Modelagem de API visual de componentes com variantes tipadas.

Por que e importante:
- Escala design system sem caos de classes condicionais.

O que estudar primeiro:
- `base`, `variants`, `defaultVariants`.
- Integracao com TypeScript `VariantProps`.

Documentacao:
- https://www.tailwind-variants.org/

Aplicacao no DevRoast:
- Revisar `Button`, `Badge`, `Switch`, `DiffLine`.

## 8) base-ui
Conceito:
- Primitives headless acessiveis para interacoes.

Por que e importante:
- Permite UX acessivel com estilo customizado.

O que estudar primeiro:
- Estrutura Root/Thumb no Switch.
- Data attributes especificos da lib.

Documentacao:
- https://base-ui.com/

Aplicacao no DevRoast:
- Entender por que switch usa `data-[checked]` e `data-[unchecked]`.

## 9) Shiki
Conceito:
- Syntax highlighting com gramaticas TextMate.

Por que e importante:
- Renderizacao de codigo com qualidade de editor.

O que estudar primeiro:
- `codeToHtml`.
- custo de renderizacao e uso em server-side.

Documentacao:
- https://shiki.style/

Aplicacao no DevRoast:
- Comparar uso do Shiki (`CodeBlock`) com highlight.js (`CodeEditor`).

## 10) NumberFlow
Conceito:
- Animacao de mudanca de numeros.

Por que e importante:
- Melhora leitura de metricas e feedback visual.

O que estudar primeiro:
- Props de formatacao e gatilho de animacao.

Documentacao:
- https://number-flow.barvian.me/

Aplicacao no DevRoast:
- Ajustar animacao para diferentes cenarios de update de metricas.

---

## Trilha de Projetos Praticos (Dentro do Repositorio)

1. Semana 1-2:
- Implementar leaderboard real com tRPC + Drizzle.

2. Semana 3-4:
- Implementar criacao de roast (mutation) com validacao Zod.

3. Semana 5:
- Substituir mock da pagina de roast por dados reais.

4. Semana 6:
- Criar skeletons reutilizaveis e melhorar boundaries de Suspense.

## Meta de Aprendizado
Ao final, voce deve conseguir:
- Explicar o fluxo completo frontend -> tRPC -> banco -> hydrate.
- Implementar feature nova com spec-first sem depender cegamente de agentes.
- Revisar codigo gerado por IA com criterio arquitetural.
