/**
 * Pac-Man Intro Overlay - Playful minimalist animation
 * Overlays the About Me section with a game-inspired reveal animation
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SlimeMoldCanvas from "./slime-mold-canvas";

interface PacManIntroOverlayProps {
  onComplete: () => void;
}

const PacManIntroOverlay = ({ onComplete }: PacManIntroOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [dotsEaten, setDotsEaten] = useState([false, false]);
  const [isMobile, setIsMobile] = useState(false);

  // Check for reduced motion preference and screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

    // Eat dots at specific intervals based on movement timing
    setTimeout(() => setDotsEaten([true, false]), 1600); // First dot
    setTimeout(() => setDotsEaten([true, true]), 2400); // Second dot

    // Start the eating animation sequence
    setTimeout(() => {
      // After animation completes, fade out overlay
      setShowOverlay(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Wait for fade out
    }, 3000); // Total animation duration
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
        {/* Slime Mold Background Simulation */}
        <SlimeMoldCanvas
          isAnimating={isAnimating || showOverlay}
          className="opacity-60"
        />

        <div className="relative w-full max-w-2xl mx-auto px-8 z-10">
          {/* Game Area */}
          <div className="relative h-32 mb-12 overflow-hidden">
            {/* Pac-Man */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2">
              <div className={cn("pacman", isAnimating && "moving")} />
            </div>

            {/* Dots positioned for proper eating timing */}
            <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-16">
              <div
                className={cn("dot", dotsEaten[0] && "eaten")}
                style={{ marginLeft: "400px" }}
              />
              <div className={cn("dot", dotsEaten[1] && "eaten")} />
            </div>
          </div>

          {/* START Button - keeping your existing styling */}
          <div className="text-center">
            <Button
              onClick={handleStart}
              disabled={isAnimating}
              size="lg"
              className="pixelated-border-button font-retro text-lg px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
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
