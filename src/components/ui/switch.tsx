"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const switchVariants = tv({
  base: "group inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-[#10B981] data-[unchecked]:bg-[#2A2A2A]",
  variants: {
    size: {
      default: "h-6 w-11",
      sm: "h-4 w-7",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbVariants = tv({
  base: "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0",
  variants: {
    size: {
      default: "h-5 w-5",
      sm: "h-3 w-3 data-[checked]:translate-x-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<React.ElementRef<typeof BaseSwitch.Root>, SwitchProps>(
  ({ className, size, ...props }, ref) => (
    <BaseSwitch.Root
      className={cn(switchVariants({ size }), className)}
      {...props}
      ref={ref}
    >
      <BaseSwitch.Thumb className={cn(thumbVariants({ size }))} />
    </BaseSwitch.Root>
  )
);
Switch.displayName = "Switch";

export { Switch };
