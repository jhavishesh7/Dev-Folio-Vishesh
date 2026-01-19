import { lazy, Suspense, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Hero from "@/components/Hero";

// Lazy load components for better performance
const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const Projects = lazy(() => import("@/components/Projects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Blog = lazy(() => import("@/components/Blog"));
const Contact = lazy(() => import("@/components/Contact"));

// Loading fallback component
const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle blog query parameter redirect
    const blogId = searchParams.get('blog');
    if (blogId) {
      navigate(`/blog/${blogId}`, { replace: true });
      return;
    }
  }, [navigate, searchParams]);

  return (
    <div className="relative w-full">
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Skills />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Education />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Blog />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>
    </div>
  );
};

export default Index;
