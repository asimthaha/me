import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SlimeMoldCanvas from "@/components/slime-mold-canvas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, Star, ArrowRight, CheckCircle } from "lucide-react";
import { services } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { ServiceCarousel } from "@/components/service-carousel";
import { CTASection } from "@/components/cta-section";

/**
 * Services Page
 * Showcase of professional development services offered
 */

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [isSlimeAnimating, setIsSlimeAnimating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);

      // Trigger reveal animation after loading completes
      setTimeout(() => {
        if (sectionRef.current) {
          const elements = sectionRef.current.querySelectorAll("[data-reveal]");
          elements.forEach((el, index) => {
            if (el instanceof HTMLElement) {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, index * 100);
            }
          });
        }

        // Start slime mold animation after reveals start
        setTimeout(() => {
          setIsSlimeAnimating(true);
        }, 500);
      }, 100);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Scroll reveal animation
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative bg-background min-h-screen">
      <Navbar scrollContainerRef={scrollContainerRef} />
      <section
        ref={sectionRef}
        className="py-24 px-4 bg-gradient-to-br from-background via-background to-background/90 relative overflow-hidden"
        aria-labelledby="services-title"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <SlimeMoldCanvas isAnimating={isSlimeAnimating} />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float z-10" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float z-10"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Page Header */}
          <div className="text-center mb-20 space-y-6">
            <h1
              id="services-title"
              className="opacity-0 translate-y-8 transition-all duration-700 text-4xl md:text-6xl font-bold text-gradient"
              data-reveal
            >
              Professional Services
            </h1>
            <p
              className="opacity-0 translate-y-8 transition-all duration-700 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              data-reveal
            >
              Transform your digital vision into reality with expert development
              services. From concept to deployment, I deliver high-quality
              solutions tailored to your needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="mb-20">
            {isMobile ? (
              <div
                className="opacity-0 translate-y-8 transition-all duration-700"
                data-reveal
              >
                <ServiceCarousel services={services} />
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-8">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="w-full sm:w-[48%] lg:w-[30%] max-w-sm opacity-0 translate-y-8 transition-all duration-700"
                    data-reveal
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card
                      className={`relative h-full border-border/20 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group ${
                        service.popular ? "ring-2 ring-primary/20" : ""
                      }`}
                    >
                      {service.popular && (
                        <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}

                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <service.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pb-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-foreground">
                            What's Included:
                          </h4>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start space-x-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="w-full space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                              Starting at
                            </span>
                            <span className="text-lg font-bold text-primary">
                              {service.startingPrice}
                            </span>
                          </div>
                          <Button
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            variant="outline"
                            size="sm"
                          >
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Process Section */}
          <div
            className="opacity-0 translate-y-8 transition-all duration-700 mb-20"
            data-reveal
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How We Work Together
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A streamlined process designed for transparency, collaboration,
                and exceptional results.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description:
                    "Understanding your goals, requirements, and vision",
                },
                {
                  step: "02",
                  title: "Planning",
                  description: "Creating a detailed roadmap and timeline",
                },
                {
                  step: "03",
                  title: "Development",
                  description: "Building your solution with regular updates",
                },
                {
                  step: "04",
                  title: "Launch",
                  description: "Deployment, testing, and ongoing support",
                },
              ].map((phase, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full btn-gradient hover:opacity-90 text-white shadow-lg flex items-center justify-center font-bold text-lg">
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {phase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <CTASection
            title="Ready to Start Your Project?"
            description="Let's discuss your vision and create something amazing together. Every project starts with a conversation."
            primaryCta={{
              label: "Start a Conversation",
              href: "/#contact",
              variant: "solid",
            }}
            secondaryCta={{
              label: "View Portfolio",
              href: "/",
            }}
            variant="boxed"
          />
        </div>
      </section>
    </main>
  );
};

export default Services;
