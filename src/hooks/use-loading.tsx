import { useState, useEffect } from 'react';

export const useLoading = (minLoadTime: number = 2000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Simulate content loading
    const loadContent = async () => {
      // Wait for minimum load time and document ready
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, minLoadTime)),
        new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve(void 0);
          } else {
            window.addEventListener('load', () => resolve(void 0));
          }
        })
      ]);
      
      setContentLoaded(true);
    };

    loadContent();
  }, [minLoadTime]);

  const completeLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading: isLoading && !contentLoaded,
    completeLoading,
    contentLoaded
  };
};