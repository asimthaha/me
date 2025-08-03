import { useForwardTimer } from '@/hooks/use-forward-timer';

/**
 * Forward Timer Component
 * Displays real-time count from July 1, 2024
 */
export const ForwardTimer = () => {
  const timeString = useForwardTimer();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-md border border-border/20 rounded-lg px-3 py-2 shadow-lg">
      <div className="text-xs text-muted-foreground mb-1">Developer Since</div>
      <div className="font-mono text-sm text-foreground font-medium">
        {timeString}
      </div>
    </div>
  );
};