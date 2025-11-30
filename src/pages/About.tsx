import { useRef, useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import SkillsSection from "@/components/skills-section";
import ExperienceTreeSection from "@/components/experience-tree-section";
import { ExperienceFilter } from "@/components/experience-filter";
import { ForwardTimer } from "@/components/forward-timer";
import { useIsMobile } from "@/hooks/use-mobile";
import { experienceNodes } from "@/lib/data";
import { CTASection } from "@/components/cta-section";
import { GenericCarousel } from "@/components/GenericCarousel";
import { ExperienceCard } from "@/components/experience-card";
import { AnimatePresence, motion } from "framer-motion";

/**
 * About Page - Dedicated page for developer introduction and background
 * Features immersive snap scrolling experience optimized for storytelling
 */
const About = () => {
  const scrollContainerRef = useRef(null);
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");

  const filteredNodes = useMemo(() => {
    if (filter === "all") return experienceNodes;
    return experienceNodes.filter((node) => node.type === filter);
  }, [filter]);

  const counts = useMemo(() => {
    const acc = { all: experienceNodes.length } as Record<string, number>;
    experienceNodes.forEach((node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
    });
    return acc;
  }, []);

  return (
    <main ref={scrollContainerRef} className="relative bg-background">
      <Navbar scrollContainerRef={scrollContainerRef} />
      <SkillsSection />

      <section className="snap-start min-h-screen flex flex-col relative pt-24">
        {/* Sticky Filter Bar */}
        <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md border-b border-border/40 mb-8">
          <div className="max-w-7xl mx-auto w-full">
            <ExperienceFilter
              activeFilter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {isMobile ? (
            <div className="px-4 sm:px-6 lg:px-8">
              {/* 2. IMPLEMENTED ANIMATE PRESENCE HERE */}
              {/* mode='wait' ensures the old content leaves before new enters */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={filter} // Changing the key triggers the exit/enter animation
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} // The 'leaving' animation
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {filteredNodes.length > 0 ? (
                    <GenericCarousel
                      items={filteredNodes}
                      getKey={(node) => node.id}
                      itemClassName="pl-4 basis-full sm:basis-1/2 flex"
                      renderItem={(node) => <ExperienceCard node={node} />}
                    />
                  ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                        <span className="text-2xl">∅</span>
                      </div>
                      <p>No entries found for this category.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            // Desktop Tree View
            <ExperienceTreeSection experienceNodes={filteredNodes} />
          )}
        </div>
      </section>

      <section className="snap-start relative z-10 bg-background px-40">
        <CTASection
          title="Let’s Build Something Together"
          description="I’m always open to new opportunities..."
          primaryCta={{
            label: "Get in Touch",
            href: "/contacts",
            variant: "solid",
          }}
          variant="boxed"
          animated={false}
        />
      </section>
      <ForwardTimer />
    </main>
  );
};

export default About;
