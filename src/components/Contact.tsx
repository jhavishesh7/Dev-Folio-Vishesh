import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Terminal } from "lucide-react";
import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

const DataSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 32, 32]}>
      <meshStandardMaterial 
        color="#00f0ff"
        emissive="#00f0ff"
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.6}
      />
    </Sphere>
  );
};

const Contact = () => {
  const [terminalText, setTerminalText] = useState(">");

  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: "jhavishesh7@gmail.com",
      href: "mailto:jhavishesh7@gmail.com",
      color: "text-primary",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/jhavishesh7",
      href: "https://github.com/jhavishesh7",
      color: "text-secondary",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "vishesh-jha-823742302",
      href: "https://linkedin.com/in/vishesh-jha-823742302",
      color: "text-accent",
    },
  ];

  const handleTerminalClick = (value: string) => {
    setTerminalText(`> Connecting to ${value}...`);
    setTimeout(() => setTerminalText(">"), 2000);
  };

  return (
    <section id="contact" className="min-h-screen py-8 sm:py-12 md:py-20 px-4 relative overflow-hidden">
      {/* 3D Data Sphere Background with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20"
        style={{ y: 0 }}
        whileInView={{ y: -30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <Canvas camera={{ position: [0, 0, 6] }}>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
          <DataSphere />
        </Canvas>
      </motion.div>

      <motion.div 
        className="absolute inset-0 gradient-cosmic opacity-30 z-0"
        style={{ y: 0 }}
        whileInView={{ y: 20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 glow-text-cyan terminal-text"
            style={{ y: 0 }}
            whileInView={{ y: -12 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            CONNECT.sh
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-muted-foreground px-2"
            style={{ y: 0 }}
            whileInView={{ y: -8 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            Initialize communication protocols
          </motion.p>
        </motion.div>

        {/* Terminal Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-card border-2 border-primary rounded-xl overflow-hidden neon-border-cyan">
            <div className="bg-primary/10 px-4 py-2 flex items-center gap-2 border-b border-primary/30">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">terminal@vishesh:~$</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="text-muted-foreground mb-2">$ ./initialize_contact.sh</div>
              <div className="text-primary mb-2">Initializing connection protocols...</div>
              <div className="text-secondary mb-4">✓ System ready for communication</div>
              <div className="text-foreground">{terminalText}<span className="animate-pulse">_</span></div>
            </div>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {contacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <motion.a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: index % 2 === 0 ? -8 : -12 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: false, amount: 0.5 }}
                whileHover={{ scale: 1.05, y: -15 }}
                onClick={() => handleTerminalClick(contact.value)}
                className="group relative"
              >
                <div className="p-6 rounded-xl bg-card border border-border 
                              hover:border-primary transition-all duration-300 neon-border-cyan
                              backdrop-blur-sm text-center">
                  <div className={`${contact.color} mb-4 flex justify-center`}>
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
                  </div>
                  <div className="text-base sm:text-lg font-bold mb-2 terminal-text">{contact.label}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground break-all">{contact.value}</div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 px-2">
            Let's build something extraordinary together
          </p>
          <motion.a
            href="mailto:jhavishesh7@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg 
                     font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-primary/50 
                     transition-all neon-border-cyan terminal-text"
          >
            INITIATE_CONTACT()
          </motion.a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center text-sm text-muted-foreground terminal-text"
        >
          <p>© 2025 Vishesh Jha • All Rights Reserved</p>
          <p className="mt-2 text-xs">Crafted in the Digital Codeverse</p>
          <p className="mt-1 text-xs">Built with React • Three.js • GSAP • Framer Motion</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
