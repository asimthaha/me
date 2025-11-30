import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { CubesBackground } from "@/components/ui/cubes-background";
import { WavyBackground } from "@/components/ui/shadcn-io/wavy";
import { AuroraBackgroundEffect } from "@/components/ui/shadcn-io/aurora-background";
import { Meteors } from "@/components/ui/shadcn-io/meteors";
import { FlickeringGrid } from "@/components/ui/shadcn-io/flickering-grid";

interface CTASectionProps {
  /** Main title */
  title: string;
  /** Supporting paragraph text */
  description: string;
  /** Primary button label and link */
  primaryCta?: {
    label: string;
    href: string;
    variant?: "solid" | "gradient" | "outline";
  };
  /** Secondary button label and link */
  secondaryCta?: {
    label: string;
    href: string;
    variant?: "outline" | "link";
  };
  /** Optional background style */
  variant?: "default" | "gradient" | "boxed";
  /** Optional reveal animation */
  animated?: boolean;
  background?: "none" | "wavy" | "aurora" | "meteors" | "flickering-grid";
}

export const CTASection = ({
  title,
  description,
  primaryCta,
  secondaryCta,
  variant = "default",
  animated = true,
  background = "none",
}: CTASectionProps) => {
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
      {/* Add the background components */}
      {/* They will sit at z-0, behind all the other content */}
      {background === "none" && (
        <CubesBackground
          className="absolute inset-0"
          color={
            variant === "boxed"
              ? "hsl(var(--primary))"
              : "hsl(var(--muted-foreground))"
          }
          opacity={variant === "boxed" ? 0.5 : 0.5}
        />
      )}
      {background === "wavy" && (
        <WavyBackground
          className="absolute inset-0"
          colors={["#3b82f6", "#60a5fa", "#93c5fd"]} // Different shades of your original blue
          backgroundFill="white" // Ensure this matches your theme (use "black" for dark mode)
          blur={10}
        >
          {/* Children are rendered inside the WavyBackground */}
        </WavyBackground>
      )}
      {background === "aurora" && (
        // Add opacity-40 so the text pops more
        <div className="absolute inset-0 opacity-40">
          <AuroraBackgroundEffect showRadialGradient={true} />
        </div>
      )}
      {background === "meteors" && (
        <Meteors number={20} className="absolute inset-0" />
      )}
      {background === "flickering-grid" && (
        <FlickeringGrid className="absolute inset-0" />
      )}

      {/* Conditionally render content outside or inside WavyBackground */}
      {background === "wavy" ? (
        <div className="relative z-10">
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
                      "shadow-lg",
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
      ) : (
        <>
          {/* Fallback for other backgrounds */}
          <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="relative z-10 text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {description}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCta && (
                <Link to={primaryCta.href}>
                  <Button
                    size="lg"
                    className={clsx(
                      "shadow-lg",
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
        </>
      )}
    </section>
  );
};
