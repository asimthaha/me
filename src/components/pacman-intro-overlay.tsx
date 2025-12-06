import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PacManIntroOverlayProps {
  onComplete: () => void;
}

const PacManIntroOverlay = ({ onComplete }: PacManIntroOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  // 4 Dots
  const [dotsEaten, setDotsEaten] = useState([false, false, false, false]);

  // SPEED SETTINGS
  const TOTAL_DURATION = 3500;
  const DOT_TIMINGS = [605, 1268, 1950, 2545];
  const dotPositions = [20, 40, 60, 80];

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleStart = () => {
    if (prefersReducedMotion) {
      setShowOverlay(false);
      onComplete();
      return;
    }

    setIsAnimating(true);

    // Schedule dots
    DOT_TIMINGS.forEach((time, index) => {
      setTimeout(() => {
        setDotsEaten((prev) => {
          const newDots = [...prev];
          newDots[index] = true;
          return newDots;
        });
      }, time);
    });

    // End sequence
    setTimeout(() => {
      setShowOverlay(false);
      setTimeout(onComplete, 500);
    }, TOTAL_DURATION);
  };

  if (!showOverlay) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 bg-background flex items-center justify-center transition-opacity duration-500",
        !showOverlay && "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>
      <div className="relative w-full max-w-2xl mx-auto px-6 z-10 flex flex-col items-center">
        {/* GAME TRACK 
            Fixed height ensuring enough room for Pacman
        */}
        <div className="relative w-full max-w-[600px] h-24 mb-8">
          <div
            className={cn(
              "absolute top-1/2 left-0 z-20 -translate-y-1/2 transition-transform ease-linear will-change-transform",
              isAnimating ? "translate-x-[105%]" : "translate-x-0"
            )}
            style={{
              transitionDuration: isAnimating ? `${TOTAL_DURATION}ms` : "0ms",
              width: "100%", // The container spans the full width
              height: "0px", // Height 0 ensures it doesn't block layout, we just want the point in space
            }}
          >
            {/* The Actual Pacman Graphic.
               Since the parent is height 0 and centered, we just center this graphic on that point.
            */}
            <div
              className={cn(
                "pacman w-12 h-12 md:w-16 md:h-16 absolute",
                // This centers the graphic on the parent's anchor point
                "top-1/2 -translate-y-1/2",
                isAnimating && "moving"
              )}
            />
          </div>

          {/* 2. THE DOTS 
             - top-1/2: Moves top edge to center
             - -translate-y-1/2: Centers dot vertically
          */}
          {dotPositions.map((pos, index) => (
            <div
              key={index}
              className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-4 h-4"
              style={{ left: `${pos}%` }}
            >
              <div
                className={cn(
                  "bg-yellow-400 rounded-full transition-all duration-150",
                  dotsEaten[index]
                    ? "opacity-0 scale-0"
                    : "opacity-100 scale-100",
                  "w-3 h-3 md:w-4 md:h-4 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                )}
              />
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <Button
          onClick={handleStart}
          disabled={isAnimating}
          className="pixelated-border-button text-lg px-8 py-6 font-bold tracking-widest hover:scale-105 transition-transform"
        >
          {isAnimating ? "LOADING..." : "START GAME"}
        </Button>
      </div>
    </div>
  );
};

export default PacManIntroOverlay;
