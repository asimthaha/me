/**
 * Pac-Man Intro Overlay - Fully responsive playful animation
 * Overlays the About Me section with a game-inspired reveal animation
 */

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { useIsMobile } from "@/hooks/use-mobile"; // <-- Removed

interface PacManIntroOverlayProps {
  onComplete: () => void;
}

// Responsive animation *timing* utility.
const getResponsiveTimings = (screenWidth: number) => {
  if (screenWidth < 768) {
    return {
      animationDuration: 2000,
      dot1Delay: 1400,
      dot2Delay: 1800,
    };
  } else if (screenWidth < 1024) {
    return {
      animationDuration: 2200,
      dot1Delay: 1500,
      dot2Delay: 1900,
    };
  } else {
    return {
      animationDuration: 2400,
      dot1Delay: 1600,
      dot2Delay: 2000,
    };
  }
};

// Helper function to get initial timings without window access during SSR
const getInitialTimings = () => {
  if (typeof window === "undefined") {
    return getResponsiveTimings(1024); // Default to desktop
  }
  return getResponsiveTimings(window.innerWidth);
};

const PacManIntroOverlay = ({ onComplete }: PacManIntroOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [dotsEaten, setDotsEaten] = useState([false, false]);
  const [responsiveTimings, setResponsiveTimings] = useState(getInitialTimings);

  // responsive timings on resize (debounced)
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const updateResponsiveTimings = () => {
      const screenWidth = window.innerWidth;
      const newTimings = getResponsiveTimings(screenWidth);
      setResponsiveTimings(newTimings);
    };

    const handleResize = () => {
      clearTimeout(debounceTimer);
      // Debounce to prevent rapid state updates on resize
      debounceTimer = setTimeout(updateResponsiveTimings, 200);
    };

    // Listen for resize events to update responsive settings
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array, runs only on mount

  // Check for reduced motion preference (memoized for performance)
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    []
  );

  const handleStart = () => {
    if (prefersReducedMotion) {
      // Skip animation if user prefers reduced motion
      setShowOverlay(false);
      onComplete();
      return;
    }

    setIsAnimating(true);

    // Eat dots at specific intervals based on responsive timing
    setTimeout(() => setDotsEaten([true, false]), responsiveTimings.dot1Delay);
    setTimeout(() => setDotsEaten([true, true]), responsiveTimings.dot2Delay);

    // Start the eating animation sequence
    setTimeout(() => {
      // After animation completes, fade out overlay
      setShowOverlay(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Wait for fade out
    }, responsiveTimings.animationDuration);
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
          // ref={containerRef} // <-- Removed
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
            className={cn(
              "relative mb-8 sm:mb-10 lg:mb-12 overflow-hidden flex items-center justify-center",
              "h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px]"
            )}
          >
            {/* Pac-Man */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                "left-[16px] sm:left-[20px] md:left-[24px] lg:left-[32px]"
              )}
            >
              <div
                className={cn(
                  "pacman",
                  isAnimating && "moving",
                  "w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px]"
                )}
              />
            </div>

            {/* Dots positioned for proper eating timing */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center",
                "ml-[300px] sm:ml-[350px] md:ml-[380px] lg:ml-[420px]"
              )}
            >
              <div
                className={cn(
                  "dot",
                  dotsEaten[0] && "eaten",
                  "w-[12px] h-[12px] mr-[60px]",
                  "sm:w-[14px] sm:h-[14px] sm:mr-[80px]",
                  "md:w-[16px] md:h-[16px] md:mr-[100px]",
                  "lg:w-[18px] lg:h-[18px] lg:mr-[120px]"
                )}
              />
              <div
                className={cn(
                  "dot",
                  dotsEaten[1] && "eaten",
                  "w-[12px] h-[12px]",
                  "sm:w-[14px] sm:h-[14px]",
                  "md:w-[16px] md:h-[16px]",
                  "lg:w-[18px] lg:h-[18px]"
                )}
              />
            </div>
          </div>

          {/* START Button - responsive sizing */}
          <div className="text-center">
            <Button
              onClick={handleStart}
              disabled={isAnimating}
              className={cn(
                "pixelated-border-button font-retro hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50",
                "text-base px-6 py-3 md:text-lg md:px-8 md:py-4"
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
