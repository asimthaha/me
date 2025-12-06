import { useRef } from "react";
import { HeroSection } from "@/components/hero-section";
import AboutMeSection from "@/components/about-me-section";
import { Navbar } from "@/components/navbar";
import ProjectsSection from "@/components/projects-section";
import ServicesSection from "@/components/services-section";
import DevelopmentImpact from "@/components/development-impact";
import Footer from "@/components/footer";
import Meteors from "@/components/ui/meteors"; // Adjust path as needed

const Index = () => {
  const scrollContainerRef = useRef(null);

  return (
    // Main Container
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background">
      {/* 1. BACKGROUND LAYER 
        Placed outside the scroll container with 'fixed' or 'absolute inset-0'.
        pointer-events-none is CRITICAL so users can still scroll/click content.
      */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Meteors number={20} />
      </div>

      {/* 2. SCROLL LAYER 
        Added 'z-10' and 'relative' to ensure content sits above meteors.
        Background of sections should ideally be transparent or semi-transparent 
        for meteors to show through.
      */}
      <main
        ref={scrollContainerRef}
        data-snap-container
        className="relative z-10   h-full w-full overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar-hide snap-none md:snap-y md:snap-mandatory"
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
    </div>
  );
};

export default Index;
