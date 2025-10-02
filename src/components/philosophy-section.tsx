import { useEffect, useRef } from "react";
import { Code, Heart, Lightbulb, Target } from "lucide-react";

export const PhilosophySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-reveal]");
            elements.forEach((el, index) => {
              if (el instanceof HTMLElement) {
                setTimeout(() => {
                  el.classList.add("animate-fade-in");
                }, index * 150);
              }
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const philosophyPoints = [
    {
      icon: Code,
      title: "Clean Code Philosophy",
      description:
        "Every line of code tells a story. I believe in writing readable, maintainable code that speaks to both machines and fellow developers.",
    },
    {
      icon: Lightbulb,
      title: "Innovation Through Simplicity",
      description:
        "Great solutions often come from simple ideas. I focus on elegant, straightforward approaches that solve complex problems effectively.",
    },
    {
      icon: Target,
      title: "User-Centric Development",
      description:
        "Technology exists to serve people. Every project starts with understanding user needs and crafting experiences that delight and empower.",
    },
    {
      icon: Heart,
      title: "Passion for Learning",
      description:
        "The tech landscape evolves rapidly. I embrace continuous learning, staying curious and adapting to new technologies and methodologies.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-24 px-6 bg-gradient-to-br from-background via-background to-accent/5"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-heading text-foreground mb-6">
            My Philosophy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Guiding principles that shape how I approach development, design,
            and collaboration.
          </p>
        </div>

        {/* Philosophy Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {philosophyPoints.map((point, index) => (
            <div
              key={index}
              className="group bg-background/60 backdrop-blur-md border border-border/20 rounded-2xl p-8 hover-scale opacity-0 translate-y-8"
              data-reveal
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <point.icon className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading text-foreground mb-3">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Core Values Quote */}
        <div className="text-center">
          <blockquote className="text-2xl font-heading text-foreground/80 italic max-w-4xl mx-auto leading-relaxed">
            "I believe that great software is not just about functionality—it's
            about creating experiences that matter, solving real problems, and
            leaving a positive impact on the world."
          </blockquote>
          <cite className="text-accent font-accent mt-6 block">
            — Alex Thompson
          </cite>
        </div>
      </div>
    </section>
  );
};
