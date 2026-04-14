import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Heart, GraduationCap, Globe, Brain, Plane, Briefcase, Shield, ChevronRight } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tech: string[];
  gradient: string;
  glow: string;
  github: string;
  demo: string | null;
}

interface Category {
  category: string;
  icon: any;
  projects: Project[];
}

const Projects = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const projectCategories: Category[] = [
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
          title: "JEC",
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
          description: "AI-powered plant disease detection using computer vision and machine learning",
          tech: ["TensorFlow", "OpenCV", "Python"],
          gradient: "from-emerald-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "#",
          demo: "https://plantmd.xyz",
        },
      ],
    },
    {
      category: "Blockchain & Web3",
      icon: Shield,
      projects: [
        {
          title: "ZKYC",
          description: "Zero-knowledge blockchain verification system ensuring privacy-preserving KYC",
          tech: ["Solidity", "Hardhat", "Web3.js"],
          gradient: "from-accent/20 to-transparent",
          glow: "neon-border-cyan",
          github: "#",
          demo: "https://zkyc.vercel.app",
        },
        {
          title: "ZeroPilot",
          description: "Decentralized aggregator for Solana ecosystem, optimizing DeFi transactions",
          tech: ["Solana", "Rust", "Next.js"],
          gradient: "from-purple-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "#",
          demo: "https://zeropilot.xyz",
        },
        {
          title: "Qryptic Shard Net",
          description: "Advanced blockchain network with quantum-resistant cryptography",
          tech: ["Blockchain", "Cryptography", "Web3"],
          gradient: "from-cyan-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "#",
          demo: "http://qryptic-shard-net.vercel.app/",
        },
      ],
    },
    {
      category: "Enterprise & Business",
      icon: Briefcase,
      projects: [
        {
          title: "BlackBytes",
          description: "Technology solutions company delivering cutting-edge software services",
          tech: ["React", "Node.js", "Business"],
          gradient: "from-slate-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "https://github.com/vishesh711/Blackbytes",
          demo: "https://blackbytes.xyz",
        },
        {
          title: "MeroClinic",
          description: "Telemedicine platform connecting patients with doctors for consultations",
          tech: ["React", "WebRTC", "MongoDB"],
          gradient: "from-blue-500/20 to-transparent",
          glow: "neon-border-violet",
          github: "#",
          demo: null,
        },
        {
          title: "Prahari",
          description: "Smart security surveillance system with AI-powered threat detection",
          tech: ["Python", "OpenCV", "FastAPI"],
          gradient: "from-red-500/20 to-transparent",
          glow: "neon-border-cyan",
          github: "#",
          demo: null,
        },
      ],
    },
  ];

  return (
    <section id="projects" className="min-h-screen py-24 px-4 relative overflow-hidden bg-background">
      {/* Cinematic Fades for Section Integration */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 glow-text-cyan terminal-text">
            PROJECT_MATRIX.bin
          </h2>
          <p className="text-muted-foreground terminal-text text-lg">
            [Hover to initialize data streams]
          </p>
        </motion.div>

        <div className="space-y-6">
          {projectCategories.map((cat, idx) => {
            const Icon = cat.icon;
            const isHovered = hoveredCategory === cat.category;

            return (
              <motion.div
                key={cat.category}
                onMouseEnter={() => setHoveredCategory(cat.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="relative group "
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                {/* Accordion Header */}
                <div className={`
                  relative flex items-center justify-between p-6 md:p-8 rounded-xl 
                  border transition-all duration-300 bg-[#0c0c1a]/50
                  ${isHovered ? 'border-primary shadow-[0_0_30px_rgba(0,255,255,0.08)]' : 'border-white/5 hover:border-primary/40'}
                `}>
                  <div className="flex items-center gap-6">
                    <div className={`
                      p-4 rounded-lg bg-background border transition-all duration-300
                      ${isHovered ? 'border-primary text-primary shadow-[0_0_15px_rgba(0,255,255,0.3)] rotate-12' : 'border-white/10 text-muted-foreground'}
                    `}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className={`text-2xl md:text-3xl font-bold terminal-text transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-foreground/80'}`}>
                        {cat.category}
                      </h3>
                      <p className="text-sm text-muted-foreground terminal-text uppercase tracking-widest mt-1">
                        {cat.projects.length} Nodes detected
                      </p>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isHovered ? 90 : 0, scale: isHovered ? 1.2 : 1 }}
                    className={isHovered ? 'text-primary' : 'text-muted-foreground'}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.div>
                </div>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isHovered && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="overflow-hidden will-change-[height,opacity]"
                    >
                      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 p-4 mt-2">
                        {cat.projects.map((proj, pIdx) => (
                          <motion.div
                            key={proj.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: pIdx * 0.05 }}
                            className="relative group/project p-6 rounded-lg bg-[#0c0c1a] border border-white/5 hover:border-primary/30 transition-all overflow-hidden"
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${proj.gradient} opacity-0 group-hover/project:opacity-100 transition-opacity duration-500`} />
                            
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-xl font-bold text-foreground group-hover/project:text-primary transition-colors">
                                  {proj.title}
                                </h4>
                                <div className="flex gap-2">
                                  {proj.demo && (
                                    <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all">
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  )}
                                  <a href={proj.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-secondary/20 text-muted-foreground hover:text-secondary transition-all">
                                    <Github className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                                {proj.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {proj.tech.map(t => (
                                  <span key={t} className="text-[10px] terminal-text uppercase px-2 py-0.5 rounded-full bg-primary/5 border border-primary/20 text-primary/70">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
