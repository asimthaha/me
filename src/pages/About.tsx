import { useRef } from "react";
import { Navbar } from "@/components/navbar";
import AboutMeSection from "@/components/about-me-section";
import SkillsSection from "@/components/skills-section";

/**
 * About Page - Dedicated page for developer introduction and background
 * Features immersive snap scrolling experience optimized for storytelling
 */
const About = () => {
  const scrollContainerRef = useRef(null);

  return (
    <main ref={scrollContainerRef} className="relative bg-background">
      <Navbar scrollContainerRef={scrollContainerRef} />
      <AboutMeSection />
      <section
        id="skills"
        className="snap-start min-h-screen"
        data-snap-section
      >
        <SkillsSection />
      </section>
    </main>
  );
};

export default About;
