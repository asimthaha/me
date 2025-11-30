"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface FlickeringGridProps {
  className?: string;
  squareSize?: number;
  gap?: number;
}

const FlickeringGrid = ({
  className,
  squareSize = 20,
  gap = 2,
}: FlickeringGridProps) => {
  const [numSquares, setNumSquares] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateSquares = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const numCols = Math.floor(clientWidth / (squareSize + gap));
        const numRows = Math.floor(clientHeight / (squareSize + gap));
        setNumSquares(numCols * numRows);
      }
    };

    calculateSquares();
    window.addEventListener("resize", calculateSquares);
    return () => window.removeEventListener("resize", calculateSquares);
  }, [squareSize, gap]);

  const squares = Array.from({ length: numSquares });

  return (
    <div
      ref={containerRef}
      style={
        {
          "--square-size": `${squareSize}px`,
          "--gap": `${gap}px`,
        } as React.CSSProperties
      }
      className={cn(
        "absolute inset-0 flex flex-wrap items-center justify-center w-full h-full",
        className
      )}
    >
      {squares.map((_, i) => (
        <div
          key={i}
          style={{
            width: "var(--square-size)",
            height: "var(--square-size)",
            margin: "var(--gap)",
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 5 + 5}s`,
          }}
          className="bg-neutral-800 animate-flicker"
        />
      ))}
    </div>
  );
};

export default FlickeringGrid;
