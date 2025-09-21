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
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
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

  // Move snake based on the current direction
  useEffect(() => {
    if (!isLoading) return;

    const moveSnake = () => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };

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
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, fruit, gameSize, isLoading]);

  // **CORRECTED LOGIC**: Intelligently change direction to chase the fruit
  useEffect(() => {
    if (!isLoading) return;

    const changeDirection = () => {
      const head = snake[0];
      if (!head) return;

      const possibleMoves = [
        { x: 1, y: 0 }, // right
        { x: -1, y: 0 }, // left
        { x: 0, y: 1 }, // down
        { x: 0, y: -1 }, // up
      ];

      // 1. Filter out the move that would be a direct reversal to prevent the snake from eating itself.
      const validMoves = possibleMoves.filter(
        (move) => move.x !== -direction.x || move.y !== -direction.y
      );

      let bestMove = direction;
      let minDistance = Infinity;

      // 2. Evaluate each valid move to find which one gets the head closest to the fruit.
      for (const move of validMoves) {
        const newHeadPos = { x: head.x + move.x, y: head.y + move.y };
        // Using Manhattan distance for performance: |x2 - x1| + |y2 - y1|
        const distance =
          Math.abs(newHeadPos.x - fruit.x) + Math.abs(newHeadPos.y - fruit.y);

        if (distance < minDistance) {
          minDistance = distance;
          bestMove = { x: move.x, y: move.y };
        }
      }

      // 3. Set the best move as the new direction.
      setDirection(bestMove);
    };

    // Re-evaluate the direction at the same speed as the snake's movement for optimal pathfinding.
    const interval = setInterval(changeDirection, 150);
    return () => clearInterval(interval);
  }, [isLoading, snake, fruit, direction]);

  // Handle loading completion
  useEffect(() => {
    if (!isLoading && !isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        onComplete?.();
      }, 600);
    }
  }, [isLoading, isExiting, onComplete]);

  if (!isLoading && !isExiting) return null;

  // The JSX for rendering remains the same
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background flex items-center justify-center",
        "transition-opacity duration-600 ease-out",
        isExiting ? "opacity-0" : "opacity-100"
      )}
      aria-label="Loading application"
    >
      {/* ... rest of the JSX ... */}
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
        <div className="space-y-2">
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-primary tracking-wider">
            ASIM.DEV
          </h1>
          <p className="font-mono text-sm text-muted-foreground tracking-wide">
            CRAFTING CODE WITH PRECISION
          </p>
        </div>
        <div className="relative mx-auto">
          <div
            className="relative border border-primary/20 bg-background/50 backdrop-blur-sm"
            style={{
              width: `${gameSize.width * 12}px`,
              height: `${gameSize.height * 12}px`,
            }}
          >
            {snake.map((segment, index) => (
              <div
                key={index}
                className={cn(
                  "absolute transition-all duration-150 ease-linear",
                  index === 0
                    ? "bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                    : "bg-primary/70"
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
    </div>
  );
};
