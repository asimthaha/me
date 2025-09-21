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

// Custom CSS for the 3D perspective grid, font, and neon effects
const componentStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');

  .font-orbitron {
    font-family: 'Orbitron', sans-serif;
  }

  /* Main container for the perspective effect */
  .perspective-container {
    perspective: 1000px;
  }

  /* The 3D grid */
  .perspective-grid {
    width: 150%;
    height: 150%;
    position: absolute;
    top: -25%; /* Pushes the grid up to fill the perspective */
    left: -25%;
    background-image:
      linear-gradient(to right, hsl(var(--primary) / 0.15) 1px, transparent 1px),
      linear-gradient(to bottom, hsl(var(--primary) / 0.15) 1px, transparent 1px);
    background-size: 4rem 4rem;
    transform: rotateX(60deg); /* Tilts the grid */
    transform-origin: center;
    mask-image: linear-gradient(to bottom, white 20%, transparent 80%);
  }

  /* General neon glow for text */
  .neon-text {
    text-shadow: 0 0 8px hsl(var(--primary) / 0.8), 0 0 12px hsl(var(--primary) / 0.5);
  }

  /* Base style for a 3D-looking snake segment */
  .snake-segment {
    background-color: hsl(var(--primary) / 0.8);
    /* Create a 3D look with a lighter top border and darker side/bottom shadows */
    border-top: 1px solid hsl(var(--primary) / 1);
    box-shadow:
      inset 0 2px 2px hsl(var(--primary) / 1), /* Inner top highlight */
      0 2px 0 0px hsl(var(--primary) / 0.4); /* Bottom edge */
    transition: all 0.15s linear;
  }

  /* Brighter head with a stronger glow */
  .snake-head {
    background-color: hsl(var(--primary) / 1);
    box-shadow:
      inset 0 2px 2px hsl(var(--primary) / 1),
      0 2px 0 0px hsl(var(--primary) / 0.4),
      0 0 20px hsl(var(--primary) / 0.8); /* Outer glow */
    z-index: 10;
  }

  /* Eyes for the snake head */
  .snake-head::before,
  .snake-head::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 5px white;
    top: 50%;
    transform: translateY(-50%);
  }
  .snake-head::before { left: 5px; }
  .snake-head::after { right: 5px; }

  /* Flickering tongue */
  @keyframes tongue-flicker {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.5); }
  }
  .snake-tongue {
    position: absolute;
    width: 2px;
    height: 8px;
    background: hsl(350 100% 60%);
    animation: tongue-flicker 0.3s infinite;
    transform-origin: top;
  }
`;

interface SnakeLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

interface Position {
  x: number;
  y: number;
}

export const SnakeLoader = ({ isLoading, onComplete }: SnakeLoaderProps) => {
  const cellSize = 24;
  const [gameSize] = useState({ width: 50, height: 30 });

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
      <style>{componentStyles}</style>
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-8 font-orbitron",
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
