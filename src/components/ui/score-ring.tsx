import * as React from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  max?: number;
  size?: number;
  thickness?: number;
}

const ScoreRing = React.forwardRef<HTMLDivElement, ScoreRingProps>(
  (
    { className, score, max = 10, size = 180, thickness = 6, ...props },
    ref
  ) => {
    // Ensure score is within bounds
    const normalizedScore = Math.min(Math.max(score, 0), max) / max;
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    // The strokeDashoffset is calculated to reveal the stroke
    const strokeDashoffset = circumference - normalizedScore * circumference;

    // Color logic based on score (matching the design's red/amber/green logic)
    const colorClass =
      normalizedScore >= 0.8
        ? "text-emerald-500" // Good
        : normalizedScore >= 0.5
        ? "text-amber-500" // Warning
        : "text-red-500"; // Critical

    return (
      <div
        ref={ref}
        className={cn("relative flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="h-full w-full -rotate-90 transform"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Ring */}
          <circle
            className="text-zinc-800"
            strokeWidth={thickness}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress Ring */}
          <circle
            className={cn("transition-all duration-1000 ease-out", colorClass)}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-mono text-6xl font-bold tracking-tighter",
              colorClass
            )}
          >
            {score}
          </span>
          <span className="font-mono text-lg font-medium text-zinc-500">
            /{max}
          </span>
        </div>
      </div>
    );
  }
);
ScoreRing.displayName = "ScoreRing";

export { ScoreRing };
