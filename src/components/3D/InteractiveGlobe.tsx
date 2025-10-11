import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

const InteractiveGlobe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current && wireframeRef.current && innerCoreRef.current && ringRef.current) {
      // Smooth rotation based on pointer position
      const targetRotationY = pointer.x * 0.5;
      const targetRotationX = -pointer.y * 0.3;
      
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
      
      // Enhanced auto-rotation with sine wave
      meshRef.current.rotation.y += 0.002;
      
      // Wireframe follows with slight delay and counter-rotation
      wireframeRef.current.rotation.y = meshRef.current.rotation.y + 0.15;
      wireframeRef.current.rotation.x = meshRef.current.rotation.x - 0.08;
      wireframeRef.current.rotation.z += 0.001;
      
      // Inner core rotates independently
      innerCoreRef.current.rotation.y -= 0.003;
      innerCoreRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 2) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
      
      // Ring rotation
      ringRef.current.rotation.z += 0.005;
      ringRef.current.rotation.x = Math.PI / 2.5 + Math.sin(time * 0.8) * 0.1;
    }
  });

  return (
    <group 
      position={[0, 0, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main globe */}
      <Sphere ref={meshRef} args={[1.3, 64, 64]}>
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={hovered ? 0.3 : 0.18}
          transparent
          opacity={hovered ? 0.18 : 0.12}
          roughness={0.3}
          metalness={0.9}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere ref={wireframeRef} args={[1.35, 32, 32]}>
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={hovered ? 0.4 : 0.28}
        />
      </Sphere>

      {/* Inner core */}
      <Sphere ref={innerCoreRef} args={[1.1, 32, 32]}>
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={hovered ? 0.2 : 0.1}
          transparent
          opacity={hovered ? 0.12 : 0.08}
        />
      </Sphere>

      {/* Orbital ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 16, 100]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          transparent 
          opacity={hovered ? 0.5 : 0.35}
        />
      </mesh>
      
      {/* Secondary ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.6, 0.01, 16, 100]} />
        <meshBasicMaterial 
          color="#a855f7" 
          transparent 
          opacity={hovered ? 0.4 : 0.25}
        />
      </mesh>

      {/* Accent lights */}
      <pointLight position={[0, 0, 0]} intensity={hovered ? 0.5 : 0.3} color="#00f0ff" distance={6} />
      <pointLight position={[2, 2, 2]} intensity={0.2} color="#a855f7" distance={4} />
      <pointLight position={[-2, -2, -2]} intensity={0.2} color="#00f0ff" distance={4} />
    </group>
  );
};

export default InteractiveGlobe;
