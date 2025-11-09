import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExperienceNode } from "@/lib/data";
import { Briefcase, GraduationCap, Award, Trophy } from "lucide-react";

interface ExperienceCardProps {
  node: ExperienceNode;
}

const getTypeIcon = (type: ExperienceNode["type"]) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "work":
      return <Briefcase className={iconClass} />;
    case "education":
      return <GraduationCap className={iconClass} />;
    case "certification":
      return <Award className={iconClass} />;
    case "milestone":
      return <Trophy className={iconClass} />;
  }
};

const getTypeColor = (type: ExperienceNode["type"]) => {
  switch (type) {
    case "work":
      return "text-primary bg-primary/10 border-primary/20";
    case "education":
      return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    case "certification":
      return "text-green-500 bg-green-500/10 border-green-500/20";
    case "milestone":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  }
};

export const ExperienceCard = ({ node }: ExperienceCardProps) => {
  return (
    <Card className="font-mono h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                  node.type
                )}`}
              >
                {getTypeIcon(node.type)}
                {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                {node.period.start} - {node.period.end}
              </span>
            </div>
            <CardTitle className="text-xl">{node.title}</CardTitle>
            <CardDescription className="text-base mt-1">
              {node.company} • {node.location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {node.description.map((desc, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-foreground/80"
            >
              <span className="text-primary mt-1">▹</span>
              <span>{desc}</span>
            </li>
          ))}
        </ul>
        {node.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {node.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono px-2.5 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded border border-border/50"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
