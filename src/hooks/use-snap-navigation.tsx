import { useEffect, useState } from 'react';

/**
 * Custom hook for snap scrolling navigation
 * Provides utilities for managing snap scroll behavior and section detection
 */
export const useSnapNavigation = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Track current section based on scroll position
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      clearTimeout(timeoutId);
      
      // Set scrolling to false after scroll ends
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      // Calculate current section based on scroll position
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollPosition / windowHeight);
      
      setCurrentSection(sectionIndex);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Scroll to specific section
  const scrollToSection = (sectionIndex: number) => {
    const targetY = sectionIndex * window.innerHeight;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    window.scrollTo({
      top: targetY,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  // Navigate to next/previous section
  const navigateToSection = (direction: 'next' | 'prev') => {
    const sections = document.querySelectorAll('[data-snap-section]');
    const totalSections = sections.length;
    
    let targetSection = currentSection;
    
    if (direction === 'next' && currentSection < totalSections - 1) {
      targetSection = currentSection + 1;
    } else if (direction === 'prev' && currentSection > 0) {
      targetSection = currentSection - 1;
    }
    
    scrollToSection(targetSection);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle navigation when not focused on input elements
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault();
          navigateToSection('next');
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          navigateToSection('prev');
          break;
        case 'Home':
          event.preventDefault();
          scrollToSection(0);
          break;
        case 'End': {
           event.preventDefault();
           const sections = document.querySelectorAll('[data-snap-section]');
           scrollToSection(sections.length - 1);
           break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection]);

  return {
    currentSection,
    isScrolling,
    scrollToSection,
    navigateToSection
  };
};