import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (titleRef.current && subtitleRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: 50,
          duration: 1.2,
          ease: "power3.out",
        });
        
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        });
      });

      return () => ctx.revert();
    }
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Background - Optimized */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 1] }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
        >
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />
            <pointLight position={[0, 15, 5]} intensity={0.5} color="#00f0ff" />
          </Float>
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/50 to-background" />
      <motion.div 
        className="absolute inset-0 z-10 gradient-radial-glow"
        animate={{
          opacity: [0.5, 0.8],
          scale: [1, 1.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight glow-text-cyan terminal-text"
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 30px rgba(0, 240, 255, 1)",
              transition: { duration: 0.3 }
            }}
          >
            VISHESH JHA
          </motion.h1>
          
          <motion.p
            ref={subtitleRef}
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-primary glow-text-violet font-light tracking-wider px-4"
          >
            SOFTWARE DEVELOPER • AI RESEARCHER • BLOCKCHAIN ARCHITECT
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8 px-4"
          >
            <motion.button
              whileHover={{ 
                scale: 1.08,
                boxShadow: "0 0 30px rgba(0, 240, 255, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToContent}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-bold text-base sm:text-lg
                       hover:shadow-lg hover:shadow-primary/50 transition-all neon-border-cyan
                       terminal-text relative overflow-hidden w-full sm:w-auto group"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10">ENTER THE CODEVERSE</span>
            </motion.button>
            
            <motion.a
              href="#contact"
              onClick={scrollToContact}
              whileHover={{ 
                scale: 1.08,
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)",
                backgroundColor: "rgba(168, 85, 247, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-3 border-2 border-accent text-accent rounded-lg font-semibold text-base sm:text-lg
                         hover:bg-accent hover:text-accent-foreground transition-all neon-border-violet relative overflow-hidden group w-full sm:w-auto cursor-pointer"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10">GET IN TOUCH</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: [0.5, 1], 
            y: [0, 10]
          }}
          transition={{ 
            delay: 2, 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
          className="absolute bottom-8 cursor-pointer"
          onClick={scrollToContent}
          whileHover={{ scale: 1.2 }}
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 10px rgba(0, 240, 255, 0.5)",
                "0 0 20px rgba(0, 240, 255, 0.8)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="rounded-full p-2"
          >
            <ChevronDown className="w-8 h-8 text-primary" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-30 scanline pointer-events-none opacity-30" />
    </section>
  );
};

export default Hero;
