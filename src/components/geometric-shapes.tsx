import { useEffect, useRef } from "react";

/**
 * Elegant Geometric Shapes Background Component
 * Features subtle floating geometric forms with refined animations
 */
export const GeometricShapes = ({ scrollContainerRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shapes = containerRef.current?.querySelectorAll(".geometric-shape");
    shapes?.forEach((shape, index) => {
      const element = shape as HTMLElement;
      // Add subtle floating animation with different delays
      element.style.animationDelay = `${index * 2}s`;
      element.style.animationDuration = `${8 + (index % 3) * 2}s`;
    });
  }, []);

  // Parallax effect for hero section only
  useEffect(() => {
    if (!scrollContainerRef?.current) return;

    const handleScroll = () => {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const parallaxElements = containerRef.current?.querySelectorAll('.parallax-shape');

      parallaxElements?.forEach((element, index) => {
        const speed = 0.3 + (index * 0.2); // Different speeds for each element
        const yPos = -(scrollTop * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    scrollContainerRef.current.addEventListener('scroll', handleScroll);
    return () => scrollContainerRef.current?.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* Large geometric shapes */}
      <div className="geometric-shape parallax-shape absolute top-20 left-10 w-32 h-32 border border-accent/10 rotate-45 animate-float opacity-20" />
      <div
        className="geometric-shape absolute top-1/3 right-20 w-24 h-24 border border-primary/10 rotate-12 animate-float opacity-15"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="geometric-shape parallax-shape absolute bottom-32 left-1/4 w-20 h-20 border border-accent/10 rounded-full animate-float opacity-25"
        style={{ animationDelay: "2s" }}
      />

      {/* Medium geometric shapes */}
      <div
        className="geometric-shape absolute top-1/2 left-20 w-16 h-16 border border-primary/5 rotate-60 animate-float opacity-20"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="geometric-shape absolute bottom-1/4 right-1/3 w-14 h-14 border border-accent/5 rotate-30 animate-float opacity-15"
        style={{ animationDelay: "4s" }}
      />

      {/* Small geometric accents */}
      <div
        className="geometric-shape absolute top-3/4 left-1/2 w-8 h-8 border border-primary/10 rounded-full animate-float opacity-30"
        style={{ animationDelay: "5s" }}
      />
      <div
        className="geometric-shape absolute top-1/4 right-10 w-6 h-6 border border-accent/10 rotate-45 animate-float opacity-25"
        style={{ animationDelay: "6s" }}
      />

      {/* Subtle gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-primary/1 to-transparent opacity-50" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-transparent via-accent/0.5 to-transparent opacity-30" />
    </div>
  );
};
