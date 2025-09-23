/**
 * Animation Manager - Handles animation loop and performance monitoring
 * Separated from UI components for better performance control
 */

import { useRef, useCallback, useEffect } from 'react';
import { perfMonitor } from '@/utils/performance-monitor';
import type { PerformanceSettings } from '@/utils/device-capabilities';

export interface AnimationState {
  isAnimating: boolean;
  isPaused: boolean;
  frameCount: number;
  lastFrameTime: number;
}

export class AnimationManager {
  private animationFrameId: number | null = null;
  private frameInterval: number;
  private lastTime = 0;
  private frameCount = 0;
  private isRunning = false;
  private onFrame: (deltaTime: number) => void;

  constructor(settings: PerformanceSettings, onFrame: (deltaTime: number) => void) {
    this.frameInterval = 1000 / settings.targetFPS;
    this.onFrame = onFrame;
  }

  /**
   * Start animation loop
   */
  start() {
    if (this.isRunning) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.isRunning = true;
    this.animate(0);
  }

  /**
   * Stop animation loop
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isRunning = false;
  }

  /**
   * Main animation loop
   */
  private animate = (currentTime: number) => {
    if (!this.isRunning) return;

    if (currentTime - this.lastTime >= this.frameInterval) {
      const deltaTime = currentTime - this.lastTime;
      
      // Performance monitoring
      perfMonitor.startMark('animation_frame');
      this.onFrame(deltaTime);
      perfMonitor.endMark('animation_frame');

      this.lastTime = currentTime;
      this.frameCount++;
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      frameCount: this.frameCount,
      isRunning: this.isRunning,
      measures: perfMonitor.getAllMeasures(),
    };
  }

  /**
   * Update frame interval based on performance settings
   */
  updateSettings(settings: PerformanceSettings) {
    this.frameInterval = 1000 / settings.targetFPS;
  }
}

/**
 * Hook for using animation manager
 */
export const useAnimationManager = (
  settings: PerformanceSettings,
  onFrame: (deltaTime: number) => void,
  isAnimating: boolean
) => {
  const managerRef = useRef<AnimationManager>();

  const createManager = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.stop();
    }
    managerRef.current = new AnimationManager(settings, onFrame);
  }, [settings, onFrame]);

  useEffect(() => {
    createManager();
    return () => {
      if (managerRef.current) {
        managerRef.current.stop();
      }
    };
  }, [createManager]);

  useEffect(() => {
    if (managerRef.current) {
      if (isAnimating) {
        managerRef.current.start();
      } else {
        managerRef.current.stop();
      }
    }
  }, [isAnimating]);

  return {
    manager: managerRef.current,
    createManager,
  };
};