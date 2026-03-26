"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CollapsibleCodeProps {
  children: React.ReactNode;
  maxHeight?: number; // Default height in pixels for collapsed state (approx 5-6 lines)
  linesOfCode?: number;
}

export function CollapsibleCode({
  children,
  maxHeight = 200,
  linesOfCode = 0,
}: CollapsibleCodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show the expand/collapse button if there are more than 7 lines
  const showExpandButton = linesOfCode > 7;

  return (
    <div className="relative w-full rounded-md border border-zinc-800 bg-zinc-950/50 group flex flex-col">
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out relative w-full",
          // Only clip vertically, hide horizontal scrolling on the container to prevent double scrollbars
          "overflow-x-hidden",
          !isExpanded && showExpandButton ? "max-h-[200px]" : "max-h-none",
        )}
        style={
          !isExpanded && showExpandButton
            ? { maxHeight: `${maxHeight}px` }
            : undefined
        }
      >
        <div className="w-full overflow-hidden [&_pre]:!overflow-x-hidden [&_code]:!whitespace-pre-wrap [&_code]:!break-all">
          {children}
        </div>

        {/* Gradient Mask for collapsed state */}
        {!isExpanded && showExpandButton && (
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        )}
      </div>

      {showExpandButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-zinc-800/50 bg-zinc-900/30 py-1.5 text-[10px] font-mono font-medium text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-zinc-300 shrink-0 z-10"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              COLLAPSE CODE
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              EXPAND CODE
            </>
          )}
        </button>
      )}
    </div>
  );
}
