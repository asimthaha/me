import { useRef } from "react";
import { HeroSection } from "@/components/hero-section";
import AboutMeSection from "@/components/about-me-section";
import { Navbar } from "@/components/navbar";
import ProjectsSection from "@/components/projects-section";
import ServicesSection from "@/components/services-section";
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
      className="relative bg-background h-[100dvh] overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar-hide snap-none md:snap-y md:snap-mandatory"
    >
      <Navbar scrollContainerRef={scrollContainerRef} />
      <section
        id="home"
        className="w-full min-h-[100dvh] md:snap-start"
        data-snap-section
      >
        <HeroSection />
      </section>
      <section
        id="about"
        className="w-full min-h-[100dvh] md:snap-start flex flex-col justify-center"
        data-snap-section
      >
        <AboutMeSection />
      </section>
      <section
        id="projects"
        className="w-full min-h-[100dvh] md:snap-start"
        data-snap-section
      >
        <ProjectsSection />
      </section>
      <section
        id="services"
        className="w-full min-h-[100dvh] md:snap-start flex flex-col justify-center"
        data-snap-section
      >
        <ServicesSection />
      </section>
      <section
        id="development-impact"
        className="w-full min-h-[100dvh] md:snap-start flex flex-col justify-center"
        data-snap-section
      >
        <DevelopmentImpact />
      </section>
      <section id="footer" className="w-full md:snap-start" data-snap-section>
        <Footer />
      </section>
    </main>
  );
};

export default Index;
