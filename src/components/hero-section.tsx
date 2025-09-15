import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import profileImage from "@/assets/developer-profile.jpg";
import RecursiveTree from "./recursive-tree";
import { TypewriterText } from "./typewriter-text";
import { ParallaxContainer } from "./parallax-container";
import { use3DTilt } from "@/hooks/use-3d-tilt";

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
  const tiltRef = use3DTilt({ maxTilt: 8, scale: 1.02 });

  return (
    <section
      className={`h-screen flex items-center justify-center px-4 py-16 ${className}`}
      aria-label="Hero section"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Section - Mobile First */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-6 animate-fade-in">
            {/* Main Headline - CRO Optimized with Typewriter Effect */}
            <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading leading-tight hero-shadow">
              <div className="block">Building</div>
              <div className="block text-gradient">
                <TypewriterText
                  text="Digital Solutions"
                  speed={600}
                  delay={10}
                  className="text-shimmer"
                />
              </div>
              <div className="block">That Matter</div>
            </div>

            {/* Supporting Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-body">
              Full-stack developer with 5+ years crafting scalable web
              applications. Specialized in React, Node.js, and cloud
              architecture.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              {/* Primary CTA - High contrast, action-focused */}
              <Button
                variant="hero"
                size="hero-lg"
                className="group magnetic premium-glow hover-lift"
                aria-label="View my work portfolio"
              >
                View My Work
                <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Secondary CTA */}
              <Button
                variant="hero-secondary"
                size="hero-lg"
                aria-label="Get in touch"
              >
                Get In Touch
              </Button>
            </div>

            {/* Social Links - Professional networking */}
            <div className="flex gap-4 justify-center lg:justify-start pt-6">
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
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              {/* Cloud Elements - Background Layer */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              >
                {/* Large background cloud - top left */}
                <div
                  className="absolute opacity-5 text-muted-foreground animate-float"
                  style={{
                    top: "-20%",
                    left: "-30%",
                    animationDelay: "0s",
                    animationDuration: "20s",
                  }}
                >
                  <svg
                    width="180"
                    height="100"
                    viewBox="0 0 180 100"
                    fill="currentColor"
                  >
                    <path d="M25 60c-8-2-15-10-15-20 0-12 10-22 22-22 2-8 9-14 18-14 6 0 11 3 14 7 3-1 6-2 9-2 12 0 22 10 22 22 0 5-2 10-5 13 8 2 14 9 14 18 0 10-8 18-18 18H32c-6 0-12-5-12-11 0-4 2-7 5-9z" />
                  </svg>
                </div>

                {/* Medium cloud - top right */}
                <div
                  className="absolute opacity-8 text-muted-foreground/60 animate-float"
                  style={{
                    top: "-10%",
                    right: "-25%",
                    animationDelay: "3s",
                    animationDuration: "25s",
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

                {/* Small cloud - bottom left */}
                <div
                  className="absolute opacity-6 text-muted-foreground/40 animate-float hidden sm:block"
                  style={{
                    bottom: "10%",
                    left: "-20%",
                    animationDelay: "7s",
                    animationDuration: "18s",
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

                {/* Small cloud - bottom right */}
                <div
                  className="absolute opacity-7 text-muted-foreground/50 animate-float hidden lg:block"
                  style={{
                    bottom: "20%",
                    right: "-15%",
                    animationDelay: "12s",
                    animationDuration: "22s",
                  }}
                >
                  <svg
                    width="90"
                    height="55"
                    viewBox="0 0 90 55"
                    fill="currentColor"
                  >
                    <path d="M18 35c-5-1-8-5-8-11 0-6 5-11 11-11 1-4 5-7 9-7 3 0 6 1 7 4 2-1 3-1 5-1 6 0 11 5 11 11 0 2-1 5-2 7 4 1 7 5 7 9 0 5-4 9-9 9H21c-3 0-6-2-6-5 0-2 1-4 3-4z" />
                  </svg>
                </div>

                {/* Tiny accent clouds */}
                <div
                  className="absolute opacity-4 text-primary/30 animate-float"
                  style={{
                    top: "15%",
                    left: "80%",
                    animationDelay: "15s",
                    animationDuration: "30s",
                  }}
                >
                  <svg
                    width="40"
                    height="25"
                    viewBox="0 0 40 25"
                    fill="currentColor"
                  >
                    <path d="M8 15c-2 0-4-2-4-5s2-5 4-5c1-2 3-3 5-3s4 1 5 3c1 0 2 0 3 0 3 0 5 2 5 5s-2 5-5 5H8z" />
                  </svg>
                </div>

                <div
                  className="absolute opacity-3 text-accent/40 animate-float"
                  style={{
                    top: "70%",
                    left: "10%",
                    animationDelay: "18s",
                    animationDuration: "28s",
                  }}
                >
                  <svg
                    width="35"
                    height="22"
                    viewBox="0 0 35 22"
                    fill="currentColor"
                  >
                    <path d="M7 13c-2 0-3-1-3-3s1-3 3-3c0-1 2-2 3-2s3 1 3 2c1 0 1 0 2 0 2 0 3 1 3 3s-1 3-3 3H7z" />
                  </svg>
                </div>
              </div>

              {/* Animated blob background */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 animate-blob animate-float blur-xl"
                style={{
                  width: "320px",
                  height: "320px",
                  transform: "translate(-10%, -10%)",
                }}
                aria-hidden="true"
              />

              {/* Subtle glow effect */}
              <div
                className="absolute inset-0 bg-accent/10 rounded-full animate-pulse-slow blur-lg"
                style={{
                  width: "280px",
                  height: "280px",
                  transform: "translate(5%, 5%)",
                }}
                aria-hidden="true"
              />

              {/* Static Concentric Circles */}
              {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-accent/10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/15 rounded-full"></div> */}

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
            {/* Recursive Trees All Around - Comprehensive Layout */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {/* Top Section Trees */}
              {/* <div className="absolute right-1/4 top-8 opacity-25 hidden md:block">
                <RecursiveTree size={1.0} />
              </div> */}

              {/* Left Side Trees */}
              {/* <div className="absolute left-2 top-1/4 opacity-20 hidden lg:block">
                <RecursiveTree size={0.9} />
              </div> */}

              {/* Right Side Trees */}
              <div className="absolute right-2 bottom-0 opacity-20 hidden lg:block">
                <RecursiveTree size={0.8} />
              </div>

              {/* Bottom Section Trees - Around Content */}
              <div className="absolute right-4/8 bottom-0 opacity-25 hidden md:block">
                <RecursiveTree size={0.8} />
              </div>

              {/* Mobile-optimized trees */}
              <div className="absolute left-2 top-30 opacity-20 md:hidden">
                <RecursiveTree size={0.6} />
              </div>
              <div className="absolute right-1 top-9 opacity-20 md:hidden">
                <RecursiveTree size={0.6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
