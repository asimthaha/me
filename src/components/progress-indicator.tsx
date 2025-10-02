import { useEffect, useState } from "react";

/**
 * Scroll Progress Indicator
 * Shows a thin line at the top indicating scroll progress
 */
export const ProgressIndicator = ({ scrollContainerRef }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current;

    if (!scrollContainer) return;

    const updateProgress = () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    scrollContainer.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial calculation

    return () => scrollContainer.removeEventListener("scroll", updateProgress);
  }, [scrollContainerRef]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-muted">
      <div
        className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
