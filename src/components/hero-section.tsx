import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import profileImage from '@/assets/developer-profile.jpg';

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
export function HeroSection({ className }: HeroSectionProps) {

  return (
    <section 
      className={`min-h-screen flex items-center justify-center px-4 py-16 ${className}`}
      aria-label="Hero section"
    >

      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Section - Mobile First */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-6 animate-fade-in">
            
            {/* Main Headline - CRO Optimized */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight hero-shadow">
              <span className="block">Building</span>
              <span className="block text-gradient">Digital Solutions</span>
              <span className="block">That Matter</span>
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Full-stack developer with 5+ years crafting scalable web applications. 
              Specialized in React, Node.js, and cloud architecture.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              
              {/* Primary CTA - High contrast, action-focused */}
              <Button 
                variant="hero" 
                size="hero-lg"
                className="group"
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
                  <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z"/>
                </svg>
              </Button>
            </div>
          </div>

          {/* Profile Image Section with Animated Blob */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              
              {/* Animated blob background */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 animate-blob animate-float blur-xl"
                style={{
                  width: '320px',
                  height: '320px',
                  transform: 'translate(-10%, -10%)'
                }}
                aria-hidden="true"
              />
              
              {/* Subtle glow effect */}
              <div 
                className="absolute inset-0 bg-accent/10 rounded-full animate-pulse-slow blur-lg"
                style={{
                  width: '280px',
                  height: '280px',
                  transform: 'translate(5%, 5%)'
                }}
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;