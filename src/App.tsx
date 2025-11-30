import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { SnakeLoader } from "@/components/snake-loader";
import { PremiumCursor } from "@/components/premium-cursor";
import { ClickSparkEffect } from "@/components/ClickSparkEffect";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useLoading } from "@/hooks/use-loading";

// Lazy load chatbot
const PortfolioChatbot = lazy(() =>
  import("@/components/PortfolioChatbot").then((module) => ({
    default: module.PortfolioChatbot,
  }))
);

// --- CHANGED: Lazy load all pages ---
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Services = lazy(() => import("./pages/Services"));
const Contacts = lazy(() => import("./pages/Contacts"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  const { isLoading, completeLoading } = useLoading(2000);

  if (isLoading) {
    return <SnakeLoader isLoading={isLoading} onComplete={completeLoading} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <PremiumCursor />
          <ClickSparkEffect />
          <ErrorBoundary>
            {/* Suspense for the Chatbot */}
            <Suspense fallback={null}>
              <PortfolioChatbot />
            </Suspense>
          </ErrorBoundary>
          <Sonner />

          <BrowserRouter>
            {/* --- ADDED: Suspense wrapper for Page Routes --- */}
            {/* The fallback is what shows briefly while switching pages */}
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
                  INITIALIZING_CORE...
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contacts" element={<Contacts />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
