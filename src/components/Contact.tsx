import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Terminal, Send, Loader2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: "7da51cfad2326b9777f844252b4fd184",
      href: "mailto:7da51cfad2326b9777f844252b4fd184",
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

  const handleTerminalKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = terminalInput.toLowerCase().trim();
      if (command === "initiate contact" || command === "contact" || command === "initiate") {
        setIsDialogOpen(true);
        setTerminalText("> Opening contact form...");
        setTerminalInput("");
        setTimeout(() => setTerminalText(">"), 1000);
      } else if (command) {
        setTerminalText(`> Command not found: ${command}. Try "initiate contact"`);
        setTerminalInput("");
        setTimeout(() => setTerminalText(">"), 2000);
      } else {
        setTerminalText(">");
        setTerminalInput("");
      }
    }
  };

  const handleTerminalClickFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (isDialogOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDialogOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Create FormData for FormSubmit
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("_captcha", "false"); // Disable captcha (optional)
      formDataToSend.append("_template", "box"); // Use box template for better formatting

      const response = await fetch("https://formsubmit.co/ajax/7da51cfad2326b9777f844252b4fd184", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setIsDialogOpen(false);
          setSubmitStatus("idle");
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen py-8 sm:py-12 md:py-20 px-4 relative overflow-hidden">
      {/* 3D Data Sphere Background - Optimized */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas 
          camera={{ position: [0, 0, 6] }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
        >
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
          <DataSphere />
        </Canvas>
      </div>

      <div className="absolute inset-0 gradient-cosmic opacity-30 z-0" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 glow-text-cyan terminal-text">
            CONNECT.sh
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            Initialize communication protocols
          </p>
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
            <div className="p-6 font-mono text-sm" onClick={handleTerminalClickFocus}>
              <div className="text-muted-foreground mb-2">$ ./initialize_contact.sh</div>
              <div className="text-primary mb-2">Initializing connection protocols...</div>
              <div className="text-secondary mb-4">✓ System ready for communication</div>
              <div className="text-foreground flex items-center gap-1">
                <span className="select-none">{terminalText === ">" ? ">" : terminalText}</span>
                {terminalText === ">" && (
                  <>
                    <input
                      ref={inputRef}
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={handleTerminalKeyPress}
                      className="flex-1 bg-transparent border-none outline-none text-foreground font-mono min-w-0"
                      placeholder="initiate contact"
                      autoFocus
                    />
                    <span className="animate-pulse">_</span>
                  </>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Tip: Type "initiate contact" and press Enter
              </div>
            </div>
          </div>
        </motion.div>

        {/* Initiate Contact Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="px-8 py-6 text-base font-bold terminal-text
                     bg-primary hover:bg-primary/90 text-primary-foreground
                     neon-border-cyan"
          >
            INITIATE_CONTACT()
          </Button>
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
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

      {/* Contact Form Dialog - Full Screen */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] overflow-y-auto bg-card border-2 border-primary neon-border-cyan p-8 sm:p-12 rounded-xl"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold terminal-text text-primary glow-text-cyan">
              SEND_MESSAGE.exe
            </DialogTitle>
            <DialogDescription className="text-muted-foreground terminal-text">
              Fill out the form below to send me a message
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dialog-name" className="text-sm font-medium terminal-text text-foreground">
                  Name
                </label>
                <Input
                  id="dialog-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                  className="bg-background border-border focus:border-primary terminal-text"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dialog-email" className="text-sm font-medium terminal-text text-foreground">
                  Email
                </label>
                <Input
                  id="dialog-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                  className="bg-background border-border focus:border-primary terminal-text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="dialog-subject" className="text-sm font-medium terminal-text text-foreground">
                Subject
              </label>
              <Input
                id="dialog-subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="What's this about?"
                className="bg-background border-border focus:border-primary terminal-text"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dialog-message" className="text-sm font-medium terminal-text text-foreground">
                Message
              </label>
              <Textarea
                id="dialog-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Type your message here..."
                rows={8}
                className="bg-background border-border focus:border-primary terminal-text resize-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-6 text-base font-bold terminal-text
                         bg-primary hover:bg-primary/90 text-primary-foreground
                         disabled:opacity-50 disabled:cursor-not-allowed
                         neon-border-cyan"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    SEND_MESSAGE()
                  </>
                )}
              </Button>
              {submitStatus === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-primary terminal-text"
                >
                  ✓ Message sent successfully!
                </motion.p>
              )}
              {submitStatus === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive terminal-text"
                >
                  ✗ Failed to send message. Please try again.
                </motion.p>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Contact;
