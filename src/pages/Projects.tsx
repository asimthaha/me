import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { InteractiveProjectCard } from "@/components/interactive-project-card";
import { ProjectModal } from "@/components/project-modal";
import { ProjectCarousel } from "@/components/project-carousel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code2, Filter } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * All Projects Page
 * Comprehensive view of all development work and portfolio items
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

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const categories = ["all", "frontend", "fullstack", "webgl", "ai"];

  return (
    <>
      <main className="relative bg-background min-h-screen">
        <Navbar />
        
        <section
          ref={sectionRef}
          className="py-24 px-4 bg-gradient-to-br from-background via-background to-background/90 relative overflow-hidden"
          aria-labelledby="all-projects-title"
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
            {/* Back Navigation */}
            <div
              className="opacity-0 translate-y-8 transition-all duration-700 mb-8"
              data-reveal
            >
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-border/20 bg-background/50 hover:bg-background"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Page Header */}
            <div className="text-center mb-20 space-y-6">
              <div
                className="opacity-0 translate-y-8 transition-all duration-700"
                data-reveal
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Code2 className="w-4 h-4" />
                  All Projects
                </div>
                <h1
                  id="all-projects-title"
                  className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
                >
                  Complete
                  <span className="block text-gradient">Portfolio</span>
                </h1>
              </div>
              <p
                className="opacity-0 translate-y-8 transition-all duration-700 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                data-reveal
              >
                Explore my full collection of projects, from experimental concepts to production applications.
                Each project represents a unique challenge and learning experience.
              </p>
            </div>

            {/* Filter Buttons */}
            <div
              className="opacity-0 translate-y-8 transition-all duration-700 mb-12"
              data-reveal
            >
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeFilter === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(category)}
                    className={`capitalize transition-all duration-300 ${
                      activeFilter === category
                        ? "bg-primary text-primary-foreground"
                        : "border-border/20 bg-background/50 hover:bg-background"
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {category === "webgl" ? "WebGL" : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="mb-20">
              {isMobile ? (
                <div className="opacity-0 translate-y-8" data-reveal>
                  <ProjectCarousel
                    projects={filteredProjects}
                    onProjectExpand={handleProjectExpand}
                  />
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                  {filteredProjects.map((project, index) => (
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
              )}
            </div>

            {/* CTA Section */}
            <div
              className="opacity-0 translate-y-8 transition-all duration-700 text-center"
              data-reveal
            >
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-foreground">
                  Let's Build Something Together
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Have a project in mind? I'd love to hear about it and discuss how we can bring your vision to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-gradient bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                  >
                    Get In Touch
                  </Button>
                  <Link to="/">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-border/20 bg-background/50 hover:bg-background"
                    >
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </main>
    </>
  );
};

export default Projects;