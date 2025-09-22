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
  const gameSize = { x: 20, y: 8, z: 20 };
  const cellSize = 1;

  // Generate random fruit position
  const generateFruit = (): Position3D => ({
    x: Math.floor(Math.random() * gameSize.x) - gameSize.x / 2,
    y: 0,
    z: Math.floor(Math.random() * gameSize.z) - gameSize.z / 2,
  });

  // Initialize Three.js scene
  useEffect(() => {
    if (!isLoading || !mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000011, 20, 60);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 3, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3D Grid - multiple grid planes
    const gridSize = gameSize.x;

    // Horizontal grid (floor)
    const gridHelper = new THREE.GridHelper(gridSize, gridSize);
    gridHelper.material.color.setHex(0x00ffff);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 30);
    pointLight1.position.set(0, 8, 0);
    scene.add(pointLight1);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (mountRef.current && renderer.domElement)
        mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [isLoading]);

  // Create the initial snake meshes only once
  useEffect(() => {
    if (!isLoading || !sceneRef.current) return;
    const scene = sceneRef.current;

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
      mesh.position.set(segment.x, segment.y, segment.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      snakeMeshesRef.current.push(mesh);
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
      }
    });

    return () => {
      snakeMeshesRef.current.forEach((mesh) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material))
          mesh.material.forEach((m) => m.dispose());
        else mesh.material.dispose();
      });
      snakeMeshesRef.current = [];
    };
  }, [isLoading]);

  // Update meshes only when snake grows or fruit changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (snake.length > snakeMeshesRef.current.length) {
      const segment = snake[snake.length - 1];
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0088cc,
        emissive: 0x001122,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const lastMeshPosition =
        snakeMeshesRef.current[snakeMeshesRef.current.length - 1].position;
      mesh.position.copy(lastMeshPosition);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      snakeMeshesRef.current.push(mesh);
    }

    if (fruitMeshRef.current) {
      scene.remove(fruitMeshRef.current);
      fruitMeshRef.current.geometry.dispose();
      if (fruitMeshRef.current.material)
        (fruitMeshRef.current.material as THREE.Material).dispose();
    }
    const fruitGeometry = new THREE.SphereGeometry(0.4, 12, 12);
    const fruitMaterial = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      emissive: 0x330022,
      shininess: 100,
    });
    const fruitMesh = new THREE.Mesh(fruitGeometry, fruitMaterial);
    fruitMesh.position.set(fruit.x, fruit.y, fruit.z);
    fruitMesh.castShadow = true;
    scene.add(fruitMesh);
    fruitMeshRef.current = fruitMesh;
  }, [snake.length, fruit]);

  // Snake movement logic
  useEffect(() => {
    if (!isLoading) return;
    const moveSnake = () => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.z += direction.z;
        if (head.x >= gameSize.x / 2) head.x = -gameSize.x / 2;
        if (head.x < -gameSize.x / 2) head.x = gameSize.x / 2 - 1;
        if (head.z >= gameSize.z / 2) head.z = -gameSize.z / 2;
        if (head.z < -gameSize.z / 2) head.z = gameSize.z / 2 - 1;
        newSnake.unshift(head);
        if (head.x === fruit.x && head.y === fruit.y && head.z === fruit.z) {
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

  // AI direction changing
  useEffect(() => {
    if (!isLoading) return;
    const changeDirection = () => {
      const head = snake[0];
      if (!head) return;
      const possibleMoves = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 },
      ];
      const validMoves = possibleMoves.filter(
        (move) => move.x !== -direction.x || move.z !== -direction.z
      );
      let bestMove = direction;
      let minDistance = Infinity;
      for (const move of validMoves) {
        const newHeadPos = {
          x: head.x + move.x,
          y: head.y + move.y,
          z: head.z + move.z,
        };
        const distance =
          Math.abs(newHeadPos.x - fruit.x) +
          Math.abs(newHeadPos.y - fruit.y) +
          Math.abs(newHeadPos.z - fruit.z);
        if (distance < minDistance) {
          minDistance = distance;
          bestMove = move;
        }
      }
      setDirection(bestMove);
    };
    const interval = setInterval(changeDirection, 150);
    return () => clearInterval(interval);
  }, [isLoading, snake, fruit, direction]);

  // Animation loop for rendering, camera, and smooth movement
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
      const interpolationFactor = 0.15;

      // Smoothly move each snake segment using interpolation
      snakeMeshesRef.current.forEach((mesh, index) => {
        if (snake[index]) {
          const targetPosition = new THREE.Vector3(
            snake[index].x * cellSize,
            snake[index].y * cellSize,
            snake[index].z * cellSize
          );
          mesh.position.lerp(targetPosition, interpolationFactor);
          if (index === 0) {
            const targetDirection = new THREE.Vector3(
              direction.x,
              direction.y,
              direction.z
            );
            if (targetDirection.lengthSq() > 0) {
              const targetQuaternion = new THREE.Quaternion();
              const matrix = new THREE.Matrix4();
              matrix.lookAt(
                mesh.position,
                mesh.position.clone().add(targetDirection),
                mesh.up
              );
              targetQuaternion.setFromRotationMatrix(matrix);
              mesh.quaternion.slerp(targetQuaternion, interpolationFactor);
            }
          }
        }
      });

      // Fruit animation
      if (fruitMeshRef.current) {
        fruitMeshRef.current.rotation.y += 0.02;
        // fruitMeshRef.current.position.y += Math.sin(time * 5) * 0.01;
      }

      // Camera animation
      // const cameraTime = time * 0.3;
      // cameraRef.current.position.x = Math.cos(cameraTime) * 25;
      // cameraRef.current.position.z = Math.sin(cameraTime) * 25;
      // cameraRef.current.position.y = 12 + Math.sin(cameraTime * 0.7) * 3;
      // cameraRef.current.lookAt(0, 3, 0);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [isLoading, snake, direction]);

  // Handle loading completion
  useEffect(() => {
    if (!isLoading && !isExiting) {
      setIsExiting(true);
      setTimeout(() => onComplete?.(), 600);
    }
  }, [isLoading, isExiting, onComplete]);

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
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
        <div
          ref={mountRef}
          className="absolute inset-0 z-10"
          style={{ background: "transparent" }}
        />
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
