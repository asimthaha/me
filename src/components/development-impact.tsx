import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { StatsCard } from "./ui/stats-card";
import { Briefcase, Star, Code2, Calendar } from "lucide-react";
import { CTASection } from "./cta-section";

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
    { icon: Code2, label: "Digital Arsenal", value: "15+", delay: 600 },
    { icon: Calendar, label: "Years Experience", value: "1+", delay: 800 },
  ];

  return (
    <div ref={sectionRef} className="mb-10 relative">
      {/* Floating gradient orbs background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="floating-animation absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div
          className="floating-animation absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Stats Section with Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="opacity-0 translate-y-8 transition-all duration-700 mb-10 text-left"
          data-reveal
        >
          <h3 className="text-2xl md:text-2xl font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Development Impact
          </h3>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Transforming ideas into powerful digital solutions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 px-4 sm:px-6 lg:px-0">
          {stats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>
        <CTASection
          title="Ready to Build Something Amazing?"
          description="Let's collaborate on your next project and create something
                extraordinary together."
          primaryCta={{
            label: "Start a Project",
            href: "/contacts",
            variant: "solid",
          }}
          secondaryCta={{
            label: "View All Work",
            href: "/projects",
          }}
          animated
          variant="boxed"
          // background="aurora"
        />
      </div>
    </div>
  );
};

export default DevelopmentImpact;
