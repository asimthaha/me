import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for slingshot overscroll effect
 * Detects overscroll past footer and smoothly navigates back to hero section
 * Optimized for performance and cross-browser compatibility
 */
export const useSlingshotOverscroll = () => {
  const isSlingshotting = useRef(false);
  const overscrollTimeout = useRef<NodeJS.Timeout>();
  const animationFrame = useRef<number>();

  /**
   * Smooth slingshot animation back to hero section
   * Uses elastic easing for natural feel
   */
  const performSlingshot = useCallback(() => {
    if (isSlingshotting.current) return;
    
    isSlingshotting.current = true;
    
    // Get current scroll position
    const startPosition = window.scrollY;
    const startTime = performance.now();
    const duration = 1200; // 1.2s for smooth elastic feel

    /**
     * Elastic easing function for slingshot effect
     * Creates a bounce-back feel similar to rubber band
     */
    const elasticEaseOut = (t: number): number => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    };

    /**
     * Animation loop for smooth scroll with elastic easing
     */
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply elastic easing
      const easedProgress = elasticEaseOut(progress);
      
      // Calculate current position with overshoot effect
      const currentPosition = startPosition * (1 - easedProgress);
      
      window.scrollTo({
        top: currentPosition,
        behavior: 'auto' // Use auto to prevent interference with our custom animation
      });

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - ensure we're at top
        window.scrollTo({ top: 0, behavior: 'auto' });
        isSlingshotting.current = false;
      }
    };

    // Start animation
    animationFrame.current = requestAnimationFrame(animate);
  }, []);

  /**
   * Detect overscroll past footer with debouncing
   */
  const handleOverscroll = useCallback(() => {
    // Prevent multiple triggers during animation
    if (isSlingshotting.current) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Check if user has scrolled past the bottom with some threshold
    const overscrollThreshold = 50; // 50px past the bottom
    const isOverscrolled = scrollTop + windowHeight >= documentHeight + overscrollThreshold;
    
    if (isOverscrolled) {
      // Clear any existing timeout
      clearTimeout(overscrollTimeout.current);
      
      // Debounce the slingshot effect (wait 100ms for scroll to settle)
      overscrollTimeout.current = setTimeout(() => {
        performSlingshot();
      }, 100);
    }
  }, [performSlingshot]);

  /**
   * Throttled scroll handler for performance
   */
  const throttledScrollHandler = useCallback(() => {
    // Use RAF for smooth 60fps handling
    if (animationFrame.current) return;
    
    animationFrame.current = requestAnimationFrame(() => {
      handleOverscroll();
      animationFrame.current = undefined;
    });
  }, [handleOverscroll]);

  /**
   * Touch and wheel event handlers for mobile/trackpad support
   */
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    // Only trigger on upward swipe at bottom of page
    if (isSlingshotting.current) return;
    
    const touches = event.changedTouches[0];
    if (touches && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
      setTimeout(handleOverscroll, 50);
    }
  }, [handleOverscroll]);

  const handleWheel = useCallback((event: WheelEvent) => {
    // Detect downward scroll at bottom
    if (isSlingshotting.current) return;
    
    if (event.deltaY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
      setTimeout(handleOverscroll, 50);
    }
  }, [handleOverscroll]);

  useEffect(() => {
    // Set overscroll behavior for modern browsers
    document.body.style.overscrollBehavior = 'contain';
    
    // Add event listeners with passive option for performance
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      // Cleanup
      document.body.style.overscrollBehavior = '';
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('wheel', handleWheel);
      
      // Clear timeouts and animation frames
      clearTimeout(overscrollTimeout.current);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [throttledScrollHandler, handleTouchEnd, handleWheel]);

  return {
    isSlingshotting: isSlingshotting.current,
    performSlingshot
  };
};