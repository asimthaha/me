import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { navItems } from "@/lib/data";

/**
 * Responsive Navbar Component
 * Features scroll-based visibility, mobile pill design, and desktop horizontal layout
 */
export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll behavior for show/hide navbar
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Track current active section based on route and hash
  useEffect(() => {
    if (location.pathname === "/projects") {
      setActiveSection("projects");
    } else if (location.pathname === "/") {
      const hash = location.hash.replace("#", "") || "home";
      setActiveSection(hash);
    }
  }, [location]);

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.type === "page") {
      if (item.id === "projects") {
        navigate("/projects");
      }
    } else if (item.type === "section") {
      // Navigate to home page first if not already there
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          const element = document.getElementById(item.id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        // Already on home page, just scroll to section
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        // Update URL hash
        window.history.pushState(null, "", `#${item.id}`);
      }
      setActiveSection(item.id);
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
                <span className="text-lg font-semibold text-foreground">
                  Portfolio
                </span>
              </div>

              {/* Desktop Navigation Links */}
              <div className="flex items-center space-x-8">
                {navItems.slice(0, 4).map((item) => {
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
                         hover:bg-accent hover:text-accent-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                         ${
                           activeSection === item.id
                             ? "text-primary bg-accent/50"
                             : "text-muted-foreground"
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

              {/* Desktop Social Links & Theme Switcher */}
              <div className="flex items-center space-x-4">
                {navItems.slice(5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-accent hover:text-accent-foreground"
                    >
                      <a
                        href={item.href}
                        aria-label={`Visit ${item.label}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                })}
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className={`
          fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50
          md:hidden
          transition-all duration-300 ease-in-out
          ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }
        `}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center space-x-4">
          {/* Mobile Pill Container */}
          <div className="mobile-pill backdrop-blur-md bg-background/90 border border-border/20 rounded-full px-6 py-3">
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`
                      relative p-2 rounded-full transition-all duration-200
                      hover:bg-accent hover:text-accent-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }
                    `}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Theme Switcher & Search */}
          <div className="flex items-center space-x-3">
            <div className="backdrop-blur-md bg-background/90 border border-border/20 rounded-full p-2">
              <ThemeSwitcher />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="
                rounded-full backdrop-blur-md bg-background/90 border-border/20
                hover:bg-accent hover:text-accent-foreground
                focus:ring-2 focus:ring-primary focus:ring-offset-2
              "
              aria-label="Search"
            >
              {/* <Search className="h-5 w-5" /> */}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};
