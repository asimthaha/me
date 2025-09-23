import { useEffect, useRef, useCallback } from "react";

/**
 * Snap-Aware Slingshot Overscroll Hook
 * Detects overscroll past footer using intersection observer
 * Temporarily disables snap-scrolling during slingshot animation
 * Optimized for performance and cross-browser compatibility
 */
export const useSlingshotOverscroll = () => {
  const isSlingshotting = useRef(false);
  const overscrollTimeout = useRef<NodeJS.Timeout>();
  const animationFrame = useRef<number>();
  const footerObserver = useRef<IntersectionObserver | null>(null);
  const isFooterVisible = useRef(false);
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  /**
   * Temporarily disable snap scrolling during slingshot animation
   */
  const disableSnapScrolling = useCallback(() => {
    const scrollContainer = document.querySelector("[data-snap-container]");
    if (scrollContainer) {
      scrollContainer.classList.add("snap-disabled");
    }
  }, []);

  /**
   * Re-enable snap scrolling after animation
   */
  const enableSnapScrolling = useCallback(() => {
    const scrollContainer = document.querySelector("[data-snap-container]");
    if (scrollContainer) {
      scrollContainer.classList.remove("snap-disabled");
    }
  }, []);

  /**
   * Enhanced slingshot animation with snap-scrolling awareness
   */
  const performSlingshot = useCallback(() => {
    if (isSlingshotting.current) return;

    isSlingshotting.current = true;

    // Temporarily disable snap scrolling
    disableSnapScrolling();

    const startPosition = window.scrollY;
    const startTime = performance.now();
    const duration = 1200;

    /**
     * Enhanced elastic easing with more pronounced slingshot feel
     */
    const elasticEaseOut = (t: number): number => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = elasticEaseOut(progress);
      const currentPosition = startPosition * (1 - easedProgress);

      // Use transform3d for hardware acceleration
      window.scrollTo({
        top: currentPosition,
        behavior: "auto",
      });

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        window.scrollTo({ top: 0, behavior: "auto" });

        // Re-enable snap scrolling after a brief delay
        setTimeout(() => {
          enableSnapScrolling();
          isSlingshotting.current = false;
        }, 100);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);
  }, [disableSnapScrolling, enableSnapScrolling]);

  /**
   * Enhanced overscroll detection with momentum tracking
   */
  const handleOverscroll = useCallback(() => {
    if (isSlingshotting.current) return;

    // Track scroll velocity
    const currentScrollY = window.scrollY;
    scrollVelocity.current = currentScrollY - lastScrollY.current;
    lastScrollY.current = currentScrollY;

    // Only trigger if footer is visible and user is scrolling down with momentum
    if (isFooterVisible.current && scrollVelocity.current > 0) {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // More precise overscroll detection
      const overscrollThreshold = 30;
      const isOverscrolled =
        scrollTop + windowHeight >= documentHeight - overscrollThreshold;

      if (isOverscrolled) {
        clearTimeout(overscrollTimeout.current);
        overscrollTimeout.current = setTimeout(() => {
          performSlingshot();
        }, 80);
      }
    }
  }, [performSlingshot]);

  /**
   * Enhanced touch handler with momentum detection
   */
  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (isSlingshotting.current || !isFooterVisible.current) return;

      const touches = event.changedTouches[0];
      if (touches) {
        // Check if at bottom and has downward momentum
        const isAtBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 20;

        if (isAtBottom && scrollVelocity.current > 5) {
          setTimeout(() => {
            performSlingshot();
          }, 50);
        }
      }
    },
    [performSlingshot]
  );

  /**
   * Enhanced wheel handler for trackpad/mouse
   */
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (isSlingshotting.current || !isFooterVisible.current) return;

      // Detect strong downward scroll at bottom
      if (event.deltaY > 10) {
        const isAtBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 20;

        if (isAtBottom) {
          setTimeout(() => {
            performSlingshot();
          }, 50);
        }
      }
    },
    [performSlingshot]
  );

  /**
   * Throttled scroll handler with momentum tracking
   */
  const throttledScrollHandler = useCallback(() => {
    if (animationFrame.current) return;

    animationFrame.current = requestAnimationFrame(() => {
      handleOverscroll();
      animationFrame.current = undefined;
    });
  }, [handleOverscroll]);

  useEffect(() => {
    // Set overscroll behavior for modern browsers
    document.body.style.overscrollBehavior = "contain";

    // Setup intersection observer for footer detection
    footerObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.tagName.toLowerCase() === "footer") {
            isFooterVisible.current = entry.isIntersecting;
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      }
    );

    // Observe footer element
    const footerElement = document.querySelector("footer");
    if (footerElement && footerObserver.current) {
      footerObserver.current.observe(footerElement);
    }

    // Add event listeners with passive option for performance
    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      // Cleanup
      document.body.style.overscrollBehavior = "";

      // Disconnect intersection observer
      if (footerObserver.current) {
        footerObserver.current.disconnect();
      }

      window.removeEventListener("scroll", throttledScrollHandler);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);

      // Clear timeouts and animation frames
      clearTimeout(overscrollTimeout.current);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [throttledScrollHandler, handleTouchEnd, handleWheel]);

  return {
    isSlingshotting: isSlingshotting.current,
    performSlingshot,
  };
};
