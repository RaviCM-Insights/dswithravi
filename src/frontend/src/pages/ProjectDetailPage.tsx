import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useIncrementViewCount,
  useProjectFiles as useProjectFilesHook,
  useProject as useProjectHook,
} from "@/hooks/use-backend";
import type { FileMetadata, ProjectId } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Eye,
  FileCode,
  FileSpreadsheet,
  Github,
  Image,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ─── helpers ─── */

function useIncrementViewOnMount(id: ProjectId) {
  const increment = useIncrementViewCount();
  const mutate = increment.mutate;
  useEffect(() => {
    mutate(id);
  }, [id, mutate]);
}

function buildAccuracyData(seed: number) {
  return Array.from({ length: 10 }, (_, i) => ({
    epoch: i + 1,
    train: Math.min(99.5, 60 + (i / 9) * 35 + (seed % 3) * 1.5),
    val: Math.min(97, 58 + (i / 9) * 32 + (seed % 3)),
  }));
}

function buildComparisonData(tagCount: number) {
  const models = ["Baseline", "Linear", "Random Forest", "XGBoost", "Final"];
  return models.map((m, i) => ({
    model: m,
    accuracy: 65 + i * 5.5 + (tagCount % 3),
    f1: 62 + i * 5 + (tagCount % 4),
  }));
}

function getFileIcon(fileType: string) {
  if (fileType.includes("python") || fileType.includes("text/x-python"))
    return FileCode;
  if (
    fileType.includes("csv") ||
    fileType.includes("excel") ||
    fileType.includes("spreadsheet")
  )
    return FileSpreadsheet;
  if (fileType.includes("image")) return Image;
  return Download;
}

const isImage = (ft: string) => ft.startsWith("image/");
const isCode = (ft: string) =>
  ft.includes("python") || ft.includes("text/x-python") || ft === "text/plain";
const isTabular = (ft: string) =>
  ft.includes("csv") || ft.includes("spreadsheet") || ft.includes("excel");

/* ─── sub-components ─── */

function TagBadge({ tag }: { tag: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
      style={{
        background: "oklch(var(--primary) / 0.1)",
        borderColor: "oklch(var(--primary) / 0.35)",
        color: "oklch(var(--primary))",
      }}
    >
      {tag}
    </span>
  );
}

