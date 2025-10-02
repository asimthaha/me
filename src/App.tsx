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
  const { isLoading, completeLoading } = useLoading(3000);
  const [showPacmanIntro, setShowPacmanIntro] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);

  const handleSnakeComplete = () => {
    console.log('Snake complete, showing Pacman');
    setShowPacmanIntro(true);
  };

  const handlePacmanComplete = () => {
    // Set next state BEFORE hiding current component
    setShowWelcome(true);
    setShowPacmanIntro(false);
  };

  const handleWelcomeEnter = () => {
    // Set next state BEFORE hiding current component
    setShowMainApp(true);
    setShowWelcome(false);
  };

  // Snake Loader Phase - show until it completes
  if (isLoading && !showPacmanIntro) {
    return <SnakeLoader isLoading={isLoading} onComplete={handleSnakeComplete} />;
  }

  // Pacman Transition Phase
  if (showPacmanIntro && !showWelcome) {
    return <PacmanIntroOverlay isVisible={showPacmanIntro} onComplete={handlePacmanComplete} />;
  }

  // Welcome Overlay Phase
  if (showWelcome && !showMainApp) {
    return <WelcomeOverlay isVisible={showWelcome} onEnter={handleWelcomeEnter} />;
  }

  // Main App Phase - Show when all intro phases complete
  if (showMainApp) {

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
  }

  // Fallback - should never reach here, but prevents white screen
  return <SnakeLoader isLoading={true} onComplete={handleSnakeComplete} />;
};

export default App;
