import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PacmanIntroOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

/**
 * Pacman Intro Overlay Component  
 * Fun transition from snake loader to welcome overlay
 */
export const PacmanIntroOverlay = ({ isVisible, onComplete }: PacmanIntroOverlayProps) => {
  const [pacmanPosition, setPacmanPosition] = useState(-100);
  const [dotsEaten, setDotsEaten] = useState(0);
  
  const totalDots = 5;

  useEffect(() => {
    if (!isVisible) return;

    const animationDuration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Pacman moves from left (-100px) to right (window width + 100px)
      const windowWidth = window.innerWidth;
      const newPosition = -100 + (windowWidth + 200) * progress;
      setPacmanPosition(newPosition);
      
      // Eat dots as pacman moves
      const dotsToEat = Math.floor(progress * totalDots);
      setDotsEaten(dotsToEat);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        setTimeout(onComplete, 500);
      }
    };

    animate();
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40 bg-background/90 backdrop-blur-sm flex items-center justify-center overflow-hidden">
      {/* Dots to be eaten */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-center space-x-16">
        {Array.from({ length: totalDots }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 bg-primary rounded-full transition-opacity duration-200",
              index < dotsEaten ? "opacity-0" : "opacity-100"
            )}
          />
        ))}
      </div>

      {/* Pacman */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 text-4xl"
        style={{
          left: `${pacmanPosition}px`,
          transition: 'none'
        }}
      >
        <div className="animate-pulse">
          <span className="text-primary">●</span>
          <span className="ml-1 text-accent animate-bounce">ᗧ</span>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground tracking-wider">
          LOADING_EXPERIENCE...
        </p>
      </div>
    </div>
  );
};