import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CyberpunkLoadingAnimation from "@/components/CyberpunkLoadingAnimation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoadingDemo from "./pages/LoadingDemo";
import GenesisPulseDemo from "./pages/GenesisPulseDemo";
import BlogPage from "./pages/BlogPage";
import AdminLogin from "./pages/admin/AdminLogin";
import BlogList from "./pages/admin/BlogList";
import BlogEditor from "./pages/admin/BlogEditor";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Prevent scrolling during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      // Ensure we're at top during loading
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  useEffect(() => {
    // Prevent browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Ensure page starts at top on mount
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Remove hash immediately
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    // Force scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
      // Ensure page scrolls to top again
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Remove any hash from URL that might cause scrolling
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }, 100);
  };

  return (
    <>
      {isLoading && <CyberpunkLoadingAnimation onComplete={handleLoadingComplete} />}
      {showContent && (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/loading-demo" element={<LoadingDemo />} />
                <Route path="/genesis-pulse" element={<GenesisPulseDemo />} />
                <Route path="/blog/:id" element={<BlogPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/blogs"
                  element={
                    <ProtectedRoute>
                      <BlogList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs/new"
                  element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs/:id"
                  element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  }
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default App;
