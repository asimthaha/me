import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

import ParticlePortrait from "./ParticlePortrait";
import StaticPortraitCarousel from "./StaticPortraitCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVisibilityAnimation } from "@/hooks/useIntersectionObserver";
import { profileLinks } from "@/lib/data";

interface HeroSectionProps {
  className?: string;
}

/**
 * CRO-optimized Hero Section for software developer portfolio
 * Features:
 * - Mobile-first responsive design
 * - Accessibility optimized (ARIA labels, keyboard navigation)
 * - Performance optimized (lazy loading, efficient animations)
 * - A/B testing ready with modular structure
 */
export const HeroSection = React.memo(function HeroSection({
  className,
}: HeroSectionProps) {
  // Use intersection observer for performance
  const { ref: heroRef, shouldAnimate } = useVisibilityAnimation({
    threshold: 0.2,
  });

  const isMobile = useIsMobile();

  return (
    <section
      ref={heroRef}
      className={`h-screen flex items-center justify-center px-4 py-16 ${className}`}
      aria-label="Hero section"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Section - Mobile First */}
          <div
            className={`text-center lg:text-left order-2 lg:order-1 space-y-8 transition-opacity duration-700 relative z-20 ${
              shouldAnimate ? "animate-fade-in" : "opacity-0"
            }`}
          >
            {/* Main Headline - Simplified and Clean */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8">
              <span className="block">Building</span>
              <span className="block text-gradient">Digital Solutions</span>
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Full-stack developer crafting scalable web applications with
              React, Node.js, and cloud architecture.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              {/* Secondary CTA */}
              <Button
                variant="hero-secondary"
                size="hero-lg"
                aria-label="Get in touch"
              >
                Get In Touch
              </Button>
            </div>

            <div className="flex gap-4 justify-center lg:justify-start">
              {/* 2. Use <Button asChild> and wrap with <a> */}
              <Button
                asChild // <-- 3. Add asChild
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border border-muted-foreground/20 hover:border-accent hover:bg-accent transition-smooth"
              >
                <a
                  href={profileLinks.github} // <-- 4. Use link from object
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit GitHub profile"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>

              <Button
                asChild // <-- 3. Add asChild
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border border-muted-foreground/20 hover:border-accent hover:bg-accent transition-smooth"
              >
                <a
                  href={profileLinks.linkedin} // <-- 4. Use link from object
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit LinkedIn profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>

              <Button
                asChild // <-- 3. Add asChild
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border border-muted-foreground/20 hover:border-accent hover:bg-accent transition-smooth"
              >
                <a
                  href={profileLinks.stackOverflow} // <-- 4. Use link from object
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Stack Overflow profile"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>

          {/* Profile Image Section with Animated Blob and Clouds */}
          <div className="order-1 lg:order-2 flex justify-center relative z-10">
            {/* Profile image container */}
            <div className="z-10 w-full h-full sm:mt-10 sm:w-80 sm:h-80 rounded-full overflow-hidden hover:blob-shadow transition-smooth hover:scale-105 hover:cursor-pointer">
              {isMobile ? <StaticPortraitCarousel /> : <ParticlePortrait />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
