/**
 * Slime Mold Canvas - Responsive Physarum simulation background
 * Based on Jeff Jones algorithm for slime mold behavior
 *
 * Features:
 * - Fully responsive canvas that adapts to container size changes
 * - Device pixel ratio handling for crisp rendering on all displays
 * - Performance scaling based on device capabilities and screen size
 * - Smooth resize transitions with fade effects
 * - Memory-efficient resource management
 * - Mobile-optimized agent counts and rendering quality
 */

import { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";
import { useTheme } from "@/contexts/theme-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { SlimeMoldSimulation, Agent } from "@/utils/slime-mold-simulation";
import {
  detectDeviceCapabilities,
  calculateOptimalAgentCount,
  getPerformanceSettings,
  calculateCanvasDimensions,
  type DeviceCapabilities,
  type PerformanceSettings,
} from "@/utils/device-capabilities";

interface SlimeMoldCanvasProps {
  isAnimating: boolean;
  className?: string;
}

const SlimeMoldCanvas = ({
  isAnimating,
  className = "",
}: SlimeMoldCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const simulationRef = useRef<SlimeMoldSimulation>();
  const deviceCapabilitiesRef = useRef<DeviceCapabilities>();
  const performanceSettingsRef = useRef<PerformanceSettings>();
  const resizeObserverRef = useRef<ResizeObserver>();
  const isInitializedRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);
  const { currentTheme } = useTheme();
  const isMobile = useIsMobile();

  // Initialize or update canvas with responsive settings
  const initializeCanvas = useCallback((width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect device capabilities
    const capabilities = detectDeviceCapabilities();
    deviceCapabilitiesRef.current = capabilities;

    // Get performance settings based on device
    const performanceSettings = getPerformanceSettings(capabilities);
    performanceSettingsRef.current = performanceSettings;

    // Calculate optimal canvas dimensions
    const dimensions = calculateCanvasDimensions(
      width,
      height,
      capabilities,
      performanceSettings
    );

    // Set actual canvas dimensions
    canvas.width = dimensions.canvasWidth;
    canvas.height = dimensions.canvasHeight;

    // Set display size (CSS pixels)
    canvas.style.width = `${dimensions.displayWidth}px`;
    canvas.style.height = `${dimensions.displayHeight}px`;

    // Scale context to match device pixel ratio
    ctx.scale(
      capabilities.pixelRatio * performanceSettings.renderScale,
      capabilities.pixelRatio * performanceSettings.renderScale
    );

    // Calculate optimal agent count
    const numAgents = calculateOptimalAgentCount(
      dimensions.canvasWidth,
      dimensions.canvasHeight,
      capabilities
    );

    // Initialize simulation with performance-tuned parameters
    const simulationConfig = {
      sensorDistance: performanceSettings.sensorDistance,
      rotationAngle: performanceSettings.rotationAngle,
      trailDecay: performanceSettings.trailDecay,
    };

    simulationRef.current = new SlimeMoldSimulation(simulationConfig);
    simulationRef.current.initialize(
      dimensions.canvasWidth,
      dimensions.canvasHeight,
      numAgents
    );

    isInitializedRef.current = true;
  }, []);

  // Handle canvas resizing
  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;

      // Skip if dimensions haven't changed significantly
      if (
        Math.abs(width - (canvasRef.current?.clientWidth || 0)) < 5 &&
        Math.abs(height - (canvasRef.current?.clientHeight || 0)) < 5
      ) {
        return;
      }

      // Show resize feedback
      setIsResizing(true);

      // Debounce the actual resize to avoid too frequent updates
      setTimeout(() => {
        initializeCanvas(width, height);
        setIsResizing(false);
      }, 100);
    },
    [initializeCanvas]
  );

  // Memoize blend mode calculation
  const blendMode = useMemo(() => {
    return currentTheme === "dark" ||
      currentTheme === "netflix" ||
      currentTheme === "github"
      ? "screen"
      : "multiply";
  }, [currentTheme]);

  // Setup ResizeObserver and initial canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get initial dimensions
    const rect = canvas.getBoundingClientRect();
    initializeCanvas(rect.width, rect.height);

    // Setup ResizeObserver for dynamic resizing
    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(canvas);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [initializeCanvas, handleResize]);

  // Animation loop with performance optimization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isAnimating || !isInitializedRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (
      !ctx ||
      !simulationRef.current ||
      !deviceCapabilitiesRef.current ||
      !performanceSettingsRef.current
    )
      return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let lastTime = 0;
    const frameInterval = 1000 / performanceSettingsRef.current.targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        // Update simulation (this handles trail decay and agent updates)
        const trailMap = simulationRef.current!.update();

        if (trailMap) {
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
        }
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
  }, [isAnimating, currentTheme, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${className}`}
      style={{
        mixBlendMode: blendMode,
        opacity: isResizing ? 0.7 : 1,
        transform: isResizing ? "scale(0.98)" : "scale(1)",
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
      }}
    />
  );
};

export default memo(SlimeMoldCanvas);
