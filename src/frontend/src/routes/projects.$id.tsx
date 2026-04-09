import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  Database,
  ExternalLink,
  Eye,
  Github,
  Lightbulb,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import {
  useIncrementViewCount,
  useProject,
  useProjectFiles,
} from "../hooks/use-backend";

// Route is registered in App.tsx via createRoute({ component: ProjectDetailPage })

const CHART_COLORS = [
  "oklch(0.55 0.30 264)",
  "oklch(0.48 0.28 294)",
  "oklch(0.65 0.25 0)",
  "oklch(0.42 0.25 120)",
];

const sampleMetrics = [
  { name: "Accuracy", value: 94.2 },
  { name: "Precision", value: 91.8 },
  { name: "Recall", value: 89.3 },
  { name: "F1 Score", value: 90.5 },
];

const sampleTimeline = [
  { epoch: "Ep 1", loss: 0.85, val: 0.88 },
  { epoch: "Ep 2", loss: 0.72, val: 0.74 },
  { epoch: "Ep 5", loss: 0.45, val: 0.5 },
  { epoch: "Ep 10", loss: 0.28, val: 0.35 },
  { epoch: "Ep 15", loss: 0.18, val: 0.22 },
  { epoch: "Ep 20", loss: 0.12, val: 0.16 },
];

const caseStudySections = [
  {
    icon: Target,
    title: "Problem Statement",
    field: "problemStatement" as const,
  },
  {
    icon: Database,
    title: "Dataset Description",
    field: "datasetDescription" as const,
  },
  {
    icon: BookOpen,
    title: "Approach & Methodology",
    field: "approach" as const,
  },
  { icon: BarChart2, title: "Results & Metrics", field: "results" as const },
  { icon: Lightbulb, title: "Key Insights", field: "insights" as const },
];

export function ProjectDetailPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params.id ?? "0";
  const projectId = BigInt(id);
  const { data: project, isLoading } = useProject(projectId);
  const { data: files } = useProjectFiles(projectId);
  const incrementView = useIncrementViewCount();
  const mutate = incrementView.mutate;
  useEffect(() => {
    mutate(projectId);
  }, [mutate, projectId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Project Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This project doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/">← Back to Portfolio</Link>
        </Button>
      </div>
    );
  }

  const imageFiles =
    files?.filter((f) => f.fileType.startsWith("image/")) ?? [];
  const csvFiles =
    files?.filter(
      (f) => f.fileType === "text/csv" || f.filename.endsWith(".csv"),
    ) ?? [];
  const pyFiles = files?.filter((f) => f.filename.endsWith(".py")) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div
        className="relative py-20 overflow-hidden"
        style={{ background: "oklch(var(--card) / 0.4)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
        </div>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-6 transition-smooth"
              data-ocid="back-link"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {project.featured && (
                <Badge
                  className="text-xs"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "oklch(var(--foreground))",
                  }}
                >
                  ⭐ Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                  data-ocid="github-link"
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                </Button>
              )}
              {project.liveDemoUrl && (
                <Button
                  size="sm"
                  className="gap-2"
                  style={{
                    background: "var(--gradient-primary)",
                    border: "none",
                  }}
                  asChild
                  data-ocid="live-demo-link"
                >
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                </Button>
              )}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{project.viewCount.toString()} views</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Case study body */}
      <div className="container mx-auto px-4 max-w-5xl py-16 space-y-12">
        {caseStudySections.map(({ icon: Icon, title, field }, i) => (
          <ScrollReveal key={field} delay={i * 0.05}>
            <Card
              className="glass p-6 sm:p-8"
              data-ocid={`case-study-${field}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: "oklch(var(--primary) / 0.12)",
                    border: "1px solid oklch(var(--primary) / 0.25)",
                  }}
                >
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-display font-semibold text-lg text-foreground">
                  {title}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project[field] || "Details coming soon."}
              </p>
            </Card>
          </ScrollReveal>
        ))}

        {/* Charts */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass p-6" data-ocid="metrics-chart">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Model Performance Metrics
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sampleMetrics}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(var(--border) / 0.3)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    domain={[80, 100]}
                    tick={{
                      fontSize: 12,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(var(--popover))",
                      border: "1px solid oklch(var(--border))",
                      borderRadius: "0.5rem",
                      color: "oklch(var(--foreground))",
                    }}
                    formatter={(v: number) => [`${v}%`, ""]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sampleMetrics.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="glass p-6" data-ocid="training-chart">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Training & Validation Loss
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={sampleTimeline}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(var(--border) / 0.3)"
                  />
                  <XAxis
                    dataKey="epoch"
                    tick={{
                      fontSize: 12,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(var(--popover))",
                      border: "1px solid oklch(var(--border))",
                      borderRadius: "0.5rem",
                      color: "oklch(var(--foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="loss"
                    stroke="oklch(0.55 0.30 264)"
                    strokeWidth={2}
                    dot={false}
                    name="Train Loss"
                  />
                  <Line
                    type="monotone"
                    dataKey="val"
                    stroke="oklch(0.48 0.28 294)"
                    strokeWidth={2}
                    dot={false}
                    name="Val Loss"
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </ScrollReveal>

        {/* Project files */}
        {imageFiles.length + csvFiles.length + pyFiles.length > 0 && (
          <ScrollReveal>
            <Card className="glass p-6" data-ocid="project-files">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                Project Files
              </h3>
              <div className="space-y-3">
                {[...imageFiles, ...csvFiles, ...pyFiles].map((file) => (
                  <div
                    key={file.id.toString()}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "oklch(var(--muted) / 0.4)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg">
                        {file.fileType.startsWith("image/")
                          ? "🖼"
                          : file.filename.endsWith(".py")
                            ? "🐍"
                            : "📊"}
                      </span>
                      <span className="text-sm text-foreground truncate">
                        {file.filename}
                      </span>
                    </div>
                    <a
                      href={file.fileKey.getDirectURL()}
                      download={file.filename}
                      className="shrink-0"
                    >
                      <Button variant="outline" size="sm" className="text-xs">
                        Download
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
