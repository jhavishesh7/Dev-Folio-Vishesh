import { useState } from "react";
import CyberpunkLoadingAnimation from "@/components/CyberpunkLoadingAnimation";
import { Button } from "@/components/ui/button";

const LoadingDemo = () => {
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
        <div className="text-center space-y-8 p-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              VISHESH JHA
            </h1>
            <p className="text-xl text-gray-400">
              Developer • Designer • Creator
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300 max-w-2xl mx-auto">
              Welcome to the portfolio. The loading animation you just witnessed represents
              the transformation of abstract code into living, breathing digital experiences.
            </p>
            
            <Button
              onClick={resetAnimation}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-6 text-lg"
            >
              Replay Animation
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 border border-cyan-500/20 rounded-lg bg-cyan-500/5">
              <h3 className="text-cyan-400 font-semibold mb-2">Phase 1-2s</h3>
              <p className="text-sm text-gray-400">The Awakening - Particles shimmer to life</p>
            </div>
            <div className="p-6 border border-cyan-500/20 rounded-lg bg-cyan-500/5">
              <h3 className="text-cyan-400 font-semibold mb-2">Phase 2-7s</h3>
              <p className="text-sm text-gray-400">The Assembly - Geometric architecture forms</p>
            </div>
            <div className="p-6 border border-cyan-500/20 rounded-lg bg-cyan-500/5">
              <h3 className="text-cyan-400 font-semibold mb-2">Phase 7-12s</h3>
              <p className="text-sm text-gray-400">The Reveal - Identity manifests and transitions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingDemo;
