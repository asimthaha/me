/**
 * Theme Context Provider
 * Manages global theme state and provides theme switching functionality
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeType, Theme, getTheme } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'default' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    // Try to get theme from localStorage first
    const savedTheme = localStorage.getItem('portfolio-theme') as ThemeType;
    return savedTheme || defaultTheme;
  });

  const theme = getTheme(currentTheme);

  const setTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  };

  const toggleTheme = () => {
    const themes: ThemeType[] = ['default', 'netflix', 'ey', 'github'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Apply theme colors to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      
      if (key === 'heroGradient' || key === 'blobShadow' || key === 'textShadow') {
        root.style.setProperty(`--${cssKey}`, value);
      } else {
        root.style.setProperty(`--${cssKey}`, value);
      }
    });
  }, [theme]);

  const value: ThemeContextType = {
    currentTheme,
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};