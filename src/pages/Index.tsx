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

    // AGGRESSIVE hash prevention - run immediately
    const removeHashAndScrollTop = () => {
      // Specifically prevent #contact hash from causing scroll
      if (window.location.hash && window.location.hash.includes('contact')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } else if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Run immediately and repeatedly
    removeHashAndScrollTop();
    
    // Run on every possible timing for longer period to catch post-loading scroll
    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i <= 5000; i += 50) {
      timers.push(setTimeout(removeHashAndScrollTop, i));
    }

    // Prevent hash navigation for first 5 seconds (longer to catch post-loading scroll)
    let allowHashNav = false;
    const enableNav = setTimeout(() => {
      allowHashNav = true;
    }, 5000);

    // Block all hash changes during initial load
    const blockHashChange = (e: HashChangeEvent) => {
      // Always block #contact hash navigation
      if (window.location.hash && window.location.hash.includes('contact')) {
        e.preventDefault();
        removeHashAndScrollTop();
        return;
      }
      if (!allowHashNav) {
        e.preventDefault();
        removeHashAndScrollTop();
      }
    };

    // Intercept anchor clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      // Always prevent #contact links from scrolling during initial load
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.includes('contact') && !allowHashNav) {
          e.preventDefault();
          e.stopPropagation();
          removeHashAndScrollTop();
          return;
        }
        if (!allowHashNav) {
          e.preventDefault();
          e.stopPropagation();
          removeHashAndScrollTop();
        }
      }
    };

    // Continuous scroll prevention - prevent scroll to contact section
    let scrollCheckInterval: NodeJS.Timeout;
    const startScrollCheck = () => {
      scrollCheckInterval = setInterval(() => {
        // If there's a contact hash, remove it and scroll to top
        if (window.location.hash && window.location.hash.includes('contact')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        if (!allowHashNav && (window.scrollY > 100 || document.documentElement.scrollTop > 100)) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }, 10);
    };
    startScrollCheck();

    window.addEventListener('hashchange', blockHashChange, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      clearTimeout(enableNav);
      timers.forEach(clearTimeout);
      clearInterval(scrollCheckInterval);
      window.removeEventListener('hashchange', blockHashChange, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [navigate, searchParams]);

  return (
    <div className="relative w-full overflow-hidden">
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
