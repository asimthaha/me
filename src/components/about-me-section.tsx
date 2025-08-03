/**
 * About Me Section - Retro Gaming Themed
 * CRO-optimized, fully responsive section with scroll animations
 */

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PacManIntroOverlay from "./pacman-intro-overlay";

const AboutMeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-reveal");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background py-20 px-4 overflow-hidden"
    >
      {/* Pac-Man Intro Overlay */}
      {showIntro && <PacManIntroOverlay onComplete={handleIntroComplete} />}
      {/* Retro scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanlines" />
      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        {/* Opening Line with blinking cursor */}
        <div className="reveal-on-scroll opacity-0 translate-y-8">
          <h1 className="font-retro text-4xl md:text-6xl lg:text-7xl text-foreground mb-4">
            Hey, I'm Alex<span className="blinking-cursor">_</span>
          </h1>
        </div>

        {/* Narrative Block 1 */}
        <div className="reveal-on-scroll opacity-0 translate-y-8">
          <p className="font-retro text-sm md:text-base text-muted-foreground leading-relaxed">
            I build things for the web. Sometimes they even work on the first
            try.
          </p>
        </div>
        <div className="reveal-on-scroll opacity-0 translate-y-8">
          <p className="font-retro text-sm md:text-base text-muted-foreground leading-relaxed">
            With over 5 years in the game, I've journeyed through the full
            stack—from crafting snappy UIs with React to architecting robust
            backends with Node.js and Python.
          </p>
        </div>

        {/* Status Panel */}
        <div className="reveal-on-scroll opacity-0 translate-y-8">
          <div className="relative">
            {/* Status title on border */}
            <div className="absolute -top-3 left-6 bg-background px-2">
              <span className="font-retro text-sm text-primary">
                [ STATUS ]
              </span>
            </div>

            {/* Pixelated border container */}
            <div className="pixelated-border bg-card p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Mission */}
                <div className="space-y-2">
                  <h3 className="font-retro text-xs text-primary">
                    // CURRENT MISSION:
                  </h3>
                  <p className="font-body text-sm text-card-foreground">
                    "Solving real-world problems with clean, efficient code."
                  </p>
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <h3 className="font-retro text-xs text-primary">// LEVEL:</h3>
                  <p className="font-body text-sm text-card-foreground">
                    "Junior Software Developer"
                  </p>
                </div>

                {/* Toolkit */}
                <div className="space-y-2 md:col-span-2">
                  <h3 className="font-retro text-xs text-primary">
                    // TOOLKIT:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-secondary text-secondary-foreground font-body text-xs rounded border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Loading Progress */}
                <div className="space-y-2 md:col-span-2">
                  <h3 className="font-retro text-xs text-primary">
                    // LOADING...
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-body text-sm text-card-foreground">
                        PASSION.EXE
                      </span>
                      <span className="font-body text-sm text-muted-foreground">
                        85%
                      </span>
                    </div>
                    <Progress value={85} className="h-2 retro-progress" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="reveal-on-scroll opacity-0 translate-y-8 space-y-6 text-center">
          <p className="font-retro text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mx-auto">
            Think we could build something great together?
          </p>

          <Button
            variant="outline"
            size="lg"
            className="pixelated-border-button font-retro text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            START
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
