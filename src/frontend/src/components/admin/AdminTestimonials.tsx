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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Pencil, Plus, Trash2, X, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useTestimonials,
  useUpdateTestimonial,
} from "../../hooks/use-backend";
import type { Testimonial, TestimonialId, TestimonialInput } from "../../types";

const skeletonKeys = ["a", "b", "c"] as const;

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function TestimonialForm({
  testimonial,
  onSuccess,
  onCancel,
}: TestimonialFormProps) {
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TestimonialInput>({
    defaultValues: testimonial
      ? {
          name: testimonial.name,
          role: testimonial.role,
          company: testimonial.company,
          quote: testimonial.quote,
          imageUrl: testimonial.imageUrl,
          approved: testimonial.approved,
        }
      : {
          name: "",
          role: "",
          company: "",
          quote: "",
          imageUrl: "",
          approved: false,
        },
  });

  const watchedApproved = watch("approved");

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: TestimonialInput) => {
    if (testimonial) {
      updateMutation.mutate(
        { id: testimonial.id, input: data },
        {
          onSuccess: () => {
            toast.success("Testimonial updated");
            onSuccess();
          },
          onError: () => toast.error("Failed to update testimonial"),
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Testimonial added");
          reset();
          onSuccess();
        },
        onError: () => toast.error("Failed to add testimonial"),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      data-ocid="testimonial-form"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="t-name">Name *</Label>
          <Input
            id="t-name"
            data-ocid="testimonial-name-input"
            placeholder="Jane Smith"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="t-role">Role *</Label>
          <Input
            id="t-role"
            data-ocid="testimonial-role-input"
            placeholder="Data Science Manager"
            {...register("role", { required: "Role is required" })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="t-company">Company *</Label>
          <Input
            id="t-company"
            data-ocid="testimonial-company-input"
            placeholder="Acme Corp"
            {...register("company", { required: "Company is required" })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="t-imageUrl">Image URL</Label>
          <Input
            id="t-imageUrl"
            data-ocid="testimonial-image-input"
            placeholder="https://…"
            {...register("imageUrl")}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-quote">Quote *</Label>
        <Textarea
          id="t-quote"
          data-ocid="testimonial-quote-input"
          placeholder="What they said about your work…"
          rows={3}
          {...register("quote", { required: "Quote is required" })}
        />
        {errors.quote && (
          <p className="text-xs text-destructive">{errors.quote.message}</p>
        )}
      </div>
      <div
        className="flex items-center gap-2"
        data-ocid="testimonial-approved-toggle"
      >
        <Checkbox
          id="testimonial-approved"
          checked={watchedApproved}
          onCheckedChange={(v) => setValue("approved", !!v)}
          aria-label="Approved (visible on site)"
        />
        <span className="text-sm text-foreground">
          Approved (visible on site)
        </span>
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-border/50">
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="testimonial-form-submit"
          style={{ background: "var(--gradient-primary)" }}
          className="text-primary-foreground"
        >
          {isPending ? "Saving…" : testimonial ? "Update" : "Add Testimonial"}
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

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useTestimonials();
  const deleteMutation = useDeleteTestimonial();
  const [editTarget, setEditTarget] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialId | null>(null);

  const handleEdit = (t: Testimonial) => {
    setEditTarget(t);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const handleFormDone = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (deleteTarget !== null) {
      deleteMutation.mutate(deleteTarget, {
        onSuccess: () => toast.success("Testimonial deleted"),
        onError: () => toast.error("Failed to delete"),
      });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Testimonials
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage client and recruiter testimonials
          </p>
        </div>
        {!showForm && (
          <Button
            data-ocid="add-testimonial-btn"
            onClick={handleAdd}
            style={{ background: "var(--gradient-primary)" }}
            className="text-primary-foreground gap-2"
          >
            <Plus size={15} />
            Add Testimonial
          </Button>
        )}
      </div>

      {/* Form Panel */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">
              {editTarget ? "Edit Testimonial" : "New Testimonial"}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleFormDone}
              aria-label="Close form"
            >
              <X size={14} />
            </Button>
          </div>
          <TestimonialForm
            testimonial={editTarget}
            onSuccess={handleFormDone}
            onCancel={handleFormDone}
          />
        </motion.div>
      )}

      {/* List */}
      <div className="glass rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">
            {skeletonKeys.map((k) => (
              <Skeleton key={k} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : !testimonials?.length ? (
          <div
            className="py-12 text-center"
            data-ocid="testimonials-empty-state"
          >
            <p className="text-muted-foreground text-sm">
              No testimonials yet. Add your first one!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {testimonials.map((t, i) => (
              <motion.div
                key={String(t.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 px-5 py-4"
                data-ocid={`testimonial-row-${String(t.id)}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {t.role} @ {t.company}
                    </span>
                    {t.approved ? (
                      <CheckCircle
                        size={13}
                        className="text-chart-4 flex-shrink-0"
                      />
                    ) : (
                      <XCircle
                        size={13}
                        className="text-muted-foreground flex-shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    data-ocid={`edit-testimonial-${String(t.id)}`}
                    onClick={() => handleEdit(t)}
                    aria-label="Edit testimonial"
                  >
                    <Pencil size={13} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    data-ocid={`delete-testimonial-${String(t.id)}`}
                    onClick={() => setDeleteTarget(t.id)}
                    aria-label="Delete testimonial"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="glass border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              data-ocid="confirm-delete-testimonial"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
