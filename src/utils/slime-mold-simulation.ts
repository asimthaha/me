/**
 * Slime Mold Simulation Logic
 * Contains the Agent class and core simulation algorithms
 * Separated from React components for better maintainability and testability
 */

export interface SimulationConfig {
  sensorDistance: number;
  rotationAngle: number;
  trailDecay: number;
}

export interface Position {
  x: number;
  y: number;
}

export class Agent {
  x: number;
  y: number;
  heading: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  sensorAngle: number;
  sensorDist: number;
  rotAngle: number;

  constructor(
    width: number,
    height: number,
    sensorDist: number = 9,
    rotAngle: number = 45
  ) {
    this.width = width;
    this.height = height;

    // Start agents near center for better visual effect
    this.x = Math.random() * (width * 0.6) + width * 0.2;
    this.y = Math.random() * (height * 0.6) + height * 0.2;

    this.heading = Math.random() * 360;
    this.vx = Math.cos((this.heading * Math.PI) / 180);
    this.vy = Math.sin((this.heading * Math.PI) / 180);

    this.sensorAngle = 45;
    this.sensorDist = sensorDist;
    this.rotAngle = rotAngle;
  }

  update(trailMap: ImageData, config: SimulationConfig) {
    this.vx = Math.cos((this.heading * Math.PI) / 180);
    this.vy = Math.sin((this.heading * Math.PI) / 180);

    // Wrap around canvas
    this.x = (this.x + this.vx + this.width) % this.width;
    this.y = (this.y + this.vy + this.height) % this.height;

    // Get sensor positions
    const rSensor = this.getSensorPos(this.heading + this.sensorAngle);
    const lSensor = this.getSensorPos(this.heading - this.sensorAngle);
    const fSensor = this.getSensorPos(this.heading);

    // Sample trail intensity at sensor positions
    const r = this.sampleTrail(trailMap, rSensor.x, rSensor.y);
    const l = this.sampleTrail(trailMap, lSensor.x, lSensor.y);
    const f = this.sampleTrail(trailMap, fSensor.x, fSensor.y);

    // Steering logic based on sensor readings
    if (f > l && f > r) {
      // Continue forward
      this.heading += 0;
    } else if (f < l && f < r) {
      // Turn randomly when both sides are stronger
      if (Math.random() < 0.5) {
        this.heading += config.rotationAngle;
      } else {
        this.heading -= config.rotationAngle;
      }
    } else if (l > r) {
      // Turn left
      this.heading -= config.rotationAngle;
    } else if (r > l) {
      // Turn right
      this.heading += config.rotationAngle;
    }

    // Add small random component for exploration
    if (Math.random() < 0.1) {
      this.heading += (Math.random() - 0.5) * 20;
    }
  }

  getSensorPos(angle: number): Position {
    const rad = (angle * Math.PI) / 180;
    return {
      x: (this.x + this.sensorDist * Math.cos(rad) + this.width) % this.width,
      y: (this.y + this.sensorDist * Math.sin(rad) + this.height) % this.height,
    };
  }

  sampleTrail(trailMap: ImageData, x: number, y: number): number {
    const ix = Math.floor(x);
    const iy = Math.floor(y);

    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height) return 0;

    const index = (iy * this.width + ix) * 4;
    return trailMap.data[index]; // Red channel intensity
  }

  deposit(trailMap: ImageData) {
    const ix = Math.floor(this.x);
    const iy = Math.floor(this.y);

    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height) return;

    const index = (iy * this.width + ix) * 4;

    // Deposit trail (increase red channel)
    trailMap.data[index] = Math.min(255, trailMap.data[index] + 60);
    trailMap.data[index + 1] = Math.min(255, trailMap.data[index + 1] + 30);
    trailMap.data[index + 2] = Math.min(255, trailMap.data[index + 2] + 20);
    trailMap.data[index + 3] = 255;
  }
}

export class SlimeMoldSimulation {
  private agents: Agent[] = [];
  private trailMap: ImageData | null = null;
  private config: SimulationConfig;

  constructor(config: SimulationConfig) {
    this.config = config;
  }

  initialize(width: number, height: number, agentCount: number) {
    // Initialize agents
    this.agents = Array.from(
      { length: agentCount },
      () =>
        new Agent(
          width,
          height,
          this.config.sensorDistance,
          this.config.rotationAngle
        )
    );

    // Initialize trail map
    this.trailMap = new ImageData(width, height);

    // Fill with transparent pixels
    for (let i = 0; i < this.trailMap.data.length; i += 4) {
      this.trailMap.data[i] = 0; // R
      this.trailMap.data[i + 1] = 0; // G
      this.trailMap.data[i + 2] = 0; // B
      this.trailMap.data[i + 3] = 0; // A
    }
  }

  update(): ImageData | null {
    if (!this.trailMap) return null;

    // Decay trails
    const decayRate = this.config.trailDecay;
    for (let i = 0; i < this.trailMap.data.length; i += 4) {
      this.trailMap.data[i] = Math.max(0, this.trailMap.data[i] * decayRate);
      this.trailMap.data[i + 1] = Math.max(
        0,
        this.trailMap.data[i + 1] * decayRate
      );
      this.trailMap.data[i + 2] = Math.max(
        0,
        this.trailMap.data[i + 2] * decayRate
      );
    }

    // Update agents
    this.agents.forEach((agent) => {
      agent.update(this.trailMap, this.config);
      agent.deposit(this.trailMap);
    });

    return this.trailMap;
  }

  getTrailMap(): ImageData | null {
    return this.trailMap;
  }

  getAgentCount(): number {
    return this.agents.length;
  }
}
