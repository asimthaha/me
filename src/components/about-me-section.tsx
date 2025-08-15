import { useEffect, useRef, useState } from "react";
import PacManIntroOverlay from "./pacman-intro-overlay";
import { Progress } from "./ui/progress";
import { skills } from "@/lib/data";

const AboutMeSection = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };
  return (
    <section className="relative h-screen bg-background">
      {showIntro && <PacManIntroOverlay onComplete={handleIntroComplete} />}

      {/* Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="scanlines" />
      </div>

      {/* About Content - Single scrollable container */}
      <div className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {/* Individual Snap Cards */}
        <div className="snap-start h-screen flex items-center justify-center px-4">
          <div className="max-w-5xl w-full space-y-6 text-center">
            <h1 className="font-retro text-4xl md:text-6xl lg:text-7xl text-foreground">
              Hey, I'm Alex<span className="blinking-cursor">_</span>
            </h1>
          </div>
        </div>

        <div className="snap-start h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full space-y-4 text-center">
            <p className="font-retro text-sm md:text-base text-muted-foreground">
              I build things for the web. Sometimes they even work on the first
              try.
            </p>
            <p className="font-retro text-sm md:text-base text-muted-foreground">
              With over 5 years in the game, I've journeyed through the full
              stack...
            </p>
          </div>
        </div>

        <div className="snap-start h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl w-full">
            {/* Status Panel */}
            <div className="relative">
              <div className="absolute -top-3 left-6 bg-background px-2 z-20">
                <span className="font-retro text-sm text-primary">
                  [ STATUS ]
                </span>
              </div>
              <div className="pixelated-border bg-card p-8 space-y-6">
                {/* You can leave this part unchanged */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Mission */}
                  <div className="space-y-2">
                    <h3 className="font-retro text-xs text-primary">
                      // CURRENT MISSION:
                    </h3>
                    <p className="font-body text-sm text-card-foreground">
                      "Solving real-world problems with clean, efficient code."
                    </p>
                  </div>

                  {/* Level */}
                  <div className="space-y-2">
                    <h3 className="font-retro text-xs text-primary">// LEVEL:</h3>
                    <p className="font-body text-sm text-card-foreground">
                      "Junior Software Developer"
                    </p>
                  </div>

                  {/* Toolkit */}
                  <div className="space-y-2 md:col-span-2">
                    <h3 className="font-retro text-xs text-primary">
                      // TOOLKIT:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-secondary text-secondary-foreground font-body text-xs rounded border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Loading Progress */}
                  <div className="space-y-2 md:col-span-2">
                    <h3 className="font-retro text-xs text-primary">
                      // LOADING...
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-card-foreground">
                          PASSION.EXE
                        </span>
                        <span className="font-body text-sm text-muted-foreground">
                          85%
                        </span>
                      </div>
                      <Progress value={85} className="h-2 retro-progress" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="snap-start h-screen flex flex-col justify-center items-center px-4">
          <p className="font-retro text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed text-center">
            Think we could build something great together?
          </p>
          <button className="mt-6 pixelated-border-button font-retro text-sm px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors">
            START
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
