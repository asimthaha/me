/**
 * Pac-Man Intro Overlay - Fully responsive playful animation
 * Overlays the About Me section with a game-inspired reveal animation
 *
 * Features:
 * - Fully responsive design that adapts to all screen sizes
 * - Dynamic positioning using CSS Grid and Flexbox
 * - Breakpoint-specific animation timing and spacing
 * - Touch-friendly interactions on mobile devices
 * - Optimized performance across different devices
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PacManIntroOverlayProps {
  onComplete: () => void;
}

// Responsive animation timing and spacing utilities
const getResponsiveSettings = (isMobile: boolean, screenWidth: number) => {
  if (screenWidth < 480) {
    // Small mobile
    return {
      gameAreaHeight: "120px",
      pacmanSize: "48px",
      dotSize: "12px",
      dotSpacing: "60px",
      animationDuration: 1800,
      dot1Delay: 1200,
      dot2Delay: 1600,
      pacmanStartPosition: "16px",
      dotsStartPosition: "300px",
    };
  } else if (screenWidth < 768) {
    // Mobile/tablet
    return {
      gameAreaHeight: "140px",
      pacmanSize: "56px",
      dotSize: "14px",
      dotSpacing: "80px",
      animationDuration: 2000,
      dot1Delay: 1400,
      dot2Delay: 1800,
      pacmanStartPosition: "20px",
      dotsStartPosition: "350px",
    };
  } else if (screenWidth < 1024) {
    // Tablet/small desktop
    return {
      gameAreaHeight: "160px",
      pacmanSize: "64px",
      dotSize: "16px",
      dotSpacing: "100px",
      animationDuration: 2200,
      dot1Delay: 1500,
      dot2Delay: 1900,
      pacmanStartPosition: "24px",
      dotsStartPosition: "380px",
    };
  } else {
    // Large desktop
    return {
      gameAreaHeight: "180px",
      pacmanSize: "72px",
      dotSize: "18px",
      dotSpacing: "120px",
      animationDuration: 2400,
      dot1Delay: 1600,
      dot2Delay: 2000,
      pacmanStartPosition: "32px",
      dotsStartPosition: "420px",
    };
  }
};

const PacManIntroOverlay = ({ onComplete }: PacManIntroOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [dotsEaten, setDotsEaten] = useState([false, false]);
  const [responsiveSettings, setResponsiveSettings] = useState(
    getResponsiveSettings(false, 1024)
  );
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive settings and device detection
  useEffect(() => {
    const updateResponsiveSettings = () => {
      const screenWidth = window.innerWidth;
      const newSettings = getResponsiveSettings(isMobile, screenWidth);
      setResponsiveSettings(newSettings);
    };

    updateResponsiveSettings();

    // Listen for resize events to update responsive settings
    window.addEventListener("resize", updateResponsiveSettings);
    return () => window.removeEventListener("resize", updateResponsiveSettings);
  }, [isMobile]);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const handleStart = () => {
    if (prefersReducedMotion) {
      // Skip animation if user prefers reduced motion
      setShowOverlay(false);
      onComplete();
      return;
    }

    setIsAnimating(true);

    // Eat dots at specific intervals based on responsive timing
    setTimeout(() => setDotsEaten([true, false]), responsiveSettings.dot1Delay);
    setTimeout(() => setDotsEaten([true, true]), responsiveSettings.dot2Delay);

    // Start the eating animation sequence
    setTimeout(() => {
      // After animation completes, fade out overlay
      setShowOverlay(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Wait for fade out
    }, responsiveSettings.animationDuration);
  };

  if (!showOverlay) return null;

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 z-50 bg-tertiary flex items-center justify-center transition-opacity duration-500",
          !showOverlay && "opacity-0 pointer-events-none"
        )}
      >
        <div
          ref={containerRef}
          className="relative w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
        >
          {/* Game Area */}
          <div
            className="relative mb-8 sm:mb-10 lg:mb-12 overflow-hidden flex items-center justify-center"
            style={{ height: responsiveSettings.gameAreaHeight }}
          >
            {/* Pac-Man */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
              style={{ left: responsiveSettings.pacmanStartPosition }}
            >
              <div
                className={cn("pacman", isAnimating && "moving")}
                style={{
                  width: responsiveSettings.pacmanSize,
                  height: responsiveSettings.pacmanSize,
                }}
              />
            </div>

            {/* Dots positioned for proper eating timing */}
            <div
              className="absolute top-1/2 -translate-y-1/2 flex items-center"
              style={{ marginLeft: responsiveSettings.dotsStartPosition }}
            >
              <div
                className={cn("dot", dotsEaten[0] && "eaten")}
                style={{
                  width: responsiveSettings.dotSize,
                  height: responsiveSettings.dotSize,
                  marginRight: responsiveSettings.dotSpacing,
                }}
              />
              <div
                className={cn("dot", dotsEaten[1] && "eaten")}
                style={{
                  width: responsiveSettings.dotSize,
                  height: responsiveSettings.dotSize,
                }}
              />
            </div>
          </div>

          {/* START Button - responsive sizing */}
          <div className="text-center">
            <Button
              onClick={handleStart}
              disabled={isAnimating}
              size={isMobile ? "default" : "lg"}
              className={cn(
                "pixelated-border-button font-retro hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50",
                isMobile ? "text-base px-6 py-3" : "text-lg px-8 py-4"
              )}
            >
              {isAnimating ? "LOADING..." : "START"}
            </Button>
          </div>

          {/* Reduced motion message */}
          {prefersReducedMotion && (
            <p className="text-center text-sm text-muted-foreground mt-4 font-retro">
              Animation disabled due to motion preferences
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PacManIntroOverlay;
