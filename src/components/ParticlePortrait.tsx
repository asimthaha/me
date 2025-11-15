import React, { useRef, useEffect } from "react";

// Types for particle state
type ParticleAnimationState = "swirling" | number; // number is the image index

class Particle {
  // --- Configuration Variables ---
  static particleDensity: number = 3;
  static particleSize: number = 1.5;
  static easeFactor: number = 0.04;
  static maxCanvasWidth: number = 320;
  static swirlCenterConcentration: number = 0.92;
  static swirlMaxRadius: number = 125;
  static swirlRotationSpeed: number = 0.0056;
  static swirlRandomWalkSpeed: number = 0.8;
  static swirlOscillation: number = 0.03;

  // --- MODIFIED: Now supports N images ---
  static imageUrls: string[] = [
    `${import.meta.env.BASE_URL}images/portrait.png`,
    `${import.meta.env.BASE_URL}images/portrait-1.png`,
    // Add more images here and it will work
    // `${import.meta.env.BASE_URL}images/portrait-2.png`,
  ];

  // --- Instance Properties ---
  imageTargets: { x: number; y: number; color: string }[];
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
    imageTargets: { x: number; y: number; color: string }[],
    color: string,
    type: "concentrated" | "scattered_swirl",
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.imageTargets = imageTargets;
    this.color = this.imageTargets[0].color;
    this.type = type;
    this.randomX = Math.random() * canvasWidth;
    this.randomY = Math.random() * canvasHeight;
    this.targetX = 0;
    this.targetY = 0;
    this.x = 0;
    this.y = 0;
    this.speed = Math.random() * 0.05 + Particle.easeFactor;

    if (this.type === "concentrated") {
      this.swirlRadius = Math.random() * Particle.swirlMaxRadius;
      this.swirlAngle = Math.random() * Math.PI * 2;
      this.swirlAngularVelocity =
        (Math.random() - 0.5) * Particle.swirlRotationSpeed * 2;
      this.swirlOscillationOffset = Math.random() * Math.PI * 2;
    } else {
      this.vx = (Math.random() - 0.5) * Particle.swirlRandomWalkSpeed;
      this.vy = (Math.random() - 0.5) * Particle.swirlRandomWalkSpeed;
    }
  }

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
      const radius = canvasWidth / 2;
      const randomAngle = Math.random() * Math.PI * 2;
      const randomRadius = Math.sqrt(Math.random()) * radius;
      this.x = centerX + Math.cos(randomAngle) * randomRadius;
      this.y = centerY + Math.sin(randomAngle) * randomRadius;
    }
  }

  update(
    centerX: number,
    centerY: number,
    time: number,
    canvasWidth: number,
    canvasHeight: number,
    animationState: ParticleAnimationState // MODIFIED
  ): void {
    if (animationState === "swirling") {
      // --- This is the original "isSwirling" logic ---
      if (this.type === "concentrated") {
        this.swirlAngle! += this.swirlAngularVelocity!;
        const currentSwirlRadius =
          this.swirlRadius! +
          Math.sin(time * 0.01 + this.swirlOscillationOffset!) *
            Particle.swirlOscillation *
            Particle.swirlMaxRadius;
        this.x = centerX + Math.cos(this.swirlAngle!) * currentSwirlRadius;
        this.y = centerY + Math.sin(this.swirlAngle!) * currentSwirlRadius;
      } else {
        this.x += this.vx!;
        this.y += this.vy!;
        this.vx! += (Math.random() - 0.5) * 0.1;
        this.vy! += (Math.random() - 0.5) * 0.1;
        this.vx = Math.max(
          -Particle.swirlRandomWalkSpeed,
          Math.min(Particle.swirlRandomWalkSpeed, this.vx!)
        );
        this.vy = Math.max(
          -Particle.swirlRandomWalkSpeed,
          Math.min(Particle.swirlRandomWalkSpeed, this.vy!)
        );
        const radius = canvasWidth / 2;
        const dx = this.x - centerX;
        const dy = this.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > radius - Particle.particleSize) {
          const nx = dx / distance;
          const ny = dy / distance;
          const dot = this.vx! * nx + this.vy! * ny;
          this.vx = this.vx! - 2 * dot * nx;
          this.vy = this.vy! - 2 * dot * ny;
          this.x = centerX + nx * (radius - Particle.particleSize);
          this.y = centerY + ny * (radius - Particle.particleSize);
        }
      }
    } else {
      // --- MODIFIED: This is the morphing logic ---
      // 'animationState' is the image index
      const target = this.imageTargets[animationState];
      if (target) {
        this.targetX = target.x;
        this.targetY = target.y;
        this.color = target.color;
      }
      this.x += (this.targetX - this.x) * this.speed;
      this.y += (this.targetY - this.y) * this.speed;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, Particle.particleSize, Particle.particleSize);
  }
}

