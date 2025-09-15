import { useEffect, useRef } from "react";

/**
 * Premium Magnetic Cursor
 * - Keeps the normal system cursor
 * - Adds a highlight circle that gets "pulled" toward magnetic elements
 */
export const PremiumCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target;
      if (target instanceof HTMLElement) {
        const magneticTarget =
          target.closest(".magnetic") ||
          target.closest("button") ||
          target.closest("a");

        if (magneticTarget) {
          const rect = magneticTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // pull cursor highlight toward the center
          mouseX = centerX;
          mouseY = centerY;
        }
      }
    };

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      cursor.style.transform = `translate3d(${cursorX - 10}px, ${
        cursorY - 10
      }px, 0)`;

      requestAnimationFrame(animateCursor);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animateCursor();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Cursor highlight */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] transition-all duration-300"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
};
