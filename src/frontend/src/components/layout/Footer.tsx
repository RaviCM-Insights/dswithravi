import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/dswithravi" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/dswithravi",
  },
  { icon: Mail, label: "Email", href: "mailto:ravi@dswithravi.tech" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? window.location.hostname
      : "dswithravi.tech";

  return (
    <footer
      className="border-t border-border/30"
      style={{ background: "oklch(var(--card) / 0.6)" }}
    >
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-display font-bold text-lg gradient-text">
              DSWithRavi
            </span>
            <p className="text-xs text-muted-foreground">
              Data Scientist · ML Enthusiast
            </p>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground transition-smooth"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "oklch(var(--primary))";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "oklch(var(--primary) / 0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "";
                }}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary transition-smooth"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "";
              }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
