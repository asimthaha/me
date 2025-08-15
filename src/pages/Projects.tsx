import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { InteractiveProjectCard } from "@/components/interactive-project-card";
import { ProjectModal } from "@/components/project-modal";
import { ProjectCarousel } from "@/components/project-carousel";
import { Button } from "@/components/ui/button";
import { Code2, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { SkeletonProjectCard } from "@/components/ui/skeleton-project-card";

/**
 * All Projects Page
 * Comprehensive view of all development work and portfolio items
 */

import { projects, Project } from "@/lib/data";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
        <Navbar scrollContainerRef={scrollContainerRef} />
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
                Explore my full collection of projects, from experimental
                concepts to production applications. Each project represents a
                unique challenge and learning experience.
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
                  {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonProjectCard key={index} />
                      ))
                    : filteredProjects.map((project, index) => (
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
                  Have a project in mind? I'd love to hear about it and discuss
                  how we can bring your vision to life.
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
