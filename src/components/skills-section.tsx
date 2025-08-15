import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Skill, skillCategories } from "@/lib/data";
import type { SkillCategory } from "@/lib/data";
// Blueprint-style skill level indicators
const SkillLevel: React.FC<{ level?: Skill["level"] }> = ({ level }) => {
  if (!level) return null;

  const dots = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  return (
    <div className="flex gap-1 ml-2" aria-label={`Skill level: ${level}`}>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className={`w-1 h-1 border border-muted-foreground/30 ${
            i < dots[level] ? "bg-accent" : "bg-transparent"
          }`}
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        />
      ))}
    </div>
  );
};

// Individual skill chip component
const SkillChip: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <div className="group relative">
      <Badge
        variant="outline"
        className="blueprint-chip bg-background/50 border-muted-foreground/30 text-foreground hover:border-accent hover:bg-accent/5 transition-all duration-300 font-mono text-xs uppercase tracking-wider"
      >
        <span className="flex items-center gap-1">
          {skill.name}
          <SkillLevel level={skill.level} />
        </span>
      </Badge>

      {/* Blueprint-style tooltip */}
      {skill.yearsOfExperience && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-background border border-muted-foreground/30 px-2 py-1 text-xs font-mono whitespace-nowrap">
            {skill.yearsOfExperience}y exp
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-muted-foreground/30"></div>
        </div>
      )}
    </div>
  );
};

// Skill category component
const SkillCategory: React.FC<{ category: SkillCategory; index: number }> = ({
  category,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-reveal");
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal-on-scroll opacity-0 translate-y-8"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Blueprint-style section header */}
      <div className="relative mb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="text-lg font-semibold text-foreground font-mono uppercase tracking-wide">
            {category.title}
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-muted-foreground/30 to-transparent"></div>
        </div>

        {/* Blueprint grid background */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--muted-foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--muted-foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {category.skills.map((skill, skillIndex) => (
          <SkillChip key={skillIndex} skill={skill} />
        ))}
      </div>
    </div>
  );
};

// Main Skills Section component
const SkillsSection: React.FC = () => {
  return (
    <section
      id="skills"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative"
      aria-labelledby="skills-heading"
    >
      {/* Blueprint background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Section header */}
      <div className="relative z-10 mb-16">
        <div className="flex items-center gap-6 mb-4">
          <div className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Section_03
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-muted-foreground/30 to-transparent"></div>
        </div>

        <h2
          id="skills-heading"
          className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-mono uppercase tracking-wide"
        >
          Tech Stack
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl font-mono">
          Tools I use to design scalable, performant systems.
        </p>

        {/* Blueprint ruler accent */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-4 h-px bg-accent"></div>
          <div className="w-2 h-px bg-muted-foreground/50"></div>
          <div className="w-8 h-px bg-accent"></div>
          <div className="text-xs font-mono text-muted-foreground">
            SPECIFICATIONS
          </div>
        </div>
      </div>

      {/* Skills categories grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {skillCategories.map((category, index) => (
          <SkillCategory key={index} category={category} index={index} />
        ))}
      </div>

      {/* Bottom blueprint accent */}
      <div className="relative z-10 mt-16 flex justify-center">
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <div className="w-8 h-px bg-muted-foreground/30"></div>
          <span>End of Specifications</span>
          <div className="w-8 h-px bg-muted-foreground/30"></div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
