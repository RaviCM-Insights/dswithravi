import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AdminContacts from "../components/admin/AdminContacts";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminProjects from "../components/admin/AdminProjects";
import AdminTestimonials from "../components/admin/AdminTestimonials";
import FileUpload from "../components/admin/FileUpload";
import { useAuth } from "../hooks/use-auth";

type AdminTab =
  | "dashboard"
  | "projects"
  | "files"
  | "testimonials"
  | "contacts";

const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "projects", label: "Projects", icon: <FolderOpen size={16} /> },
  { id: "files", label: "Files", icon: <Upload size={16} /> },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: <MessageSquare size={16} />,
  },
  { id: "contacts", label: "Contacts", icon: <Mail size={16} /> },
];

export default function AdminPage() {
  const { isAuthenticated, isAdmin, login, logout, loginStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-10 max-w-md w-full text-center space-y-6"
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full mx-auto"
            style={{ background: "var(--gradient-primary)" }}
          >
            <ShieldAlert size={28} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in with Internet Identity to access the admin panel.
            </p>
          </div>
          <Button
            data-ocid="admin-login-btn"
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            className="w-full"
            style={{ background: "var(--gradient-primary)" }}
          >
            <LogIn size={16} className="mr-2" />
            {loginStatus === "logging-in"
              ? "Connecting…"
              : "Sign in with Internet Identity"}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-10 max-w-md w-full text-center space-y-6"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto bg-destructive/20">
            <ShieldAlert size={28} className="text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Not Authorized
            </h1>
            <p className="text-muted-foreground text-sm">
              Your account does not have admin privileges for this portfolio.
            </p>
          </div>
          <Button variant="outline" onClick={() => logout()} className="w-full">
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold gradient-text">
            DSWithRavi Admin
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Portfolio Management Panel
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          data-ocid="admin-logout-btn"
        >
          <LogOut size={14} className="mr-1.5" />
          Sign Out
        </Button>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar Nav */}
        <nav
          className="w-56 bg-card border-r border-border p-4 space-y-1 flex-shrink-0"
          data-ocid="admin-sidebar"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-ocid={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                activeTab === tab.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              style={
                activeTab === tab.id
                  ? { background: "var(--gradient-primary)" }
                  : {}
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === "dashboard" && <AdminDashboard />}
              {activeTab === "projects" && <AdminProjects />}
              {activeTab === "files" && <FileUpload />}
              {activeTab === "testimonials" && <AdminTestimonials />}
              {activeTab === "contacts" && <AdminContacts />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
