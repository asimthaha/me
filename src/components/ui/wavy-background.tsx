"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}

const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  // Helper: Reads the actual numbers (e.g., "220 14% 96%") from CSS variables
  const getCssVariableValue = (variable: string) => {
    if (typeof window === "undefined") return "";
    // We inspect the <html> or <body> tag to get the variables
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue(variable).trim();
  };

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = canvas.offsetWidth;
    h = ctx.canvas.height = canvas.offsetHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;

    window.onresize = function () {
      w = ctx.canvas.width = canvas.offsetWidth;
      h = ctx.canvas.height = canvas.offsetHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  // 1. We determine the colors *inside* the function so we can calculate them
  const drawWave = (n: number) => {
    // Fetch the CURRENT theme colors from the DOM
    // We do this here or in render to ensure it catches theme changes
    // (For better performance, you could move this to init() and listen for theme changes)
    const computedColors = colors ?? [
      `hsl(${getCssVariableValue("--primary")})`,
      `hsl(${getCssVariableValue("--accent")})`,
      `hsl(${getCssVariableValue("--secondary")})`,
      `hsl(${getCssVariableValue("--muted-foreground")})`,
      `hsl(${getCssVariableValue("--ring")})`,
    ];

    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = 50 / n;

      // Use the computed HSL string
      ctx.strokeStyle = computedColors[i % computedColors.length];

      for (x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = () => {
    ctx.fillStyle = backgroundFill || "transparent";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    requestAnimationFrame(render);
  };

  useEffect(() => {
    init();

    // OPTIONAL: If your theme switcher adds a class to <html>,
    // we can listen for changes to force a redraw with new colors.
    const observer = new MutationObserver(() => {
      // Just triggering a resize-like logic to refresh context if needed
      // but 'render' loop actually picks up new values naturally if we
      // put the color fetch inside the loop.
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(nt);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "h-full flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        id="canvas"
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

export default WavyBackground;
