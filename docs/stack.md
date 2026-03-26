# Stack Técnica e Decisões

## Visão Geral
Este projeto combina tecnologias de runtime (aplicação), infraestrutura de dados, UI e ferramentas de produtividade com IA.

## Runtime da Aplicação

### Next.js (App Router moderno)
- Para que serve: framework full-stack para React com roteamento, server rendering e API routes.
- Por que foi escolhido: centraliza frontend e backend no mesmo projeto, reduzindo fricção de integração.
- Problema que resolve: elimina necessidade de manter dois repositórios separados (UI e API).

### React
- Para que serve: biblioteca de construção de interfaces em componentes.
- Por que foi escolhido: ecossistema maduro e integração nativa com Next.js.
- Problema que resolve: composição de UI e estado de forma previsível.

### tRPC
- Para que serve: API tipada fim a fim sem gerar clientes manualmente.
- Por que foi escolhido: inferência de tipos entre frontend e backend em TypeScript.
- Problema que resolve: evita divergência de contratos entre cliente e servidor.

### TanStack React Query (usado junto do tRPC)
- Para que serve: cache, sincronização e estados de loading/error de dados remotos.
- Por que foi escolhido: integração oficial com tRPC.
- Problema que resolve: simplifica fetch, cache e hidratação SSR/CSR.

### Drizzle ORM + PostgreSQL
- Para que serve: mapeamento tipado de tabelas e queries SQL em TypeScript.
- Por que foi escolhido: abordagem SQL-friendly, leve e tipada.
- Problema que resolve: persistência de dados com segurança de tipos e migrações previsíveis.

### Zod + SuperJSON
- Para que serve:
  - Zod: validação de input.
  - SuperJSON: serialização de dados ricos entre server/client.
- Por que foi escolhido: padrão comum em stacks tRPC.
- Problema que resolve: validação explícita e transporte seguro de payloads.

## UI e Estilo

### Tailwind CSS
- Para que serve: utilitários CSS para estilização rápida e consistente.
- Por que foi escolhido: produtividade e facilidade de composição.
- Problema que resolve: evita CSS disperso e reduz custo de manutenção visual.

### tailwind-merge
- Para que serve: resolve conflitos de classes Tailwind.
- Por que foi escolhido: melhora previsibilidade ao combinar classes dinâmicas.
- Problema que resolve: evita bugs de estilo por duplicidade/conflito de classes.

### tailwind-variants
- Para que serve: modelar variantes de componentes (size, variant, state).
- Por que foi escolhido: organiza design system de forma tipada.
- Problema que resolve: evita condicionais de classe espalhadas e difíceis de manter.

### base-ui
- Para que serve: primitives acessíveis/headless para componentes interativos.
- Por que foi escolhido: controle visual total com base acessível.
- Problema que resolve: acelera componentes complexos sem perder acessibilidade.

### Shiki
- Para que serve: syntax highlighting com gramáticas TextMate (qualidade VS Code).
- Por que foi escolhido: qualidade visual para blocos de código renderizados no servidor.
- Problema que resolve: destacar código com fidelidade e aparência profissional.

### NumberFlow
- Para que serve: animação de números em transições de métricas.
- Por que foi escolhido: feedback visual suave para KPIs.
- Problema que resolve: melhora percepção de atualização de dados e UX.

## Ferramentas de Desenvolvimento com IA

### Context7
- Para que serve: busca contextual de documentação/API de bibliotecas.
- Por que foi escolhido: acelera investigação técnica durante implementação.
- Problema que resolve: reduz tempo gasto procurando docs fragmentadas.

### Pencil
- Para que serve: fluxo de design/prototipação baseado em arquivos `.pen` via MCP.
- Por que foi escolhido: permite iterar layout e design com apoio de agente.
- Problema que resolve: reduz ciclo entre ideia visual e protótipo.

### Opencode
- Para que serve: ambiente operacional para agentes executarem análises e mudanças.
- Por que foi escolhido: coordena exploração do repositório e execução de tarefas.
- Problema que resolve: padroniza automação de tarefas de engenharia assistida.

### GitHub Copilot
- Para que serve: assistência de código, revisão e documentação.
- Por que foi escolhido: aumenta velocidade de implementação e suporte a aprendizado.
- Problema que resolve: reduz tempo de boilerplate e pesquisa operacional.

## Decisão Arquitetural Relevante
Mesmo com IA no fluxo, a base técnica continua centrada em:
- TypeScript end-to-end.
- Contratos explícitos via tRPC/Zod.
- Camadas separadas (UI, API, dados).
- Workflow spec-first para preservar qualidade e entendimento.
