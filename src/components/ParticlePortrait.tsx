import React, { useRef, useEffect } from "react";

// We can keep the Particle class from the original JS,
// as it's a very clean way to manage each particle's state.
class Particle {
  // --- Configuration Variables ---
  // Moved static properties inside the class for TS
  static particleDensity: number = 3;
  static particleSize: number = 1.5;
  static easeFactor: number = 0.04;
  static maxCanvasWidth: number = 320;
  static swirlCenterConcentration: number = 0.92;
  static swirlMaxRadius: number = 125;
  static swirlRotationSpeed: number = 0.0056;
  static swirlRandomWalkSpeed: number = 0.8;
  static swirlOscillation: number = 0.03;
  static imageUrl: string = "/public/images/portrait.png";

  // --- Instance Properties ---
  imageX: number;
  imageY: number;
  randomX: number;
  randomY: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  color: string;
  speed: number;
  type: "concentrated" | "scattered_swirl";

  // Swirling properties
  swirlRadius?: number;
  swirlAngle?: number;
  swirlAngularVelocity?: number;
  swirlOscillationOffset?: number;

  // Scattered properties
  vx?: number;
  vy?: number;

  constructor(
    imageX: number,
    imageY: number,
    color: string,
    type: "concentrated" | "scattered_swirl",
    canvasWidth: number,
    canvasHeight: number // Note: will be the same (square)
  ) {
    // The "assembled" position (from the image)
    this.imageX = imageX;
    this.imageY = imageY;

    // The "scattered" position (random, for later use)
    this.randomX = Math.random() * canvasWidth;
    this.randomY = Math.random() * canvasHeight;

    // The "target" position (where it's trying to go)
    this.targetX = 0;
    this.targetY = 0;

    // The "current" position (where it is right now)
    this.x = 0;
    this.y = 0;

    this.color = color;

    // Give each particle a slightly different speed for a more organic feel
    this.speed = Math.random() * 0.05 + Particle.easeFactor;

    // Swirling properties
    this.type = type; // 'concentrated' or 'scattered_swirl'
    if (this.type === "concentrated") {
      this.swirlRadius = Math.random() * Particle.swirlMaxRadius;
      this.swirlAngle = Math.random() * Math.PI * 2; // Full circle
      this.swirlAngularVelocity =
        (Math.random() - 0.5) * Particle.swirlRotationSpeed * 2; // Slight variation
      this.swirlOscillationOffset = Math.random() * Math.PI * 2; // For breathing effect
    } else {
      // For scattered particles in swirl state
      this.vx = (Math.random() - 0.5) * Particle.swirlRandomWalkSpeed;
      this.vy = (Math.random() - 0.5) * Particle.swirlRandomWalkSpeed;
    }
  }

  // Initialize position for the start of the swirl animation
  initSwirlPosition(
    centerX: number,
    centerY: number,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    if (this.type === "concentrated") {
      this.x = centerX + Math.cos(this.swirlAngle!) * this.swirlRadius!;
      this.y = centerY + Math.sin(this.swirlAngle!) * this.swirlRadius!;
    } else {
      // --- MODIFIED: Start scattered particles inside the circle ---
      const radius = canvasWidth / 2;
      const randomAngle = Math.random() * Math.PI * 2;
      // Use Math.sqrt(Math.random()) for a uniform distribution within the circle
      const randomRadius = Math.sqrt(Math.random()) * radius;
      this.x = centerX + Math.cos(randomAngle) * randomRadius;
      this.y = centerY + Math.sin(randomAngle) * randomRadius;
    }
  }

  // Update the particle's current position
  update(
    centerX: number,
    centerY: number,
    time: number,
    canvasWidth: number,
    canvasHeight: number,
    isSwirling: boolean
  ): void {
    if (isSwirling) {
      if (this.type === "concentrated") {
        // --- Concentrated Swirl Logic ---
        this.swirlAngle! += this.swirlAngularVelocity!;

        // Add some oscillation for "breathing" effect
        const currentSwirlRadius =
          this.swirlRadius! +
          Math.sin(time * 0.01 + this.swirlOscillationOffset!) *
            Particle.swirlOscillation *
            Particle.swirlMaxRadius;

        this.x = centerX + Math.cos(this.swirlAngle!) * currentSwirlRadius;
        this.y = centerY + Math.sin(this.swirlAngle!) * currentSwirlRadius;

        // Boundary check is no longer needed here, as clipping handles visuals
        // and concentrated particles stay near the center anyway.
      } else {
        // --- Scattered Swirl Logic (random walk with bounce) ---
        this.x += this.vx!;
        this.y += this.vy!;

        // Add a small random change to velocity for "swirling"
        this.vx! += (Math.random() - 0.5) * 0.1;
        this.vy! += (Math.random() - 0.5) * 0.1;

        // Clamp velocity to a max speed
        this.vx = Math.max(
          -Particle.swirlRandomWalkSpeed,
          Math.min(Particle.swirlRandomWalkSpeed, this.vx!)
        );
        this.vy = Math.max(
          -Particle.swirlRandomWalkSpeed,
          Math.min(Particle.swirlRandomWalkSpeed, this.vy!)
        );

        // --- MODIFIED: Boundary check (bounce off circle) ---
        const radius = canvasWidth / 2;
        const dx = this.x - centerX;
        const dy = this.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if particle is at or outside the boundary
        if (distance > radius - Particle.particleSize) {
          // Calculate normal vector (from center to particle)
          const nx = dx / distance;
          const ny = dy / distance;

          // Calculate dot product of velocity and normal
          const dot = this.vx! * nx + this.vy! * ny;

          // Reflect velocity vector
          this.vx = this.vx! - 2 * dot * nx;
          this.vy = this.vy! - 2 * dot * ny;

          // Push particle back inside to prevent getting stuck
          this.x = centerX + nx * (radius - Particle.particleSize);
          this.y = centerY + ny * (radius - Particle.particleSize);
        }
      }
    } else {
      // --- Easing Logic (Assemble/Scatter) ---
      this.x += (this.targetX - this.x) * this.speed;
      this.y += (this.targetY - this.y) * this.speed;
    }
  }

