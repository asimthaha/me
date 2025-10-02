import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ProgressIndicator } from "./progress-indicator";
import { navItems } from "@/lib/data";

/**
 * Responsive Navbar Component
 * Features scroll-based visibility, mobile pill design, and desktop horizontal layout
 */
export const Navbar = ({ scrollContainerRef }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll behavior for show/hide navbar
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;
    const controlNavbar = () => {
      const currentScrollY = scrollContainer.scrollTop;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };
    scrollContainer.addEventListener("scroll", controlNavbar);
    return () => scrollContainer.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY, scrollContainerRef]);

  // Track current active section based on route and hash
  useEffect(() => {
    if (location.pathname === "/projects") {
      setActiveSection("projects");
    } else if (location.pathname === "/about") {
      setActiveSection("about");
    } else if (location.pathname === "/services") {
      setActiveSection("services");
    } else if (location.pathname === "/contacts") {
      setActiveSection("contact");
    } else if (location.pathname === "/") {
      const hash = location.hash.replace("#", "") || "home";
      setActiveSection(hash);
    }
  }, [location]);

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.type === "page") {
      if (item.id === "home") {
        navigate("/");
      } else if (item.id === "about") {
        navigate("/about");
      } else if (item.id === "projects") {
        navigate("/projects");
      } else if (item.id === "services") {
        navigate("/services");
      } else if (item.id === "contact") {
        navigate("/contacts");
      }
    } else if (item.type === "external" && item.href) {
      if (item.href.startsWith("http")) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        // Internal anchor link
        window.location.href = item.href;
      }
    }
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <ProgressIndicator scrollContainerRef={scrollContainerRef} />

      {/* Desktop Navbar */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 
          hidden md:block
          transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-glass backdrop-blur-md bg-background/80 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo/Brand */}
              <div className="flex items-center space-x-2">
                <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-lg font-heading text-foreground">
                  PORT
                </span>
              </div>

              {/* Desktop Navigation Links */}
              <div className="flex items-center space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item);
                      }}
                      className={`
                         flex items-center space-x-2 px-3 py-2 rounded-lg
                         text-sm font-medium transition-all duration-200
                         hover:bg-accent/85 hover:text-accent-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                         ${
                           activeSection === item.id
                             ? "bg-primary text-primary-foreground"
                             : "border-border/20 bg-background/50 hover:bg-accent hover:text-accent-foreground"
                         }
                       `}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Theme Switcher */}
              <div className="flex items-center">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-6 right-6 z-50 md:hidden p-2 rounded-full bg-background/80 backdrop-blur-md border border-border/20 hover-scale"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </button>

      {/* Mobile Slide-in Menu */}
      <nav
        className={`
          fixed top-0 right-0 h-full w-80 z-40
          md:hidden
          transition-transform duration-300 ease-in-out
          transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          bg-background/95 backdrop-blur-md border-l border-border/20
        `}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center space-x-3 w-full p-4 rounded-lg transition-all duration-200
                    hover:bg-accent hover:text-accent-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Theme Switcher */}
          <div className="mt-8 pt-8 border-t border-border/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