const ParticlePortrait: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDrawDataRef = useRef({ dx: 0, dy: 0, dWidth: 0, dHeight: 0 });
  const particlesArrayRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- MODIFIED: State is "swirling" or an image index ---
  const animationStateRef = useRef<ParticleAnimationState>("swirling");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // --- Helper to load an image and get its data ---
    const loadImageData = (
      src: string
    ): Promise<{
      imageData: ImageData;
      drawData: { dx: number; dy: number; dWidth: number; dHeight: number };
    }> => {
      return new Promise((resolve, reject) => {
        if (!ctx || !canvas) return reject(new Error("Canvas not ready"));

        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = src;

        image.onload = () => {
          // Calculate draw dimensions
          const imgAspectRatio = image.width / image.height;
          const canvasAspectRatio = 1; // Assuming 1:1 canvas
          let dWidth, dHeight, dx, dy;

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
          const drawData = { dx, dy, dWidth, dHeight };

          // Get image data
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, dx, dy, dWidth, dHeight);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          resolve({ imageData, drawData });
        };
        image.onerror = () => {
          reject(new Error(`Failed to load image: ${src}`));
        };
      });
    };

    // --- Helper to extract particles from image data ---
    type PotentialParticle = { x: number; y: number; color: string };
    const getPotentialParticles = (
      imageData: ImageData
    ): PotentialParticle[] => {
      const particles: PotentialParticle[] = [];
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

      for (let y = 0; y < height; y += Particle.particleDensity) {
        for (let x = 0; x < width; x += Particle.particleDensity) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];
          const color = `rgb(${r},${g},${b})`;
          const brightness = (r + g + b) / 3;

          if (a > 100 && brightness > 10) {
            particles.push({ x, y, color });
          }
        }
      }
      return particles;
    };

    const initParticles = (
      allImageData: ImageData[],
      drawData: { dx: number; dy: number; dWidth: number; dHeight: number }
    ) => {
      if (!canvas) return;
      imageDrawDataRef.current = drawData; // Store draw data (from first image)

      // 1. Get particle arrays for all images
      const allPotentialParticles: PotentialParticle[][] = [];
      for (const imgData of allImageData) {
        const particles = getPotentialParticles(imgData);
        particles.sort(() => 0.5 - Math.random()); // Shuffle each array
        allPotentialParticles.push(particles);
      }

      if (allPotentialParticles.some((arr) => arr.length === 0)) {
        console.error("Could not extract particles from one or more images.");
        return;
      }

      // 2. Find the max particle count
      const particleCounts = allPotentialParticles.map((arr) => arr.length);
      const maxParticles = Math.max(...particleCounts);
      console.log(`Particle counts: ${particleCounts.join(", ")}`);
      console.log(`Creating ${maxParticles} total particles.`);

      particlesArrayRef.current = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 3. Create particles
      for (let i = 0; i < maxParticles; i++) {
        const imageTargets: { x: number; y: number; color: string }[] = [];

        for (let j = 0; j < allPotentialParticles.length; j++) {
          const currentImageParticles = allPotentialParticles[j];
          const pData = currentImageParticles[i % currentImageParticles.length];
          // Store color along with x and y
          imageTargets.push({ x: pData.x, y: pData.y, color: pData.color });
        }

        // Use color from the *first* image's particle map
        const pData0 =
          allPotentialParticles[0][i % allPotentialParticles[0].length];

        const type =
          i < maxParticles * Particle.swirlCenterConcentration
            ? "concentrated"
            : "scattered_swirl";

        const particle = new Particle(
          imageTargets,
          pData0.color,
          type,
          canvas.width,
          canvas.height
        );

        particle.initSwirlPosition(
          centerX,
          centerY,
          canvas.width,
          canvas.height
        );
        particlesArrayRef.current.push(particle);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // --- MODIFIED: animate passes the new state ---
    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArrayRef.current.length; i++) {
        const particle = particlesArrayRef.current[i];
        particle.update(
          centerX,
          centerY,
          time,
          canvas.width,
          canvas.height,
          animationStateRef.current // Pass the current state
        );
        particle.draw(ctx);
      }
      ctx.restore();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // --- MODIFIED: New state machine logic for N images ---
    const transitionToNextState = () => {
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }

      const currentState = animationStateRef.current;
      let nextState: ParticleAnimationState;
      let nextDuration: number;
      const lastImageIndex = Particle.imageUrls.length - 1;

      if (currentState === "swirling") {
        // --- From SWIRL, go to IMAGE 0 ---
        nextState = 0;
        nextDuration = 7000; // View time for image
        console.log(`Carousel: Assembling Image 0`);
      } else if (typeof currentState === "number") {
        if (currentState === lastImageIndex) {
          // --- From LAST IMAGE, go to SWIRL ---
          nextState = "swirling";
          nextDuration = 5000; // Swirl time
          console.log("Carousel: Returning to Swirl");
        } else {
          // --- From IMAGE N, go to IMAGE N+1 ---
          nextState = currentState + 1;
          nextDuration = 7000; // View time for image
          console.log(`Carousel: Morphing to Image ${nextState}`);
        }
      } else {
        // Fallback
        nextState = "swirling";
        nextDuration = 5000;
      }

      animationStateRef.current = nextState;
      carouselTimerRef.current = setTimeout(
        transitionToNextState,
        nextDuration
      );
    };

    // --- NEW: Main setup function ---
    const setup = async (isRetry: boolean = false) => {
      if (!canvas || !ctx) return;

      // 1. Stop any existing animations
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
        carouselTimerRef.current = null;
      }

      // 2. Set canvas size
      const dpr = window.devicePixelRatio || 1;
      const newSize = canvas.parentElement
        ? canvas.parentElement.getBoundingClientRect().width
        : 0;
      const finalCssSize = Math.min(newSize, Particle.maxCanvasWidth);

      if (finalCssSize <= 0) {
        console.warn(
          `ParticlePortrait: Parent width is ${newSize}. Retrying in 100ms.`
        );
        setTimeout(() => setup(true), 100);
        return;
      }

      const finalBitmapSize = finalCssSize * dpr;
      canvas.width = finalBitmapSize;
      canvas.height = finalBitmapSize;
      canvas.style.width = `${finalCssSize}px`;
      canvas.style.height = `${finalCssSize}px`;
      canvas.style.aspectRatio = `1 / 1`;

      // 3. Load ALL images
      try {
        console.log("Loading all images...");
        const allLoadedData = await Promise.all(
          Particle.imageUrls.map(loadImageData)
        );
        console.log("All images loaded successfully.");

        // 4. Initialize particles (using first image's draw data for canvas centering)
        initParticles(
          allLoadedData.map((d) => d.imageData),
          allLoadedData[0].drawData
        );

        // 5. Start animation loop
        animationStateRef.current = "swirling"; // Start in swirl state
        if (!animationFrameIdRef.current) {
          animate(0);
        }

        // 6. Start state machine timer
        const initialSwirlTime = isRetry ? 100 : 2000; // 2s for first load
        console.log(`Carousel: Swirling for ${initialSwirlTime}ms`);
        carouselTimerRef.current = setTimeout(
          transitionToNextState,
          initialSwirlTime
        );
      } catch (error) {
        console.error("Error during setup:", error);
        if (ctx) {
          ctx.fillStyle = "red";
          ctx.font = "16px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            "Error loading images.",
            canvas.width / 2,
            canvas.height / 2
          );
        }
      }
    };

    // --- MODIFIED: Resize handler ---
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        console.log("Resizing... re-initializing.");
        // Just re-run the entire setup
        setup(true); // Pass true to indicate it's a "retry" or "resize"
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    // --- Initial run ---
    setup(false);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticlePortrait;
