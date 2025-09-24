import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  sections: string[];
  activeSection: string;
  className?: string;
}

/**
 * Progress Indicator Component
 * Shows user's journey through the landing page experience
 */
export const ProgressIndicator = ({ sections, activeSection, className }: ProgressIndicatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const index = sections.findIndex(section => section === activeSection);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [activeSection, sections]);

  const progress = ((currentIndex + 1) / sections.length) * 100;

  return (
    <div className={cn("fixed top-4 left-1/2 transform -translate-x-1/2 z-40", className)}>
      <div className="bg-background/80 backdrop-blur-md border border-border/20 rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          {/* Progress Bar */}
          <div className="w-32 h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Section Indicator */}
          <span className="text-xs font-medium text-muted-foreground min-w-[60px]">
            {currentIndex + 1} / {sections.length}
          </span>
        </div>
      </div>
    </div>
  );
};