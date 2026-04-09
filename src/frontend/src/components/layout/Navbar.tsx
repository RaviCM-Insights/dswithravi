import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { Download, Menu, Moon, Shield, Sun, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { useTheme } from "../../hooks/use-theme";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Live Demos", href: "#demos" },
  { label: "Why Me", href: "#why-me" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(href: string) {
  if (href.startsWith("#")) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
      data-ocid="navbar"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg glass neon-border flex items-center justify-center shrink-0">
            <span className="text-xs font-display font-bold gradient-text">
              DS
            </span>
          </div>
          <span className="font-display font-bold text-lg gradient-text hidden sm:block">
            DSWithRavi
          </span>
        </Link>

        {/* Desktop nav links */}
        {isHome && (
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className="px-3 py-1.5 text-sm text-muted-foreground rounded-md transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{}}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(var(--foreground))";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(var(--muted) / 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "";
                  }}
                  data-ocid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Resume download */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-1.5 text-xs"
            asChild
            data-ocid="resume-download"
          >
            <a href="/assets/resume.pdf" download="Ravi_Resume.pdf">
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            data-ocid="theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>

          {/* Admin link */}
          {isAdmin && (
            <Button variant="ghost" size="icon" asChild data-ocid="admin-link">
              <Link to="/admin">
                <Shield className="w-4 h-4 text-primary" />
              </Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="mobile-menu-toggle"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && isHome && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="lg:hidden glass border-t border-border/20 px-4 py-3"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection(link.href);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-muted-foreground rounded-md transition-smooth"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(var(--foreground))";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(var(--muted) / 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "";
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <a
                href="/assets/resume.pdf"
                download="Ravi_Resume.pdf"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground rounded-md"
              >
                <Download className="w-3.5 h-3.5" /> Resume
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
