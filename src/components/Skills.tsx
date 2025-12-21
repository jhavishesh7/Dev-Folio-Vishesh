import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Badge } from "./ui/badge";

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const section = sectionRef.current;
    if (!section) return;

    // Initialize canvas with proper dimensions
    const updateCanvasSize = () => {
      const rect = section.getBoundingClientRect();
      const width = rect.width || 800; // Fallback width
      const height = rect.height || 600; // Fallback height
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
    };

    updateCanvasSize();

    // Particle system for neural network effect
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      baseOpacity: number;
    }> = [];

    const particleCount = 100;
    const initParticles = () => {
      const rect = section.getBoundingClientRect();
      particles.length = 0; // Clear existing particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          baseOpacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    initParticles();

    let animationFrameId: number | null = null;
    let isAnimating = true;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1000, y: -1000 };
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      if (!isAnimating || !canvas || !ctx) return;
      
      try {
        const rect = section.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const mouseX = mousePosRef.current.x;
        const mouseY = mousePosRef.current.y;
        const mouseRadius = 150; // Radius of mouse influence
        
        // Update and draw particles
        particles.forEach((particle, i) => {
          // Mouse interaction - particles are repelled by mouse
          const dx = particle.x - mouseX;
          const dy = particle.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius && distance > 0) {
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            const repulsionStrength = force * 2;
            
            particle.vx += Math.cos(angle) * repulsionStrength * 0.1;
            particle.vy += Math.sin(angle) * repulsionStrength * 0.1;
            
            // Increase opacity when near mouse
            particle.opacity = Math.min(1, particle.baseOpacity + force * 0.5);
          } else {
            // Gradually return to base opacity
            particle.opacity += (particle.baseOpacity - particle.opacity) * 0.05;
          }

          // Apply velocity with damping
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.98;
          particle.vy *= 0.98;

          // Wrap around edges
          if (particle.x < 0) {
            particle.x = width;
            particle.vx *= -0.5;
          }
          if (particle.x > width) {
            particle.x = 0;
            particle.vx *= -0.5;
          }
          if (particle.y < 0) {
            particle.y = height;
            particle.vy *= -0.5;
          }
          if (particle.y > height) {
            particle.y = 0;
            particle.vy *= -0.5;
          }

          // Draw particle with glow effect
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, `rgba(0, 240, 255, ${particle.opacity})`);
          gradient.addColorStop(0.5, `rgba(0, 240, 255, ${particle.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(0, 240, 255, 0)`);
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Draw core particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
          ctx.fill();

          // Draw connections (neural network effect) - enhanced near mouse
          particles.slice(i + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              // Check if connection is near mouse for enhanced visibility
              const midX = (particle.x + otherParticle.x) / 2;
              const midY = (particle.y + otherParticle.y) / 2;
              const distToMouse = Math.sqrt(
                Math.pow(midX - mouseX, 2) + Math.pow(midY - mouseY, 2)
              );
              
              let connectionOpacity = 0.1 * (1 - distance / 150);
              if (distToMouse < mouseRadius) {
                connectionOpacity = Math.min(0.6, connectionOpacity * 3);
              }

              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(0, 240, 255, ${connectionOpacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });

        animationFrameId = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Error in canvas animation:', error);
        isAnimating = false;
      }
    };

    // Start animation after a small delay to ensure canvas is ready
    const startAnimation = setTimeout(() => {
      if (isAnimating) {
        animate();
      }
    }, 100);

    const handleResize = () => {
      updateCanvasSize();
      // Reinitialize particles on resize to match new canvas size
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isAnimating = false;
      clearTimeout(startAnimation);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const skillCategories = [
    {
      category: "Frontend",
      color: "border-primary",
      glowClass: "neon-border-cyan",
      skills: [
        { name: "React.js", level: 95 },
        { name: "Next.js", level: 90 },
        { name: "TypeScript", level: 88 },
        { name: "Tailwind CSS", level: 92 },
      ],
    },
    {
      category: "Backend",
      color: "border-secondary",
      glowClass: "neon-border-violet",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Python", level: 90 },
        { name: "PostgreSQL", level: 82 },
        { name: "MongoDB", level: 85 },
      ],
    },
    {
      category: "AI/ML",
      color: "border-accent",
      glowClass: "neon-border-violet",
      skills: [
        { name: "TensorFlow", level: 87 },
        { name: "OpenCV", level: 85 },
        { name: "Scikit-learn", level: 83 },
        { name: "LangChain", level: 80 },
      ],
    },
    {
      category: "Blockchain",
      color: "border-primary",
      glowClass: "neon-border-cyan",
      skills: [
        { name: "Solidity", level: 82 },
        { name: "Web3.js", level: 85 },
        { name: "Hardhat", level: 80 },
      ],
    },
    {
      category: "Low-Level",
      color: "border-accent",
      glowClass: "neon-border-violet",
      skills: [
        { name: "Assembly", level: 25, isLearning: true },
      ],
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="min-h-screen py-8 sm:py-12 md:py-20 px-4 relative overflow-hidden"
    >
      {/* Interactive Neural Network / Particle Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-40"
        style={{ width: '100%', height: '100%' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 glow-text-violet terminal-text">
            SKILLS_MATRIX.sys
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            Navigate through the technological galaxy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1
              }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className={`text-2xl font-bold mb-6 terminal-text ${
                category.category === "Frontend" ? "text-primary" :
                category.category === "Backend" ? "text-secondary" :
                category.category === "AI/ML" ? "text-accent" :
                category.category === "Low-Level" ? "text-accent" : "text-primary"
              }`}>
                {category.category}
              </h3>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="relative"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium terminal-text">{skill.name}</span>
                        {(skill as any).isLearning && (
                          <Badge variant="outline" className="text-xs px-2 py-0 border-accent text-accent">
                            Currently Learning
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    
                    <div className="h-3 bg-muted rounded-full overflow-hidden relative border border-border">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ 
                          duration: 1.5, 
                          delay: categoryIndex * 0.1 + skillIndex * 0.05,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true }}
                        className={`h-full rounded-full relative overflow-hidden ${
                          category.category === "Frontend" ? "bg-gradient-to-r from-primary via-primary/70 to-primary" :
                          category.category === "Backend" ? "bg-gradient-to-r from-secondary via-secondary/70 to-secondary" :
                          category.category === "AI/ML" ? "bg-gradient-to-r from-accent via-accent/70 to-accent" :
                          category.category === "Low-Level" ? "bg-gradient-to-r from-accent via-accent/70 to-accent" :
                          "bg-gradient-to-r from-primary via-primary/70 to-primary"
                        } ${hoveredSkill === skill.name ? "animate-pulse-glow" : ""}`}
                      >
                        {/* Animated shine effect */}
                        <motion.div
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        />
                        {/* Particle effect */}
                        {hoveredSkill === skill.name && (
                          <>
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ x: 0, opacity: 1 }}
                                animate={{ 
                                  x: ['0%', '100%'],
                                  opacity: [1, 0]
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                                className="absolute top-0 w-1 h-full bg-white rounded-full"
                              />
                            ))}
                          </>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-8 text-secondary glow-text-violet terminal-text">
            ADDITIONAL_SYSTEMS
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Docker", "AWS", "Git", "Firebase", "GraphQL", "Redis",
              "Prisma", "Jest", "FastAPI", "Flutter", "Rust", "Go",
              "Supabase", "Vercel", "Kubernetes",
            ].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-4 py-2 rounded-lg bg-card border border-border 
                         hover:border-primary transition-all cursor-pointer terminal-text text-sm"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
