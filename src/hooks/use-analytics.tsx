import { useEffect, useRef, useState } from "react";

interface AnalyticsData {
  sessionId: string;
  startTime: string;
  totalTimeSpent: number;
  sectionTimeSpent: Record<string, number>;
  interactions: {
    clicks: number;
    scrolls: number;
    hovers: number;
    formSubmissions: number;
  };
  conversionPoints: string[];
  exitPatterns: {
    lastSection: string;
    scrollDepth: number;
    timeInLastSection: number;
  };
}

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    sessionId: "",
    startTime: "",
    totalTimeSpent: 0,
    sectionTimeSpent: {},
    interactions: {
      clicks: 0,
      scrolls: 0,
      hovers: 0,
      formSubmissions: 0,
    },
    conversionPoints: [],
    exitPatterns: {
      lastSection: "",
      scrollDepth: 0,
      timeInLastSection: 0,
    },
  });

  const sessionStartTime = useRef<number>(Date.now());
  const currentSection = useRef<string>("");
  const sectionStartTime = useRef<number>(Date.now());
  const scrollDepth = useRef<number>(0);

  // Initialize session
  useEffect(() => {
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const startTime = new Date().toISOString();

    setAnalyticsData((prev) => ({
      ...prev,
      sessionId,
      startTime,
    }));

    // Track total time spent
    const timeInterval = setInterval(() => {
      const now = Date.now();
      setAnalyticsData((prev) => ({
        ...prev,
        totalTimeSpent: Math.floor((now - sessionStartTime.current) / 1000),
      }));
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Track section changes
  const trackSectionVisit = (sectionId: string) => {
    if (currentSection.current) {
      // Record time spent in previous section
      const timeSpent = Math.floor(
        (Date.now() - sectionStartTime.current) / 1000
      );
      setAnalyticsData((prev) => ({
        ...prev,
        sectionTimeSpent: {
          ...prev.sectionTimeSpent,
          [currentSection.current]:
            (prev.sectionTimeSpent[currentSection.current] || 0) + timeSpent,
        },
      }));
    }

    currentSection.current = sectionId;
    sectionStartTime.current = Date.now();

    setAnalyticsData((prev) => ({
      ...prev,
      exitPatterns: {
        ...prev.exitPatterns,
        lastSection: sectionId,
      },
    }));

    // Send section visit event (in production, this would go to analytics service)
    console.log(`Analytics: Section visit - ${sectionId}`);
  };

  // Track interactions
  const trackInteraction = (type: keyof AnalyticsData["interactions"]) => {
    setAnalyticsData((prev) => ({
      ...prev,
      interactions: {
        ...prev.interactions,
        [type]: prev.interactions[type] + 1,
      },
    }));

    console.log(`Analytics: Interaction - ${type}`);
  };

  // Track conversion points
  const trackConversion = (point: string) => {
    setAnalyticsData((prev) => ({
      ...prev,
      conversionPoints: [...prev.conversionPoints, point],
    }));

    console.log(`Analytics: Conversion - ${point}`);
  };

  // Track scroll depth
  const trackScrollDepth = (depth: number) => {
    scrollDepth.current = Math.max(scrollDepth.current, depth);
    setAnalyticsData((prev) => ({
      ...prev,
      exitPatterns: {
        ...prev.exitPatterns,
        scrollDepth: scrollDepth.current,
      },
    }));
  };

  // Track page unload (exit patterns)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSection.current) {
        const timeInLastSection = Math.floor(
          (Date.now() - sectionStartTime.current) / 1000
        );
        setAnalyticsData((prev) => ({
          ...prev,
          exitPatterns: {
            ...prev.exitPatterns,
            timeInLastSection,
          },
        }));
      }

      // In production, send analytics data to server
      console.log("Analytics: Session end", analyticsData);
      localStorage.setItem(
        "portfolio-analytics-last-session",
        JSON.stringify(analyticsData)
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [analyticsData]);

  return {
    trackSectionVisit,
    trackInteraction,
    trackConversion,
    trackScrollDepth,
    analyticsData,
  };
};
