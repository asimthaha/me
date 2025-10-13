import { useRef } from "react";
import { Navbar } from "@/components/navbar";
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
      <SkillsSection />
    </main>
  );
};

export default About;
