import { motion } from "framer-motion";
import { Building2, Calendar } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      company: "BlackBytes",
      role: "Founder & CEO",
      period: "2023 - Present",
      description: "Founded and led development of enterprise POS systems, managing cross-functional teams and delivering scalable solutions",
      type: "Founder",
    },
    {
      company: "ZeroPilot",
      role: "Co-Founder & CTO",
      period: "2024 - Present",
      description: "Co-founded blockchain infrastructure startup leveraging LayerZero for cross-chain solutions",
      type: "Founder",
    },
    {
      company: "Techy Solve",
      role: "Software Developer",
      period: "2023 - 2024",
      description: "Developed full-stack applications and implemented AI-powered features for client projects",
      type: "Work",
    },
    {
      company: "MockVisa",
      role: "Frontend Developer",
      period: "Dec 2024 - Present",
      description: "Developing AI-driven visa interview preparation platform with real-time feedback systems using React and modern frontend technologies",
      type: "Work",
    },
    {
      company: "Incubate Nepal",
      role: "Mentee",
      period: "2022 - 2023",
      description: "Built PlantMD, an AI chatbot capable of analyzing plants based on images using computer vision and machine learning",
      type: "Work",
    },
    {
      company: "GenZDrobe",
      role: "Full Stack Developer",
      period: "2022",
      description: "Built e-commerce platform with inventory management and payment integration",
      type: "Work",
    },
  ];

  return (
    <section className="min-h-screen py-8 sm:py-12 md:py-20 px-4 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background"
        style={{ y: 0 }}
        whileInView={{ y: 20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 glow-text-violet terminal-text"
            style={{ y: 0 }}
            whileInView={{ y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            CAREER_TIMELINE.log
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-muted-foreground px-2"
            style={{ y: 0 }}
            whileInView={{ y: -8 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            Journey through the professional codeverse
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Timeline line with animated glow */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-full">
            <motion.div
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-accent blur-sm"
            />
          </div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company + exp.period}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: index % 2 === 0 ? -8 : -12 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: false, amount: 0.5 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot with pulse animation */}
                <motion.div 
                  className="absolute left-8 md:left-1/2 w-5 h-5 rounded-full transform -translate-x-1/2 z-10"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  <div className={`w-full h-full rounded-full ${
                    exp.type === "Founder" ? "bg-primary" : "bg-secondary"
                  } border-4 border-background shadow-lg ${
                    exp.type === "Founder" ? "shadow-primary/50" : "shadow-secondary/50"
                  }`} />
                </motion.div>

                <div className={`w-full md:w-5/12 pl-16 md:pl-0 ${
                  index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className={`p-6 rounded-xl bg-card border border-border backdrop-blur-sm
                              hover:border-primary transition-all duration-300 ${
                                exp.type === "Founder" ? "neon-border-cyan" : "neon-border-violet"
                              }`}
                  >
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                      exp.type === "Founder" 
                        ? "bg-primary/20 text-primary" 
                        : "bg-secondary/20 text-secondary"
                    }`}>
                      {exp.type}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 terminal-text">{exp.company}</h3>
                    <div className="text-lg text-primary mb-2">{exp.role}</div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 
                                  justify-start md:justify-end">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
