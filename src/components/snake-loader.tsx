import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import * as THREE from "three";

// Loading messages to cycle through
const LOADING_MESSAGES = [
  "INITIALIZING_CORE...",
  "COMPILING_ASSETS...",
  "ESTABLISHING_CONNECTION...",
  "DECRYPTING_MODULES...",
  "SYNCHRONIZING_DATASTREAMS...",
  "FINALIZING_RENDER...",
];

// Custom CSS for Orbitron font and neon effects
const componentStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');

  .font-orbitron {
    font-family: 'Orbitron', sans-serif;
  }

  .neon-text {
    text-shadow: 0 0 8px hsl(var(--primary) / 0.8), 0 0 12px hsl(var(--primary) / 0.5);
  }

  .loading-canvas {
    background: radial-gradient(ellipse at center, hsl(var(--background) / 0.8) 0%, hsl(var(--background)) 100%);
  }
`;

interface SnakeLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

interface Position3D {
  x: number;
  y: number;
  z: number;
}

export const SnakeLoader = ({ isLoading, onComplete }: SnakeLoaderProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const snakeMeshesRef = useRef<THREE.Mesh[]>([]);
  const fruitMeshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const [isExiting, setIsExiting] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // 3D Snake game state
  const [snake, setSnake] = useState<Position3D[]>([
    { x: 0, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: -2, y: 0, z: 0 },
  ]);
  const [direction, setDirection] = useState<Position3D>({ x: 1, y: 0, z: 0 });
  const [fruit, setFruit] = useState<Position3D>({ x: 5, y: 0, z: 3 });

  // Game parameters
  const gameSize = { x: 20, y: 8, z: 20 }; // 3D game bounds
  const cellSize = 1;

  // Generate random fruit position in 3D space
  const generateFruit = (): Position3D => ({
    x: Math.floor(Math.random() * gameSize.x) - gameSize.x / 2,
    y: 0,
    z: Math.floor(Math.random() * gameSize.z) - gameSize.z / 2,
  });

  // Initialize Three.js scene
  useEffect(() => {
    if (!isLoading || !mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000011, 20, 60);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // 3D Grid - multiple grid planes
    const gridSize = gameSize.x;

    // Horizontal grid (floor)
    const gridHelper = new THREE.GridHelper(gridSize, gridSize);
    gridHelper.material.color.setHex(0x00ffff);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Vertical grids for 3D effect
    const verticalGrid1 = new THREE.GridHelper(gridSize, gridSize);
    verticalGrid1.rotateZ(Math.PI / 2);
    verticalGrid1.position.set(-gameSize.x / 2, gameSize.y / 2, 0);
    verticalGrid1.material.color.setHex(0x00ffff);
    verticalGrid1.material.opacity = 0.1;
    verticalGrid1.material.transparent = true;
    scene.add(verticalGrid1);

    const verticalGrid2 = new THREE.GridHelper(gridSize, gridSize);
    verticalGrid2.rotateX(Math.PI / 2);
    verticalGrid2.position.set(0, gameSize.y / 2, -gameSize.z / 2);
    verticalGrid2.material.color.setHex(0x00ffff);
    verticalGrid2.material.opacity = 0.1;
    verticalGrid2.material.transparent = true;
    scene.add(verticalGrid2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Point lights for neon effect
    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 30);
    pointLight1.position.set(0, 8, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1.5, 20);
    pointLight2.position.set(-8, 4, -8);
    scene.add(pointLight2);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isLoading]);

  // Snake movement logic (3D snake game)
  useEffect(() => {
    if (!isLoading) return;

    const moveSnake = () => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };

        // Move head in current direction
        head.x += direction.x;
        // head.y += direction.y;
        head.z += direction.z;

        // Wrap around edges (3D boundaries)
        if (head.x >= gameSize.x / 2) head.x = -gameSize.x / 2;
        if (head.x < -gameSize.x / 2) head.x = gameSize.x / 2 - 1;
        if (head.z >= gameSize.z / 2) head.z = -gameSize.z / 2;
        if (head.z < -gameSize.z / 2) head.z = gameSize.z / 2 - 1;

        newSnake.unshift(head);

        // Check if fruit is eaten
        if (head.x === fruit.x && head.y === fruit.y && head.z === fruit.z) {
          setFruit(generateFruit());
          // Keep tail (snake grows)
        } else {
          // Remove tail (snake maintains size)
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 300); // Slower for better visibility
    return () => clearInterval(interval);
  }, [direction, fruit, gameSize, isLoading]);

  // Smart direction changing to chase fruit in 3D
  useEffect(() => {
    if (!isLoading) return;

    const changeDirection = () => {
      const head = snake[0];
      if (!head) return;

      const possibleMoves = [
        { x: 1, y: 0, z: 0 }, // right
        { x: -1, y: 0, z: 0 }, // left
        { x: 0, y: 0, z: 1 }, // forward
        { x: 0, y: 0, z: -1 }, // backward
      ];

      // Filter out moves that would be direct reversals
      const validMoves = possibleMoves.filter(
        (move) =>
          move.x !== -direction.x ||
          // move.y !== -direction.y ||
          move.z !== -direction.z
      );

      let bestMove = direction;
      let minDistance = Infinity;

      // Find the move that gets closest to the fruit
      for (const move of validMoves) {
        const newHeadPos = {
          x: head.x + move.x,
          y: head.y + move.y,
          z: head.z + move.z,
        };

        // 3D Manhattan distance
        const distance =
          Math.abs(newHeadPos.x - fruit.x) +
          Math.abs(newHeadPos.y - fruit.y) +
          Math.abs(newHeadPos.z - fruit.z);

        if (distance < minDistance) {
          minDistance = distance;
          bestMove = { x: move.x, y: move.y, z: move.z };
        }
      }

      setDirection(bestMove);
    };

    const interval = setInterval(changeDirection, 300);
    return () => clearInterval(interval);
  }, [isLoading, snake, fruit, direction]);

  // Update 3D meshes based on game state
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    // Clear existing snake meshes
    snakeMeshesRef.current.forEach((mesh) => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => mat.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    snakeMeshesRef.current = [];

    // Create new snake meshes
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const geometry = isHead
        ? new THREE.SphereGeometry(0.6, 12, 12)
        : new THREE.BoxGeometry(0.8, 0.8, 0.8);

      const material = new THREE.MeshPhongMaterial({
        color: isHead ? 0x00ffff : 0x0088cc,
        emissive: isHead ? 0x003344 : 0x001122,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        segment.x * cellSize,
        segment.y * cellSize,
        segment.z * cellSize
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add eyes to head
      if (isHead) {
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: 0x222222,
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 0.2, 0.4);
        mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 0.2, 0.4);
        mesh.add(rightEye);

        // Make head face movement direction
        if (direction.x !== 0 || direction.z !== 0) {
          mesh.lookAt(
            mesh.position.x + direction.x,
            mesh.position.y + direction.y,
            mesh.position.z + direction.z
          );
        }
      }

      scene.add(mesh);
      snakeMeshesRef.current.push(mesh);
    });

    // Update fruit mesh
    if (fruitMeshRef.current) {
      scene.remove(fruitMeshRef.current);
      fruitMeshRef.current.geometry.dispose();
      // fruitMeshRef.current.material.dispose();
    }

    const fruitGeometry = new THREE.SphereGeometry(0.4, 12, 12);
    const fruitMaterial = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      emissive: 0x330022,
      shininess: 100,
      transparent: true,
      opacity: 0.8,
    });

    const fruitMesh = new THREE.Mesh(fruitGeometry, fruitMaterial);
    fruitMesh.position.set(
      fruit.x * cellSize,
      fruit.y * cellSize,
      fruit.z * cellSize
    );
    fruitMesh.castShadow = true;
    scene.add(fruitMesh);
    fruitMeshRef.current = fruitMesh;
  }, [snake, fruit, direction]);

  // Animation loop for rendering and camera movement
  useEffect(() => {
    if (
      !isLoading ||
      !sceneRef.current ||
      !rendererRef.current ||
      !cameraRef.current
    )
      return;

    let time = 0;

    const animate = () => {
      if (!isLoading) return;

      time += 0.01;

      // Fruit animation
      if (fruitMeshRef.current) {
        fruitMeshRef.current.rotation.x += 0.02;
        fruitMeshRef.current.rotation.y += 0.02;
        fruitMeshRef.current.position.y += Math.sin(time * 3) * 0.02;
      }

      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isLoading]);

  // Handle loading completion
  useEffect(() => {
    if (!isLoading && !isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        onComplete?.();
      }, 600);
    }
  }, [isLoading, isExiting, onComplete]);

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length
      );
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [isLoading]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isLoading && !isExiting) return null;

  return (
    <>
      <style>{componentStyles}</style>
      <div
        className={cn(
          "fixed inset-0 z-50 font-orbitron loading-canvas",
          "transition-opacity duration-600 ease-out",
          isExiting ? "opacity-0" : "opacity-100"
        )}
        aria-label="Loading application"
      >
        {/* Three.js Canvas Container */}
        <div
          ref={mountRef}
          className="absolute inset-0 z-10"
          style={{ background: "transparent" }}
        />

        {/* Centered Text Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-6 px-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-primary tracking-wider md:text-6xl neon-text">
                ASIM.DEV
              </h1>
              <p className="text-sm text-muted-foreground tracking-wide md:text-base">
                CRAFTING CODE WITH PRECISION
              </p>
            </div>

            <div className="pt-8 space-y-4">
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full bg-primary animate-pulse"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      boxShadow: "0 0 10px hsl(var(--primary))",
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground tracking-[0.3em] md:text-sm neon-text">
                {LOADING_MESSAGES[currentMessageIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
