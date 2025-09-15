import { useRef, useEffect } from 'react';

interface Tilt3DOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

/**
 * 3D Tilt Effect Hook
 * Adds smooth 3D tilt animation based on mouse movement
 */
export const use3DTilt = ({
  maxTilt = 15,
  perspective = 1000,
  scale = 1.05,
  speed = 300,
}: Tilt3DOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let requestId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }

      requestId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        const rotateX = deltaY * maxTilt;
        const rotateY = -deltaX * maxTilt;

        element.style.transform = `
          perspective(${perspective}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(${scale})
        `;
      });
    };

    const handleMouseLeave = () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }

      requestId = requestAnimationFrame(() => {
        element.style.transform = `
          perspective(${perspective}px)
          rotateX(0deg)
          rotateY(0deg)
          scale(1)
        `;
      });
    };

    // Set initial transition
    element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    element.style.transformStyle = 'preserve-3d';

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, perspective, scale, speed]);

  return elementRef;
};