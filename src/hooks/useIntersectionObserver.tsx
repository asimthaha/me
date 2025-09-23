/**
 * Intersection Observer Hook - Performance optimization for animations
 * Only runs animations when elements are visible in viewport
 */

import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const elementRef = useRef<HTMLElement>(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
    setIsIntersecting(entry.isIntersecting);
  };

  useEffect(() => {
    const node = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen]);

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  };
};

/**
 * Hook for lazy animation trigger based on visibility
 */
export const useVisibilityAnimation = (
  options: UseIntersectionObserverOptions = {}
) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
    ...options,
  });

  return {
    ref,
    shouldAnimate: isIntersecting,
    animateClass: isIntersecting ? 'animate-fade-in' : 'opacity-0',
  };
};