import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SnakeLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

interface Position {
  x: number;
  y: number;
}

export const SnakeLoader = ({ isLoading, onComplete }: SnakeLoaderProps) => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 }, // head
    { x: 9, y: 10 }, // body segment 1
    { x: 8, y: 10 }, // body segment 2
  ]);

  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [fruit, setFruit] = useState<Position>({ x: 15, y: 10 });
  const [gameSize] = useState({ width: 30, height: 20 });
  const [isExiting, setIsExiting] = useState(false);

  // Generate random fruit position
  const generateFruit = (): Position => ({
    x: Math.floor(Math.random() * gameSize.width),
    y: Math.floor(Math.random() * gameSize.height),
  });

  // Move snake
  useEffect(() => {
    if (!isLoading) return;

    const moveSnake = () => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };

        // Update head position
        head.x += direction.x;
        head.y += direction.y;

        // Wrap around screen edges
        if (head.x >= gameSize.width) head.x = 0;
        if (head.x < 0) head.x = gameSize.width - 1;
        if (head.y >= gameSize.height) head.y = 0;
        if (head.y < 0) head.y = gameSize.height - 1;

        newSnake.unshift(head);

        // Check if fruit is eaten
        if (head.x === fruit.x && head.y === fruit.y) {
          setFruit(generateFruit());
          // Keep tail (snake grows)
        } else {
          // Remove tail (snake maintains size)
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, fruit, gameSize, isLoading]);

  // Auto-change direction occasionally for dynamic movement
  useEffect(() => {
    if (!isLoading) return;

    const changeDirection = () => {
      const directions = [
        { x: 1, y: 0 }, // right
        { x: -1, y: 0 }, // left
        { x: 0, y: 1 }, // down
        { x: 0, y: -1 }, // up
      ];

      if (Math.random() < 0.3) {
        // 30% chance to change direction
        const newDirection =
          directions[Math.floor(Math.random() * directions.length)];
        setDirection(newDirection);
      }
    };

    const interval = setInterval(changeDirection, 800);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle loading completion
  useEffect(() => {
    if (!isLoading && !isExiting) {
      setIsExiting(true);
      // Wait for exit animation to complete
      setTimeout(() => {
        onComplete?.();
      }, 600);
    }
  }, [isLoading, isExiting, onComplete]);

  if (!isLoading && !isExiting) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background flex items-center justify-center",
        "transition-opacity duration-600 ease-out",
        isExiting ? "opacity-0" : "opacity-100"
      )}
      aria-label="Loading application"
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="text-center space-y-8 max-w-lg mx-auto px-4">
        {/* Brand */}
        <div className="space-y-2">
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-primary tracking-wider">
            ASIM.DEV
          </h1>
          <p className="font-mono text-sm text-muted-foreground tracking-wide">
            CRAFTING CODE WITH PRECISION
          </p>
        </div>

        {/* Snake Game Area */}
        <div className="relative mx-auto">
          <div
            className="relative border border-primary/20 bg-background/50 backdrop-blur-sm"
            style={{
              width: `${gameSize.width * 12}px`,
              height: `${gameSize.height * 12}px`,
            }}
          >
            {/* Snake segments */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={cn(
                  "absolute transition-all duration-150 ease-linear",
                  index === 0
                    ? "bg-primary shadow-[0_0_10px_hsl(var(--primary))]" // Head with glow
                    : "bg-primary/70" // Body segments
                )}
                style={{
                  left: `${segment.x * 12}px`,
                  top: `${segment.y * 12}px`,
                  width: "10px",
                  height: "10px",
                  borderRadius: index === 0 ? "2px" : "1px",
                }}
              />
            ))}

            {/* Fruit */}
            <div
              className="absolute bg-accent shadow-[0_0_8px_hsl(var(--accent))] animate-pulse"
              style={{
                left: `${fruit.x * 12}px`,
                top: `${fruit.y * 12}px`,
                width: "10px",
                height: "10px",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>

        {/* Loading indicator */}
        <div className="space-y-3">
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="font-mono text-xs text-muted-foreground tracking-widest">
            BOOTING_SYSTEM
          </p>
        </div>
      </div>

      {/* Reduced motion styles handled by Tailwind's built-in support */}
    </div>
  );
};
