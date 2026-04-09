import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Code,
  Download,
  FileText,
  Image,
  Table,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, createActor } from "../../backend";
import {
  useDeleteFile,
  useProjectFiles,
  useProjects,
} from "../../hooks/use-backend";
import type { FileMetadata, ProjectId } from "../../types";

function getFileIcon(filename: string) {
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename))
    return <Image size={16} className="text-chart-3" />;
  if (/\.py$/i.test(filename))
    return <Code size={16} className="text-chart-2" />;
  if (/\.(csv|xlsx|xls)$/i.test(filename))
    return <Table size={16} className="text-chart-4" />;
  return <FileText size={16} className="text-muted-foreground" />;
}

function getFileType(filename: string): string {
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)) return "image";
  if (/\.py$/i.test(filename)) return "python";
  if (/\.csv$/i.test(filename)) return "csv";
  if (/\.(xlsx|xls)$/i.test(filename)) return "excel";
  return "other";
}

function getTypeLabel(fileType: string): string {
  const map: Record<string, string> = {
    image: "Image",
    python: "Python Script",
    csv: "CSV Data",
    excel: "Excel Spreadsheet",
    other: "File",
  };
  return map[fileType] ?? fileType;
}

async function handleDownload(record: FileMetadata) {
  try {
    const bytes = await record.fileKey.getBytes();
    const blob = new Blob([bytes]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = record.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    toast.error("Download failed");
  }
}

const skeletonKeys = ["a", "b", "c"] as const;

export default function FileUpload() {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId | null>(
    null,
  );
  const { data: files, isLoading: filesLoading } = useProjectFiles(
    selectedProjectId !== null ? selectedProjectId : undefined,
  );
  const deleteMutation = useDeleteFile();
  const { actor } = useActor(createActor);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!actor || selectedProjectId === null) {
      toast.error("Please select a project first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      const fileType = getFileType(file.name);

      await actor.addFileMetadata({
        filename: file.name,
        fileType,
        projectId: selectedProjectId,
        fileKey: blob,
      });

      toast.success(`${file.name} uploaded successfully`);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          File Uploads
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Upload CSV, Excel, Python scripts, and images per project
        </p>
      </div>

      {/* Project Selector */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{
          background: "oklch(var(--card) / 0.5)",
          border: "1px solid oklch(var(--border) / 0.4)",
        }}
      >
        <Label htmlFor="project-select">Select Project</Label>
        <Select
          onValueChange={(val) => setSelectedProjectId(BigInt(val))}
          value={
            selectedProjectId !== null ? String(selectedProjectId) : undefined
          }
        >
          <SelectTrigger
            id="project-select"
            data-ocid="file-project-select"
            className="w-72"
          >
            <SelectValue placeholder="Choose a project…" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((p) => (
              <SelectItem key={String(p.id)} value={String(p.id)}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!projects?.length && (
          <p className="text-xs text-muted-foreground">
            No projects found. Create a project first in the Projects tab.
          </p>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        data-ocid="file-upload-zone"
        style={{
          borderRadius: "0.75rem",
          border: dragOver
            ? "2px dashed oklch(var(--primary))"
            : "2px dashed oklch(var(--border) / 0.6)",
          background: dragOver
            ? "oklch(var(--primary) / 0.06)"
            : "oklch(var(--card) / 0.3)",
          transition: "border-color 0.2s ease, background 0.2s ease",
          opacity: selectedProjectId === null ? 0.5 : 1,
        }}
        className="p-10 text-center"
      >
        <input
          ref={fileInputRef}
          id="file-upload-input"
          type="file"
          accept=".csv,.xlsx,.xls,.py,.jpg,.jpeg,.png,.gif,.webp"
          className="hidden"
          onChange={handleInputChange}
          disabled={isUploading || selectedProjectId === null}
          data-ocid="file-input"
          aria-label="Upload file"
        />
        <label
          htmlFor="file-upload-input"
          className={`flex flex-col items-center gap-3 ${
            selectedProjectId === null ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Upload size={22} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {dragOver ? "Drop to upload" : "Click or drag files here"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supported: CSV, Excel (.xlsx), Python (.py), Images (JPG, PNG,
              WebP)
            </p>
          </div>
          {selectedProjectId === null && (
            <p
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: "oklch(var(--muted) / 0.5)",
                color: "oklch(var(--muted-foreground))",
              }}
            >
              Select a project above to enable uploads
            </p>
          )}
        </label>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "oklch(var(--card) / 0.6)",
              border: "1px solid oklch(var(--primary) / 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground font-medium">Uploading…</p>
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      {selectedProjectId !== null && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "oklch(var(--card) / 0.4)",
            border: "1px solid oklch(var(--border) / 0.4)",
          }}
        >
          <div
            className="px-5 py-3 border-b"
            style={{ borderColor: "oklch(var(--border) / 0.3)" }}
          >
            <h3 className="text-sm font-semibold text-foreground">
              Uploaded Files
              {files && (
                <span className="ml-2 font-normal text-muted-foreground">
                  ({files.length})
                </span>
              )}
            </h3>
          </div>

          {filesLoading ? (
            <div className="p-4 space-y-3">
              {skeletonKeys.map((k) => (
                <Skeleton key={k} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : !files?.length ? (
            <div className="py-12 text-center" data-ocid="files-empty-state">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground">
                No files uploaded for this project yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                borderTop: "1px solid oklch(var(--border) / 0.2)",
              }}
            >
              {files.map((file, i) => (
                <motion.div
                  key={String(file.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 px-5 py-3"
                  style={{
                    borderBottom:
                      i < files.length - 1
                        ? "1px solid oklch(var(--border) / 0.2)"
                        : "none",
                  }}
                  data-ocid={`file-row-${String(file.id)}`}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "oklch(var(--muted) / 0.5)" }}
                  >
                    {getFileIcon(file.filename)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.filename}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getTypeLabel(file.fileType)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Download ${file.filename}`}
                      data-ocid={`download-file-${String(file.id)}`}
                      onClick={() => handleDownload(file)}
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      aria-label={`Delete ${file.filename}`}
                      data-ocid={`delete-file-${String(file.id)}`}
                      onClick={() =>
                        deleteMutation.mutate(file.id, {
                          onSuccess: () => toast.success("File deleted"),
                          onError: () => toast.error("Failed to delete file"),
                        })
                      }
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
