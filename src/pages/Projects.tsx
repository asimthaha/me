import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { InteractiveProjectCard } from "@/components/interactive-project-card";
import { ProjectModal } from "@/components/project-modal";
import { ProjectCarousel } from "@/components/project-carousel";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
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
    // Simulate loading time for skeleton display
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Loading complete, projects should now be visible");

      // Fallback: trigger reveal animation after loading completes
      setTimeout(() => {
        if (sectionRef.current) {
          const elements = sectionRef.current.querySelectorAll("[data-reveal]");
          console.log(
            "Fallback: Found data-reveal elements after loading:",
            elements.length
          );
          elements.forEach((el, index) => {
            if (el instanceof HTMLElement) {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
                console.log("Fallback: Added animate-fade-in to element");
              }, index * 100);
            }
          });
        }
      }, 100);
    }, 800); // Reduced from 1500ms for better UX

    return () => clearTimeout(timer);
  }, []);

  // Detect mobile/tablet for carousel
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(
            "IntersectionObserver entry:",
            entry.isIntersecting,
            entry.target
          );
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-reveal]");
            console.log("Found data-reveal elements:", elements.length);
            elements.forEach((el, index) => {
              if (el instanceof HTMLElement) {
                console.log("Adding animate-fade-in to element:", el);
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
      console.log("Setting up intersection observer on section");
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleProjectExpand = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleFilterChange = (category: string) => {
    console.log("Filter changed from", activeFilter, "to", category);
    setActiveFilter(category);

    // Reset animation states when filter changes
    setTimeout(() => {
      if (sectionRef.current) {
        const elements = sectionRef.current.querySelectorAll("[data-reveal]");
        console.log("Resetting animations for", elements.length, "elements");
        elements.forEach((el, index) => {
          if (el instanceof HTMLElement) {
            // Remove existing animation class
            el.classList.remove("animate-fade-in");
            // Force reflow by accessing a property
            void el.offsetHeight;
            // Re-add animation class with delay
            setTimeout(() => {
              el.classList.add("animate-fade-in");
            }, index * 100);
          }
        });
      }
    }, 50); // Small delay to allow state update
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const categories = ["all", "frontend", "fullstack", "webgl", "ai"];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  // Debug project data and filtering
  console.log("Project data debug:", {
    totalProjects: projects.length,
    activeFilter,
    filteredProjectsCount: filteredProjects.length,
    isMobile,
    loading,
  });

  // Debug filtering results
  if (activeFilter !== "all") {
    console.log("Filtering debug:", {
      activeFilter,
      filteredProjects: filteredProjects.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
      })),
      originalProjects: projects.map((p) => ({
        id: p.id,
        category: p.category,
      })),
    });
  }

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
                    onClick={() => handleFilterChange(category)}
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
                  {loading ? (
                    // Show skeletons while loading
                    Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonProjectCard key={`skeleton-${index}`} />
                    ))
                  ) : filteredProjects.length > 0 ? (
                    // Show projects when loaded
                    filteredProjects.map((project, index) => (
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
                    ))
                  ) : (
                    // Show message when no projects found
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        No projects found for the selected filter.
                      </p>
                    </div>
                  )}
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
