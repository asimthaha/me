import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { StatsCard } from "./ui/stats-card";
import { Briefcase, Star, Code2, Calendar } from "lucide-react";

/**
 * Development Impact Section
 * Showcases portfolio statistics and CTA with premium design
 * Features individual animated stat cards and gradient effects
 */
const DevelopmentImpact = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-reveal]");
            elements.forEach((el, index) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = "1";
                (el as HTMLElement).style.transform = "translateY(0)";
              }, index * 150);
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Briefcase, label: "Projects Delivered", value: "25+", delay: 200 },
    { icon: Star, label: "Client Satisfaction", value: "100%", delay: 400 },
    { icon: Code2, label: "Technologies Mastered", value: "15+", delay: 600 },
    { icon: Calendar, label: "Years Experience", value: "1+", delay: 800 },
  ];

  return (
    <div ref={sectionRef} className="mb-20 relative">
      {/* Floating gradient orbs background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="floating-animation absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="floating-animation absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      {/* Stats Section with Title */}
      <div className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700" data-reveal>
        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Development Impact
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transforming ideas into powerful digital solutions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Enhanced CTA Section */}
      <div
        className="opacity-0 translate-y-8 transition-all duration-700 relative"
        data-reveal
      >
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl blur-xl" />
        
        {/* Main CTA content */}
        <div className="relative bg-background/40 backdrop-blur-xl border border-border/20 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-10 blur-2xl" />
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Build Something Amazing?
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Let's collaborate on your next project and create something
              extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                className="btn-gradient hover:opacity-90 text-white shadow-lg hover-lift group"
              >
                <span className="relative z-10">Start a Project</span>
              </Button>
              <Link to="/projects">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/30 bg-background/50 hover:bg-background hover:border-accent/50 hover:text-accent shadow-lg hover-lift transition-all duration-300"
                >
                  View All Work
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative dots pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]">
            <div className="grid grid-cols-8 gap-2 p-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-foreground" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentImpact;
