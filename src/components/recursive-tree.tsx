import { useEffect, useRef } from "react";
import p5 from "p5";
import { useTheme } from "@/contexts/theme-context";

interface RecursiveTreeProps {
  size?: number;
  opacity?: number;
}

const RecursiveTree = ({ size = 1, opacity = 1 }: RecursiveTreeProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!sketchRef.current) return;

    let angle: number;

    const sketch = (p: p5) => {
      p.setup = () => {
        // Responsive canvas sizing based on screen size
        const isMobile = window.innerWidth < 768;
        const baseWidth = isMobile ? 300 : 400;
        const baseHeight = isMobile ? 225 : 300;
        p.createCanvas(baseWidth * size, baseHeight * size);
        p.colorMode(p.RGB, 255);
        p.angleMode(p.DEGREES);
      };

      p.draw = () => {
        p.clear();

        // Calculate the angle based on the mouse position, maximum 90 degrees
        angle = (p.mouseX / p.width) * 90;
        angle = p.min(angle, 90);

        // Start the tree from the bottom of the screen
        p.translate(p.width / 2, p.height);

        // Move to the end of that line
        p.translate(0, -80);

        // Start the recursive branching
        branch(80, 0);
      };

      const branch = (h: number, level: number) => {
        // Get current theme colors - parse HSL values for RGB conversion
        const accentColor = theme.colors.accent; // HSL format like "217 91% 60%"
        const mutedColor = theme.colors.muted; // HSL format like "220 14% 96%"

        // Convert HSL to RGB for p5.js
        const accentRGB = hslToRgb(accentColor);
        const mutedRGB = hslToRgb(mutedColor);

        // Interpolate between accent and muted based on recursion level
        const ratio = Math.min(level * 0.1, 1);
        const r = p.lerp(accentRGB.r, mutedRGB.r, ratio);
        const g = p.lerp(accentRGB.g, mutedRGB.g, ratio);
        const b = p.lerp(accentRGB.b, mutedRGB.b, ratio);

        // Set stroke with theme colors and reduce opacity for subtle effect
        p.stroke(r, g, b, 120); // Semi-transparent for background blending
        p.strokeWeight(2);

        // Each branch will be 2/3 the size of the previous one
        h *= 0.66;

        // Draw if our branch length > 2, otherwise stop the recursion
        if (h > 2) {
          // Draw the right branch
          p.push();
          p.rotate(angle);
          p.line(0, 0, 0, -h);
          p.translate(0, -h);
          branch(h, level + 1);
          p.pop();

          // Draw the left branch
          p.push();
          p.rotate(-angle);
          p.line(0, 0, 0, -h);
          p.translate(0, -h);
          branch(h, level + 1);
          p.pop();
        }
      };

      // Helper function to convert HSL string to RGB object
      const hslToRgb = (hslString: string) => {
        const [h, s, l] = hslString.split(" ").map((val) => {
          if (val.includes("%")) {
            return parseFloat(val.replace("%", "")) / 100;
          }
          return parseFloat(val);
        });

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;

        let r = 0,
          g = 0,
          b = 0;

        if (0 <= h && h < 60) {
          r = c;
          g = x;
          b = 0;
        } else if (60 <= h && h < 120) {
          r = x;
          g = c;
          b = 0;
        } else if (120 <= h && h < 180) {
          r = 0;
          g = c;
          b = x;
        } else if (180 <= h && h < 240) {
          r = 0;
          g = x;
          b = c;
        } else if (240 <= h && h < 300) {
          r = x;
          g = 0;
          b = c;
        } else if (300 <= h && h < 360) {
          r = c;
          g = 0;
          b = x;
        }

        return {
          r: Math.round((r + m) * 255),
          g: Math.round((g + m) * 255),
          b: Math.round((b + m) * 255),
        };
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, [theme, size]);

  return (
    <div className="flex justify-center">
      <div
        ref={sketchRef}
        className="rounded-lg overflow-hidden bg-transparent"
        style={{ background: "transparent" }}
      />
    </div>
  );
};

export default RecursiveTree;
