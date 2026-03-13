import * as React from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const diffLineVariants = tv({
  base: "flex w-full min-w-0 items-start gap-4 border-l-2 px-4 py-2 font-mono text-sm leading-6 transition-colors hover:bg-white/5",
  variants: {
    type: {
      added: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
      removed: "border-red-500/50 bg-red-500/10 text-red-400 decoration-red-900/50 line-through",
      context: "border-transparent text-zinc-400",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

interface DiffLineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineVariants> {
  prefix?: string;
  lineNumber?: number;
}

const DiffLine = React.forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type, children, prefix, lineNumber, ...props }, ref) => {
    const defaultPrefix =
      type === "added" ? "+" : type === "removed" ? "-" : " ";

    return (
      <div
        ref={ref}
        className={cn(diffLineVariants({ type }), className)}
        {...props}
      >
        {lineNumber && (
          <span className="w-8 shrink-0 select-none text-right text-zinc-600">
            {lineNumber}
          </span>
        )}
        <span className="w-4 shrink-0 select-none text-center font-bold opacity-50">
          {prefix || defaultPrefix}
        </span>
        <div className="min-w-0 flex-1 whitespace-pre-wrap break-all">
          {children}
        </div>
      </div>
    );
  }
);
DiffLine.displayName = "DiffLine";

export { DiffLine, diffLineVariants };
