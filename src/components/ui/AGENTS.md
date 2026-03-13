# UI Component Standards

This document outlines the standards for creating reusable UI components in this project. All future components in `src/components/ui` must follow these guidelines.

## Tech Stack
- **Styling:** Tailwind CSS
- **Variants:** `tailwind-variants` (TV)
- **Class Merging:** `clsx` + `tailwind-merge` (via `cn` utility)
- **Polymorphism:** `@radix-ui/react-slot`

## Rules
1. **File Location:** `src/components/ui/[component-name].tsx`
2. **Exports:** Always use **Named Exports**.
3. **Types:** Extend native HTML attributes (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`) and `VariantProps`.
4. **Refs:** Always wrap components in `React.forwardRef`.
5. **Polymorphism:** Always implement the `asChild` prop using `@radix-ui/react-slot` to allow rendering as different elements (e.g., `a`, `Link`).
6. **Class Merging:** Always merge the `className` prop with the variant classes using the `cn()` utility.
7. **Display Name:** Always set `Component.displayName`.

## Known Pitfall: Base UI State Attributes

When using `@base-ui/react` primitives (especially `Switch`), do **not** assume Radix-style `data-[state=checked]` / `data-[state=unchecked]` selectors.

Base UI `Switch` uses presence attributes:
- `data-checked`
- `data-unchecked`

Use Tailwind selectors as:
- `data-[checked]:...`
- `data-[unchecked]:...`

Wrong:
```tsx
data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-zinc-800
```

Correct:
```tsx
data-[checked]:bg-green-500 data-[unchecked]:bg-zinc-800
```

Apply this to both root and thumb elements when implementing toggle movement and background color transitions.

## Template

Use this template for new components:

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, tv } from "tailwind-variants"
import { cn } from "@/lib/utils"

// 1. Define Variants using tv
const componentVariants = tv({
  base: "base-classes-here",
  variants: {
    variant: {
      default: "...",
      outline: "...",
    },
    size: {
      default: "...",
      sm: "...",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

// 2. Define Props Interface
// Change HTMLDivElement to the appropriate element type
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof componentVariants> {
  asChild?: boolean
}

// 3. Implement Component
// Change HTMLDivElement to the appropriate element type
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div" // Change "div" to default element
    return (
      <Comp
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

// 4. Export
export { Component, componentVariants }
```
