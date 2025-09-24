import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, ExternalLink, ArrowRight, Mail, Download, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import profileImage from "@/assets/developer-profile.jpg";
import RecursiveTree from "./recursive-tree";
import { useVisibilityAnimation } from "@/hooks/useIntersectionObserver";
import ErrorBoundary from "./ui/ErrorBoundary";
import { TypewriterText } from "@/components/typewriter-text";
import { cn } from "@/lib/utils";

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

  // Memoize static styles
  const profileImageStyle = useMemo(
    () => ({
      width: "280px",
      height: "280px",
      transform: "translate(-5%, -5%)",
    }),
    []
  );

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
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 mb-6 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Available for Projects
              </span>
            </div>

            {/* Main Headline with Typewriter Effect */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              <TypewriterText 
                text="Hi, I'm Asim" 
                speed={100}
                className="inline block"
              />
              <br />
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Full Stack Developer
              </span>
              <br />
              <span className="text-lg md:text-xl lg:text-2xl font-light text-muted-foreground">
                Crafting premium digital experiences
              </span>
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              3+ years of experience building scalable web applications with
              React, Node.js, and modern cloud architecture. Let's create something amazing together.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              {/* Primary CTA - High contrast, action-focused */}
              <Button 
                size="lg" 
                className="btn-gradient hover:opacity-90 text-white shadow-lg group"
                asChild
              >
                <Link to="/projects">
                  <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              {/* Secondary CTA */}
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border/20 bg-background/50 hover:bg-background hover:text-foreground shadow-lg group"
                asChild
              >
                <Link to="/contacts">
                  <Mail className="mr-2 h-4 w-4" />
                  Let's Connect
                </Link>
              </Button>
            </div>

            {/* Social Links - Professional networking */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border border-muted-foreground/20 hover:border-accent hover:bg-accent/10 transition-smooth"
                aria-label="Visit GitHub profile"
              >
                <Github className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border border-muted-foreground/20 hover:border-accent hover:bg-accent/10 transition-smooth"
                aria-label="Visit LinkedIn profile"
              >
                <Linkedin className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border border-muted-foreground/20 hover:border-accent hover:bg-accent/10 transition-smooth"
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
              </Button>
            </div>
          </div>

          {/* Profile Image Section with Animated Blob and Clouds */}
          <div className="order-1 lg:order-2 flex justify-center relative z-10">
            <div className="relative">
              {/* Simplified Cloud Elements */}
              <div
                className="absolute inset-0 pointer-events-none motion-reduce:hidden"
                aria-hidden="true"
              >
                {/* Primary cloud - top left */}
                <div
                  className="absolute opacity-4 text-muted-foreground/30 animate-float"
                  style={{
                    top: "-15%",
                    left: "-20%",
                    animationDelay: "0s",
                    animationDuration: "12s",
                  }}
                >
                  <svg
                    width="120"
                    height="70"
                    viewBox="0 0 120 70"
                    fill="currentColor"
                  >
                    <path d="M20 45c-6-1-11-7-11-14 0-8 7-15 15-15 1-6 6-10 13-10 4 0 8 2 10 5 2-1 4-1 6-1 8 0 15 7 15 15 0 3-1 7-3 9 5 1 9 6 9 12 0 7-5 12-12 12H25c-4 0-8-3-8-7 0-3 1-5 3-6z" />
                  </svg>
                </div>

                {/* Secondary cloud - bottom right */}
                <div
                  className="absolute opacity-3 text-muted-foreground/20 animate-float hidden lg:block"
                  style={{
                    bottom: "15%",
                    right: "-10%",
                    animationDelay: "6s",
                    animationDuration: "20s",
                  }}
                >
                  <svg
                    width="80"
                    height="50"
                    viewBox="0 0 80 50"
                    fill="currentColor"
                  >
                    <path d="M15 30c-4-1-7-4-7-9 0-5 4-9 9-9 1-3 4-6 8-6 3 0 5 1 6 3 1 0 3-1 4-1 5 0 9 4 9 9 0 2-1 4-2 6 3 1 6 4 6 7 0 4-3 7-7 7H18c-2 0-5-2-5-4 0-2 1-3 2-3z" />
                  </svg>
                </div>
              </div>

              {/* Simplified Background Gradient - Memoized */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl motion-reduce:opacity-50"
                style={profileImageStyle}
                aria-hidden="true"
              />

              {/* Profile image container */}
              <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden blob-shadow transition-smooth hover:scale-105">
                <img
                  src={profileImage}
                  alt="Asim - Full Stack Developer and Digital Experience Creator"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
          {/* Optimized Recursive Trees with Error Boundary */}
          <div className="absolute inset-0 w-full h-full overflow-hidden motion-reduce:hidden pointer-events-none z-5">
            <ErrorBoundary fallback={null}>
              {/* Single tree for desktop */}
              <div className="absolute right-4 bottom-2 opacity-15 hidden lg:block">
                <RecursiveTree size={0.7} />
              </div>

              {/* Single tree for mobile */}
              <div className="absolute right-1 bottom-0 opacity-0 lg:hidden">
                <RecursiveTree size={0.5} />
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
