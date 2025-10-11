import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

interface ProjectCubeProps {
  position: [number, number, number];
  color: string;
  index: number;
}

const ProjectCube = ({ position, color, index }: ProjectCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.3;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime + index) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.5;
    }
  });

  return (
    <RoundedBox 
      ref={meshRef} 
      args={[1, 1, 1]} 
      position={position} 
      radius={0.1}
      smoothness={4}
    >
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.7}
        roughness={0.3}
      />
    </RoundedBox>
  );
};

export default ProjectCube;
