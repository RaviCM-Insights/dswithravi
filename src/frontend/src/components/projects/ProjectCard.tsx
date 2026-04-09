import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, Eye, Github } from "lucide-react";
import { motion } from "motion/react";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const TAG_COLORS: Record<string, string> = {
  "Machine Learning": "border-blue-500/50 text-blue-400",
  "Data Analysis": "border-purple-500/50 text-purple-400",
  NLP: "border-cyan-500/50 text-cyan-400",
  Visualization: "border-pink-500/50 text-pink-400",
  Python: "border-yellow-500/50 text-yellow-400",
  "Deep Learning": "border-green-500/50 text-green-400",
  TensorFlow: "border-orange-500/50 text-orange-400",
  PyTorch: "border-red-500/50 text-red-400",
};

function getTagStyle(tag: string): string {
  return TAG_COLORS[tag] ?? "border-primary/40 text-primary";
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate({ to: `/projects/${project.id.toString()}` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`group relative rounded-xl overflow-hidden flex flex-col transition-smooth ${featured ? "h-full" : ""}`}
      style={{
        background: "oklch(var(--card) / 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid oklch(var(--border) / 0.3)",
      }}
      data-ocid="project-card"
    >
      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-smooth"
        style={{
          boxShadow:
            "0 0 30px oklch(var(--primary) / 0.25), inset 0 0 0 1px oklch(var(--primary) / 0.4)",
        }}
      />

      {/* Preview image / gradient placeholder */}
      <div className={`relative overflow-hidden ${featured ? "h-52" : "h-44"}`}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, oklch(0.2 0.12 ${264 + (Number(project.id) % 5) * 20}) 0%, oklch(0.15 0.1 ${294 + (Number(project.id) % 4) * 15}) 100%)`,
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(oklch(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--primary) / 0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Tag label overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {project.featured && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              Featured
            </span>
          )}
        </div>
        {/* View count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="size-3" />
          <span>{project.viewCount.toString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className={`font-display font-semibold leading-tight ${featured ? "text-xl" : "text-base"} text-foreground`}
        >
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-transparent ${getTagStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-muted text-muted-foreground">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border/30">
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={handleViewDetails}
            data-ocid="view-details-btn"
          >
            View Details
          </Button>
          {project.githubUrl && (
            <Button
              size="icon"
              variant="outline"
              className="shrink-0"
              asChild
              data-ocid="github-btn"
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              >
                <Github className="size-4" />
              </a>
            </Button>
          )}
          {project.liveDemoUrl && (
            <Button
              size="icon"
              variant="outline"
              className="shrink-0"
              asChild
              data-ocid="demo-btn"
            >
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
              >
                <ExternalLink className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
