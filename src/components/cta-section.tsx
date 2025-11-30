import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import FlickeringGrid from "@/components/ui/flickering-grid";
import Meteors from "@/components/ui/meteors";
import WavyBackground from "@/components/ui/wavy-background";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { EtheralShadow } from "./ui/ethereal-shadow";
import { getWaveColors } from "@/lib/themes";
import { useTheme } from "@/hooks/use-theme";

interface CTASectionProps {
  title: string;
  description: string;
  primaryCta?: {
    label: string;
    href: string;
    variant?: "solid" | "gradient" | "outline";
  };
  secondaryCta?: {
    label: string;
    href: string;
    variant?: "outline" | "link";
  };
  variant?: "default" | "gradient" | "boxed";
  animated?: boolean;
  backgroundEffect?:
    | "grid"
    | "meteor"
    | "wavy"
    | "aurora"
    | "ethereal"
    | "none";
}

export const CTASection = ({
  title,
  description,
  primaryCta,
  secondaryCta,
  variant = "default",
  animated = true,
  backgroundEffect = "none",
}: CTASectionProps) => {
  const renderBackground = () => {
    switch (backgroundEffect) {
      case "grid":
        return (
          <FlickeringGrid className="absolute inset-0 z-0" squareSize={4} />
        );
      case "meteor":
        // Ensure Meteors doesn't overflow
        return (
          <div className="absolute inset-0 overflow-hidden">
            <Meteors number={20} />
          </div>
        );
      case "wavy":
        return (
          <WavyBackground
            containerClassName="absolute inset-0 z-0"
            waveWidth={50} // Wider waves
            blur={10} // Soft edges
            speed="fast"
            waveOpacity={0.9} // Lower opacity for better blending
          />
        );
      case "aurora":
        return (
          <AuroraBackground className="absolute inset-0 z-0">
            {null}
          </AuroraBackground>
        );
      case "ethereal":
        return (
          <EtheralShadow
            color="rgba(128, 128, 128, 1)"
            animation={{ scale: 100, speed: 90 }}
            noise={{ opacity: 1, scale: 1.2 }}
            sizing="fill"
          >
            {null}
          </EtheralShadow>
        );
      default:
        return null;
    }
  };

  return (
    <section
      className={clsx(
        // Add 'relative' and 'overflow-hidden' to the container
        "relative overflow-hidden text-center px-6 py-20 flex flex-col items-center justify-center",
        {
          "bg-gradient-to-b from-background to-muted": variant === "default",
          "bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-border/20 p-12 mx-4":
            variant === "boxed",
          "space-y-6": true,
          "opacity-0 translate-y-8 transition-all duration-700": animated,
        }
      )}
      data-reveal={animated ? true : undefined}
    >
      {/* Background Rendering */}
      {renderBackground()}

      {/* Content z-index must be higher than background */}
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          {description}
        </p>

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryCta && (
              <Link to={primaryCta.href}>
                <Button
                  size="lg"
                  className={clsx(
                    "shadow-lg transition-all hover:scale-105",
                    primaryCta.variant === "gradient" &&
                      "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white",
                    primaryCta.variant === "solid" &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                    primaryCta.variant === "outline" &&
                      "border-border/20 bg-background/50 hover:bg-background"
                  )}
                >
                  {primaryCta.label}
                </Button>
              </Link>
            )}

            {secondaryCta && (
              <Link to={secondaryCta.href}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/20 bg-background/50 hover:bg-background"
                >
                  {secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
