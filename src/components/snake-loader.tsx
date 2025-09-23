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
  const [gameSize] = useState({ width: 50, height: 30 });
  const [cellSize, setCellSize] = useState(24);

  const [snake, setSnake] = useState<Position[]>([
    { x: 25, y: 20 },
    { x: 24, y: 20 },
    { x: 23, y: 20 },
  ]);
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [fruit, setFruit] = useState<Position>({ x: 35, y: 20 });
  const [isExiting, setIsExiting] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const generateFruit = (): Position => ({
    x: Math.floor(Math.random() * gameSize.width),
    y: Math.floor(Math.random() * gameSize.height),
  });

  // Update cellSize based on window size for responsiveness
  useEffect(() => {
    const updateCellSize = () => {
      const newCellSize = Math.min(
        window.innerWidth / gameSize.width,
        window.innerHeight / gameSize.height
      );
      setCellSize(newCellSize);
    };
    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [gameSize]);

  // --- All game logic useEffect hooks remain the same ---
  useEffect(() => {
    if (!isLoading) return;
    const moveSnake = () => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x >= gameSize.width) head.x = 0;
        if (head.x < 0) head.x = gameSize.width - 1;
        if (head.y >= gameSize.height) head.y = 0;
        if (head.y < 0) head.y = gameSize.height - 1;

        newSnake.unshift(head);

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

  useEffect(() => {
    if (!isLoading) return;
    const changeDirection = () => {
      const head = snake[0];
      if (!head) return;
      const possibleMoves = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
      const validMoves = possibleMoves.filter(
        (move) => move.x !== -direction.x || move.y !== -direction.y
      );
      let bestMove = direction;
      let minDistance = Infinity;
      for (const move of validMoves) {
        const newHeadPos = { x: head.x + move.x, y: head.y + move.y };
        const distance =
          Math.abs(newHeadPos.x - fruit.x) + Math.abs(newHeadPos.y - fruit.y);
        if (distance < minDistance) {
          minDistance = distance;
          bestMove = { x: move.x, y: move.y };
        }
      }
      setDirection(bestMove);
    };
    const interval = setInterval(changeDirection, 150);
    return () => clearInterval(interval);
  }, [isLoading, snake, fruit, direction]);

  useEffect(() => {
    if (!isLoading && !isExiting) {
      setIsExiting(true);
      setTimeout(() => onComplete?.(), 600);
    }
  }, [isLoading, isExiting, onComplete]);

  useEffect(() => {
    if (!isLoading) return;
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length
      );
    }, 2000);
    return () => clearInterval(messageInterval);
  }, [isLoading]);

  if (!isLoading && !isExiting) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-8",
          "bg-background transition-opacity duration-600 ease-out",
          isExiting ? "opacity-0" : "opacity-100"
        )}
        aria-label="Loading application"
      >
        {/* Background: Grid and Game Area */}
        <div className="absolute inset-0 z-10 flex items-center justify-center perspective-container overflow-hidden">
          <div className="perspective-grid"></div>
          <div
            className="relative"
            style={{
              width: `${gameSize.width * cellSize}px`,
              height: `${gameSize.height * cellSize}px`,
              transition: "width 0.3s ease, height 0.3s ease",
            }}
          >
            {/* Snake segments */}
            {snake.map((segment, index) => {
              const tongueStyle = {
                left: "50%",
                top: "50%",
                transform: `translateX(-50%) translateY(-50%)`,
              };
              if (direction.x === 1) {
                // Right
                tongueStyle.left = "100%";
                tongueStyle.transform = `translateY(-50%) rotate(90deg)`;
              } else if (direction.x === -1) {
                // Left
                tongueStyle.left = "0%";
                tongueStyle.transform = `translateY(-50%) rotate(-90deg)`;
              } else if (direction.y === 1) {
                // Down
                tongueStyle.top = "100%";
                tongueStyle.transform = `translateX(-50%) rotate(180deg)`;
              } else if (direction.y === -1) {
                // Up
                tongueStyle.top = "0%";
                tongueStyle.transform = `translateX(-50%)`;
              }

              return (
                <div
                  key={index}
                  className={cn(
                    "absolute rounded-sm snake-segment",
                    index === 0 && "snake-head"
                  )}
                  style={{
                    left: `${segment.x * cellSize}px`,
                    top: `${segment.y * cellSize}px`,
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    transition:
                      "left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease",
                  }}
                >
                  {index === 0 && (
                    <div className="snake-tongue" style={tongueStyle}></div>
                  )}
                </div>
              );
            })}

            {/* Fruit */}
            <div
              className="absolute bg-accent rounded-full animate-pulse"
              style={{
                left: `${fruit.x * cellSize}px`,
                top: `${fruit.y * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                boxShadow:
                  "0 0 20px hsl(var(--accent)), inset 0 0 5px hsl(var(--accent))",
                transition:
                  "left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Foreground: Centered Text */}
        <div className="relative z-20 text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary tracking-wider md:text-4xl neon-text">
            ASIM.DEV
          </h1>
          <p className="mt-2 text-sm text-muted-foreground tracking-wide">
            CRAFTING CODE WITH PRECISION
          </p>
          <div className="pt-8">
            <p className="text-xs text-muted-foreground tracking-[0.3em] neon-text">
              {LOADING_MESSAGES[currentMessageIndex]}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
