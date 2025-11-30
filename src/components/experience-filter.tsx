import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExperienceNode } from "@/lib/data";

interface ExperienceFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

// Define filter options manually or derive them.
// Adding "all" as the first option.
const filters = ["all", "work", "education", "certification", "milestone"];

export const ExperienceFilter = ({
  activeFilter,
  onFilterChange,
  counts,
}: ExperienceFilterProps) => {
  // Helper to match your card colors
  const getActiveStyles = (type: string) => {
    switch (type) {
      case "work":
        return "text-primary border-primary/50 bg-primary/10";
      case "education":
        return "text-purple-500 border-purple-500/50 bg-purple-500/10";
      case "certification":
        return "text-green-500 border-green-500/50 bg-green-500/10";
      case "milestone":
        return "text-amber-500 border-amber-500/50 bg-amber-500/10";
      default:
        return "text-foreground border-foreground/50 bg-foreground/5"; // "all" case
    }
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4">
      <div className="flex gap-2 min-w-max px-4 sm:justify-center">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          const count = counts[filter] || 0;

          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 border border-transparent",
                // Base styles for inactive state
                !isActive &&
                  "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border/30",
                // Active styles generated dynamically
                isActive && getActiveStyles(filter)
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full opacity-[0.08]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 capitalize flex items-center gap-2">
                {filter}
                <span className="text-[10px] opacity-60 tabular-nums">
                  ({count})
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
