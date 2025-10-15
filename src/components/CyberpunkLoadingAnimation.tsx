import { useEffect, useRef, useState, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

interface CyberpunkLoadingAnimationProps {
  onComplete: () => void;
}

// Matrix Rain - Optimized with delta time
const MatrixRain = memo(() => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500;
  const velocityRef = useRef<Float32Array>();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      vel[i] = 0.05 + Math.random() * 0.1;
    }
    velocityRef.current = vel;
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !velocityRef.current) return;
    
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const vel = velocityRef.current;
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] -= vel[i] * delta * 60;
      if (pos[i * 3 + 1] < -25) pos[i * 3 + 1] = 25;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        transparent
        color="#00ff41"
        size={0.12}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
});

// Wireframe Cube - Optimized
const WireframeCube = memo(({ stage }: { stage: number }) => {
  const cubeRef = useRef<THREE.Group>(null);
  const [formed, setFormed] = useState(false);

  useFrame((state) => {
    if (!cubeRef.current || !formed) return;
    const time = state.clock.elapsedTime;
    cubeRef.current.rotation.x = time * 0.3;
    cubeRef.current.rotation.y = time * 0.5;
    cubeRef.current.rotation.z = time * 0.2;
  });

  useEffect(() => {
    if (stage >= 1) setTimeout(() => setFormed(true), 1000);
  }, [stage]);

  if (stage < 1) return null;

  const scale = 2;
  const edges = [
    [[-1*scale, -1*scale, 1*scale], [1*scale, -1*scale, 1*scale]],
    [[1*scale, -1*scale, 1*scale], [1*scale, 1*scale, 1*scale]],
    [[1*scale, 1*scale, 1*scale], [-1*scale, 1*scale, 1*scale]],
    [[-1*scale, 1*scale, 1*scale], [-1*scale, -1*scale, 1*scale]],
    [[-1*scale, -1*scale, -1*scale], [1*scale, -1*scale, -1*scale]],
    [[1*scale, -1*scale, -1*scale], [1*scale, 1*scale, -1*scale]],
    [[1*scale, 1*scale, -1*scale], [-1*scale, 1*scale, -1*scale]],
    [[-1*scale, 1*scale, -1*scale], [-1*scale, -1*scale, -1*scale]],
    [[-1*scale, -1*scale, -1*scale], [-1*scale, -1*scale, 1*scale]],
    [[1*scale, -1*scale, -1*scale], [1*scale, -1*scale, 1*scale]],
    [[1*scale, 1*scale, -1*scale], [1*scale, 1*scale, 1*scale]],
    [[-1*scale, 1*scale, -1*scale], [-1*scale, 1*scale, 1*scale]],
  ];

  return (
    <group ref={cubeRef}>
      {edges.map((edge, i) => (
        <Line key={i} points={edge as any} color="#00ffff" lineWidth={3} transparent opacity={0.8} />
      ))}
      {[
        [-1*scale, -1*scale, -1*scale], [1*scale, -1*scale, -1*scale],
        [1*scale, 1*scale, -1*scale], [-1*scale, 1*scale, -1*scale],
        [-1*scale, -1*scale, 1*scale], [1*scale, -1*scale, 1*scale],
        [1*scale, 1*scale, 1*scale], [-1*scale, 1*scale, 1*scale],
      ].map((pos, i) => (
        <mesh key={i} position={pos as any}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#ff00ff" />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0]} intensity={3} color="#00ffff" distance={8} />
    </group>
  );
});

// Forming Particles - Optimized
const FormingParticles = memo(({ stage }: { stage: number }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 300;
  
  const { positions, targets } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const tgt = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const side = Math.floor(Math.random() * 6);
      const u = (Math.random() - 0.5) * 2;
      const v = (Math.random() - 0.5) * 2;
      
      switch(side) {
        case 0: tgt[i * 3] = 1; tgt[i * 3 + 1] = u; tgt[i * 3 + 2] = v; break;
        case 1: tgt[i * 3] = -1; tgt[i * 3 + 1] = u; tgt[i * 3 + 2] = v; break;
        case 2: tgt[i * 3] = u; tgt[i * 3 + 1] = 1; tgt[i * 3 + 2] = v; break;
        case 3: tgt[i * 3] = u; tgt[i * 3 + 1] = -1; tgt[i * 3 + 2] = v; break;
        case 4: tgt[i * 3] = u; tgt[i * 3 + 1] = v; tgt[i * 3 + 2] = 1; break;
        case 5: tgt[i * 3] = u; tgt[i * 3 + 1] = v; tgt[i * 3 + 2] = -1; break;
      }
    }
    return { positions: pos, targets: tgt };
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current || stage < 1) return;
    
    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const lerpSpeed = 0.05 * delta * 60;
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pos[idx] += (targets[idx] - pos[idx]) * lerpSpeed;
      pos[idx + 1] += (targets[idx + 1] - pos[idx + 1]) * lerpSpeed;
      pos[idx + 2] += (targets[idx + 2] - pos[idx + 2]) * lerpSpeed;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (stage < 1 || stage >= 2) return null;

  return (
    <Points ref={particlesRef} positions={positions}>
      <PointMaterial transparent color="#00ffff" size={0.06} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
    </Points>
  );
});

// Circuit Pattern - Optimized
const CircuitPattern = memo(() => {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  const circuitLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      lines.push({
        start: [Math.cos(angle) * radius, Math.sin(angle) * radius, -5],
        end: [Math.cos(angle) * (radius + 1), Math.sin(angle) * (radius + 1), -5],
      });
    }
    return lines;
  }, []);

  return (
    <group ref={linesRef}>
      {circuitLines.map((line, i) => (
        <Line key={i} points={[line.start, line.end] as any} color="#4a0080" lineWidth={1} transparent opacity={0.3} />
      ))}
    </group>
  );
});

