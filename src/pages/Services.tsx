import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Code2, 
  Palette, 
  Users, 
  Zap, 
  Wrench,
  Clock,
  Star,
  ArrowRight,
  CheckCircle 
} from "lucide-react";

/**
 * Services Page
 * Showcase of professional development services offered
 */

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  duration: string;
  startingPrice: string;
  popular?: boolean;
}

const services: Service[] = [
  {
    id: 1,
    title: "Web Development",
    description: "Custom web applications built with modern frameworks and best practices for performance and scalability.",
    icon: Code2,
    features: [
      "React/TypeScript Development", 
      "Responsive Design", 
      "API Integration", 
      "Performance Optimization",
      "SEO Implementation"
    ],
    duration: "2-8 weeks",
    startingPrice: "Contact for quote",
    popular: true,
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "User-centered design solutions that create intuitive interfaces and exceptional user experiences.",
    icon: Palette,
    features: [
      "User Research & Testing",
      "Wireframing & Prototyping", 
      "Design Systems", 
      "Accessibility Compliance",
      "Mobile-First Design"
    ],
    duration: "1-4 weeks",
    startingPrice: "Contact for quote",
  },
  {
    id: 3,
    title: "Technical Consulting",
    description: "Strategic guidance on architecture, technology choices, and development best practices.",
    icon: Users,
    features: [
      "Architecture Planning",
      "Technology Assessment", 
      "Code Reviews", 
      "Performance Audits",
      "Team Training"
    ],
    duration: "Ongoing",
    startingPrice: "Contact for quote",
  },
  {
    id: 4,
    title: "Performance Optimization",
    description: "Comprehensive analysis and optimization of web applications for speed, accessibility, and SEO.",
    icon: Zap,
    features: [
      "Lighthouse Audits",
      "Core Web Vitals", 
      "Bundle Optimization", 
      "Image & Asset Optimization",
      "Caching Strategies"
    ],
    duration: "1-2 weeks",
    startingPrice: "Contact for quote",
  },
  {
    id: 5,
    title: "Maintenance & Support",
    description: "Ongoing support, updates, and maintenance for existing web applications and websites.",
    icon: Wrench,
    features: [
      "Bug Fixes & Updates",
      "Security Monitoring", 
      "Content Management", 
      "Performance Monitoring",
      "24/7 Support"
    ],
    duration: "Monthly retainer",
    startingPrice: "Contact for quote",
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Page Header */}
          <div className="text-center mb-20 space-y-6">
            <h1 
              id="services-title"
              className="opacity-0 translate-y-8 transition-all duration-700 text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              data-reveal
            >
              Professional Services
            </h1>
            <p
              className="opacity-0 translate-y-8 transition-all duration-700 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              data-reveal
            >
              Transform your digital vision into reality with expert development services. 
              From concept to deployment, I deliver high-quality solutions tailored to your needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="opacity-0 translate-y-8 transition-all duration-700"
                data-reveal
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className={`relative h-full border-border/20 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group ${
                  service.popular ? 'ring-2 ring-primary/20' : ''
                }`}>
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
                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-foreground">What's Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <div className="w-full space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Starting at</span>
                        <span className="text-lg font-bold text-primary">{service.startingPrice}</span>
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
                A streamlined process designed for transparency, collaboration, and exceptional results.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Discovery", description: "Understanding your goals, requirements, and vision" },
                { step: "02", title: "Planning", description: "Creating a detailed roadmap and timeline" },
                { step: "03", title: "Development", description: "Building your solution with regular updates" },
                { step: "04", title: "Launch", description: "Deployment, testing, and ongoing support" },
              ].map((phase, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{phase.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div
            className="opacity-0 translate-y-8 transition-all duration-700 text-center"
            data-reveal
          >
            <div className="space-y-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-12 border border-border/20">
              <h3 className="text-3xl font-bold text-foreground">
                Ready to Start Your Project?
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Let's discuss your vision and create something amazing together. 
                Every project starts with a conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#contact">
                  <Button
                    size="lg"
                    className="text-gradient bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                  >
                    Start a Conversation
                  </Button>
                </Link>
                <Link to="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border/20 bg-background/50 hover:bg-background"
                  >
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;