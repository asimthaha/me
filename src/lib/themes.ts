export type ThemeType =
  | "light"
  | "dark"
  | "ares"
  | "enterprise"
  | "slate"
  | "dune";

export interface Theme {
  id: ThemeType;
  name: string;
  icon: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    heroGradient: string;
    blobShadow: string;
    textShadow: string;
  };
}

export const themes: Record<ThemeType, Theme> = {
  light: {
    id: "light",
    name: "Light",
    icon: "☀️",
    colors: {
      background: "0 0% 100%",
      foreground: "240 10% 3.9%",
      card: "0 0% 100%",
      cardForeground: "240 10% 3.9%",
      popover: "0 0% 100%",
      popoverForeground: "240 10% 3.9%",
      primary: "220 26% 14%",
      primaryForeground: "0 0% 98%",
      secondary: "220 13% 91%",
      secondaryForeground: "220 9% 46%",
      muted: "220 14% 96%",
      mutedForeground: "220 9% 46%",
      accent: "217 91% 60%",
      accentForeground: "0 0% 98%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "210 40% 98%",
      border: "220 13% 91%",
      input: "220 13% 91%",
      ring: "217 91% 60%",
      heroGradient:
        "linear-gradient(135deg, hsl(220 26% 14%) 0%, hsl(217 91% 60%) 100%)",
      blobShadow: "0 20px 40px -10px hsl(217 91% 60% / 0.15)",
      textShadow: "0 2px 4px hsl(220 26% 14% / 0.1)",
    },
  },

  dark: {
    id: "dark",
    name: "Dark",
    icon: "🌙",
    colors: {
      background: "220 13% 9%",
      foreground: "220 13% 85%",
      card: "220 13% 12%",
      cardForeground: "220 13% 85%",
      popover: "220 13% 12%",
      popoverForeground: "220 13% 85%",
      primary: "220 13% 85%",
      primaryForeground: "220 13% 9%",
      secondary: "220 13% 16%",
      secondaryForeground: "220 13% 85%",
      muted: "220 13% 16%",
      mutedForeground: "220 13% 65%",
      accent: "217 91% 60%",
      accentForeground: "220 13% 9%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "220 13% 18%",
      input: "220 13% 18%",
      ring: "217 91% 60%",
      heroGradient:
        "linear-gradient(135deg, hsl(220 13% 9%) 0%, hsl(217 91% 60%) 100%)",
      blobShadow: "0 20px 40px -10px hsl(217 91% 60% / 0.25)",
      textShadow: "0 2px 4px hsl(220 13% 9% / 0.3)",
    },
  },

  ares: {
    id: "ares",
    name: "Ares",
    icon: "🎬",
    colors: {
      background: "0 0% 8%",
      foreground: "0 0% 95%",
      card: "0 0% 12%",
      cardForeground: "0 0% 95%",
      popover: "0 0% 12%",
      popoverForeground: "0 0% 95%",
      primary: "0 100% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 18%",
      secondaryForeground: "0 0% 85%",
      muted: "0 0% 15%",
      mutedForeground: "0 0% 65%",
      accent: "0 100% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 20%",
      input: "0 0% 20%",
      ring: "0 100% 50%",
      heroGradient:
        "linear-gradient(135deg, hsl(0 0% 8%) 0%, hsl(0 100% 50%) 100%)",
      blobShadow: "0 20px 40px -10px hsl(0 100% 50% / 0.25)",
      textShadow: "0 2px 4px hsl(0 0% 0% / 0.3)",
    },
  },

  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    icon: "🏢",
    colors: {
      background: "0 0% 98%",
      foreground: "0 0% 10%",
      card: "0 0% 100%",
      cardForeground: "0 0% 10%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 10%",
      primary: "0 0% 15%",
      primaryForeground: "60 100% 50%",
      secondary: "60 100% 95%",
      secondaryForeground: "0 0% 15%",
      muted: "60 20% 96%",
      mutedForeground: "0 0% 40%",
      accent: "60 100% 50%",
      accentForeground: "0 0% 15%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "60 20% 88%",
      input: "60 20% 88%",
      ring: "60 100% 50%",
      heroGradient:
        "linear-gradient(135deg, hsl(0 0% 15%) 0%, hsl(60 100% 50%) 100%)",
      blobShadow: "0 20px 40px -10px hsl(60 100% 50% / 0.2)",
      textShadow: "0 2px 4px hsl(0 0% 15% / 0.1)",
    },
  },
  slate: {
    id: "slate",
    name: "Slate",
    icon: "🪶", // Changed from "feather" text to emoji to match other themes
    colors: {
      // Base Colors
      background: "0 0% 100%", // #ffffff
      foreground: "220 4% 15%", // #242527 (Charcoal)

      // Surfaces
      card: "0 0% 100%",
      cardForeground: "220 4% 15%",
      popover: "0 0% 100%",
      popoverForeground: "220 4% 15%",

      // Primary Brand Color (Dark Slate)
      primary: "208 35% 28%", // #2F4A61
      primaryForeground: "0 0% 100%",

      // Secondary Brand Color (Muted Blue)
      secondary: "201 23% 48%", // #5F8396
      secondaryForeground: "0 0% 100%",

      // Muted/Neutral Elements (Beige)
      muted: "48 10% 71%", // #BCB9AC
      mutedForeground: "34 12% 39%", // #6F6558 (Taupe used for contrast)

      // Accent Color (Taupe/Brown)
      accent: "34 12% 39%", // #6F6558
      accentForeground: "0 0% 100%",

      // Destructive
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",

      // Borders & Inputs
      border: "48 10% 71%", // #BCB9AC
      input: "48 10% 71%",
      ring: "201 23% 48%", // Focus ring uses secondary blue

      // Special Effects
      heroGradient:
        "linear-gradient(135deg, hsl(208 35% 28%) 0%, hsl(201 23% 48%) 100%)",
      blobShadow: "0 20px 40px -10px hsl(201 23% 48% / 0.2)",
      textShadow: "0 1px 2px hsl(220 4% 15% / 0.1)",
    },
  },
  dune: {
    id: "dune",
    name: "Dune",
    icon: "🏜️",
    colors: {
      background: "60 6% 9%", // #1A1A17
      foreground: "38 32% 74%", // #D4C2A4 (desert haze)

      card: "60 6% 12%", // deeper matte charcoal
      cardForeground: "38 32% 74%",

      popover: "60 6% 12%",
      popoverForeground: "38 32% 74%",

      primary: "38 36% 62%", // desert sand
      primaryForeground: "60 6% 9%",

      secondary: "38 36% 46%", // bronze midtone
      secondaryForeground: "38 55% 75%",

      muted: "60 6% 18%",
      mutedForeground: "210 14% 52%", // still-suit steel blue

      accent: "28 58% 53%", // spice glow
      accentForeground: "60 6% 9%",

      destructive: "0 70% 58%",
      destructiveForeground: "0 0% 98%",

      border: "60 6% 18%",
      input: "60 6% 18%",
      ring: "38 36% 62%",

      heroGradient:
        "linear-gradient(135deg, hsl(60 6% 9%) 0%, hsl(38 36% 62%) 100%)",

      blobShadow: "0 20px 40px -10px hsl(38 36% 62% / 0.25)",
      textShadow: "0 2px 4px hsl(60 6% 9% / 0.25)",
    },
  },
};

export const getTheme = (themeId: ThemeType): Theme => {
  return themes[themeId] || themes.dune;
};

export const isDarkTheme = (themeId: ThemeType): boolean => {
  return themeId === "dark" || themeId === "ares" || themeId === "terra";
};

export const getAllThemes = (): Theme[] => Object.values(themes);
