import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { InteractiveProjectCard } from "./interactive-project-card";
import { Project } from "@/lib/data";

interface ProjectCarouselProps {
  projects: Project[];
  onProjectExpand?: (project: Project) => void;
}

/**
 * Responsive Project Carousel with touch gestures and pagination
 * Optimized for mobile and tablet viewing
 */
export const ProjectCarousel = ({
  projects,
  onProjectExpand,
}: ProjectCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Update current and count when carousel API changes
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {projects.map((project, index) => (
            <CarouselItem
              key={project.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <InteractiveProjectCard
                project={project}
                index={index}
                onExpand={onProjectExpand}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            <CarouselPrevious className="relative inset-auto translate-y-0 bg-background/80 backdrop-blur-sm border-border/20 hover:bg-background" />
            <CarouselNext className="relative inset-auto translate-y-0 bg-background/80 backdrop-blur-sm border-border/20 hover:bg-background" />
          </div>

          {/* Pagination Dots */}
          <div className="flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/90 hover:bg-muted-foreground/50"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </div>
  );
};
