import { motion } from "framer-motion";
import { GraduationCap, Award, Trophy, Users } from "lucide-react";
import { useState, useEffect } from "react";

const Education = () => {
  const [playSound, setPlaySound] = useState(false);

  const achievements = [
    {
      icon: Trophy,
      title: "Solana World Hackathon",
      description: "Submitted 3 times to Solana World Hackathon",
      color: "text-purple-400",
      glow: "shadow-purple-500/50",
    },
    {
      icon: Award,
      title: "CNIYEF Fest Winner",
      description: "Winner of CNIYEF Fest competition",
      color: "text-accent",
      glow: "shadow-accent/50",
    },
    {
      icon: Trophy,
      title: "Spardha Hackathon Winner",
      description: "First place at Spardha Hackathon",
      color: "text-primary",
      glow: "shadow-primary/50",
    },
    {
      icon: Users,
      title: "Robotics Club President",
      description: "Leading innovation and technical projects",
      color: "text-secondary",
      glow: "shadow-secondary/50",
    },
  ];

  const education = [
    {
      degree: "+2 Education",
      institution: "Kathmandu Model College (KMC)",
      period: "Completed",
      description: "Completed higher secondary education with focus on science and technology",
    },
    {
      degree: "Code in Place",
      institution: "Stanford University",
      period: "Experienced Student",
      description: "Selected as an experienced student in Stanford's Code in Place program",
    },
  ];

  useEffect(() => {
    if (playSound) {
      // Optional: Add sound effect here
      const timer = setTimeout(() => setPlaySound(false), 300);
      return () => clearTimeout(timer);
    }
  }, [playSound]);

  return (
    <section className="min-h-screen py-8 sm:py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Animated background with Parallax */}
      <motion.div 
        className="absolute inset-0 gradient-cosmic opacity-20"
        style={{ y: 0 }}
        whileInView={{ y: -25 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      />
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        style={{ y: 0 }}
        whileInView={{ y: 15 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        viewport={{ once: false, amount: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 glow-text-cyan terminal-text"
            style={{ y: 0 }}
            whileInView={{ y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            EDUCATION_&_ACHIEVEMENTS.log
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-muted-foreground px-2"
            style={{ y: 0 }}
            whileInView={{ y: -8 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            Academic journey and competitive victories
          </motion.p>
        </motion.div>

        {/* Education Section */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-primary glow-text-cyan terminal-text text-center"
          >
            ACADEMIC_RECORDS
          </motion.h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {education.map((edu, index) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                onHoverStart={() => setPlaySound(true)}
                className="relative group perspective-1000"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-xl 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-6 rounded-xl bg-card border-2 border-border 
                              hover:border-primary transition-all duration-300 neon-border-cyan
                              backdrop-blur-sm transform-gpu">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div className="text-xs text-muted-foreground terminal-text">{edu.period}</div>
                  </div>
                  
                  <h4 className="text-xl font-bold mb-2 terminal-text group-hover:glow-text-cyan transition-all">
                    {edu.degree}
                  </h4>
                  <div className="text-primary font-semibold mb-3">{edu.institution}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {edu.description}
                  </p>

                  {/* Animated corner accents */}
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary rounded-tr-xl opacity-50"
                  />
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1,
                    }}
                    className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-secondary rounded-bl-xl opacity-50"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-secondary glow-text-violet terminal-text text-center"
          >
            ACHIEVEMENTS_UNLOCKED
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -15, 
                    rotateZ: [0, -2, 2, 0],
                    transition: { duration: 0.5 }
                  }}
                  onHoverStart={() => setPlaySound(true)}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                    className={`absolute inset-0 rounded-xl blur-xl ${achievement.glow} opacity-0 group-hover:opacity-100`}
                  />

                  <div className="relative p-6 rounded-xl bg-card border border-border 
                                hover:border-primary transition-all duration-300 neon-border-violet
                                backdrop-blur-sm h-full">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                      className={`${achievement.color} mb-4`}
                    >
                      <Icon className="w-10 h-10" />
                    </motion.div>
                    
                    <h4 className="text-lg font-bold mb-2 terminal-text group-hover:glow-text-cyan">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {achievement.description}
                    </p>

                    {/* Particle effects on hover */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary rounded-full"
                        initial={{ opacity: 0 }}
                        whileHover={{
                          opacity: [0, 1, 0],
                          x: [0, Math.random() * 100 - 50],
                          y: [0, Math.random() * 100 - 50],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Floating tech orbs in background */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Education;