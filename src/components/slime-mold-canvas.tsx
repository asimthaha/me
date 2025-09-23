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
import { SlimeMoldSimulation } from "@/utils/slime-mold-simulation";
import {
  detectDeviceCapabilities,
  calculateOptimalAgentCount,
  getPerformanceSettings,
  calculateCanvasDimensions,
  type DeviceCapabilities,
  type PerformanceSettings,
} from "@/utils/device-capabilities";
import { useCanvasRenderer } from "@/components/canvas/CanvasRenderer";
import { useAnimationManager } from "@/components/canvas/AnimationManager";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface SlimeMoldCanvasProps {
  isAnimating: boolean;
  className?: string;
}

const SlimeMoldCanvas = memo(({
  isAnimating,
  className = "",
}: SlimeMoldCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<SlimeMoldSimulation>();
  const deviceCapabilitiesRef = useRef<DeviceCapabilities>();
  const performanceSettingsRef = useRef<PerformanceSettings>();
  const resizeObserverRef = useRef<ResizeObserver>();
  const isInitializedRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);
  const { currentTheme } = useTheme();
  const isMobile = useIsMobile();

  // Use canvas renderer hook
  const { createRenderer } = useCanvasRenderer(canvasRef, currentTheme);

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

  // Animation frame using optimized animation manager
  const onAnimationFrame = useCallback((deltaTime: number) => {
    if (!simulationRef.current || !canvasRef.current) return;

    const renderer = createRenderer();
    if (!renderer) return;

    // Update simulation (handles trail decay and agent updates)
    const trailMap = simulationRef.current.update();

    if (trailMap) {
      // Clear canvas and render trail map
      renderer.clearCanvas();
      renderer.renderTrailMap(trailMap);
    }
  }, [createRenderer]);

  // Use animation manager
  const { manager } = useAnimationManager(
    performanceSettingsRef.current || { targetFPS: 30 } as PerformanceSettings,
    onAnimationFrame,
    isAnimating && isInitializedRef.current
  );

  return (
    <ErrorBoundary fallback={<div className="absolute inset-0 bg-muted/5" />}>
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
    </ErrorBoundary>
  );
});

export default SlimeMoldCanvas;
