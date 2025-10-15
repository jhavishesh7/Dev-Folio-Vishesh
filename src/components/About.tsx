import { motion } from "framer-motion";
import { Code2, Brain, Blocks } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Code2,
      title: "Full Stack Engineer",
      description: "Architecting scalable solutions with modern web technologies and cloud infrastructure",
      color: "text-primary",
    },
    {
      icon: Brain,
      title: "AI Researcher",
      description: "Developing intelligent systems with machine learning and computer vision",
      color: "text-secondary",
    },
    {
      icon: Blocks,
      title: "Blockchain Developer",
      description: "Building decentralized applications with Web3 and smart contract technologies",
      color: "text-accent",
    },
  ];

  return (
    <section className="min-h-screen py-8 sm:py-12 px-4 relative overflow-hidden flex items-center">
      {/* Creative Geometric Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 border-2 border-primary/20 rounded-full"
          animate={{
            scale: [1, 1.2],
            rotate: [0, 180],
            opacity: [0.2, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 border-2 border-accent/20"
          style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
          animate={{
            scale: [1, 1.15],
            rotate: [0, -90],
            opacity: [0.15, 0.35],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/10"
          style={{ borderRadius: "40% 60% 60% 40% / 60% 40% 60% 40%" }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Floating dots - Reduced for performance */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              x: [-10, 10],
              opacity: [0.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Sophisticated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background z-0" />
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0"
        animate={{
          scale: [1, 1.1],
          opacity: [0.5, 0.8]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] z-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating particles effect - Optimized */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 glow-text-cyan terminal-text">
            ABOUT_ME.exe
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            A passionate technologist bridging the gap between innovative ideas and robust implementations. 
            Specializing in AI, blockchain, and full-stack development to create next-generation digital experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="relative group perspective-1000"
              >
                <motion.div 
                  className="p-6 sm:p-8 rounded-xl bg-card/90 border border-border 
                              hover:border-primary transition-all duration-300
                              neon-border-cyan backdrop-blur-md relative overflow-hidden"
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Floating particles - Reduced */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary/40 rounded-full"
                      style={{
                        left: `${25 + i * 25}%`,
                        top: `${30 + i * 15}%`,
                      }}
                      animate={{
                        y: [-10, 10],
                        x: [-5, 5],
                        opacity: [0.2, 0.6],
                        scale: [1, 1.5],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  <div className={`${feature.color} mb-4 relative z-10`}>
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 terminal-text relative z-10">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed relative z-10">{feature.description}</p>
                  
                  {/* Particle effect on hover */}
                  <motion.div
                    className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      x: [-10, 10],
                      y: [-10, 10],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { label: "Projects Completed", value: "25+" },
            { label: "Technologies", value: "20+" },
            { label: "Companies Founded", value: "2" },
            { label: "Years Experience", value: "3+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-4 sm:p-6 rounded-lg bg-card/70 border border-border text-center backdrop-blur-md relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.08, 
                borderColor: "rgba(0, 240, 255, 0.8)",
                boxShadow: "0 0 20px rgba(0, 240, 255, 0.3)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Animated background on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              
              {/* Floating particles in stat cards - Minimal */}
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/50 rounded-full"
                  style={{
                    left: `${30 + i * 40}%`,
                    top: `${25 + i * 25}%`,
                  }}
                  animate={{
                    y: [-8, 8],
                    x: [-4, 4],
                    opacity: [0.3, 0.7],
                  }}
                  transition={{
                    duration: 1.5 + i * 0.3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              <motion.div 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary glow-text-cyan terminal-text relative z-10"
                whileHover={{ 
                  scale: 1.15,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground mt-2 relative z-10">{stat.label}</div>
              
              {/* Corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/50"
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/50"
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
