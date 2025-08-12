import { HeroSection } from '@/components/hero-section';
import { Navbar } from '@/components/navbar';
import AboutMeSection from '@/components/about-me-section';
import ProjectsSection from '@/components/projects-section';
import SkillsSection from '@/components/skills-section';
import ContactSection from '@/components/contact-section';

/**
 * Developer Portfolio Homepage
 * Features a CRO-optimized hero section designed for maximum conversion
 */
const Index = () => {
  return (
    <main className="relative bg-background">
      <Navbar />
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <AboutMeSection />
      </section>
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="skills">
        <SkillsSection />
      </section>
      <ContactSection />
    </main>
  );
};

export default Index;
