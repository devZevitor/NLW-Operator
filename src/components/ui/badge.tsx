import type * as React from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const badgeVariants = tv({
  base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    variant: {
      default:
        "border-transparent bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-red-500/10 text-red-500 hover:bg-red-500/20",
      warning:
        "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn("mr-1.5 h-2 w-2 rounded-full", {
            "bg-[#10B981]": variant === "default",
            "bg-red-500": variant === "destructive",
            "bg-amber-500": variant === "warning",
            "bg-secondary-foreground": variant === "secondary",
            "bg-foreground": variant === "outline",
          })}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
