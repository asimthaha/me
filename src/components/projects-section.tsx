import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InteractiveProjectCard } from "./interactive-project-card";
import { ProjectModal } from "./project-modal";
import { Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Modern Interactive Projects Section
 * Features glassmorphism design, 3D interactions, and responsive carousel
 */

import { projects, Project } from "@/lib/data";

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

  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = projects;

  return (
    <>
      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
      <section
        ref={sectionRef}
        className="min-h-screen flex flex-col justify-center py-24 px-4 bg-gradient-to-br from-background via-background to-background/90 relative overflow-hidden"
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
          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="opacity-0 translate-y-8 transition-all duration-700 mb-10"
                data-reveal
              >
                <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-primary" />
                  Featured Projects
                </h3>
                <p className="text-muted-foreground mt-2">
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
              {/* CTA Button */}
              <div
                className="opacity-0 translate-y-8 transition-all duration-700 m-10 flex justify-center"
                data-reveal
                style={{ transitionDelay: "300ms" }}
              >
                <Link to="/projects">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto btn-gradient hover:opacity-90 text-white shadow-lg"
                  >
                    View All Projects
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsSection;
