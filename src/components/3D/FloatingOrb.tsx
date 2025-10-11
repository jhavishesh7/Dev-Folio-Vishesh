import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingOrbProps {
  position: [number, number, number];
  color: string;
  scale?: number;
}

const FloatingOrb = ({ position, color, scale = 0.5 }: FloatingOrbProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.z += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.1}
        wireframe={false}
      />
      {/* Outer glow sphere */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
    </mesh>
  );
};

export default FloatingOrb;
