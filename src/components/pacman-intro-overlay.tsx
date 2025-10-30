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
          "absolute inset-0 z-50 bg-background flex items-center justify-center transition-opacity duration-500",
          !showOverlay && "opacity-0 pointer-events-none"
        )}
      >
        <div
          ref={containerRef}
          className="relative w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            {/* Cloud 1 */}
            <div
              className="absolute text-muted-foreground/30 animate-float"
              style={{
                top: "-10%",
                left: "-15%",
                animationDelay: "0s",
                animationDuration: "12s",
                opacity: 0.4,
              }}
            >
              <svg
                className="w-32 h-auto lg:w-40"
                viewBox="0 0 120 70"
                fill="currentColor"
              >
                <path d="M20 45c-6-1-11-7-11-14 0-8 7-15 15-15 1-6 6-10 13-10 4 0 8 2 10 5 2-1 4-1 6-1 8 0 15 7 15 15 0 3-1 7-3 9 5 1 9 6 9 12 0 7-5 12-12 12H25c-4 0-8-3-8-7 0-3 1-5 3-6z" />
              </svg>
            </div>

            {/* Cloud 2 */}
            <div
              className="absolute text-muted-foreground/20 animate-float hidden lg:block"
              style={{
                bottom: "8%",
                right: "-18%",
                animationDelay: "6s",
                animationDuration: "20s",
                opacity: 0.3,
              }}
            >
              <svg
                className="w-20 h-auto"
                viewBox="0 0 80 50"
                fill="currentColor"
              >
                <path d="M15 30c-4-1-7-4-7-9 0-5 4-9 9-9 1-3 4-6 8-6 3 0 5 1 6 3 1 0 3-1 4-1 5 0 9 4 9 9 0 2-1 4-2 6 3 1 6 4 6 7 0 4-3 7-7 7H18c-2 0-5-2-5-4 0-2 1-3 2-3z" />
              </svg>
            </div>
          </div>
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
