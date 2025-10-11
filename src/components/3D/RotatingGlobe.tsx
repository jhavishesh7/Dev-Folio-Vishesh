import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface RotatingGlobeProps {
  position?: [number, number, number];
}

const RotatingGlobe = ({ position = [0, 0, 0] }: RotatingGlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= 0.002;
      wireframeRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Main globe with gradient */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.15}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere ref={wireframeRef} args={[2.05, 32, 32]}>
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Inner glow */}
      <Sphere args={[1.8, 32, 32]}>
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.1}
        />
      </Sphere>

      {/* Rotating rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
      </mesh>

      <mesh rotation={[0, Math.PI / 4, Math.PI / 2]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
      </mesh>

      {/* Point light at center */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00f0ff" />
    </group>
  );
};

export default RotatingGlobe;
