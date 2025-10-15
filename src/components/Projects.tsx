import { motion } from "framer-motion";
import { ExternalLink, Github, Heart, GraduationCap, Globe, Brain, Plane, Briefcase, Shield } from "lucide-react";

const Projects = () => {
  const projectCategories = [
    {
      category: "Healthcare & Medical AI",
      icon: Heart,
      projects: [
        {
          title: "Sanjeevni-3.0",
          description: "Advanced AI-powered healthcare platform with comprehensive medical guidance and analysis",
          tech: ["AI", "Healthcare", "React"],
          gradient: "from-red-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Sanjeevni-3.0",
          demo: "https://sanjeevni-3-0.vercel.app/",
        },
        {
          title: "Sanjeevni-AI",
          description: "AI-powered health assistant providing intelligent medical guidance and symptom analysis",
          tech: ["Python", "AI", "Healthcare"],
          gradient: "from-green-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "https://github.com/vishesh711/Sanjeevni-AI",
          demo: null,
        },
        {
          title: "Carebridge",
          description: "Comprehensive healthcare bridge connecting patients with medical services seamlessly",
          tech: ["React", "Node.js", "Healthcare"],
          gradient: "from-blue-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Carebridge",
          demo: "https://carebridge-rho.vercel.app/",
        },
        {
          title: "Tele-Doctor",
          description: "Telemedicine platform enabling remote consultations and health monitoring",
          tech: ["React", "WebRTC", "Healthcare"],
          gradient: "from-purple-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "https://github.com/vishesh711/Tele-Doctor",
          demo: "https://tele-doctor-eight.vercel.app/",
        },
      ],
    },
    {
      category: "Educational Platforms",
      icon: GraduationCap,
      projects: [
        {
          title: "Parikshya",
          description: "Comprehensive examination and assessment platform for educational institutions",
          tech: ["React", "Node.js", "Education"],
          gradient: "from-indigo-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Parikshya",
          demo: "https://parikshya.vercel.app/",
        },
        {
          title: "CodeForge",
          description: "Interactive coding platform for learning and practicing programming skills",
          tech: ["React", "TypeScript", "Education"],
          gradient: "from-orange-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "https://github.com/vishesh711/CodeForge",
          demo: "https://code-forge-mu.vercel.app/",
        },
        {
          title: "Roadmaps",
          description: "Curated learning paths and roadmaps for various technology stacks",
          tech: ["React", "Education", "Career"],
          gradient: "from-cyan-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Roadmaps",
          demo: null,
        },
        {
          title: "JavaLearn",
          description: "Interactive Java learning platform with hands-on exercises and tutorials",
          tech: ["Java", "Education", "Tutorial"],
          gradient: "from-amber-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "https://github.com/vishesh711/JavaLearn",
          demo: null,
        },
      ],
    },
    {
      category: "Websites & Portfolios",
      icon: Globe,
      projects: [
        {
          title: "Portfolio",
          description: "Personal portfolio showcasing projects, skills, and professional experience",
          tech: ["React", "TypeScript", "Design"],
          gradient: "from-primary/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Portfolio",
          demo: "https://visheshjha.com.np/",
        },
        {
          title: "JEC (Junior Entrepreneurship Circle)",
          description: "Official website for Junior Entrepreneurship Circle promoting student entrepreneurship",
          tech: ["React", "Business", "Community"],
          gradient: "from-emerald-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "https://github.com/vishesh711/JEC",
          demo: "https://jec-jecw.vercel.app/",
        },
        {
          title: "Blackbytes",
          description: "Technology solutions company website showcasing services and innovations",
          tech: ["React", "Business", "Tech"],
          gradient: "from-slate-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Blackbytes",
          demo: null,
        },
        {
          title: "Frontend-dev",
          description: "Frontend development showcase with modern web development techniques",
          tech: ["HTML", "CSS", "JavaScript"],
          gradient: "from-pink-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "https://github.com/vishesh711/Frontend-dev",
          demo: "https://frontend-dev-two.vercel.app/",
        },
      ],
    },
    {
      category: "AI/ML Models",
      icon: Brain,
      projects: [
        {
          title: "AI_model",
          description: "Advanced machine learning model implementation with practical applications",
          tech: ["Python", "TensorFlow", "ML"],
          gradient: "from-violet-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/AI_model",
          demo: "https://ai-model-kappa.vercel.app/",
        },
        {
          title: "AI_model2",
          description: "Enhanced AI model with improved algorithms and performance optimization",
          tech: ["Python", "PyTorch", "AI"],
          gradient: "from-fuchsia-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "https://github.com/vishesh711/AI_model2",
          demo: null,
        },
        {
          title: "PlantMD",
          description: "AI-powered plant disease detection using computer vision and machine learning for agricultural diagnosis",
          tech: ["TensorFlow", "OpenCV", "Python", "React"],
          gradient: "from-emerald-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "#",
          demo: "https://plantmd.xyz",
        },
        {
          title: "MockVisa Platform",
          description: "Interactive visa interview preparation tool with AI-driven feedback and assessment",
          tech: ["React", "Python", "TensorFlow", "PostgreSQL"],
          gradient: "from-indigo-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "#",
          demo: "https://mockvisa.com",
        },
      ],
    },
    {
      category: "Blockchain & Web3",
      icon: Shield,
      projects: [
        {
          title: "ZKYC",
          description: "Zero-knowledge blockchain verification system ensuring privacy-preserving KYC authentication",
          tech: ["Solidity", "Hardhat", "Web3.js", "Next.js"],
          gradient: "from-accent/20 to-transparent",
          glow: "neon-border-cyan",
          github: "#",
          demo: "https://zkyc.vercel.app",
        },
        {
          title: "ZeroPilot",
          description: "Decentralized aggregator for Solana ecosystem, optimizing DeFi transactions across multiple protocols",
          tech: ["Solana", "Rust", "TypeScript", "Next.js"],
          gradient: "from-purple-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "#",
          demo: "https://zeropilot.xyz",
        },
        {
          title: "Qryptic Shard Net",
          description: "Advanced blockchain network with quantum-resistant cryptography and sharding technology",
          tech: ["Blockchain", "Cryptography", "Web3"],
          gradient: "from-cyan-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "#",
          demo: "http://qryptic-shard-net.vercel.app/",
        },
      ],
    },
    {
      category: "Travel & Other Applications",
      icon: Plane,
      projects: [
        {
          title: "Roam",
          description: "Travel planning and exploration platform for discovering new destinations",
          tech: ["React", "Maps API", "Travel"],
          gradient: "from-sky-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Roam",
          demo: "https://roam-gamma.vercel.app/",
        },
        {
          title: "Hack_blight",
          description: "Innovative hackathon project addressing community challenges",
          tech: ["React", "Node.js", "Innovation"],
          gradient: "from-lime-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "https://github.com/vishesh711/Hack_blight",
          demo: "https://hack-blight.vercel.app/",
        },
        {
          title: "SLOT-GAME",
          description: "Interactive slot game with engaging gameplay and animations",
          tech: ["JavaScript", "Game", "Entertainment"],
          gradient: "from-yellow-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/SLOT-GAME",
          demo: null,
        },
      ],
    },
    {
      category: "Enterprise & Business Solutions",
      icon: Briefcase,
      projects: [
        {
          title: "BlackBytes",
          description: "Technology solutions company delivering cutting-edge software and digital transformation services",
          tech: ["React", "Node.js", "Business", "Tech"],
          gradient: "from-slate-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Blackbytes",
          demo: "https://blackbytes.xyz",
        },
        {
          title: "MeroClinic",
          description: "Telemedicine platform connecting patients with doctors for remote consultations and health monitoring",
          tech: ["React", "Node.js", "WebRTC", "MongoDB"],
          gradient: "from-blue-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "#",
          demo: null,
        },
        {
          title: "CareRide",
          description: "Specialized ride-sharing platform designed for elderly passengers with accessibility features",
          tech: ["React Native", "Node.js", "PostgreSQL", "Maps API"],
          gradient: "from-orange-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "#",
          demo: null,
        },
        {
          title: "ShipSure Reloaded",
          description: "Comprehensive shipping management platform with real-time tracking and automated logistics",
          tech: ["React", "Node.js", "MongoDB", "Socket.io"],
          gradient: "from-secondary/20 to-transparent",
          glow: "neon-border-violet",
          github: "#",
          demo: null,
        },
        {
          title: "Prahari",
          description: "Smart security surveillance system with AI-powered threat detection and alert mechanisms",
          tech: ["Python", "OpenCV", "FastAPI", "React"],
          gradient: "from-red-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "#",
          demo: null,
        },
        {
          title: "Waste Management System",
          description: "IoT-enabled smart waste collection with route optimization and environmental monitoring",
          tech: ["React", "Node.js", "IoT", "MongoDB"],
          gradient: "from-primary/20 to-transparent",
          glow: "neon-border-violet",
          github: "#",
          demo: null,
        },
      ],
    },
  ];

  return (
    <section id="projects" className="min-h-screen py-8 sm:py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 glow-text-cyan terminal-text">
            PROJECTS_ARCHIVE.db
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            Explore the digital dimensions I've crafted
          </p>
        </motion.div>

        {projectCategories.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <motion.div 
                className="flex items-center gap-3 mb-8"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <IconComponent className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-bold terminal-text glow-text-cyan">
                  {category.category}
                </h3>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 50, rotateX: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -15,
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    className="group relative"
                    style={{ perspective: "1000px" }}
                  >
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${project.gradient} rounded-xl blur-xl`}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <motion.div 
                      className={`relative p-6 rounded-xl bg-card/80 border border-border 
                                  hover:border-primary transition-all duration-300 ${project.glow}
                                  backdrop-blur-md h-full flex flex-col shadow-2xl`}
                      whileHover={{ 
                        boxShadow: "0 0 30px rgba(0, 240, 255, 0.3)",
                        borderColor: "rgba(0, 240, 255, 0.8)"
                      }}
                    >
                      <h4 className="text-2xl font-bold mb-3 terminal-text group-hover:glow-text-cyan transition-all">
                        {project.title}
                      </h4>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground 
                                     border border-border terminal-text"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-auto">
                        {project.demo && (
                          <motion.a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </motion.a>
                        )}
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </motion.a>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
