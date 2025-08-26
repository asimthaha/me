/**
 * Device Capabilities Detection and Performance Scaling
 * Handles device detection, performance optimization, and responsive settings
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  isLowEnd: boolean;
}

export interface PerformanceSettings {
  renderScale: number;
  trailDecay: number;
  targetFPS: number;
  sensorDistance: number;
  rotationAngle: number;
}

/**
 * Detect device capabilities for performance optimization
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth < 768;

  // Detect low-end devices based on hardware concurrency and screen size
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isLowEnd = hardwareConcurrency < 4 || (isMobile && screenWidth < 480);

  return {
    isMobile,
    pixelRatio,
    screenWidth,
    screenHeight,
    isLowEnd,
  };
};

/**
 * Calculate optimal agent count based on canvas dimensions and device capabilities
 */
export const calculateOptimalAgentCount = (
  canvasWidth: number,
  canvasHeight: number,
  capabilities: DeviceCapabilities
): number => {
  const baseCount = Math.floor((canvasWidth * canvasHeight) / 1000);

  // Scale based on device capabilities
  let scaleFactor = 1;

  if (capabilities.isLowEnd) {
    scaleFactor = 0.3; // Reduce to 30% on low-end devices
  } else if (capabilities.isMobile) {
    scaleFactor = 0.6; // Reduce to 60% on mobile
  } else if (capabilities.screenWidth >= 1440) {
    scaleFactor = 1.2; // Increase on large screens
  }

  return Math.max(50, Math.min(400, Math.floor(baseCount * scaleFactor)));
};

/**
 * Get performance settings optimized for the current device
 */
export const getPerformanceSettings = (
  capabilities: DeviceCapabilities
): PerformanceSettings => {
  const baseSettings: PerformanceSettings = {
    renderScale: 1,
    trailDecay: 0.99,
    targetFPS: 30,
    sensorDistance: 9,
    rotationAngle: 45,
  };

  if (capabilities.isLowEnd) {
    return {
      ...baseSettings,
      renderScale: 0.5,
      trailDecay: 0.95,
      targetFPS: 24,
      sensorDistance: 6,
      rotationAngle: 60,
    };
  } else if (capabilities.isMobile) {
    return {
      ...baseSettings,
      renderScale: 0.7,
      trailDecay: 0.97,
      targetFPS: 30,
      sensorDistance: 7,
      rotationAngle: 45,
    };
  }

  return baseSettings;
};

/**
 * Calculate optimal canvas dimensions with device pixel ratio
 */
export const calculateCanvasDimensions = (
  displayWidth: number,
  displayHeight: number,
  capabilities: DeviceCapabilities,
  performanceSettings: PerformanceSettings
) => {
  const canvasWidth = Math.floor(
    displayWidth * capabilities.pixelRatio * performanceSettings.renderScale
  );
  const canvasHeight = Math.floor(
    displayHeight * capabilities.pixelRatio * performanceSettings.renderScale
  );

  return {
    canvasWidth,
    canvasHeight,
    displayWidth,
    displayHeight,
  };
};
