import { useState } from "react";
import { motion } from "framer-motion";
import CyberpunkLoadingAnimation from "@/components/CyberpunkLoadingAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GenesisPulseDemo = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleComplete = () => {
    setLoadingComplete(true);
    setShowLoading(false);
  };

  const resetAnimation = () => {
    setShowLoading(true);
    setLoadingComplete(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {showLoading && <CyberpunkLoadingAnimation onComplete={handleComplete} />}
      
      {loadingComplete && (
        <div className="text-center space-y-8 p-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            <motion.h1 
              className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              VISHESH JHA
            </motion.h1>
            <motion.p 
              className="text-2xl text-gray-400 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The Genesis Pulse
            </motion.p>
          </div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              You just witnessed the Genesis Pulse — a 12-second cinematic journey from a single point of light 
              to the full emergence of identity. From <span className="text-cyan-400 font-semibold">VJ</span> to <span className="text-cyan-400 font-semibold">VISHESH JHA</span>, 
              like a universe unfolding from compressed code.
            </p>
            
            <Button
              onClick={resetAnimation}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-semibold px-10 py-7 text-lg shadow-lg shadow-cyan-500/50 transition-all duration-300"
            >
              ↻ Replay Genesis Pulse
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <span className="text-2xl">🌌</span> Phase 1-2s
                </CardTitle>
                <CardDescription className="text-gray-400">The Silence Before</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                Cosmic dust floats in void. A single cyan particle glows with heartbeat rhythm. 
                Camera zooms in slowly.
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <span className="text-2xl">💥</span> Phase 2-3s
                </CardTitle>
                <CardDescription className="text-gray-400">The Boom</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                Explosive shockwave bursts outward. Data fragments scatter in slow motion. 
                Light trails paint the void.
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <span className="text-2xl">✨</span> Phase 3-6s
                </CardTitle>
                <CardDescription className="text-gray-400">VJ Formation</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                Bold metallic "VJ" emerges from chaos. Pulses with cyan energy. 
                Code ripples across surface.
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <span className="text-2xl">🌊</span> Phase 6-9s
                </CardTitle>
                <CardDescription className="text-gray-400">The Expansion</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                VJ fractures into light threads. Weaves outward morphing into full name. 
                Camera orbits elegantly.
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> Phase 9-11s
                </CardTitle>
                <CardDescription className="text-gray-400">The Ascend</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                "VISHESH JHA" glows softly floating. Data lines flicker across letters. 
                Final cyan pulse expands.
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <span className="text-2xl">🌟</span> Phase 11-12s
                </CardTitle>
                <CardDescription className="text-gray-400">The Reveal</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                Pulse fades to ambient glow. Name dissolves into smooth fog. 
                Seamless transition to interface.
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="mt-12 p-8 border border-cyan-500/20 rounded-lg bg-cyan-950/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Technical Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="text-cyan-300 font-semibold mb-2">Visual Effects</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 1000+ cosmic dust particles</li>
                  <li>• 200 data fragments with physics</li>
                  <li>• 50 light thread morphing system</li>
                  <li>• Volumetric bloom & glow</li>
                  <li>• Real-time metallic reflections</li>
                </ul>
              </div>
              <div>
                <h4 className="text-cyan-300 font-semibold mb-2">Animation Tech</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• GSAP elastic easing curves</li>
                  <li>• Three.js PBR materials</li>
                  <li>• Cinematic camera orbits</li>
                  <li>• Post-processing pipeline</li>
                  <li>• 60fps performance target</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-8 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <p>Inspired by Apple M3 reveal • Tron Legacy • Refik Anadol • Iron Man HUD</p>
            <p className="mt-2">Built with Three.js • React Three Fiber • GSAP • Framer Motion</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GenesisPulseDemo;
