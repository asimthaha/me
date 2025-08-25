import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, FileText, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  demoUrl: string;
  codeUrl: string;
  caseStudyUrl?: string | null;
  category: "frontend" | "fullstack" | "webgl" | "ai";
  featured?: boolean;
}

interface InteractiveProjectCardProps {
  project: Project;
  index: number;
  onExpand?: (project: Project) => void;
}

/**
 * Interactive Project Card with micro-animations and glassmorphism design
 * Features hover effects, tilt animations, and interactive previews
 */
export const InteractiveProjectCard = ({
  project,
  index,
  onExpand,
}: InteractiveProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform:
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
    });
  };

  // Intersection Observer for reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log("Card intersection:", entry.isIntersecting, entry.target);
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            console.log("Added animate-fade-in to card");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      console.log("Setting up card observer for:", cardRef.current);
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getCategoryIcon = () => {
    switch (project.category) {
      case "webgl":
        return "🎮";
      case "ai":
        return "🤖";
      case "fullstack":
        return "⚡";
      default:
        return "💻";
    }
  };

  return (
    <article
      ref={cardRef}
      className={cn(
        "group relative flex flex-col min-h-full bg-background/60 backdrop-blur-md border border-border/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 opacity-0 translate-y-8",
        "hover:border-primary/20 hover:bg-background/80"
      )}
      style={{
        ...tiltStyle,
        transitionDelay: `${index * 100}ms`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-10">
          <Badge
            variant="default"
            className="bg-primary/90 text-primary-foreground"
          >
            Featured
          </Badge>
        </div>
      )}

      {/* Category Icon */}
      <div className="absolute top-4 right-4 z-10 text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
        {getCategoryIcon()}
      </div>

      {/* Project Image with Interactive Overlay */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={project.image}
          alt={`${project.title} preview`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Interactive Preview Overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500",
            isHovered ? "opacity-100 backdrop-blur-sm" : "opacity-0"
          )}
        >
          <div className="flex gap-3">
            <Button
              size="sm"
              className="bg-background/90 text-foreground border border-border/20 hover:bg-primary hover:text-primary-foreground shadow-lg"
              onClick={() => window.open(project.demoUrl)}
            >
              <Play className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-background/90 border-border/20 hover:bg-background shadow-lg"
              onClick={() => onExpand?.(project)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex-grow flex flex-col">
        {/* Title & Description */}
        <div className="space-y-2 flex-grow">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="text-xs bg-secondary/50 hover:bg-secondary/80 transition-colors"
            >
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.techStack.length - 4} more
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" asChild>
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4" />
            </a>
          </Button>
          {project.caseStudyUrl && (
            <Button size="sm" variant="ghost" asChild>
              <a
                href={project.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Glassmorphism border effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </article>
  );
};
