import { useForwardTimer } from "@/hooks/use-forward-timer";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Forward Timer Component
 * Displays real-time count from July 1, 2024
 * Responsive positioning: top-right on mobile, bottom-left on desktop
 */
export const ForwardTimer = () => {
  const timeString = useForwardTimer();
  const isMobile = useIsMobile();

  return (
    <div
      className={`fixed z-50 bg-background/80 backdrop-blur-md border border-border/20 rounded-lg px-3 py-2 shadow-lg transition-all duration-300 ${
        isMobile
          ? "top-4 right-4" // Mobile: top-right positioning
          : "bottom-4 left-4" // Desktop: bottom-left positioning (original)
      }`}
    >
      <div className="text-xs text-muted-foreground mb-1">Experience</div>
      <div className="font-mono text-sm text-foreground font-medium">
        {timeString}
      </div>
    </div>
  );
};
