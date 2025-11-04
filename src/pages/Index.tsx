import { useRef } from "react";
import { HeroSection } from "@/components/hero-section";
import AboutMeSection from "@/components/about-me-section";
import { Navbar } from "@/components/navbar";
import ProjectsSection from "@/components/projects-section";
import ServicesSection from "@/components/services-section";
import { ForwardTimer } from "@/components/forward-timer";
import DevelopmentImpact from "@/components/development-impact";
import Footer from "@/components/footer";

/**
 * Developer Portfolio Homepage
 * Features immersive snap scrolling experience across all sections
 * Optimized for accessibility, performance, and smooth navigation
 */
const Index = () => {
  const scrollContainerRef = useRef(null);
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
      <section id="services" className="snap-start" data-snap-section>
        <ServicesSection />
      </section>
      <section id="development-impact" className="snap-start" data-snap-section>
        <DevelopmentImpact />
      </section>
      <section id="footer" className="snap-start" data-snap-section>
        <Footer />
      </section>
      {/* Forward Timer */}
      <ForwardTimer />
    </main>
  );
};

export default Index;
