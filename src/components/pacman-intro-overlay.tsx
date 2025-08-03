/**
 * Pac-Man Intro Overlay - Playful minimalist animation
 * Overlays the About Me section with a game-inspired reveal animation
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PacManIntroOverlayProps {
  onComplete: () => void;
}

const PacManIntroOverlay = ({ onComplete }: PacManIntroOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleStart = () => {
    if (prefersReducedMotion) {
      // Skip animation if user prefers reduced motion
      setShowOverlay(false);
      onComplete();
      return;
    }

    setIsAnimating(true);
    
    // Start the eating animation sequence
    setTimeout(() => {
      // After animation completes, fade out overlay
      setShowOverlay(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Wait for fade out
    }, 2500); // Animation duration
  };

  if (!showOverlay) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background flex items-center justify-center transition-opacity duration-500",
      !showOverlay && "opacity-0 pointer-events-none"
    )}>
      <div className="relative w-full max-w-2xl mx-auto px-8">
        {/* Game Area */}
        <div className="relative h-32 mb-12 overflow-hidden">
          {/* Pac-Man */}
          <div className={cn(
            "absolute left-8 top-1/2 -translate-y-1/2 transition-transform duration-2000 ease-in-out",
            isAnimating && "translate-x-96"
          )}>
            <div className="pacman">
              <div className="pacman-mouth"></div>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute right-32 top-1/2 -translate-y-1/2 flex gap-16">
            <div className={cn(
              "dot transition-opacity duration-300",
              isAnimating && "opacity-0 delay-1000"
            )}></div>
            <div className={cn(
              "dot transition-opacity duration-300",
              isAnimating && "opacity-0 delay-1500"
            )}></div>
          </div>
        </div>

        {/* START Button */}
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
  );
};

export default PacManIntroOverlay;