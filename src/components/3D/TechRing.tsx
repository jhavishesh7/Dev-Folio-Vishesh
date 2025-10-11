import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TechRingProps {
  position?: [number, number, number];
  color?: string;
  radius?: number;
}

const TechRing = ({ position = [0, 0, 0], color = "#00f0ff", radius = 2 }: TechRingProps) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= 0.015;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.8, 0.03, 16, 100]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export default TechRing;
