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

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/contexts/theme-context";
import { useIsMobile } from "@/hooks/use-mobile";

interface SlimeMoldCanvasProps {
  isAnimating: boolean;
  className?: string;
}

interface DeviceCapabilities {
  isMobile: boolean;
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  isLowEnd: boolean;
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

  constructor(
    width: number,
    height: number,
    sensorDist: number = 9,
    rotAngle: number = 45
  ) {
    this.width = width;
    this.height = height;

    // Start agents near center for better visual effect
    this.x = Math.random() * (width * 0.6) + width * 0.2;
    this.y = Math.random() * (height * 0.6) + height * 0.2;

    this.heading = Math.random() * 360;
    this.vx = Math.cos((this.heading * Math.PI) / 180);
    this.vy = Math.sin((this.heading * Math.PI) / 180);

    this.sensorAngle = 45;
    this.sensorDist = sensorDist;
    this.rotAngle = rotAngle;
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

// Device capability detection and performance scaling utilities
const detectDeviceCapabilities = (): DeviceCapabilities => {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth < 768;

  // Detect low-end devices based on hardware concurrency and screen size
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isLowEnd = hardwareConcurrency < 4 || (isMobile && screenWidth < 480);

  return {
    isMobile,
    pixelRatio,
    screenWidth,
    screenHeight,
    isLowEnd,
  };
};

const calculateOptimalAgentCount = (
  canvasWidth: number,
  canvasHeight: number,
  capabilities: DeviceCapabilities
): number => {
  const baseCount = Math.floor((canvasWidth * canvasHeight) / 1000);

  // Scale based on device capabilities
  let scaleFactor = 1;

  if (capabilities.isLowEnd) {
    scaleFactor = 0.3; // Reduce to 30% on low-end devices
  } else if (capabilities.isMobile) {
    scaleFactor = 0.6; // Reduce to 60% on mobile
  } else if (capabilities.screenWidth >= 1440) {
    scaleFactor = 1.2; // Increase on large screens
  }

  return Math.max(50, Math.min(400, Math.floor(baseCount * scaleFactor)));
};

const getPerformanceSettings = (capabilities: DeviceCapabilities) => {
  const baseSettings = {
    renderScale: 1,
    trailDecay: 0.99,
    targetFPS: 30,
    sensorDistance: 9,
    rotationAngle: 45,
  };

  if (capabilities.isLowEnd) {
    return {
      ...baseSettings,
      renderScale: 0.5,
      trailDecay: 0.95,
      targetFPS: 24,
      sensorDistance: 6,
      rotationAngle: 60,
    };
  } else if (capabilities.isMobile) {
    return {
      ...baseSettings,
      renderScale: 0.7,
      trailDecay: 0.97,
      targetFPS: 30,
      sensorDistance: 7,
      rotationAngle: 45,
    };
  }

  return baseSettings;
};

const SlimeMoldCanvas = ({
  isAnimating,
  className = "",
}: SlimeMoldCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const agentsRef = useRef<Agent[]>([]);
  const trailMapRef = useRef<ImageData>();
  const deviceCapabilitiesRef = useRef<DeviceCapabilities>();
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

    // Calculate optimal canvas size with device pixel ratio
    const canvasWidth = Math.floor(
      width * capabilities.pixelRatio * performanceSettings.renderScale
    );
    const canvasHeight = Math.floor(
      height * capabilities.pixelRatio * performanceSettings.renderScale
    );

    // Set actual canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set display size (CSS pixels)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale context to match device pixel ratio
    ctx.scale(
      capabilities.pixelRatio * performanceSettings.renderScale,
      capabilities.pixelRatio * performanceSettings.renderScale
    );

    // Calculate optimal agent count
    const numAgents = calculateOptimalAgentCount(
      canvasWidth,
      canvasHeight,
      capabilities
    );

    // Initialize agents with performance-tuned parameters
    agentsRef.current = Array.from(
      { length: numAgents },
      () =>
        new Agent(
          canvasWidth,
          canvasHeight,
          performanceSettings.sensorDistance,
          performanceSettings.rotationAngle
        )
    );

    // Initialize trail map
    trailMapRef.current = ctx.createImageData(canvasWidth, canvasHeight);

    // Fill with transparent pixels
    for (let i = 0; i < trailMapRef.current.data.length; i += 4) {
      trailMapRef.current.data[i] = 0; // R
      trailMapRef.current.data[i + 1] = 0; // G
      trailMapRef.current.data[i + 2] = 0; // B
      trailMapRef.current.data[i + 3] = 0; // A
    }

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
    if (!ctx || !trailMapRef.current || !deviceCapabilitiesRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Get performance settings for current device
    const capabilities = deviceCapabilitiesRef.current;
    const performanceSettings = getPerformanceSettings(capabilities);

    let lastTime = 0;
    const frameInterval = 1000 / performanceSettings.targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        // Decay trails with device-specific decay rate
        const trailMap = trailMapRef.current!;
        const decayRate = performanceSettings.trailDecay;

        for (let i = 0; i < trailMap.data.length; i += 4) {
          trailMap.data[i] = Math.max(0, trailMap.data[i] * decayRate); // R
          trailMap.data[i + 1] = Math.max(0, trailMap.data[i + 1] * decayRate); // G
          trailMap.data[i + 2] = Math.max(0, trailMap.data[i + 2] * decayRate); // B
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
  }, [isAnimating, currentTheme, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${className}`}
      style={{
        mixBlendMode:
          currentTheme === "dark" ||
          currentTheme === "netflix" ||
          currentTheme === "github"
            ? "screen"
            : "multiply",
        opacity: isResizing ? 0.7 : 1,
        transform: isResizing ? 'scale(0.98)' : 'scale(1)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
      }}
    />
  );
};

export default SlimeMoldCanvas;
