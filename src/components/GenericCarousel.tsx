import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
// 1. IMPORT THE OPTIONS TYPE
import type { EmblaOptionsType } from "embla-carousel";
import { cn } from "@/lib/utils"; // Make sure you have this utility

/**
 * Props for the GenericCarousel.
 * Uses a generic type <T> to accept any kind of data.
 */
interface GenericCarouselProps<T> {
  /** The array of items to display (e.g., projects, services, experiences) */
  items: T[];

  /** A function that returns a unique key for each item */
  getKey: (item: T) => string | number;

  /** * A function that renders the component for each item.
   * IMPORTANT: The component you render should accept a `className`
   * and you should apply `h-full` to it for consistent heights.
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /** * Tailwind classes for the CarouselItem. Must include basis-X, pl-X, and flex.
   * @example "pl-4 basis-full sm:basis-1/2 flex"
   */
  itemClassName: string;

  /** Optional overrides for the Embla Carousel options */
  // 2. USE THE CORRECT TYPE HERE
  carouselOpts?: EmblaOptionsType;

  /** The maximum number of dots to show before switching to a fraction */
  maxDots?: number;
}

const DEFAULT_MAX_DOTS = 10;

/**
 * A reusable, responsive, and intelligent carousel component.
 * - Handles all API state and 'current' slide logic.
 * - Prevents "stuck" swiping on mobile.
 * - Intelligently switches between dots (for few items) and
 * a fraction (for many items) to prevent UI overflow.
 */
export const GenericCarousel = <T,>({
  items,
  getKey,
  renderItem,
  itemClassName,
  carouselOpts,
  maxDots = DEFAULT_MAX_DOTS,
}: GenericCarouselProps<T>) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Set up the carousel API and event listeners
  useEffect(() => {
    if (!api) {
      return;
    }

    // Function to update the current slide
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    // Re-initialize and set listeners
    api.reInit(); // Re-init is crucial when `items` prop changes (e.g., filtering)
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, items]); // Dependency array includes `items`

  // Default options for a smooth, non-stuck mobile experience
  // 3. USE THE CORRECT TYPE HERE
  const defaultOpts: EmblaOptionsType = {
    align: "start",
    loop: true,
  };

  // Merge default options with any user-provided options
  const combinedOpts = { ...defaultOpts, ...carouselOpts };

  // Logic for which pagination to show
  const showDots = items.length > 1 && items.length <= maxDots;
  const showFraction = items.length > maxDots;

  return (
    <div className="w-full">
      <Carousel setApi={setApi} className="w-full" opts={combinedOpts}>
        <CarouselContent className="-ml-4">
          {items.map((item, index) => (
            <CarouselItem
              key={getKey(item)}
              // Apply the required layout classes passed via props
              className={cn("pl-4", itemClassName)} // cn handles merging
            >
              {/* This wrapper ensures the card can fill the height */}
              <div className="p-1 w-full h-full">{renderItem(item, index)}</div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* --- Intelligent Pagination --- */}
        <div className="flex items-center justify-between mt-8">
          {/* Standard navigation arrows */}
          <div className="flex gap-2">
            <CarouselPrevious className="relative inset-auto translate-y-0 bg-background/80 backdrop-blur-sm border-border/20 hover:bg-background" />
            <CarouselNext className="relative inset-auto translate-y-0 bg-background/80 backdrop-blur-sm border-border/20 hover:bg-background" />
          </div>

          {/* Show Dots (for 10 or fewer items) */}
          {showDots && (
            <div className="flex gap-2">
              {items.map((_, index) => (
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
          )}

          {/* Show Fraction (for more than 10 items) */}
          {showFraction && (
            <div className="text-sm font-mono text-muted-foreground">
              {current + 1} / {items.length}
            </div>
          )}
        </div>
      </Carousel>
    </div>
  );
};
