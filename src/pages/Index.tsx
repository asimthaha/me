import { useRef, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import ProjectsSection from "@/components/projects-section";
import AboutMeSection from "@/components/about-me-section";
import { PhilosophySection } from "@/components/philosophy-section";
import { CollaborationSection } from "@/components/collaboration-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ForwardTimer } from "@/components/forward-timer";
import DevelopmentImpact from "@/components/development-impact";
import Footer from "@/components/footer";
import { useSlingshotOverscroll } from "@/hooks/use-slingshot-overscroll";
import { useAnalytics } from "@/hooks/use-analytics";

/**
 * Developer Portfolio Homepage
 * Features immersive snap scrolling experience across all sections
 * Optimized for accessibility, performance, and smooth navigation
 */
const Index = () => {
  const scrollContainerRef = useRef(null);
  const { trackSectionVisit, trackScrollDepth } = useAnalytics();

  // Enable slingshot overscroll effect
  useSlingshotOverscroll();

  // Track section visibility for analytics
  useEffect(() => {
    const sections = document.querySelectorAll("[data-snap-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id || "unknown";
            trackSectionVisit(sectionId);
          }
        });
      },
      { threshold: 0.5, root: scrollContainerRef.current }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [trackSectionVisit]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        const scrollHeight =
          scrollContainerRef.current.scrollHeight -
          scrollContainerRef.current.clientHeight;
        const depth =
          scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
        trackScrollDepth(depth);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [trackScrollDepth]);

  return (
    <main
      id="main-content"
      ref={scrollContainerRef}
      data-snap-container
      className="relative bg-background snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth scrollbar-hide"
      role="main"
    >
      <Navbar scrollContainerRef={scrollContainerRef} />
      <section id="home" className="snap-start h-screen" data-snap-section>
        <HeroSection scrollContainerRef={scrollContainerRef} />
      </section>
      <section
        id="projects"
        className="snap-start min-h-screen"
        data-snap-section
      >
        <ProjectsSection />
      </section>
      <section id="about" className="snap-start" data-snap-section>
        <AboutMeSection />
      </section>

      <section id="philosophy" className="snap-start" data-snap-section>
        <PhilosophySection />
      </section>

      <section id="testimonials" className="snap-start" data-snap-section>
        <TestimonialsSection />
      </section>

      <section id="collaboration" className="snap-start" data-snap-section>
        <CollaborationSection />
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
