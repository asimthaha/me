/**
 * Theme Context Provider
 * Manages global theme state and provides theme switching functionality
 */

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeType, Theme, getTheme, isDarkTheme } from "@/lib/themes";
import { themes } from "@/lib/data";

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    // Try to get theme from localStorage first
    const savedTheme = localStorage.getItem("portfolio-theme") as ThemeType;
    if (savedTheme) return savedTheme;

    // Check system preference for light/dark
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  const theme = getTheme(currentTheme);

  const setTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
  };

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Apply theme colors to CSS custom properties and manage dark class
  useEffect(() => {
    const root = document.documentElement;
    const theme = getTheme(currentTheme);

    // Apply dark class for CSS compatibility
    const isDarkMode = isDarkTheme(currentTheme);
    root.classList.toggle("dark", isDarkMode);

    Object.entries(theme.colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      root.style.setProperty(`--${cssKey}`, value);
    });
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    theme,
    setTheme,
    toggleTheme,
    isDark: isDarkTheme(currentTheme),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
