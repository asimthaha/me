import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { SnakeLoader } from "@/components/snake-loader";
import { PremiumCursor } from "@/components/premium-cursor";
import { ClickSparkEffect } from "@/components/ClickSparkEffect";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useLoading } from "@/hooks/use-loading";
import { useIsMobile } from "./hooks/use-mobile";

// Lazy load chatbot
const PortfolioChatbot = lazy(() =>
  import("@/components/PortfolioChatbot").then((module) => ({
    default: module.PortfolioChatbot,
  }))
);

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Services = lazy(() => import("./pages/Services"));
const Contacts = lazy(() => import("./pages/Contacts"));
const NotFound = lazy(() => import("./pages/NotFound"));

// OPTIMIZATION: Configure QueryClient for better mobile performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevents UI stutter on mobile when switching browser tabs/apps
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Layout Component: Renders the Chatbot and the current Page
const MainLayout = () => {
  return (
    <>
      <Suspense fallback={null}>
        <PortfolioChatbot />
      </Suspense>
      <Outlet />
    </>
  );
};

const AppContent = () => {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter basename="/me">
      {/* PERFORMANCE: Only render the heavy cursor effect on desktop */}
      {!isMobile && <PremiumCursor />}

      {/* Optional: You might want to disable ClickSpark on mobile too if it's still laggy */}
      <ClickSparkEffect />

      <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contacts" element={<Contacts />} />
          </Route>

          {/* 404 Route - Outside MainLayout (No Chatbot) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => {
  const { isLoading, completeLoading } = useLoading(2000);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <Sonner />

            {/* PERFORMANCE STRATEGY: 
               We render the AppContent immediately but hide it with opacity 
               while the loader is active. This ensures the JS is parsed and 
               the DOM is ready, preventing the "mount jerk" when loading ends.
            */}

            {/* The Loader Overlay */}
            {isLoading && (
              <div className="fixed inset-0 z-[9999]">
                <SnakeLoader
                  isLoading={isLoading}
                  onComplete={completeLoading}
                />
              </div>
            )}

            {/* The Application */}
            <div
              className={`transition-opacity duration-700 ease-in-out ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              <AppContent />
            </div>
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
