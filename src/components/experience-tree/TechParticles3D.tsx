import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { experienceNodes } from "@/lib/data";

/**
 * Individual floating particle representing a technology
 */
function TechParticle({ position, text, speed }: { position: [number, number, number]; text: string; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      
      // Gentle rotation
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Glowing sphere */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#3B82F6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Technology label */}
      <Text
        ref={textRef}
        position={[position[0], position[1] + 0.2, position[2]]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {text}
      </Text>
    </group>
  );
}

/**
 * 3D scene with floating tech particles
 */
function ParticleScene() {
  // Extract all unique technologies from experience nodes
  const technologies = useMemo(() => {
    const techSet = new Set<string>();
    experienceNodes.forEach((node) => {
      node.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet);
  }, []);

  // Generate random positions for particles in a cylindrical volume
  const particles = useMemo(() => {
    return technologies.map((tech, index) => {
      const angle = (index / technologies.length) * Math.PI * 2;
      const radius = 2 + Math.random() * 1.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 8;
      
      return {
        position: [x, y, z] as [number, number, number],
        text: tech,
        speed: 0.5 + Math.random() * 0.5,
      };
    });
  }, [technologies]);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Directional light */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Point light for glow effect */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#3B82F6" />
      
      {/* Render all particles */}
      {particles.map((particle, index) => (
        <TechParticle
          key={index}
          position={particle.position}
          text={particle.text}
          speed={particle.speed}
        />
      ))}
    </>
  );
}

/**
 * 3D Tech Particles Component
 * Displays floating technology tags in a 3D space
 */
const TechParticles3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ParticleScene />
      </Canvas>
    </div>
  );
};

export default TechParticles3D;
