# Especificação da Funcionalidade do Editor de Código

## Visão Geral
Este documento descreve a especificação técnica para implementar um editor de código com destaque de sintaxe no DevRoast. O objetivo é fornecer um editor leve, performático e visualmente agradável, com suporte a detecção automática de linguagem e seleção manual, semelhante ao Ray.so.

## Objetivos
- **Destaque de Sintaxe:** Aplicar coloração precisa aos snippets de código.
- **Detecção Automática:** Inferir automaticamente a linguagem de programação quando o código for colado ou digitado.
- **Seleção Manual:** Permitir que o usuário selecione a linguagem manualmente quando a detecção falhar ou estiver incorreta.
- **Performance:** Garantir digitação e renderização suaves, mesmo para snippets moderadamente grandes.
- **Suporte a Tema:** Integrar de forma fluida com o tema da aplicação em Tailwind CSS/modo escuro.

## Recomendações de Stack Tecnológica

### 1. Núcleo do Editor: `react-simple-code-editor`
- **Por quê:** Leve (diferente de Monaco/CodeMirror), fácil de estilizar com CSS/Tailwind e suficiente para casos de uso de snippets (sem necessidade de intellisense/LSP).
- **Alternativa:** `react-textarea-autosize` com overlay customizado (mais complexo).
- **Decisão:** Usar `react-simple-code-editor` pela simplicidade e controle.

### 2. Destaque de Sintaxe: `shiki`
- **Por quê:** Usa gramáticas TextMate (as mesmas do VS Code) para destaque de alta fidelidade.
- **Prós:** Temas bonitos, tokenização precisa.
- **Contras:** Carregamento assíncrono de linguagens/temas.
- **Mitigação:** Pré-carregar um conjunto padrão de linguagens comuns (JS, TS, Python, HTML, CSS) e carregar outras sob demanda, ou usar um estado "plain" durante o carregamento.

### 3. Detecção de Linguagem: `highlight.js` (ou `flourite`)
- **Por quê:** `highlight.js` possui a função robusta `highlightAuto`. `flourite` é uma alternativa mais nova e leve, frequentemente usada em ferramentas como Ray.so para detecção de snippets.
- **Decisão:** Usar `highlight.js` (especificamente `highlight.js/lib/core` para manter o bundle menor) ou `flourite` se o tamanho do bundle for crítico.

## Detalhes de Implementação

### Estrutura de Componentes

#### `CodeEditor` (Átomo)
Um wrapper em torno de `react-simple-code-editor`.

**Props:**
```typescript
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  className?: string;
  disabled?: boolean;
}
```

**Lógica Interna:**
- Usa `shiki` para gerar HTML para a prop `highlight` do `react-simple-code-editor`.
- Aplica estilização (padding, família da fonte, fundo) via classes do Tailwind.

#### `SmartEditor` (Container de Funcionalidade)
Gerencia o estado e a lógica do editor, incluindo detecção de linguagem.

**Estado:**
- `code`: string (o snippet de código)
- `language`: string (linguagem selecionada atualmente, ex.: `'javascript'`)
- `isDetecting`: boolean (estado de carregamento da detecção)

**Lógica:**
1.  **Detecção Automática:**
    - No evento de `paste` ou em mudanças relevantes (com debounce), executar detecção de linguagem.
    - Atualizar o estado de `language` se a confiança for alta e o usuário não tiver travado a escolha manual.
2.  **Seleção Manual:**
    - Um componente `Select` (dropdown) permite forçar uma linguagem específica.
    - Ao selecionar uma linguagem, a detecção automática subsequente é desativada durante essa sessão.

### Fluxo de UI/UX

1.  **Estado Inicial:** Editor vazio, linguagem definida como "Plain Text" ou "Auto".
2.  **Usuário Digita/Cola:**
    - O editor atualiza o conteúdo.
    - Um `useEffect` dispara a detecção (debounce de 500 ms).
    - A linguagem detectada atualiza o valor do `Select` (ex.: "TypeScript").
    - O destaque de sintaxe é atualizado para corresponder à nova linguagem.
3.  **Usuário Seleciona Manualmente:**
    - O usuário clica no dropdown de "Language".
    - Seleciona "Python".
    - O editor é renderizado novamente com destaque para Python.
    - A detecção automática é pausada para não sobrescrever a escolha do usuário.

### Estilização (Tailwind v4)
- Usar `font-mono` para a fonte do editor.
- Garantir alto contraste para tokens de código (aproveitar temas do `shiki` ou mapear tokens para variáveis CSS).
- Adicionar borda/ring sutil no foco (`focus-within:ring-2`).

## Lista de Tarefas

- [x] Instalar dependências: `react-simple-code-editor`, `shiki`, `highlight.js` (ou `flourite`), `clsx`, `tailwind-merge`.
- [x] Criar `src/components/ui/code-editor.tsx` (componente base).
- [x] Criar `src/components/features/smart-editor.tsx` (container com lógica).
- [x] Implementar hook `useLanguageDetection` (lógica de detecção com debounce).
- [x] Integrar highlighter (Usado `highlight.js` para compatibilidade síncrona com `react-simple-code-editor` em vez de `shiki`).
- [x] Adicionar UI de seleção de linguagem (dropdown) na toolbar do editor.
- [ ] Validar performance com snippets grandes (adicionar alerta de limite de caracteres).

## Questões em Aberto/Riscos
- **Tamanho do Bundle:** `shiki` pode ser pesado. Garantir carregamento apenas das linguagens necessárias ou usar imports dinâmicos.
- **Destaque Assíncrono:** `react-simple-code-editor` espera highlight síncrono. Pode ser necessário renderizar um estado de "loading" ou fallback para lógica simples com `prismjs` enquanto o `shiki` prepara os tokens.
