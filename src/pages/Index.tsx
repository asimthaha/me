import { useRef, useState, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import ProjectsSection from "@/components/projects-section";
import { ForwardTimer } from "@/components/forward-timer";
import DevelopmentImpact from "@/components/development-impact";
import Footer from "@/components/footer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useSlingshotOverscroll } from "@/hooks/use-slingshot-overscroll";

/**
 * Developer Portfolio Homepage
 * Features immersive snap scrolling experience across all sections
 * Optimized for accessibility, performance, and smooth navigation
 */
const Index = () => {
  const scrollContainerRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");

  // Enable slingshot overscroll effect
  useSlingshotOverscroll();

  const sections = ["home", "projects", "impact"];

  // Track active section for progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      
      if (scrollTop < windowHeight * 0.5) {
        setActiveSection("home");
      } else if (scrollTop < windowHeight * 1.5) {
        setActiveSection("projects");
      } else {
        setActiveSection("impact");
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <main
      ref={scrollContainerRef}
      data-snap-container
      className="relative bg-background snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth scrollbar-hide"
    >
      <ProgressIndicator sections={sections} activeSection={activeSection} />
      <Navbar scrollContainerRef={scrollContainerRef} />
      <section id="home" className="snap-start h-screen" data-snap-section>
        <HeroSection />
      </section>
      <section
        id="projects"
        className="snap-start min-h-screen"
        data-snap-section
      >
        <ProjectsSection />
      </section>
      <section id="development-impact" className="snap-start" data-snap-section>
        <DevelopmentImpact />
      </section>
      {/* Forward Timer */}
      <ForwardTimer />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;
