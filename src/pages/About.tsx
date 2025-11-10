import { useRef } from "react";
import { Navbar } from "@/components/navbar";
import SkillsSection from "@/components/skills-section";
import ExperienceTreeSection from "@/components/experience-tree-section";
import { ExperienceCarousel } from "@/components/experience-carousel";
import { ForwardTimer } from "@/components/forward-timer";
import { useIsMobile } from "@/hooks/use-mobile";
import { experienceNodes } from "@/lib/data";
import { CTASection } from "@/components/cta-section";

/**
 * About Page - Dedicated page for developer introduction and background
 * Features immersive snap scrolling experience optimized for storytelling
 */
const About = () => {
  const scrollContainerRef = useRef(null);
  const isMobile = useIsMobile();

  return (
    <main ref={scrollContainerRef} className="relative bg-background">
      <Navbar scrollContainerRef={scrollContainerRef} />
      <SkillsSection />
      {isMobile ? (
        <ExperienceCarousel nodes={experienceNodes} />
      ) : (
        <ExperienceTreeSection experienceNodes={experienceNodes} />
      )}
      <section className="snap-start relative z-10 bg-background">
        <CTASection
          title="Let’s Build Something Together"
          description="I’m always open to new opportunities, collaborations, and interesting projects. If you’d like to chat, feel free to reach out."
          primaryCta={{
            label: "Get in Touch",
            href: "/contacts",
            variant: "solid",
          }}
          variant="default"
          animated={false} // disable reveal animation for now
        />
      </section>
      {/* Forward Timer */}
      <ForwardTimer />
    </main>
  );
};

export default About;
