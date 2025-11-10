import { useEffect } from 'react';

/**
 * ClickSparkEffect Component
 * 
 * Adds sparkling particle effects on every click across the application.
 * Uses clickspark.js library for visual feedback on user interactions.
 */
export const ClickSparkEffect = () => {
  useEffect(() => {
    // Dynamically import clickspark.js to avoid SSR issues
    import('clickspark.js').then((module) => {
      const clickSpark = module.default;
      
      // Add click event listener to document
      const handleClick = (e: MouseEvent) => {
        clickSpark({
          x: e.clientX,
          y: e.clientY,
          // Customize spark appearance using CSS variables for theming
          color: 'hsl(var(--primary))',
          count: 15,
          size: 8,
        });
      };

      document.addEventListener('click', handleClick);

      // Cleanup
      return () => {
        document.removeEventListener('click', handleClick);
      };
    });
  }, []);

  return null;
};
