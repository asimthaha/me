import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { SnakeLoader } from "@/components/snake-loader";
import { PremiumCursor } from "@/components/premium-cursor";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";
import { PacmanIntroOverlay } from "@/components/PacmanIntroOverlay";
import { useLoading } from "@/hooks/use-loading";
import { useState } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isLoading, completeLoading } = useLoading(8000); // Reduced load time for better UX
  const [showPacmanIntro, setShowPacmanIntro] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);

  const handleSnakeComplete = () => {
    completeLoading();
    setShowPacmanIntro(true);
  };

  const handlePacmanComplete = () => {
    setShowPacmanIntro(false);
    setShowWelcome(true);
  };

  const handleWelcomeEnter = () => {
    setShowWelcome(false);
    setShowMainApp(true);
  };

  // Snake Loader Phase
  if (isLoading) {
    return <SnakeLoader isLoading={isLoading} onComplete={handleSnakeComplete} />;
  }

  // Pacman Transition Phase
  if (showPacmanIntro) {
    return <PacmanIntroOverlay isVisible={showPacmanIntro} onComplete={handlePacmanComplete} />;
  }

  // Welcome Overlay Phase
  if (showWelcome) {
    return <WelcomeOverlay isVisible={showWelcome} onEnter={handleWelcomeEnter} />;
  }

  // Main App Phase
  if (!showMainApp) {
    return null; // Brief moment while transitioning
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <PremiumCursor />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contacts" element={<Contacts />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
