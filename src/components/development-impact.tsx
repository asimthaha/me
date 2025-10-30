import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { StatsCounter } from "./ui/stats-counter";

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
              }, index * 100);
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

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={sectionRef} className="mb-20">
      {/* Stats Section */}
      <div
        className="opacity-0 translate-y-8 transition-all duration-700 bg-background/60 backdrop-blur-xl border border-border/20 rounded-3xl p-8 md:p-12"
        data-reveal
      >
        <div className="text-center mb-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Development Impact
          </h3>
          <p className="text-muted-foreground">
            Transforming ideas into powerful digital solutions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatsCounter label="Projects Delivered" value="25+" delay={200} />
          <StatsCounter label="Client Satisfaction" value="100%" delay={400} />
          <StatsCounter label="Technologies Mastered" value="15+" delay={600} />
          <StatsCounter label="Years Experience" value="1+" delay={800} />
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="opacity-0 translate-y-8 transition-all duration-700 text-center mt-20"
        data-reveal
      >
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-foreground">
            Ready to Build Something Amazing?
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's collaborate on your next project and create something
            extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center m-10">
            <Button
              size="lg"
              className="btn-gradient hover:opacity-90 text-white shadow-lg"
            >
              Start a Project
            </Button>
            <Link to="/projects">
              <Button
                size="lg"
                variant="outline"
                className="border-border/20 bg-background/50 hover:bg-background hover:text-foreground shadow-lg"
              >
                View All Work
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentImpact;
