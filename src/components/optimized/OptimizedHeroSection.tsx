/**
 * Optimized Hero Section - Performance optimized version with lazy loading and intersection observers
 * Uses React.memo, useMemo, and lazy loading for better performance
 */

import React, { useMemo, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import profileImage from "@/assets/developer-profile.jpg";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

// Lazy load heavy components
const RecursiveTree = lazy(() => import("@/components/recursive-tree"));

interface HeroSectionProps {
  className?: string;
}

/**
 * Memoized social links component
 */
const SocialLinks = React.memo(() => (
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
));

SocialLinks.displayName = "SocialLinks";

/**
 * Memoized call-to-action buttons
 */
const CallToActionButtons = React.memo(() => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
    <Button
      variant="hero"
      size="hero-lg"
      className="group bg-accent"
      aria-label="View my work portfolio"
    >
      View My Work
      <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Button>

    <Button
      variant="hero-secondary"
      size="hero-lg"
      aria-label="Get in touch"
    >
      Get In Touch
    </Button>
  </div>
));

CallToActionButtons.displayName = "CallToActionButtons";

/**
 * CRO-optimized Hero Section for software developer portfolio
 * Features:
 * - Mobile-first responsive design
 * - Accessibility optimized (ARIA labels, keyboard navigation)
 * - Performance optimized (lazy loading, efficient animations, memoization)
 * - A/B testing ready with modular structure
 */
export const OptimizedHeroSection = React.memo(function OptimizedHeroSection({
  className,
}: HeroSectionProps) {
  // Memoize static content
  const profileImageStyle = useMemo(() => ({
    width: "280px",
    height: "280px",
    transform: "translate(-5%, -5%)",
  }), []);

  return (
    <section
      className={`h-screen flex items-center justify-center px-4 py-16 ${className}`}
      aria-label="Hero section"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Section - Mobile First */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-8 animate-fade-in">
            {/* Main Headline - Simplified and Clean */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8">
              <span className="block">Building</span>
              <span className="block text-gradient">Digital Solutions</span>
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Full-stack developer crafting scalable web applications with React, Node.js, and cloud architecture.
            </p>

            {/* Memoized CTAs */}
            <CallToActionButtons />

            {/* Memoized Social Links */}
            <SocialLinks />
          </div>

          {/* Profile Image Section with Optimized Animations */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
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
                  alt="Professional headshot of John Doe, Software Developer"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            {/* Lazy-loaded Recursive Trees with Error Boundary */}
            <div className="absolute inset-0 w-full h-full overflow-hidden motion-reduce:hidden">
              <ErrorBoundary fallback={null}>
                <Suspense fallback={null}>
                  {/* Single tree for desktop */}
                  <div className="absolute right-4 bottom-2 opacity-15 hidden lg:block">
                    <RecursiveTree size={0.7} />
                  </div>

                  {/* Single tree for mobile */}
                  <div className="absolute right-2 bottom-4 opacity-12 lg:hidden">
                    <RecursiveTree size={0.5} />
                  </div>
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default OptimizedHeroSection;