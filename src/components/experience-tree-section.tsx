import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Trophy } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceNodes, ExperienceNode } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Experience Tree Section Component
 * Visualizes professional journey using recursive tree animation
 * Matches blueprint aesthetic of the Tech Stack section
 */
const ExperienceTreeSection = () => {
  const treeRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered tree growth animation
  useEffect(() => {
    if (!treeRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // {/** CHANGED: Updated GSAP logic to grow trunk from top to bottom */}
      // Animate tree "trunk" growing from top to bottom
      gsap.from(treeRef.current, {
        scaleY: 0, // Start from 0 scale
        transformOrigin: "top center", // Grow from the top
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current, // The whole section
          start: "top 50%", // Start when the top of the section hits the middle of the screen
          end: "bottom 80%", // End when the bottom of the section hits 80% from the top
          scrub: 1, // Link animation progress to scroll progress
        },
      });
    }, sectionRef); // Scope context to the section

    return () => ctx.revert();
  }, []);

  // Get icon based on experience type
  const getTypeIcon = (type: ExperienceNode["type"]) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "work":
        return <Briefcase className={iconClass} />;
      case "education":
        return <GraduationCap className={iconClass} />;
      case "certification":
        return <Award className={iconClass} />;
      case "milestone":
        return <Trophy className={iconClass} />;
    }
  };

  // Get type color for badges
  const getTypeColor = (type: ExperienceNode["type"]) => {
    switch (type) {
      case "work":
        return "text-primary bg-primary/10 border-primary/20";
      case "education":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "certification":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "milestone":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 px-4 md:px-8 overflow-hidden"
    >
      {/* Blueprint grid background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center gap-6 mb-4">
            <div className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Section_02
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-muted-foreground/30 to-transparent"></div>
          </div>

          <h2
            id="experience-heading"
            className="text-4xl md:text-5xl text-start font-bold text-foreground mb-4 font-mono uppercase tracking-wide"
          >
            Professinal Journey
          </h2>

          <p className="text-start text-lg text-muted-foreground max-w-2xl font-mono">
            Interactive visualization of career growth and key milestones
          </p>
        </motion.div>

        {/* {/** CHANGED: Parent container for timeline layout **} */}
        <div className="relative py-8">
          {/* {/** ADDED: Central timeline "trunk" - animated with GSAP **} */}
          <div
            ref={treeRef}
            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 -translate-x-1/2 hidden md:block"
          />

          {/* Experience Timeline */}
          <div className="space-y-8">
            {experienceNodes.map((node, index) => (
              // {/** CHANGED: Wrapper for each timeline item (row) **}
              <div
                key={node.id}
                className={`relative w-full flex ${
                  index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* {/** ADDED: Timeline "dot" for this entry (desktop only) **} */}
                <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full z-10" />

                {/* {/** CHANGED: Card wrapper with alternating animation **} */}
                <motion.div
                  className="w-full md:w-[calc(50%-2.5rem)]" // 50% width minus gap
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Card className="font-mono group hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                                node.type
                              )}`}
                            >
                              {getTypeIcon(node.type)}
                              {node.type.charAt(0).toUpperCase() +
                                node.type.slice(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {node.period.start} - {node.period.end}
                            </span>
                          </div>
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                            {node.title}
                          </CardTitle>
                          <CardDescription className="text-base mt-1">
                            {node.company} • {node.location}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent
                      className="space-y-4 pt-0 max-h-0 opacity-0 
                                 group-hover:max-h-[1000px] group-hover:opacity-100 group-hover:pt-6 
                                 transition-all duration-700 ease-in-out overflow-hidden"
                    >
                      {/* Description */}
                      <ul className="space-y-2">
                        {node.description.map((desc, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-foreground/80"
                          >
                            <span className="text-primary mt-1">▹</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {node.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono px-2.5 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Highlights */}
                      {node.highlights.length > 0 && (
                        <div className="pt-3 border-t border-border/50">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Key Achievements
                          </h4>
                          <ul className="space-y-1">
                            {node.highlights.map((highlight, i) => (
                              <li
                                key={i}
                                className="text-sm text-foreground/70 flex items-start gap-2"
                              >
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Metrics */}
                      {node.metrics && node.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-3 pt-2">
                          {node.metrics.map((metric, i) => (
                            <div
                              key={i}
                              className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-lg"
                            >
                              <span className="text-xs font-semibold text-primary">
                                {metric}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom blueprint accent */}
        <div className="relative z-10 mt-16 flex justify-center">
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <div className="w-8 h-px bg-muted-foreground/30"></div>
            <span>End of Specifications</span>
            <div className="w-8 h-px bg-muted-foreground/30"></div>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </div>
    </section>
  );
};

export default ExperienceTreeSection;
