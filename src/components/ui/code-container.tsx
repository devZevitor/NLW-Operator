import * as React from "react";
import { cn } from "@/lib/utils";

export interface CodeContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
}

export const CodeContainer = React.forwardRef<
  HTMLDivElement,
  CodeContainerProps
>(({ className, children, headerRight, footer, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111] shadow-2xl",
        className,
      )}
      {...props}
    >
      {/* Window Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#111111] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
        </div>
        {headerRight && <div className="flex items-center">{headerRight}</div>}
      </div>

      {/* Content Body */}
      <div className="relative flex flex-1 min-h-0 text-sm">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-end border-t border-[#2A2A2A] bg-[#111111] px-4 py-2">
          {footer}
        </div>
      )}
    </div>
  );
});

CodeContainer.displayName = "CodeContainer";
