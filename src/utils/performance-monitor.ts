/**
 * Performance monitoring utilities for theme switching
 */

interface PerformanceMark {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private marks: Map<string, PerformanceMark> = new Map();
  private measures: PerformanceMark[] = [];

  startMark(name: string) {
    const startTime = performance.now();
    this.marks.set(name, { name, startTime });
    console.log(`[Performance] Started: ${name}`);
  }

  endMark(name: string) {
    const mark = this.marks.get(name);
    if (!mark) {
      console.warn(`[Performance] Mark "${name}" not found`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - mark.startTime;

    const completedMark = {
      ...mark,
      endTime,
      duration,
    };

    this.measures.push(completedMark);
    this.marks.delete(name);

    console.log(`[Performance] Completed: ${name} (${duration.toFixed(2)}ms)`);

    return duration;
  }

  measureFunction<T>(name: string, fn: () => T): T {
    this.startMark(name);
    try {
      const result = fn();
      this.endMark(name);
      return result;
    } catch (error) {
      this.endMark(name);
      throw error;
    }
  }

  async measureAsyncFunction<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.startMark(name);
    try {
      const result = await fn();
      this.endMark(name);
      return result;
    } catch (error) {
      this.endMark(name);
      throw error;
    }
  }

  getAllMeasures() {
    return this.measures;
  }

  clearMeasures() {
    this.measures = [];
    this.marks.clear();
  }

  getSummary() {
    const summary = this.measures.reduce(
      (acc, measure) => {
        if (measure.duration) {
          acc.totalTime += measure.duration;
          acc.operations++;
          acc.averageTime = acc.totalTime / acc.operations;
          acc.maxTime = Math.max(acc.maxTime, measure.duration);
          acc.minTime = Math.min(acc.minTime, measure.duration);
        }
        return acc;
      },
      {
        totalTime: 0,
        operations: 0,
        averageTime: 0,
        maxTime: 0,
        minTime: Infinity,
      }
    );

    return summary;
  }
}

// Global performance monitor instance
export const perfMonitor = new PerformanceMonitor();

// Performance utilities
export const measureThemeSwitch = async (
  themeName: string,
  switchFn: () => Promise<void>
) => {
  console.log(`[ThemeSwitch] Starting theme switch to: ${themeName}`);
  const totalStart = performance.now();

  // Measure the actual theme switch
  await perfMonitor.measureAsyncFunction(`theme-switch-${themeName}`, switchFn);

  const totalEnd = performance.now();
  const totalDuration = totalEnd - totalStart;

  console.log(
    `[ThemeSwitch] Total theme switch time: ${totalDuration.toFixed(2)}ms`
  );

  const summary = perfMonitor.getSummary();
  console.log(`[ThemeSwitch] Performance Summary:`, {
    totalTime: summary.totalTime.toFixed(2) + "ms",
    operations: summary.operations,
    averageTime: summary.averageTime.toFixed(2) + "ms",
    maxTime: summary.maxTime.toFixed(2) + "ms",
    minTime: summary.minTime.toFixed(2) + "ms",
  });

  return {
    totalDuration,
    summary,
    measures: perfMonitor.getAllMeasures(),
  };
};

// CSS performance measurement
export const measureCSSUpdate = (updateFn: () => void) => {
  return perfMonitor.measureFunction("css-update", () => {
    // Force layout calculation before update
    const _beforeHeight = document.body.offsetHeight; // Trigger layout

    const startTime = performance.now();
    updateFn();

    // Force layout calculation after update
    const _afterHeight = document.body.offsetHeight; // Trigger layout

    return performance.now() - startTime;
  });
};

// Memory usage monitoring
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo;
}

export const getMemoryUsage = () => {
  const perfWithMemory = performance as PerformanceWithMemory;
  if ("memory" in perfWithMemory && perfWithMemory.memory) {
    const memory = perfWithMemory.memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
      totalMB: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
    };
  }
  return null;
};