function CaseStudyContent({ content }: { content: string }) {
  return (
    <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
      {content}
    </p>
  );
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 text-sm shadow-lg">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{" "}
          <span className="font-mono">
            {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

function FileAttachmentCard({ file }: { file: FileMetadata }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const IconComp = getFileIcon(file.fileType);
  const url = file.fileKey.getDirectURL();

  const handlePreview = async () => {
    setLoading(true);
    try {
      const bytes = await file.fileKey.getBytes();
      setPreview(new TextDecoder().decode(bytes));
    } catch {
      setPreview("Failed to load preview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: "oklch(var(--card) / 0.5)",
        border: "1px solid oklch(var(--border) / 0.3)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="size-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "oklch(var(--primary) / 0.15)" }}
        >
          <IconComp
            className="size-5"
            style={{ color: "oklch(var(--primary))" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {file.filename}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {file.fileType}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {(isCode(file.fileType) || isTabular(file.fileType)) && !preview && (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePreview}
              disabled={loading}
              data-ocid="preview-btn"
            >
              {loading ? "Loading…" : "Preview"}
            </Button>
          )}
          <Button size="sm" variant="outline" asChild data-ocid="download-btn">
            <a
              href={url}
              download={file.filename}
              aria-label={`Download ${file.filename}`}
            >
              <Download className="size-4" />
            </a>
          </Button>
        </div>
      </div>
      {isImage(file.fileType) && (
        <img
          src={url}
          alt={file.filename}
          className="rounded-lg w-full object-cover max-h-64"
        />
      )}
      {preview !== null && isCode(file.fileType) && (
        <pre
          className="rounded-lg p-4 overflow-auto text-xs font-mono max-h-80"
          style={{
            background: "oklch(0.08 0 0)",
            color: "oklch(0.85 0.05 264)",
            border: "1px solid oklch(var(--primary) / 0.2)",
          }}
        >
          {preview}
        </pre>
      )}
      {preview !== null && isTabular(file.fileType) && (
        <div
          className="overflow-auto max-h-64 rounded-lg"
          style={{ border: "1px solid oklch(var(--border) / 0.3)" }}
        >
          <table className="text-xs w-full">
            <tbody>
              {preview
                .split("\n")
                .slice(0, 20)
                .map((row, rowIdx) => (
                  <tr
                    key={`${rowIdx}-${row.substring(0, 12)}`}
                    style={{
                      background:
                        rowIdx % 2 === 0
                          ? "oklch(var(--card) / 0.4)"
                          : "transparent",
                    }}
                  >
                    {row.split(",").map((cell, cellIdx) => (
                      <td
                        key={`${rowIdx}-${cellIdx}-${cell.substring(0, 6)}`}
                        className={`px-3 py-1.5 border-r border-border/20 ${rowIdx === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-6 md:p-8"
      style={{
        background: "oklch(var(--card) / 0.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid oklch(var(--border) / 0.3)",
      }}
    >
      <h3 className="text-lg font-display font-semibold mb-5 flex items-center gap-2 text-foreground">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-10 w-2/3" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

/* ─── main page — used standalone or embedded ─── */

interface ProjectDetailPageProps {
  projectId: bigint;
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const navigate = useNavigate();
  const { data: project, isLoading } = useProjectHook(projectId);
  const { data: files } = useProjectFilesHook(projectId);
  useIncrementViewOnMount(projectId);

  if (isLoading) return <DetailSkeleton />;
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-6">🔍</div>
        <h2 className="text-2xl font-display font-bold mb-3">
          Project Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This project may have been removed.
        </p>
        <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
      </div>
    );
  }

  const accuracyData = buildAccuracyData(Number(project.id));
  const comparisonData = buildComparisonData(project.tags.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth"
          data-ocid="back-btn"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Projects</span>
        </button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {project.featured && (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "oklch(0.48 0.28 294 / 0.15)",
                border: "1px solid oklch(0.48 0.28 294 / 0.4)",
                color: "oklch(0.75 0.2 294)",
              }}
            >
              ⭐ Featured
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold gradient-text mb-4 leading-tight">
          {project.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
          {project.description}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {project.githubUrl && (
            <Button variant="outline" asChild data-ocid="github-link">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          )}
          {project.liveDemoUrl && (
            <Button asChild data-ocid="demo-link">
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground ml-auto">
            <Eye className="size-4" />
            {project.viewCount.toString()} views
          </span>
        </div>
      </motion.div>

      {/* Case study tabs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="problem" data-ocid="case-study-tabs">
          <TabsList
            className="flex flex-wrap h-auto gap-1 mb-6 p-1 rounded-xl"
            style={{
              background: "oklch(var(--card) / 0.5)",
              border: "1px solid oklch(var(--border) / 0.3)",
            }}
          >
            {[
              { value: "problem", label: "Problem" },
              { value: "dataset", label: "Dataset" },
              { value: "approach", label: "Approach" },
              { value: "results", label: "Results" },
              { value: "insights", label: "Insights" },
            ].map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="text-sm"
                data-ocid={`tab-${value}`}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="problem">
            <SectionCard title="Problem Statement" icon="🎯">
              <CaseStudyContent content={project.problemStatement} />
            </SectionCard>
          </TabsContent>
          <TabsContent value="dataset">
            <SectionCard title="Dataset Description" icon="📂">
              <CaseStudyContent content={project.datasetDescription} />
            </SectionCard>
          </TabsContent>
          <TabsContent value="approach">
            <SectionCard title="Approach & Methodology" icon="🔬">
              <CaseStudyContent content={project.approach} />
            </SectionCard>
          </TabsContent>
          <TabsContent value="results">
            <SectionCard title="Results & Metrics" icon="📊">
              <CaseStudyContent content={project.results} />
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "oklch(var(--card) / 0.5)",
                    border: "1px solid oklch(var(--border) / 0.3)",
                  }}
                >
                  <h4 className="text-sm font-semibold mb-4 text-foreground">
                    Model Accuracy Over Epochs
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={accuracyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(var(--border) / 0.3)"
                      />
                      <XAxis
                        dataKey="epoch"
                        tick={{
                          fontSize: 11,
                          fill: "oklch(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: "oklch(var(--muted-foreground))",
                        }}
                        domain={[50, 100]}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line
                        type="monotone"
                        dataKey="train"
                        stroke="oklch(0.55 0.3 264)"
                        strokeWidth={2}
                        dot={false}
                        name="Train Acc %"
                      />
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="oklch(0.48 0.28 294)"
                        strokeWidth={2}
                        dot={false}
                        name="Val Acc %"
                        strokeDasharray="4 2"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "oklch(var(--card) / 0.5)",
                    border: "1px solid oklch(var(--border) / 0.3)",
                  }}
                >
                  <h4 className="text-sm font-semibold mb-4 text-foreground">
                    Model Comparison
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={comparisonData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(var(--border) / 0.3)"
                      />
                      <XAxis
                        type="number"
                        domain={[60, 100]}
                        tick={{
                          fontSize: 10,
                          fill: "oklch(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        type="category"
                        dataKey="model"
                        tick={{
                          fontSize: 10,
                          fill: "oklch(var(--muted-foreground))",
                        }}
                        width={72}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar
                        dataKey="accuracy"
                        fill="oklch(0.55 0.3 264)"
                        name="Accuracy %"
                        radius={[0, 3, 3, 0]}
                      />
                      <Bar
                        dataKey="f1"
                        fill="oklch(0.48 0.28 294)"
                        name="F1 Score %"
                        radius={[0, 3, 3, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SectionCard>
          </TabsContent>
          <TabsContent value="insights">
            <SectionCard title="Business Insights" icon="💡">
              <CaseStudyContent content={project.insights} />
            </SectionCard>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* File attachments */}
      {files && files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10"
          data-ocid="file-attachments"
        >
          <h3 className="text-lg font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <span
              className="size-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "oklch(var(--primary) / 0.15)" }}
            >
              📁
            </span>
            Project Files{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({files.length})
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <FileAttachmentCard key={file.id.toString()} file={file} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
