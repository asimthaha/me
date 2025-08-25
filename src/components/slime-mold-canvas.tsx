/**
 * Slime Mold Canvas - Physarum simulation background
 * Based on Jeff Jones algorithm for slime mold behavior
 */

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/theme-context";

interface SlimeMoldCanvasProps {
  isAnimating: boolean;
  className?: string;
}

class Agent {
  x: number;
  y: number;
  heading: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  sensorAngle: number;
  sensorDist: number;
  rotAngle: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    // Start agents near center for better visual effect
    this.x = Math.random() * (width * 0.6) + width * 0.2;
    this.y = Math.random() * (height * 0.6) + height * 0.2;

    this.heading = Math.random() * 360;
    this.vx = Math.cos((this.heading * Math.PI) / 180);
    this.vy = Math.sin((this.heading * Math.PI) / 180);

    this.sensorAngle = 45;
    this.sensorDist = 9;
    this.rotAngle = 45;
  }

  update(trailMap: ImageData) {
    this.vx = Math.cos((this.heading * Math.PI) / 180);
    this.vy = Math.sin((this.heading * Math.PI) / 180);

    // Wrap around canvas
    this.x = (this.x + this.vx + this.width) % this.width;
    this.y = (this.y + this.vy + this.height) % this.height;

    // Get sensor positions
    const rSensor = this.getSensorPos(this.heading + this.sensorAngle);
    const lSensor = this.getSensorPos(this.heading - this.sensorAngle);
    const fSensor = this.getSensorPos(this.heading);

    // Sample trail intensity at sensor positions
    const r = this.sampleTrail(trailMap, rSensor.x, rSensor.y);
    const l = this.sampleTrail(trailMap, lSensor.x, lSensor.y);
    const f = this.sampleTrail(trailMap, fSensor.x, fSensor.y);

    // Steering logic based on sensor readings
    if (f > l && f > r) {
      // Continue forward
      this.heading += 0;
    } else if (f < l && f < r) {
      // Turn randomly when both sides are stronger
      if (Math.random() < 0.5) {
        this.heading += this.rotAngle;
      } else {
        this.heading -= this.rotAngle;
      }
    } else if (l > r) {
      // Turn left
      this.heading -= this.rotAngle;
    } else if (r > l) {
      // Turn right
      this.heading += this.rotAngle;
    }

    // Add small random component for exploration
    if (Math.random() < 0.1) {
      this.heading += (Math.random() - 0.5) * 20;
    }
  }

  getSensorPos(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: (this.x + this.sensorDist * Math.cos(rad) + this.width) % this.width,
      y: (this.y + this.sensorDist * Math.sin(rad) + this.height) % this.height,
    };
  }

  sampleTrail(trailMap: ImageData, x: number, y: number): number {
    const ix = Math.floor(x);
    const iy = Math.floor(y);

    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height) return 0;

    const index = (iy * this.width + ix) * 4;
    return trailMap.data[index]; // Red channel intensity
  }

  deposit(trailMap: ImageData) {
    const ix = Math.floor(this.x);
    const iy = Math.floor(this.y);

    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height) return;

    const index = (iy * this.width + ix) * 4;

    // Deposit trail (increase red channel)
    trailMap.data[index] = Math.min(255, trailMap.data[index] + 60);
    trailMap.data[index + 1] = Math.min(255, trailMap.data[index + 1] + 30);
    trailMap.data[index + 2] = Math.min(255, trailMap.data[index + 2] + 20);
    trailMap.data[index + 3] = 255;
  }
}

const SlimeMoldCanvas = ({
  isAnimating,
  className = "",
}: SlimeMoldCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const agentsRef = useRef<Agent[]>([]);
  const trailMapRef = useRef<ImageData>();
  const { currentTheme, theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = rect.width * scale * 0.5; // Reduce resolution for performance
    canvas.height = rect.height * scale * 0.5;
    ctx.scale(scale * 0.5, scale * 0.5);

    // Initialize agents
    const numAgents = Math.min(
      300,
      Math.floor((canvas.width * canvas.height) / 1000)
    );
    agentsRef.current = Array.from(
      { length: numAgents },
      () => new Agent(canvas.width, canvas.height)
    );

    // Initialize trail map
    trailMapRef.current = ctx.createImageData(canvas.width, canvas.height);

    // Fill with transparent pixels
    for (let i = 0; i < trailMapRef.current.data.length; i += 4) {
      trailMapRef.current.data[i] = 0; // R
      trailMapRef.current.data[i + 1] = 0; // G
      trailMapRef.current.data[i + 2] = 0; // B
      trailMapRef.current.data[i + 3] = 0; // A
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx || !trailMapRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        // Decay trails
        const trailMap = trailMapRef.current!;
        for (let i = 0; i < trailMap.data.length; i += 4) {
          trailMap.data[i] = Math.max(0, trailMap.data[i] * 0.99); // R
          trailMap.data[i + 1] = Math.max(0, trailMap.data[i + 1] * 0.99); // G
          trailMap.data[i + 2] = Math.max(0, trailMap.data[i + 2] * 0.99); // B
        }

        // Update agents
        agentsRef.current.forEach((agent) => {
          agent.update(trailMap);
          agent.deposit(trailMap);
        });

        // Clear canvas with very subtle background based on theme
        const isDark =
          currentTheme === "dark" ||
          currentTheme === "netflix" ||
          currentTheme === "github";
        ctx.fillStyle = isDark
          ? "rgba(0, 0, 0, 0.05)"
          : "rgba(255, 255, 255, 0.03)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw trail map with theme-aware colors
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < trailMap.data.length; i += 4) {
          const intensity = trailMap.data[i] / 255;

          // Theme-specific trail colors
          let r = 30,
            g = 30,
            b = 30,
            a = 80; // Default (light)

          switch (currentTheme) {
            case "light":
              r = 30;
              g = 30;
              b = 30;
              a = 80;
              break;
            case "dark":
              r = 200;
              g = 255;
              b = 230;
              a = 150; // Blue-green
              break;
            case "netflix":
              r = 255;
              g = 50;
              b = 50;
              a = 120; // Red accent
              break;
            case "ey":
              r = 255;
              g = 200;
              b = 0;
              a = 100; // Gold/yellow
              break;
            case "github":
              r = 150;
              g = 200;
              b = 255;
              a = 130; // Blue
              break;
          }

          imageData.data[i] = Math.floor(intensity * r); // R
          imageData.data[i + 1] = Math.floor(intensity * g); // G
          imageData.data[i + 2] = Math.floor(intensity * b); // B
          imageData.data[i + 3] = Math.floor(intensity * a); // A
        }

        ctx.putImageData(imageData, 0, 0);
        lastTime = currentTime;
      }

      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        mixBlendMode:
          currentTheme === "dark" ||
          currentTheme === "netflix" ||
          currentTheme === "github"
            ? "screen"
            : "multiply",
      }}
    />
  );
};

export default SlimeMoldCanvas;
