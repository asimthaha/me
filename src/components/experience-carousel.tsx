import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { ExperienceNode } from "@/lib/data";
import { ExperienceCard } from "./experience-card"; // This will be created next

interface ExperienceCarouselProps {
  nodes: ExperienceNode[];
}

export const ExperienceCarousel = ({ nodes }: ExperienceCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

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
        }}
      >
        <CarouselContent className="-ml-4">
          {nodes.map((node) => (
            <CarouselItem
              key={node.id}
              className="pl-4 basis-full sm:basis-1/2 flex"
            >
              <div className="p-1 w-full">
                <ExperienceCard node={node} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            <CarouselPrevious className="relative inset-auto translate-y-0 bg-background/80 backdrop-blur-sm border-border/20 hover:bg-background" />
            <CarouselNext className="relative inset-auto translate-y-0 bg-background/80 backdrop-blur-sm border-border/20 hover:bg-background" />
          </div>
          <div className="text-sm font-mono text-muted-foreground">
            {current + 1} / {nodes.length}
          </div>
        </div>
      </Carousel>
    </div>
  );
};
