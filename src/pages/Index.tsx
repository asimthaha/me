import { HeroSection } from '@/components/hero-section';
import { Navbar } from '@/components/navbar';
import AboutMeSection from '@/components/about-me-section';
import ProjectsSection from '@/components/projects-section';
import SkillsSection from '@/components/skills-section';
import ContactSection from '@/components/contact-section';

/**
 * Developer Portfolio Homepage  
 * Features immersive snap scrolling experience across all sections
 * Optimized for accessibility, performance, and smooth navigation
 */
const Index = () => {
  return (
    <main className="relative bg-background snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
      <Navbar />
      <section id="home" className="snap-start h-screen" data-snap-section>
        <HeroSection />
      </section>
      <section id="about" className="snap-start" data-snap-section>
        <AboutMeSection />
      </section>
      <section id="projects" className="snap-start min-h-screen" data-snap-section>
        <ProjectsSection />
      </section>
      <section id="skills" className="snap-start min-h-screen" data-snap-section>
        <SkillsSection />
      </section>
      <section id="contact" className="snap-start min-h-screen" data-snap-section>
        <ContactSection />
      </section>
    </main>
  );
};

export default Index;
