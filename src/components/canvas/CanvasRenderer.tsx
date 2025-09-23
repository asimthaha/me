/**
 * Canvas Renderer - Separated rendering logic for better maintainability
 * Handles all canvas drawing operations and theme-specific rendering
 */

import { useCallback } from 'react';
import type { DeviceCapabilities, PerformanceSettings } from '@/utils/device-capabilities';

export interface RenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  capabilities: DeviceCapabilities;
  settings: PerformanceSettings;
}

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private theme: string;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, theme: string) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.theme = theme;
  }

  /**
   * Update theme for renderer
   */
  updateTheme(theme: string) {
    this.theme = theme;
  }

  /**
   * Clear canvas with theme-appropriate background
   */
  clearCanvas() {
    const isDark = this.theme === "dark" || this.theme === "netflix" || this.theme === "github";
    this.ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Render trail map with theme-specific colors
   */
  renderTrailMap(trailMap: ImageData) {
    const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < trailMap.data.length; i += 4) {
      const intensity = trailMap.data[i] / 255;
      const { r, g, b, a } = this.getThemeColors();

      imageData.data[i] = Math.floor(intensity * r);     // R
      imageData.data[i + 1] = Math.floor(intensity * g); // G
      imageData.data[i + 2] = Math.floor(intensity * b); // B
      imageData.data[i + 3] = Math.floor(intensity * a); // A
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Get theme-specific color values
   */
  private getThemeColors() {
    let r = 30, g = 30, b = 30, a = 150; // Default (light)

    switch (this.theme) {
      case "light":
        r = 30; g = 30; b = 30; a = 150;
        break;
      case "dark":
        r = 200; g = 255; b = 230; a = 200; // Blue-green
        break;
      case "netflix":
        r = 255; g = 50; b = 50; a = 180; // Red accent
        break;
      case "ey":
        r = 255; g = 200; b = 0; a = 170; // Gold/yellow
        break;
      case "github":
        r = 150; g = 200; b = 255; a = 190; // Blue
        break;
    }

    return { r, g, b, a };
  }
}

/**
 * Hook for using canvas renderer
 */
export const useCanvasRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  theme: string
) => {
  const createRenderer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    return new CanvasRenderer(canvas, ctx, theme);
  }, [canvasRef, theme]);

  return { createRenderer };
};