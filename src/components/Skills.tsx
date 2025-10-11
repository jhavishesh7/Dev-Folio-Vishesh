import { motion } from "framer-motion";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingOrb from "./3D/FloatingOrb";

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

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
        { name: "LayerZero", level: 78 },
      ],
    },
  ];

  return (
    <section className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* 3D Skill Orbs Background with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-30"
        style={{ y: 0 }}
        whileInView={{ y: -30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />
          
          {/* Tech orbs floating around */}
          <FloatingOrb position={[-4, 3, 0]} color="#00f0ff" scale={0.6} />
          <FloatingOrb position={[4, 2, 0]} color="#a855f7" scale={0.5} />
          <FloatingOrb position={[-3, -2, 1]} color="#f97316" scale={0.4} />
          <FloatingOrb position={[3, -3, -1]} color="#00f0ff" scale={0.5} />
          <FloatingOrb position={[0, 4, -2]} color="#a855f7" scale={0.3} />
        </Canvas>
      </motion.div>

      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0"
        style={{ y: 0 }}
        whileInView={{ y: 15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 glow-text-violet terminal-text"
            style={{ y: 0 }}
            whileInView={{ y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            SKILLS_MATRIX.sys
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground"
            style={{ y: 0 }}
            whileInView={{ y: -8 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            Navigate through the technological galaxy
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1,
                y: categoryIndex % 2 === 0 ? -10 : -15 
              }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: false, amount: 0.5 }}
              className="space-y-4"
            >
              <h3 className={`text-2xl font-bold mb-6 terminal-text ${
                category.category === "Frontend" ? "text-primary" :
                category.category === "Backend" ? "text-secondary" :
                category.category === "AI/ML" ? "text-accent" : "text-primary"
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
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium terminal-text">{skill.name}</span>
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
