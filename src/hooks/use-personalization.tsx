import { useState, useEffect } from "react";

interface VisitorData {
  visitCount: number;
  lastVisit: string;
  firstVisit: string;
  hasSeenIntro: boolean;
}

export const usePersonalization = () => {
  const [visitorData, setVisitorData] = useState<VisitorData>({
    visitCount: 1,
    lastVisit: new Date().toISOString(),
    firstVisit: new Date().toISOString(),
    hasSeenIntro: false,
  });

  const [greeting, setGreeting] = useState("Welcome");
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);

  useEffect(() => {
    // Load visitor data from localStorage
    const storedData = localStorage.getItem("portfolio-visitor-data");

    if (storedData) {
      try {
        const parsedData: VisitorData = JSON.parse(storedData);
        const now = new Date();
        const lastVisit = new Date(parsedData.lastVisit);
        const daysSinceLastVisit = Math.floor(
          (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Consider returning if visited within last 30 days
        const isReturning =
          daysSinceLastVisit <= 30 && parsedData.visitCount > 1;

        setVisitorData({
          ...parsedData,
          visitCount: parsedData.visitCount + 1,
          lastVisit: now.toISOString(),
          hasSeenIntro: isReturning ? parsedData.hasSeenIntro : false,
        });

        setIsReturningVisitor(isReturning);
      } catch (error) {
        console.warn("Failed to parse visitor data, resetting");
        initializeNewVisitor();
      }
    } else {
      initializeNewVisitor();
    }

    // Update greeting based on time of day
    updateGreeting();
  }, []);

  const initializeNewVisitor = () => {
    const now = new Date();
    setVisitorData({
      visitCount: 1,
      lastVisit: now.toISOString(),
      firstVisit: now.toISOString(),
      hasSeenIntro: false,
    });
    setIsReturningVisitor(false);
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Welcome";

    if (hour >= 5 && hour < 12) {
      timeGreeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
      timeGreeting = "Good evening";
    } else {
      timeGreeting = "Welcome";
    }

    if (isReturningVisitor) {
      timeGreeting += " back";
    }

    setGreeting(timeGreeting);
  };

  const markIntroAsSeen = () => {
    const updatedData = { ...visitorData, hasSeenIntro: true };
    setVisitorData(updatedData);
    localStorage.setItem("portfolio-visitor-data", JSON.stringify(updatedData));
  };

  // Save visitor data when component unmounts or data changes
  useEffect(() => {
    localStorage.setItem("portfolio-visitor-data", JSON.stringify(visitorData));
  }, [visitorData]);

  return {
    greeting,
    isReturningVisitor,
    visitCount: visitorData.visitCount,
    hasSeenIntro: visitorData.hasSeenIntro,
    markIntroAsSeen,
  };
};
