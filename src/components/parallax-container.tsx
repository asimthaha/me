import { useEffect, useRef, ReactNode } from 'react';

interface ParallaxContainerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

/**
 * Parallax Container Component
 * Creates smooth parallax scrolling effects for enhanced visual depth
 */
export const ParallaxContainer = ({ 
  children, 
  speed = 0.5, 
  className = '' 
}: ParallaxContainerProps) => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = parallaxRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * speed;
      
      element.style.transform = `translate3d(0, ${parallax}px, 0)`;
    };

    // Throttled scroll handler for better performance
    let ticking = false;
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
        setTimeout(() => { ticking = false; }, 16); // ~60fps
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, [speed]);

  return (
    <div 
      ref={parallaxRef}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};