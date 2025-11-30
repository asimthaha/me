import { useEffect, useRef } from "react";
import { ServiceCard } from "./service-card";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "@/lib/data";

/**
 * Services Section
 * Showcase of professional development services
 */
const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-24 px-4 bg-gradient-to-br from-background via-background to-background/90 relative overflow-hidden"
      aria-labelledby="services-title"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div
          className="opacity-0 translate-y-8 transition-all duration-700 mb-10"
          data-reveal
        >
          <h3
            id="services-title"
            className="text-2xl font-semibold text-foreground flex items-center gap-2"
            data-reveal
          >
            <Wrench className="w-6 h-6 text-primary" />
            Professional Services
          </h3>
          <p className="text-muted-foreground mt-2" data-reveal>
            Bringing your digital vision to life with expert, customized
            development.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {services.slice(0, 2).map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button
              size="lg"
              className="btn-gradient hover:opacity-90 text-primary-foreground shadow-lg"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
