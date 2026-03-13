# Project: DevRoast (NLW Operator)

## Overview
DevRoast is a humorous code review platform where users submit code snippets to be "roasted" by an AI. It features a leaderboard of the "worst" code and a sarcastic UI theme.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + Tailwind Variants
- **Language:** TypeScript
- **Linting/Formatting:** Biome
- **Icons:** Lucide React

## Global Standards

### Directory Structure
- `src/app`: App Router pages and layouts.
- `src/components/ui`: Reusable, generic UI components (Buttons, Cards, Inputs).
- `src/components/layout`: App-specific layout components (Navbar, Footer).
- `src/lib`: Utility functions (`cn`, etc).

### Component Guidelines
- **Server Components:** Default to Server Components unless interactivity (hooks, event listeners) is required.
- **Client Components:** Add `"use client";` at the very top.
- **Styling:** Use Tailwind utility classes. For complex components with variants, use `tailwind-variants` (tv).
- **Imports:** Use absolute imports with `@/` alias.
- **Exports:** Use Named Exports for all components.

### UI Patterns
- **Composition:** Prefer composite components (e.g., `Card` + `CardHeader` + `CardContent`) over monolithic configuration props.
- **Radix UI/Base UI:** Use headless primitives for accessible interactive elements.
- **Shadcn-like:** Follow the pattern of copying code into `src/components/ui` rather than importing from a monolithic npm library (where applicable).

## Key Conventions
- **Filenames:** `kebab-case.tsx` for components.
- **Variables:** `camelCase`.
- **Commits:** Conventional Commits (feat, fix, docs, style, refactor).
