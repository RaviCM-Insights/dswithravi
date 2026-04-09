import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Eye,
  Files,
  FolderOpen,
  LogIn,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Shield,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import AdminProjects from "../components/admin/AdminProjects";
import FileUpload from "../components/admin/FileUpload";
import { useAuth } from "../hooks/use-auth";
import {
  useAnalytics,
  useContacts,
  useCreateTestimonial,
  useDeleteContact,
  useDeleteTestimonial,
  useMarkContactRead,
  useTestimonials,
  useUpdateTestimonial,
} from "../hooks/use-backend";
import type { Testimonial, TestimonialInput } from "../types";

// Route is registered in App.tsx via createRoute({ component: AdminPage })

type AdminTab = "overview" | "projects" | "files" | "contacts" | "testimonials";

export function AdminPage() {
  const { isAuthenticated, isAdmin, login, logout, loginStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-2xl glass neon-border flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Sign in with Internet Identity to manage your portfolio.
          </p>
          <Button
            size="lg"
            className="gap-2"
            style={{
              background: "var(--gradient-primary)",
              border: "none",
              color: "oklch(var(--foreground))",
            }}
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            data-ocid="admin-login-btn"
          >
            <LogIn className="w-4 h-4" />
            {loginStatus === "logging-in"
              ? "Signing in…"
              : "Sign In with Internet Identity"}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Your identity doesn't have admin privileges.
          </p>
          <Button
            variant="outline"
            onClick={() => logout()}
            className="gap-2"
            data-ocid="admin-logout-btn"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: typeof Eye }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "files", label: "Files", icon: Files },
    { id: "testimonials", label: "Testimonials", icon: Users },
    { id: "contacts", label: "Contacts", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div
        className="border-b border-border/30 px-4 py-4"
        style={{ background: "oklch(var(--card) / 0.6)" }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">
                DSWithRavi Portfolio
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="gap-2 text-muted-foreground"
            data-ocid="admin-logout"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="border-b border-border/20 px-4"
        style={{ background: "oklch(var(--card) / 0.3)" }}
      >
        <div className="container mx-auto flex gap-1 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
                activeTab === id
                  ? "border-primary"
                  : "border-transparent text-muted-foreground"
              }`}
              style={
                activeTab === id
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.55 0.3 264), oklch(0.48 0.28 294))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
                  : {}
              }
              data-ocid={`admin-tab-${id}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "projects" && <AdminProjects />}
        {activeTab === "files" && <FileUpload />}
        {activeTab === "testimonials" && <TestimonialsTab />}
        {activeTab === "contacts" && <ContactsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data: analytics, isLoading } = useAnalytics();

  const cards = [
    {
      icon: FolderOpen,
      label: "Total Projects",
      value: analytics?.projectCount,
    },
    { icon: Star, label: "Featured", value: analytics?.featuredCount },
    { icon: Eye, label: "Total Views", value: analytics?.totalViews },
    { icon: MessageSquare, label: "Contacts", value: analytics?.contactCount },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-display font-bold text-foreground">
        Dashboard Overview
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className="glass p-5 flex items-center gap-4"
              data-ocid={`stat-${label.toLowerCase().replace(/ /g, "-")}`}
            >
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-display font-bold gradient-text">
                    {value?.toString() ?? "—"}
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const EMPTY_TESTIMONIAL: TestimonialInput = {
  name: "",
  role: "",
  company: "",
  quote: "",
  approved: false,
  imageUrl: undefined,
};

function TestimonialForm({
  initial,
  onClose,
}: {
  initial?: Testimonial;
  onClose: () => void;
}) {
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const [form, setForm] = useState<TestimonialInput>(
    initial
      ? {
          name: initial.name,
          role: initial.role,
          company: initial.company,
          quote: initial.quote,
          approved: initial.approved,
          imageUrl: initial.imageUrl,
        }
      : EMPTY_TESTIMONIAL,
  );

  function set(field: keyof TestimonialInput, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (initial) {
        await updateTestimonial.mutateAsync({ id: initial.id, input: form });
        toast.success("Testimonial updated");
      } else {
        await createTestimonial.mutateAsync(form);
        toast.success("Testimonial added");
      }
      onClose();
    } catch {
      toast.error("Failed to save testimonial");
    }
  }

  const isPending = createTestimonial.isPending || updateTestimonial.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="t-name">Name</Label>
          <Input
            id="t-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            placeholder="Full name"
            data-ocid="testimonial-form-name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="t-role">Role</Label>
          <Input
            id="t-role"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            required
            placeholder="Job title"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-company">Company</Label>
        <Input
          id="t-company"
          value={form.company}
          onChange={(e) => set("company", e.target.value)}
          required
          placeholder="Company name"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-quote">Quote</Label>
        <Textarea
          id="t-quote"
          value={form.quote}
          onChange={(e) => set("quote", e.target.value)}
          required
          rows={3}
          placeholder="What did they say about you?"
          data-ocid="testimonial-form-quote"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-image">Image URL (optional)</Label>
        <Input
          id="t-image"
          value={form.imageUrl ?? ""}
          onChange={(e) => set("imageUrl", e.target.value || "")}
          placeholder="https://…"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="t-approved"
          type="checkbox"
          checked={form.approved}
          onChange={(e) => set("approved", e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
        <Label htmlFor="t-approved">Approved (visible on portfolio)</Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1"
          style={{ background: "var(--gradient-primary)", border: "none" }}
          data-ocid="testimonial-form-submit"
        >
          {isPending
            ? "Saving…"
            : initial
              ? "Update Testimonial"
              : "Add Testimonial"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function TestimonialsTab() {
  const { data: testimonials, isLoading } = useTestimonials();
  const deleteTestimonial = useDeleteTestimonial();
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<
    Testimonial | undefined
  >(undefined);

  async function handleDelete(id: bigint, name: string) {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    await deleteTestimonial.mutateAsync(id);
    toast.success("Testimonial deleted");
  }

  function openAdd() {
    setEditingTestimonial(undefined);
    setShowForm(true);
  }

  function openEdit(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTestimonial(undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">
          Testimonials
        </h2>
        <Button
          size="sm"
          className="gap-2"
          style={{
            background: "var(--gradient-primary)",
            border: "none",
            color: "oklch(var(--foreground))",
          }}
          onClick={openAdd}
          data-ocid="add-testimonial-btn"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-md" data-ocid="testimonial-form-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <TestimonialForm initial={editingTestimonial} onClose={closeForm} />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((k) => (
            <Skeleton key={k} className="h-24 w-full" />
          ))}
        </div>
      ) : !testimonials || testimonials.length === 0 ? (
        <Card className="glass p-8 text-center" data-ocid="testimonials-empty">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No testimonials yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <Card
              key={t.id.toString()}
              className="glass p-5 flex items-start justify-between gap-4"
              data-ocid={`testimonial-row-${t.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-foreground">{t.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </span>
                  {t.approved ? (
                    <Badge variant="secondary" className="text-xs">
                      Approved
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      Pending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit"
                  onClick={() => openEdit(t)}
                  data-ocid={`edit-testimonial-${t.id}`}
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(t.id, t.name)}
                  aria-label="Delete"
                  data-ocid={`delete-testimonial-${t.id}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactsTab() {
  const { data: contacts, isLoading } = useContacts();
  const markRead = useMarkContactRead();
  const deleteContact = useDeleteContact();

  async function handleMarkRead(id: bigint) {
    await markRead.mutateAsync(id);
    toast.success("Marked as read");
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this contact message?")) return;
    await deleteContact.mutateAsync(id);
    toast.success("Contact deleted");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-bold text-foreground">
        Contact Messages
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-20 w-full" />
          ))}
        </div>
      ) : !contacts || contacts.length === 0 ? (
        <Card className="glass p-8 text-center" data-ocid="contacts-empty">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No contact messages yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <Card
              key={c.id.toString()}
              className={`glass p-5 flex items-start justify-between gap-4 ${!c.read ? "neon-border" : ""}`}
              data-ocid={`contact-row-${c.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.email}
                  </span>
                  {!c.read && (
                    <Badge
                      className="text-xs"
                      style={{
                        background: "oklch(var(--primary) / 0.2)",
                        color: "oklch(var(--primary))",
                      }}
                    >
                      New
                    </Badge>
                  )}
                </div>
                {c.subject && (
                  <p className="text-sm font-medium text-foreground mb-1">
                    {c.subject}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {c.message}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!c.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleMarkRead(c.id)}
                    data-ocid={`mark-read-${c.id}`}
                  >
                    Mark Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(c.id)}
                  aria-label="Delete"
                  data-ocid={`delete-contact-${c.id}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
