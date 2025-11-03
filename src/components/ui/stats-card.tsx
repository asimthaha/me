import { LucideIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delay: number;
}

/**
 * Premium stats card with 3D hover effects and animations
 * Features glass morphism, gradient borders, and counter animations
 */
export const StatsCard = ({
  icon: Icon,
  label,
  value,
  delay,
}: StatsCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Gradient border effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-0 blur-sm transition-opacity duration-500 ${
          isHovered ? "opacity-50" : ""
        }`}
      />

      {/* Main card */}
      <div className="relative bg-background/60 backdrop-blur-xl border border-border/20 rounded-2xl p-8 hover-lift transition-all duration-300">
        {/* Icon container */}
        <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="w-7 h-7 text-primary transition-colors duration-300 group-hover:text-accent" />
        </div>

        {/* Value with counter animation */}
        <div className="text-4xl md:text-4xl font-bold mb-3 font-mono bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {isVisible ? value : "00"}
        </div>

        {/* Label */}
        <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </div>

        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-100" : ""
          }`}
        />
      </div>
    </div>
  );
};
