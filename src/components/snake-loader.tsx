import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// The list of messages to cycle through
const LOADING_MESSAGES = [
  "INITIALIZING_CORE...",
  "COMPILING_ASSETS...",
  "ESTABLISHING_CONNECTION...",
  "DECRYPTING_MODULES...",
  "SYNCHRONIZING_DATASTREAMS...",
  "FINALIZING_RENDER...",
];

interface SnakeLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

interface Position {
  x: number;
  y: number;
}

export const SnakeLoader = ({ isLoading, onComplete }: SnakeLoaderProps) => {
  // Increased cell size for a bigger snake
  const cellSize = 24;

  // Adjusted game size to better fill a larger background area
  const [gameSize] = useState({ width: 50, height: 30 });

  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [fruit, setFruit] = useState<Position>({ x: 15, y: 10 });
  const [isExiting, setIsExiting] = useState(false);

  // State for cycling through loading messages
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

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
    /* ... existing onComplete logic ... */
  }, [isLoading, isExiting, onComplete]);

  // **NEW**: useEffect to cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length
      );
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(messageInterval);
  }, [isLoading]);

  if (!isLoading && !isExiting) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background font-mono",
        "transition-opacity duration-600 ease-out",
        isExiting ? "opacity-0" : "opacity-100"
      )}
      aria-label="Loading application"
    >
      {/* BACKGROUND: Snake animation layer */}
      {/* Increased opacity, removed blur, and added flex centering */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-25">
        <div
          className="relative"
          style={{
            width: `${gameSize.width * cellSize}px`,
            height: `${gameSize.height * cellSize}px`,
          }}
        >
          {/* Snake segments */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={cn(
                "absolute transition-all duration-150 ease-linear",
                index === 0
                  ? "bg-primary shadow-[0_0_15px_hsl(var(--primary))]"
                  : "bg-primary/70"
              )}
              style={{
                left: `${segment.x * cellSize}px`,
                top: `${segment.y * cellSize}px`,
                width: `${cellSize - 2}px`,
                height: `${cellSize - 2}px`,
                borderRadius: "4px",
              }}
            />
          ))}
          {/* Fruit */}
          <div
            className="absolute bg-accent shadow-[0_0_12px_hsl(var(--accent))]"
            style={{
              left: `${fruit.x * cellSize}px`,
              top: `${fruit.y * cellSize}px`,
              width: `${cellSize - 2}px`,
              height: `${cellSize - 2}px`,
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      {/* FOREGROUND: Text content layer */}
      {/* REMOVED 'bg-background/80' to make the background visible */}
      <div className="relative z-20 flex h-full w-full items-center justify-center backdrop-blur-[2px]">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary tracking-wider md:text-4xl">
            ASIM.DEV
          </h1>
          <p className="text-sm text-muted-foreground tracking-wide">
            CRAFTING CODE WITH PRECISION
          </p>
          <div className="pt-8">
            <p className="text-xs text-muted-foreground tracking-[0.3em]">
              {LOADING_MESSAGES[currentMessageIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
