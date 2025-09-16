import { useRef } from "react";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import AboutMeSection from "@/components/about-me-section";
import ProjectsSection from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";
import { ForwardTimer } from "@/components/forward-timer";
import DevelopmentImpact from "@/components/development-impact";
import Footer from "@/components/footer";
import { useSlingshotOverscroll } from "@/hooks/use-slingshot-overscroll";

/**
 * Developer Portfolio Homepage
 * Features immersive snap scrolling experience across all sections
 * Optimized for accessibility, performance, and smooth navigation
 */
const Index = () => {
  const scrollContainerRef = useRef(null);
  
  // Enable slingshot overscroll effect
  useSlingshotOverscroll();
  
  return (
    <main
      ref={scrollContainerRef}
      data-snap-container
      className="relative bg-background snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth scrollbar-hide"
    >
      <Navbar scrollContainerRef={scrollContainerRef} />
      <section id="home" className="snap-start h-screen" data-snap-section>
        <HeroSection />
      </section>
      <section id="about" className="snap-start" data-snap-section>
        <AboutMeSection />
      </section>
      <section
        id="projects"
        className="snap-start min-h-screen"
        data-snap-section
      >
        <ProjectsSection />
      </section>
      <section
        id="skills"
        className="snap-start min-h-screen"
        data-snap-section
      >
        <SkillsSection />
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
