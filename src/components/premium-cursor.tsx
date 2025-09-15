import { useEffect, useRef, useState } from 'react';

/**
 * Premium Interactive Cursor Component
 * Features: Custom cursor, magnetic effects, hover state changes
 */
export const PremiumCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check for magnetic elements
      const magneticElement = e.target as HTMLElement;
      const isMagneticTarget = magneticElement?.closest('.magnetic') || 
                              magneticElement?.closest('button') || 
                              magneticElement?.closest('a');

      if (isMagneticTarget && !isMagnetic) {
        setIsMagnetic(true);
        const rect = (isMagneticTarget as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Magnetic pull effect
        mouseX = centerX;
        mouseY = centerY;
      } else if (!isMagneticTarget && isMagnetic) {
        setIsMagnetic(false);
      }
    };

    // Smooth cursor animation
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      cursor.style.transform = `translate3d(${cursorX - 20}px, ${cursorY - 20}px, 0)`;
      cursorDot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;

      requestAnimationFrame(animateCursor);
    };

    // Hover state handlers
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('button, a, .interactive')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('button, a, .interactive')) {
        setIsHovering(false);
      }
    };

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Start animation
    animateCursor();

    return () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, [isMagnetic]);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] transition-all duration-300 ${
          isHovering ? 'scale-150 opacity-50' : 'scale-100 opacity-30'
        } ${
          isMagnetic ? 'scale-200 opacity-80' : ''
        }`}
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          mixBlendMode: 'difference',
        }}
      />
      
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] transition-all duration-100 ${
          isHovering ? 'scale-200' : 'scale-100'
        }`}
        style={{
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: '50%',
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
};