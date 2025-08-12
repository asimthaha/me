import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InteractiveProjectCard } from "./interactive-project-card";
import { ProjectModal } from "./project-modal";
import { ForwardTimer } from "./forward-timer";
import { Sparkles, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Modern Interactive Projects Section
 * Features glassmorphism design, 3D interactions, and responsive carousel
 */

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  demoUrl: string;
  codeUrl: string;
  caseStudyUrl?: string | null;
  category: "frontend" | "fullstack" | "webgl" | "ai";
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Three.js Portfolio Experience",
    description:
      "Immersive 3D portfolio with WebGL shaders, particle systems, and interactive scenes built with Three.js and React Three Fiber.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    techStack: ["Three.js", "React Three Fiber", "WebGL", "GLSL", "TypeScript"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#",
    category: "webgl",
    featured: true,
  },
  {
    id: 2,
    title: "AI-Powered Design System",
    description:
      "Intelligent design system that generates component variants using machine learning and automated testing.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    techStack: ["React", "TensorFlow.js", "Node.js", "Storybook", "Jest"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#",
    category: "ai",
    featured: true,
  },
  {
    id: 3,
    title: "Real-time Collaboration Platform",
    description:
      "Full-stack application with WebSocket connections, live cursors, and collaborative editing features.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    techStack: ["Next.js", "Socket.io", "PostgreSQL", "Redis", "Docker"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#",
    category: "fullstack",
  },
  {
    id: 4,
    title: "Interactive Data Visualization",
    description:
      "Dynamic dashboard with D3.js charts, real-time data streams, and responsive animations.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    techStack: ["D3.js", "React", "WebSockets", "Chart.js", "Tailwind"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#",
    category: "frontend",
  },
  {
    id: 5,
    title: "WebGL Particle Engine",
    description:
      "High-performance particle system with GPU computation, physics simulation, and interactive controls.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
    techStack: ["WebGL", "Three.js", "GPU.js", "Canvas API", "ES6"],
    demoUrl: "#",
    codeUrl: "#",
    category: "webgl",
  },
  {
    id: 6,
    title: "E-commerce Microservices",
    description:
      "Scalable microservices architecture with containerization, API gateway, and automated deployment.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    techStack: ["Node.js", "Docker", "Kubernetes", "MongoDB", "GraphQL"],
    demoUrl: "#",
    codeUrl: "#",
    category: "fullstack",
  },
];

const StatsCounter = ({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`text-center space-y-2 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="text-3xl md:text-4xl font-bold text-primary font-mono">
        {isVisible ? value : "00"}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet for carousel
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-reveal]");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, index * 150);
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

  const handleProjectExpand = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = projects;

  return (
    <>
      <section
        ref={sectionRef}
        className="py-24 px-4 bg-gradient-to-br from-background via-background to-background/90 relative overflow-hidden"
        aria-labelledby="projects-title"
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
          {/* Section Header */}
          <div className="text-center mb-20 space-y-6">
            <div
              className="opacity-0 translate-y-8 transition-all duration-700"
              data-reveal
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Featured Work
              </div>
              <h2
                id="projects-title"
                className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
              >
                Crafting Digital
                <span className="block text-gradient">Experiences</span>
              </h2>
            </div>
            <p
              className="opacity-0 translate-y-8 transition-all duration-700 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              data-reveal
            >
              From interactive 3D experiences to scalable web applications, each
              project represents a journey of innovation and technical
              excellence.
            </p>
          </div>

          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <div className="mb-20">
              <div
                className="opacity-0 translate-y-8 transition-all duration-700 mb-12"
                data-reveal
              >
                <h3 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-primary" />
                  Featured Projects
                </h3>
                <p className="text-muted-foreground">
                  Showcasing cutting-edge technology and creative solutions
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {featuredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="opacity-0 translate-y-8"
                    data-reveal
                  >
                    <InteractiveProjectCard
                      project={project}
                      index={index}
                      onExpand={handleProjectExpand}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View All Projects CTA */}
          <div className="mb-20">
            <div
              className="opacity-0 translate-y-8 transition-all duration-700 text-center bg-background/60 backdrop-blur-xl border border-border/20 rounded-3xl p-8 md:p-12"
              data-reveal
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground">
                  Want to See More?
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore my complete portfolio with detailed case studies, code
                  examples, and interactive demos across all categories.
                </p>
                <Link to="/projects">
                  <Button
                    size="lg"
                    className="text-gradient bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                  >
                    View All Projects
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

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
              <StatsCounter
                label="Projects Delivered"
                value="25+"
                delay={200}
              />
              <StatsCounter
                label="Client Satisfaction"
                value="100%"
                delay={400}
              />
              <StatsCounter
                label="Technologies Mastered"
                value="15+"
                delay={600}
              />
              <StatsCounter label="Years Experience" value="3+" delay={800} />
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-gradient bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                >
                  Start a Project
                </Button>
                <Link to="/projects">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border/20 bg-background/50 hover:bg-background"
                  >
                    View All Work
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Forward Timer */}
        <ForwardTimer />
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default ProjectsSection;
