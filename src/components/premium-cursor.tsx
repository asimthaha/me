import { useEffect, useRef, useState } from "react";

/**
 * Premium Magnetic Cursor with Contextual States
 * - Keeps the normal system cursor
 * - Adds a highlight circle with contextual states (viewing, clickable, dragging)
 * - Magnetic attraction to interactive elements
 */
export const PremiumCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<
    "default" | "clickable" | "dragging"
  >("default");

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isDragging = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target;
      if (target instanceof HTMLElement) {
        // Check for clickable elements
        const clickableTarget =
          target.closest("button") ||
          target.closest("a") ||
          target.closest("[role='button']") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select");

        const magneticTarget = target.closest(".magnetic") || clickableTarget;

        if (magneticTarget) {
          const rect = magneticTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // pull cursor highlight toward the center
          mouseX = centerX;
          mouseY = centerY;

          // Update cursor state
          if (clickableTarget) {
            setCursorState("clickable");
          } else {
            setCursorState("default");
          }
        } else {
          setCursorState("default");
        }
      }
    };

    const handleMouseDown = () => {
      isDragging = true;
      setCursorState("dragging");
    };

    const handleMouseUp = () => {
      isDragging = false;
      setCursorState("default");
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
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    animateCursor();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const getCursorStyle = () => {
    const baseStyle = {
      borderRadius: "50%",
      mixBlendMode: "normal" as const,
      transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };

    switch (cursorState) {
      case "clickable":
        return {
          ...baseStyle,
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.6) 0%, hsl(var(--accent) / 0.2) 50%, transparent 80%)",
          boxShadow: "0 0 25px hsl(var(--accent) / 0.5)",
          transform: "scale(1.2)",
        };
      case "dragging":
        return {
          ...baseStyle,
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, hsl(var(--primary) / 0.2) 50%, transparent 80%)",
          boxShadow: "0 0 30px hsl(var(--primary) / 0.5)",
          transform: "scale(0.8)",
        };
      default:
        return {
          ...baseStyle,
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.4) 0%, hsl(var(--accent) / 0.1) 50%, transparent 80%)",
          boxShadow: "0 0 20px hsl(var(--accent) / 0.3)",
        };
    }
  };

  return (
    <>
      {/* Cursor highlight */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999]"
        style={getCursorStyle()}
      />
    </>
  );
};
