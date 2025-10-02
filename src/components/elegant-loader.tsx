import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ElegantLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  personalizedGreeting?: string;
  isReturningVisitor?: boolean;
}

export const ElegantLoader = ({
  isLoading,
  onComplete,
  onSkip,
  personalizedGreeting = "Welcome",
  isReturningVisitor = false,
}: ElegantLoaderProps) => {
  const [textIndex, setTextIndex] = useState(0);
  const [showText, setShowText] = useState(false);

  const loadingTexts = isReturningVisitor
    ? [
        personalizedGreeting,
        "Loading your experience...",
        "Welcome back"
      ]
    : [
        personalizedGreeting,
        "Loading experience...",
        "Almost ready..."
      ];

  useEffect(() => {
    if (!isLoading) return;

    // Start showing text after a brief delay
    const textTimer = setTimeout(() => setShowText(true), 300);

    // For returning visitors, skip some loading steps
    const cycleInterval = isReturningVisitor ? 600 : 800;
    const cycleTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, cycleInterval);

    return () => {
      clearTimeout(textTimer);
      clearInterval(cycleTimer);
    };
  }, [isLoading, isReturningVisitor]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Elegant text reveal */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-light text-foreground tracking-wide">
            PORT
          </h1>
          <p
            className={`text-lg text-muted-foreground transition-opacity duration-1000 ${
              showText ? "opacity-100" : "opacity-0"
            }`}
          >
            {loadingTexts[textIndex]}
          </p>
        </div>

        {/* Optional skip button for returning visitors */}
        <div className="pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip || onComplete}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Subtle animation overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-muted-foreground/20 rounded-full animate-ping" />
      </div>
    </div>
  );
};
