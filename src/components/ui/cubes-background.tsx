import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CubesBackgroundProps {
  className?: string;
  /** Number of columns (default: 10) */
  cols?: number;
  /** Number of rows (default: 10) */
  rows?: number;
  /** Total animation duration in seconds (default: 15) */
  animationDuration?: number;
  /** Base color (e.g., "hsl(var(--primary))"). Default is shadcn primary. */
  color?: string;
  /** Opacity for the cubes (default: 0.1) */
  opacity?: number;
}

/**
 * Renders an animated grid of cubes as a background element.
 * Based on reactbits.dev/animations/cubes
 */
export const CubesBackground: React.FC<CubesBackgroundProps> = ({
  className,
  cols = 10,
  rows = 10,
  animationDuration = 15,
  color = "hsl(var(--primary))",
  opacity = 0.1,
}) => {
  const numCubes = rows * cols;

  // Memoize the cube data to prevent re-calculating random delays on every render
  const cubes = useMemo(() => {
    return Array.from({ length: numCubes }).map((_, i) => ({
      key: i,
      // Random delay for each cube, spread across the animation duration
      delay: (Math.random() * animationDuration).toFixed(2), // 'toFixed' for smaller style string
    }));
  }, [numCubes, animationDuration]);

  return (
    <div
      className={cn("cubes-background-grid", className)}
      // Use CSS variables to pass props to CSS
      style={
        {
          "--cube-cols": cols,
          "--cube-animation-duration": `${animationDuration}s`,
          "--cube-color": color,
          "--cube-opacity": opacity,
        } as React.CSSProperties
      }
    >
      {cubes.map(({ key, delay }) => (
        <div
          className="cube"
          key={key}
          style={{
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
};
