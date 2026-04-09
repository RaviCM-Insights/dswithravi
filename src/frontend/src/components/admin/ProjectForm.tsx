import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateProject, useUpdateProject } from "../../hooks/use-backend";
import type { Project, ProjectInput } from "../../types";

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "Machine Learning",
  "Data Analysis",
  "NLP",
  "Visualization",
] as const;

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{
        background: "oklch(var(--card) / 0.5)",
        border: "1px solid oklch(var(--border) / 0.5)",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-xs font-semibold uppercase tracking-widest"
      style={{ color: "oklch(var(--primary))" }}
    >
      {children}
    </h3>
  );
}

export default function ProjectForm({
  project,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    defaultValues: {
      title: "",
      description: "",
      problemStatement: "",
      datasetDescription: "",
      approach: "",
      results: "",
      insights: "",
      tags: [],
      githubUrl: undefined,
      liveDemoUrl: undefined,
      featured: false,
    },
  });

  const watchedTags = watch("tags") ?? [];
  const watchedFeatured = watch("featured");

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        problemStatement: project.problemStatement,
        datasetDescription: project.datasetDescription,
        approach: project.approach,
        results: project.results,
        insights: project.insights,
        tags: project.tags,
        githubUrl: project.githubUrl ?? undefined,
        liveDemoUrl: project.liveDemoUrl ?? undefined,
        featured: project.featured,
      });
    }
  }, [project, reset]);

  const toggleTag = (tag: string) => {
    const current = watchedTags;
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setValue("tags", updated, { shouldValidate: true });
  };

  const isPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  const submitError = createMutation.error || updateMutation.error;

  const onSubmit = (data: ProjectInput) => {
    if (project) {
      updateMutation.mutate({ id: project.id, input: data }, { onSuccess });
    } else {
      createMutation.mutate(data, { onSuccess });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      data-ocid="project-form"
    >
      {/* Basic Info */}
      <SectionCard>
        <SectionHeader>Basic Info</SectionHeader>

        <div className="space-y-1.5">
          <Label htmlFor="title">
            Title <span style={{ color: "oklch(var(--destructive))" }}>*</span>
          </Label>
          <Input
            id="title"
            data-ocid="project-title-input"
            placeholder="e.g. House Price Prediction"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p
              className="text-xs"
              style={{ color: "oklch(var(--destructive))" }}
            >
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">
            Description{" "}
            <span style={{ color: "oklch(var(--destructive))" }}>*</span>
          </Label>
          <Textarea
            id="description"
            data-ocid="project-description-input"
            placeholder="Brief overview of the project…"
            rows={3}
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p
              className="text-xs"
              style={{ color: "oklch(var(--destructive))" }}
            >
              {errors.description.message}
            </p>
          )}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">
            Categories{" "}
            <span style={{ color: "oklch(var(--destructive))" }}>*</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => {
              const id = `tag-${cat.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-2"
                  data-ocid={`tag-checkbox-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Checkbox
                    id={id}
                    checked={watchedTags.includes(cat)}
                    onCheckedChange={() => toggleTag(cat)}
                  />
                  <label
                    htmlFor={id}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {cat}
                  </label>
                </div>
              );
            })}
          </div>
          {errors.tags && (
            <p
              className="text-xs"
              style={{ color: "oklch(var(--destructive))" }}
            >
              {errors.tags.message}
            </p>
          )}
          {watchedTags.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Select at least one category
            </p>
          )}
        </fieldset>

        <div
          className="flex items-center gap-2.5 p-3 rounded-lg"
          style={{ background: "oklch(var(--muted) / 0.4)" }}
          data-ocid="project-featured-toggle"
        >
          <Checkbox
            id="featured-checkbox"
            checked={watchedFeatured}
            onCheckedChange={(checked) => setValue("featured", !!checked)}
            aria-label="Featured Project"
          />
          <div>
            <span className="text-sm font-medium text-foreground">
              Featured Project
            </span>
            <p className="text-xs text-muted-foreground">
              Show in the featured section on the home page
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Case Study Details */}
      <SectionCard>
        <SectionHeader>Case Study Details</SectionHeader>

        <div className="space-y-1.5">
          <Label htmlFor="problemStatement">Problem Statement</Label>
          <Textarea
            id="problemStatement"
            data-ocid="project-problem-input"
            placeholder="Describe the problem you solved..."
            rows={5}
            {...register("problemStatement")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="datasetDescription">Dataset Description</Label>
          <Textarea
            id="datasetDescription"
            data-ocid="project-dataset-input"
            placeholder="Describe the dataset used..."
            rows={4}
            {...register("datasetDescription")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="approach">Approach</Label>
          <Textarea
            id="approach"
            data-ocid="project-approach-input"
            placeholder="Explain your methodology and approach..."
            rows={5}
            {...register("approach")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="results">Results</Label>
          <Textarea
            id="results"
            data-ocid="project-results-input"
            placeholder="Share key results and metrics..."
            rows={5}
            {...register("results")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="insights">Insights</Label>
          <Textarea
            id="insights"
            data-ocid="project-insights-input"
            placeholder="What did you learn? Key insights..."
            rows={4}
            {...register("insights")}
          />
        </div>
      </SectionCard>

      {/* Links & Media */}
      <SectionCard>
        <SectionHeader>Links &amp; Media</SectionHeader>

        <div className="space-y-1.5">
          <Label htmlFor="githubUrl">GitHub Repository</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Github size={15} />
            </div>
            <Input
              id="githubUrl"
              data-ocid="project-github-input"
              placeholder="https://github.com/..."
              className="pl-9"
              {...register("githubUrl", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Must be a valid URL starting with http(s)://",
                },
              })}
            />
          </div>
          {errors.githubUrl && (
            <p
              className="text-xs"
              style={{ color: "oklch(var(--destructive))" }}
            >
              {errors.githubUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="liveDemoUrl">Live Demo</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <ExternalLink size={15} />
            </div>
            <Input
              id="liveDemoUrl"
              data-ocid="project-demo-input"
              placeholder="https://..."
              className="pl-9"
              {...register("liveDemoUrl", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Must be a valid URL starting with http(s)://",
                },
              })}
            />
          </div>
          {errors.liveDemoUrl && (
            <p
              className="text-xs"
              style={{ color: "oklch(var(--destructive))" }}
            >
              {errors.liveDemoUrl.message}
            </p>
          )}
        </div>
      </SectionCard>

      {/* Error + Actions */}
      {submitError && (
        <p
          className="text-sm px-3 py-2 rounded-lg"
          style={{
            background: "oklch(var(--destructive) / 0.1)",
            color: "oklch(var(--destructive))",
            border: "1px solid oklch(var(--destructive) / 0.3)",
          }}
        >
          Failed to save project. Please try again.
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="project-form-submit"
          style={{ background: "var(--gradient-primary)" }}
          className="text-primary-foreground gap-2"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending
            ? "Saving…"
            : project
              ? "Update Project"
              : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
