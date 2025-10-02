import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TypewriterText } from '@/components/typewriter-text';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeOverlayProps {
  isVisible: boolean;
  onEnter: () => void;
}

/**
 * Welcome Overlay Component
 * Creates engaging landing experience with typewriter effects and personality
 */
export const WelcomeOverlay = ({ isVisible, onEnter }: WelcomeOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  const welcomeMessages = [
    "Welcome to my digital world",
    "I'm Asim - Full Stack Developer",
    "Crafting premium web experiences"
  ];

  useEffect(() => {
    if (!isVisible) return;
    
    if (currentStep < welcomeMessages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1800);
      return () => clearTimeout(timer);
    } else if (currentStep === welcomeMessages.length - 1 && !showCTA) {
      const timer = setTimeout(() => {
        setShowCTA(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isVisible, showCTA, welcomeMessages.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="text-center space-y-8 px-6 max-w-2xl">
        {/* Main Welcome Messages */}
        <div className="space-y-4 min-h-[120px]">
          {welcomeMessages.map((message, index) => (
            <div key={index} className={cn(
              "transition-opacity duration-500",
              index <= currentStep ? "opacity-100" : "opacity-0"
            )}>
              {index === currentStep && (
                <TypewriterText
                  text={message}
                  speed={60}
                  className={cn(
                    "block",
                    index === 0 && "text-2xl md:text-3xl font-light text-muted-foreground",
                    index === 1 && "text-3xl md:text-4xl font-bold text-foreground",
                    index === 2 && "text-lg md:text-xl text-primary font-medium"
                  )}
                />
              )}
              {index < currentStep && (
                <span className={cn(
                  "block",
                  index === 0 && "text-2xl md:text-3xl font-light text-muted-foreground",
                  index === 1 && "text-3xl md:text-4xl font-bold text-foreground", 
                  index === 2 && "text-lg md:text-xl text-primary font-medium"
                )}>
                  {message}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Statistics */}
        {currentStep >= 2 && (
          <div className={cn(
            "grid grid-cols-3 gap-6 py-6 border-y border-border/20",
            "opacity-0 animate-fade-in"
          )} style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {showCTA && (
          <div className={cn(
            "space-y-4",
            "opacity-0 animate-fade-in"
          )} style={{ animationDelay: "2s", animationFillMode: "forwards" }}>
            <p className="text-muted-foreground">
              Currently available for exciting projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onEnter}
                className="btn-gradient hover:opacity-90 text-white shadow-lg group"
              >
                <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Enter Portfolio
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.scrollTo({ top: window.innerHeight * 3, behavior: 'smooth' })}
                className="border-border/20 bg-background/50 hover:bg-background hover:text-foreground"
              >
                Quick Contact
              </Button>
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-accent rounded-full animate-pulse opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-secondary rounded-full animate-pulse opacity-50" style={{ animationDelay: "2s" }} />
      </div>
    </div>
  );
};