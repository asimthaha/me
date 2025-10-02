import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { ElegantLoader } from "@/components/elegant-loader";
import { PremiumCursor } from "@/components/premium-cursor";
import { SoundToggle } from "@/components/sound-toggle";
import { useLoading } from "@/hooks/use-loading";
import { usePersonalization } from "@/hooks/use-personalization";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { greeting, isReturningVisitor, hasSeenIntro, markIntroAsSeen } =
    usePersonalization();

  // Skip or shorten loading for returning visitors who have seen intro
  const loadingDuration = isReturningVisitor && hasSeenIntro ? 500 : 2500;

  const { isLoading, completeLoading } = useLoading(loadingDuration);

  if (isLoading) {
    return (
      <ElegantLoader
        isLoading={isLoading}
        onComplete={() => {
          completeLoading();
          markIntroAsSeen();
        }}
        personalizedGreeting={greeting}
        isReturningVisitor={isReturningVisitor}
      />
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-accent-foreground px-4 py-2 rounded z-[100] focus-visible"
          >
            Skip to main content
          </a>

          <PremiumCursor />
          <SoundToggle />
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
