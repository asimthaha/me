import { HeroSection } from '@/components/hero-section';
import { Navbar } from '@/components/navbar';
import AboutMeSection from '@/components/about-me-section';
import ProjectsSection from '@/components/projects-section';
import SkillsSection from '@/components/skills-section';

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
      <section id="contact" className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Contact</h2>
          <p className="text-muted-foreground">Contact section coming soon...</p>
        </div>
      </section>
    </main>
  );
};

export default Index;
