import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  FileText,
  FolderOpen,
  Mail,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useAnalytics } from "../../hooks/use-backend";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  index: number;
}

function StatCard({ icon, label, value, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass rounded-xl p-5 flex items-start gap-4"
      data-ocid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
        style={{ background: color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-display font-bold text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

const skeletonKeys = ["a", "b", "c", "d"] as const;

const quickActions = [
  {
    label: "Add New Project",
    icon: <Plus size={14} />,
    ocid: "qa-add-project",
  },
  {
    label: "View Contacts",
    icon: <Mail size={14} />,
    ocid: "qa-view-contacts",
  },
  {
    label: "Manage Files",
    icon: <FileText size={14} />,
    ocid: "qa-manage-files",
  },
  { label: "Testimonials", icon: <Users size={14} />, ocid: "qa-testimonials" },
];

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useAnalytics();

  const stats = [
    {
      icon: <FolderOpen size={18} className="text-primary-foreground" />,
      label: "Total Projects",
      value: analytics ? Number(analytics.projectCount) : "—",
      color:
        "linear-gradient(135deg, oklch(0.55 0.3 264), oklch(0.48 0.28 294))",
    },
    {
      icon: <Star size={18} className="text-primary-foreground" />,
      label: "Featured Projects",
      value: analytics ? Number(analytics.featuredCount) : "—",
      color:
        "linear-gradient(135deg, oklch(0.58 0.22 45), oklch(0.52 0.25 28))",
    },
    {
      icon: <Eye size={18} className="text-primary-foreground" />,
      label: "Total Views",
      value: analytics ? Number(analytics.totalViews).toLocaleString() : "—",
      color:
        "linear-gradient(135deg, oklch(0.42 0.25 120), oklch(0.38 0.22 150))",
    },
    {
      icon: <Mail size={18} className="text-primary-foreground" />,
      label: "Contact Messages",
      value: analytics ? Number(analytics.contactCount) : "—",
      color:
        "linear-gradient(135deg, oklch(0.48 0.28 294), oklch(0.42 0.26 310))",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-display font-bold text-foreground">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your portfolio performance
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? skeletonKeys.map((k) => (
              <div key={k} className="glass rounded-xl p-5">
                <Skeleton className="h-10 w-10 rounded-lg mb-3" />
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))
          : stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-primary" />
          <h3 className="font-display font-semibold text-foreground">
            Quick Actions
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              data-ocid={action.ocid}
              className="gap-1.5"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-xl p-5 border border-primary/20"
        style={{ background: "oklch(var(--primary) / 0.05)" }}
      >
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Tip:</span> Use the
          Projects tab to add detailed case studies. Upload supporting files in
          the Files tab, then link them to your projects for richer
          presentation.
        </p>
      </motion.div>
    </div>
  );
}
