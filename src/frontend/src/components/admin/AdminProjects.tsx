import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FolderOpen, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteProject,
  useProjects,
  useToggleFeatured,
} from "../../hooks/use-backend";
import type { Project, ProjectId } from "../../types";
import ProjectForm from "./ProjectForm";

const skeletonKeys = ["a", "b", "c", "d"] as const;

const TAG_COLORS: Record<string, string> = {
  "Machine Learning": "bg-primary/20 text-primary border-primary/30",
  "Data Analysis": "bg-accent/20 text-accent border-accent/30",
  NLP: "bg-secondary/20 text-secondary border-secondary/30",
  Visualization: "bg-chart-3/20 text-chart-3 border-chart-3/30",
};

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: (p: Project) => void;
  onDelete: (id: ProjectId, title: string) => void;
  onToggleFeatured: (id: ProjectId) => void;
  isTogglePending: boolean;
}

function ProjectCard({
  project,
  index,
  onEdit,
  onDelete,
  onToggleFeatured,
  isTogglePending,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`project-card-${String(project.id)}`}
      style={{
        background: "oklch(var(--card) / 0.6)",
        border: hovered
          ? "1px solid oklch(var(--primary) / 0.5)"
          : "1px solid oklch(var(--border) / 0.4)",
        boxShadow: hovered ? "0 0 16px oklch(var(--primary) / 0.12)" : "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        borderRadius: "0.75rem",
        padding: "1rem 1.25rem",
      }}
      className="flex items-center justify-between gap-4 flex-wrap"
    >
      {/* Left: info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className="font-semibold truncate max-w-[280px]"
            style={{ color: "oklch(var(--foreground))" }}
          >
            {project.title}
          </p>
          {project.featured && (
            <Badge
              className="text-xs shrink-0"
              style={{
                background: "oklch(var(--chart-5) / 0.2)",
                color: "oklch(0.78 0.18 75)",
                border: "1px solid oklch(var(--chart-5) / 0.3)",
              }}
            >
              ⭐ Featured
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate max-w-[360px]">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 pt-0.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${
                TAG_COLORS[tag] ??
                "bg-muted/30 text-muted-foreground border-border"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
          <Eye size={12} />
          {Number(project.viewCount).toLocaleString()}
        </span>

        <button
          type="button"
          data-ocid={`toggle-featured-${String(project.id)}`}
          onClick={() => onToggleFeatured(project.id)}
          disabled={isTogglePending}
          aria-label={
            project.featured ? "Remove from featured" : "Mark as featured"
          }
          className="p-1.5 rounded-md transition-smooth"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          <Star
            size={16}
            className={
              project.featured
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }
          />
        </button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          data-ocid={`edit-project-${String(project.id)}`}
          onClick={() => onEdit(project)}
          aria-label="Edit project"
        >
          <Pencil size={14} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          data-ocid={`delete-project-${String(project.id)}`}
          onClick={() => onDelete(project.id, project.title)}
          aria-label="Delete project"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </motion.div>
  );
}

export default function AdminProjects() {
  const { data: projects, isLoading } = useProjects();
  const deleteMutation = useDeleteProject();
  const toggleFeaturedMutation = useToggleFeatured();
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: ProjectId;
    title: string;
  } | null>(null);

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditProject(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditProject(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    toast.success(editProject ? "Project updated!" : "Project created!");
  };

  const handleToggleFeatured = (id: ProjectId) => {
    toggleFeaturedMutation.mutate(id, {
      onSuccess: () => toast.success("Featured status updated"),
      onError: () => toast.error("Failed to update featured status"),
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget !== null) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => toast.success("Project deleted"),
        onError: () => toast.error("Failed to delete project"),
      });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Projects
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your portfolio projects
          </p>
        </div>
        <Button
          data-ocid="add-project-btn"
          onClick={handleAddNew}
          style={{ background: "var(--gradient-primary)" }}
          className="text-primary-foreground gap-2"
        >
          <Plus size={15} />
          Add New Project
        </Button>
      </div>

      {/* Project list */}
      {isLoading ? (
        <div className="space-y-3">
          {skeletonKeys.map((k) => (
            <Skeleton key={k} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !projects?.length ? (
        <div
          className="py-16 text-center rounded-xl"
          data-ocid="projects-empty-state"
          style={{
            background: "oklch(var(--card) / 0.4)",
            border: "1px dashed oklch(var(--border) / 0.5)",
          }}
        >
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="font-medium text-foreground mb-1">No projects yet</p>
          <p className="text-muted-foreground text-sm mb-5">
            Add your first project to showcase your work
          </p>
          <Button
            onClick={handleAddNew}
            style={{ background: "var(--gradient-primary)" }}
            className="text-primary-foreground gap-2"
          >
            <Plus size={14} />
            Add Project
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, i) => (
            <ProjectCard
              key={String(project.id)}
              project={project}
              index={i}
              onEdit={handleEdit}
              onDelete={(id, title) => setDeleteTarget({ id, title })}
              onToggleFeatured={handleToggleFeatured}
              isTogglePending={toggleFeaturedMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => !open && handleFormClose()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={editProject}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="glass border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deleteTarget?.title}"
              </span>
              ? This action cannot be undone. The project and all associated
              data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-ocid="confirm-delete-project"
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