  // Draw the particle on the canvas
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, Particle.particleSize, Particle.particleSize);
  }
}

const ParticlePortrait: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  // Ref to store "contain" draw dimensions
  const imageDrawDataRef = useRef({ dx: 0, dy: 0, dWidth: 0, dHeight: 0 });
  // Use refs for all data that the animation loop needs to access and mutate
  const particlesArrayRef = useRef<Particle[]>([]);
  const isSwirlingRef = useRef<boolean>(true);
  const isAssembledRef = useRef<boolean>(false);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    // --- 1. Setup ---
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // --- 4. Particle Creation ---
    const initParticles = () => {
      const image = imageRef.current;
      if (!image || !canvas || !ctx) return;

      // Get "contain" draw dimensions from ref
      const { dx, dy, dWidth, dHeight } = imageDrawDataRef.current;

      // Draw the image onto the canvas (it's hidden)
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear first
      ctx.drawImage(image, dx, dy, dWidth, dHeight); // Use calculated dimensions

      // Get the pixel data from the canvas
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;

      particlesArrayRef.current = []; // Clear any existing particles
      const potentialParticles: { x: number; y: number; color: string }[] = [];

      // Collect all potential particle data
      // This loop is fine, it scans the whole square canvas and will
      // only find pixels where the image was drawn (dx, dy, dWidth, dHeight).
      for (let y = 0; y < canvas.height; y += Particle.particleDensity) {
        for (let x = 0; x < canvas.width; x += Particle.particleDensity) {
          const index = (y * canvas.width + x) * 4;
          const r = imageData[index];
          const g = imageData[index + 1];
          const b = imageData[index + 2];
          const a = imageData[index + 3];

          const color = `rgb(${r},${g},${b})`;
          const brightness = (r + g + b) / 3;

          // The x, y coordinates are already correct relative to the canvas
          if (a > 100 && brightness > 10) {
            potentialParticles.push({ x, y, color });
          }
        }
      }

      // Randomize the order to distribute 'concentrated' types evenly
      potentialParticles.sort(() => 0.5 - Math.random());

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < potentialParticles.length; i++) {
        const pData = potentialParticles[i];
        const type =
          i < potentialParticles.length * Particle.swirlCenterConcentration
            ? "concentrated"
            : "scattered_swirl";
        const particle = new Particle(
          pData.x,
          pData.y,
          pData.color,
          type,
          canvas.width,
          canvas.height
        );
        particle.initSwirlPosition(
          centerX,
          centerY,
          canvas.width,
          canvas.height
        ); // Set initial swirl position
        particlesArrayRef.current.push(particle);
      }

      // Clear the image from the canvas, leaving it blank
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // --- 5. Animation Loop ---
    const animate = (time: number) => {
      if (!ctx || !canvas) return; // Ensure context and canvas are still valid

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2; // Canvas is square

      // --- NEW: Apply circular clipping mask ---
      ctx.save(); // Save the current state (transform, fillStyle, etc.)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip(); // Apply the clipping path

      // Clear the *clipped* canvas area every frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw every particle
      // We mutate the array in the ref directly for performance
      for (let i = 0; i < particlesArrayRef.current.length; i++) {
        const particle = particlesArrayRef.current[i];
        particle.update(
          centerX,
          centerY,
          time,
          canvas.width,
          canvas.height,
          isSwirlingRef.current
        );
        // draw() will only render inside the clipped path
        particle.draw(ctx);
      }

      // --- NEW: Restore context ---
      ctx.restore(); // Remove the clipping mask for the next frame
      // This is crucial so that the *next* frame's save/clip/clearRect works correctly

      // Request the next frame
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // --- 6. Interaction ---
    const toggleState = () => {
      if (!canvas) return;

      if (isSwirlingRef.current) {
        // First click: Stop swirling and assemble
        isSwirlingRef.current = false;
        isAssembledRef.current = true;

        // Tell every particle its *image* target
        for (let i = 0; i < particlesArrayRef.current.length; i++) {
          const p = particlesArrayRef.current[i];
          p.targetX = p.imageX;
          p.targetY = p.imageY;
        }
      } else {
        // Subsequent clicks: Toggle between assembled and scattered
        isAssembledRef.current = !isAssembledRef.current; // Flip the state

        // --- NEW: Get circle properties for scattering ---
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2;

        // Tell every particle its new target
        for (let i = 0; i < particlesArrayRef.current.length; i++) {
          const p = particlesArrayRef.current[i];
          if (isAssembledRef.current) {
            p.targetX = p.imageX;
            p.targetY = p.imageY;
          } else {
            // --- MODIFIED: Give it a new random position *inside* the circle ---
            const randomAngle = Math.random() * Math.PI * 2;
            const randomRadius = Math.sqrt(Math.random()) * radius;
            p.randomX = centerX + Math.cos(randomAngle) * randomRadius;
            p.randomY = centerY + Math.sin(randomAngle) * randomRadius;
            // --- END MODIFIED ---
            p.targetX = p.randomX;
            p.targetY = p.randomY;
          }
        }
      }
    };

    // --- 3. Image Loading and Initialization ---
    const image = new Image();
    image.crossOrigin = "Anonymous";
    imageRef.current = image; // Store image in ref

    image.onload = () => {
      if (!canvas || !ctx) return; // Add ctx check // --- 1. GET DPR ---

      const dpr = window.devicePixelRatio || 1;

      const newSize = canvas.parentElement
        ? canvas.parentElement.getBoundingClientRect().width
        : 0; // --- 2. THIS IS THE *CSS* DISPLAY SIZE ---

      const finalCssSize = Math.min(newSize, Particle.maxCanvasWidth);

      if (finalCssSize <= 0) {
        console.warn(
          `ParticlePortrait: Parent width is ${newSize}. Retrying in 100ms.`
        );
        setTimeout(image.onload, 100);
        return;
      }
      const finalBitmapSize = finalCssSize * dpr; // Set the canvas internal resolution

      canvas.width = finalBitmapSize;
      canvas.height = finalBitmapSize; // Square // Set the canvas display size (CSS)

      canvas.style.width = `${finalCssSize}px`;
      canvas.style.height = `${finalCssSize}px`;
      canvas.style.aspectRatio = `1 / 1`; // --- 4. CALCULATE "CONTAIN" USING BITMAP SIZE --- // All particle logic will now operate in the larger "bitmap" space.

      const imgAspectRatio = image.width / image.height;
      const canvasAspectRatio = 1; // canvas.width / canvas.height is 1
      let dWidth, dHeight, dx, dy;

      // This logic now correctly uses canvas.width (which is finalBitmapSize)
      if (imgAspectRatio > canvasAspectRatio) {
        dWidth = canvas.width;
        dHeight = dWidth / imgAspectRatio;
        dx = 0;
        dy = (canvas.height - dHeight) / 2;
      } else {
        dHeight = canvas.height;
        dWidth = dHeight * imgAspectRatio;
        dy = 0;
        dx = (canvas.width - dWidth) / 2;
      }

      imageDrawDataRef.current = { dx, dy, dWidth, dHeight };

      console.log("Image loaded. Initializing particles...");
      initParticles();
      console.log(`Created ${particlesArrayRef.current.length} particles.`);

      // Start the animation loop
      animate(0); // Pass initial time
    };

    image.onerror = () => {
      if (!ctx || !canvas) return;
      console.error("Error loading image. Check URL and CORS.");
      ctx.fillStyle = "red";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "Error loading image. Check URL and CORS.",
        canvas.width / 2,
        canvas.height / 2
      );
    };

    // Set src to trigger loading
    image.src = Particle.imageUrl;

    // --- 7. Event Listeners ---
    canvas.addEventListener("click", toggleState);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas || !ctx) return; // Add ctx check
        console.log("Resizing... re-initializing.");

        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }

        // --- NEW: Clear entire canvas *before* changing size ---
        // This ensures no artifacts are left from the old clipped circle
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = 0;
        canvas.height = 0;

        // Re-load the image to trigger the process
        if (imageRef.current) {
          // This will re-trigger image.onload, which now has
          // our square canvas and "contain" logic.
          imageRef.current.src = Particle.imageUrl;
        }

        isSwirlingRef.current = true;
        isAssembledRef.current = false;
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    // --- Cleanup Function ---
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      // Check if canvas still exists before removing listener
      if (canvas) {
        canvas.removeEventListener("click", toggleState);
      }
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    // Root container with Tailwind classes for the <body>
    <div className="w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticlePortrait;
