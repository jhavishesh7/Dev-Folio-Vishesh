import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simple password authentication - you can change this password
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("admin_authenticated", "true");
        toast({
          title: "Success",
          description: "Login successful!",
        });
        navigate("/admin/blogs");
      } else {
        toast({
          title: "Error",
          description: "Invalid password",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-card/80 border-2 border-primary rounded-xl p-8 neon-border-cyan backdrop-blur-md shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-4"
            >
              <Terminal className="w-12 h-12 text-primary mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 terminal-text glow-text-cyan">
              ADMIN_ACCESS.exe
            </h1>
            <p className="text-muted-foreground terminal-text text-sm">
              Enter credentials to access admin panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 terminal-text text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pl-10 terminal-text"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full terminal-text"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary terminal-text transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