// Main Scene
function Scene({ stage }: { stage: number }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" castShadow={false} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" castShadow={false} />
      <MatrixRain />
      <CircuitPattern />
      <FormingParticles stage={stage} />
      <WireframeCube stage={stage} />
      <fog attach="fog" args={["#000000", 10, 50]} />
    </>
  );
}

// Typewriter Text
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let currentIndex = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, delay]);
  
  return (
    <span className="font-mono text-cyan-400">
      {displayText}<span className="animate-pulse">_</span>
    </span>
  );
}

const CyberpunkLoadingAnimation = ({ onComplete }: CyberpunkLoadingAnimationProps) => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 1000),
      setTimeout(() => setStage(2), 3500),
      setTimeout(() => setStage(3), 8500),
      setTimeout(() => setStage(4), 9500),
      setTimeout(() => onComplete(), 10000),
    ];

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 1.2));
    }, 100);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    });
  };

  const messages = [
    "Initializing environment...",
    "Loading neural modules...",
    "Deploying quantum code...",
    "Establishing secure connection...",
    "System ready.",
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: 'radial-gradient(circle at center, #1a0033 0%, #0a0015 50%, #000000 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop="always"
        flat
      >
        <Scene stage={stage} />
      </Canvas>

      {/* Cursor particles */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: `${(mousePos.x + 1) * 50}%`,
          top: `${(-mousePos.y + 1) * 50}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            animate={{
              x: Math.cos((i / 3) * Math.PI * 2) * 30,
              y: Math.sin((i / 3) * Math.PI * 2) * 30,
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            style={{ filter: 'blur(1px)', boxShadow: '0 0 10px rgba(0,255,255,0.8)' }}
          />
        ))}
      </div>

      {/* Terminal UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-8">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-2" style={{
              color: '#00ffff',
              textShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4)',
              fontFamily: 'monospace',
            }}>
              VISHESH.JHA
            </div>
            <div className="text-xs sm:text-sm text-purple-400 font-mono">
              [ NEURAL INTERFACE v2.0.47 ]
            </div>
          </motion.div>

          <AnimatePresence>
            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-black/40 border border-cyan-500/30 rounded-lg p-4 sm:p-6 backdrop-blur-sm mb-6"
              >
                <div className="space-y-2 text-xs sm:text-sm">
                  {messages.slice(0, Math.min(stage, 5)).map((msg, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-green-400 flex-shrink-0">{'>'}</span>
                      <TypewriterText text={msg} delay={i * 800} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {stage >= 2 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="relative"
            >
              <div className="h-2 sm:h-3 bg-black/60 border border-cyan-500/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 relative"
                  style={{ width: `${progress}%` }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(0,255,255,0.5)',
                      '0 0 20px rgba(138,43,226,0.8)',
                      '0 0 10px rgba(0,255,255,0.5)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </motion.div>
              </div>
              <div className="text-center mt-2 text-xs sm:text-sm text-cyan-400 font-mono">
                {Math.floor(progress)}% COMPLETE
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {stage === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 5, 10] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.8) 0%, rgba(138,43,226,0.4) 50%, transparent 100%)',
          }}
        />
      )}

      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)',
        }}
      />

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />
    </div>
  );
};

export default CyberpunkLoadingAnimation;
