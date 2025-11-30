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

const queryClient = new QueryClient();

// Layout Component: Renders the Chatbot and the current Page
const MainLayout = () => {
  return (
    <>
      <Suspense fallback={null}>
        <PortfolioChatbot />
      </Suspense>
      {/* Outlet renders the child route (Index, About, etc.) */}
      <Outlet />
    </>
  );
};

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
            <Sonner />
            <BrowserRouter basename="/me">
              <Suspense fallback={null}>
                <Routes>
                  {/* WRAPPER ROUTE: Includes Chatbot */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contacts" element={<Contacts />} />
                  </Route>

                  {/* 404 ROUTE: Excluded from MainLayout (No Chatbot) */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
