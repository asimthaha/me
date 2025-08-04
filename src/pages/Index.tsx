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
      <HeroSection />
      <AboutMeSection />
      <ProjectsSection />
      <SkillsSection />
    </main>
  );
};

export default Index;
