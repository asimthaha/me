import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Solutions",
    content:
      "Alex delivered a complex e-commerce platform that exceeded our expectations. His attention to detail and ability to translate business requirements into elegant code was outstanding. The project was delivered on time and within budget.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Founder",
    company: "InnovateLab",
    content:
      "Working with Alex was a game-changer for our startup. He not only built a robust web application but also mentored our team on best practices. His expertise in modern React and Node.js technologies helped us scale rapidly.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Marketing Director",
    company: "Creative Minds Agency",
    content:
      "Alex transformed our outdated website into a modern, performant platform. The user experience improvements led to a 40% increase in engagement. His design sensibility and technical expertise are truly exceptional.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "CTO",
    company: "DataDriven Corp",
    content:
      "Alex's work on our data visualization dashboard was phenomenal. He took complex requirements and created an intuitive interface that our analysts love. His problem-solving skills and clean code practices are top-notch.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-reveal]");
            elements.forEach((el, index) => {
              if (el instanceof HTMLElement) {
                setTimeout(() => {
                  el.classList.add("animate-fade-in");
                }, index * 150);
              }
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-24 px-6 bg-gradient-to-br from-background via-background to-primary/5"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-heading text-foreground mb-6">
            Client Testimonials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            What clients say about working together and the results we achieved.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-shrink-0 w-full">
                  <div className="bg-background/60 backdrop-blur-md border border-border/20 rounded-3xl p-8 md:p-12 mx-4">
                    <div className="flex flex-col items-center text-center">
                      {/* Quote Icon */}
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                        <Quote className="w-8 h-8 text-accent" />
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-accent text-accent"
                            />
                          )
                        )}
                      </div>

                      {/* Testimonial Content */}
                      <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 max-w-4xl">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="text-center">
                        <h4 className="text-xl font-heading text-foreground mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-accent font-medium">
                          {testimonial.role}
                        </p>
                        <p className="text-muted-foreground">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/20 hover:bg-background hover-scale"
            size="icon"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/20 hover:bg-background hover-scale"
            size="icon"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-accent scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16 opacity-0 translate-y-8" data-reveal>
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-background/60 backdrop-blur-md border border-border/20 rounded-2xl">
            <div className="text-center">
              <div className="text-2xl font-heading text-foreground">50+</div>
              <div className="text-sm text-muted-foreground">
                Projects Completed
              </div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-heading text-foreground">25+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-heading text-foreground">5.0</div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
