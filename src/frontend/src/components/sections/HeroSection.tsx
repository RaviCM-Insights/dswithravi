import { Button } from "@/components/ui/button";
import { ChevronDown, Download } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const ROLES = [
  "Data Scientist",
  "ML Enthusiast",
  "Data Analyst",
  "AI Explorer",
];

function TypingText() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = ROLES[roleIndex];
    if (!deleting) {
      if (displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1));
      } else {
        setTimeout(() => setDeleting(true), 1800);
      }
    } else {
      if (displayed.length > 0) {
        setDisplayed(current.slice(0, displayed.length - 1));
      } else {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % ROLES.length);
      }
    }
  }, [displayed, deleting, roleIndex]);

  useEffect(() => {
    const speed = deleting ? 60 : 100;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, deleting]);

  return (
    <span className="gradient-text font-display font-bold">
      {displayed}
      <span className="animate-pulse ml-0.5 inline-block w-0.5 h-8 bg-primary align-middle" />
    </span>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: (i * 13.7) % 100,
    y: (i * 7.3) % 100,
    size: (i % 3) + 1,
    duration: (i % 6) + 4,
    delay: i % 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "oklch(0.55 0.3 264 / 0.6)",
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: p.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Glow orbs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "oklch(0.55 0.3 264 / 0.12)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "oklch(0.48 0.28 294 / 0.12)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{ background: "oklch(0.55 0.3 264 / 0.05)" }}
      />
    </div>
  );
}

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.08 0.02 264) 0%, oklch(0.1 0 0) 40%, oklch(0.09 0.02 294) 100%)",
      }}
    >
      <ParticleField />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.55 0.3 264 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.55 0.3 264 / 0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 py-20">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0"
        >
          <div className="relative">
            {/* Neon ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -inset-3 rounded-full"
              style={{
                background:
                  "conic-gradient(oklch(0.55 0.3 264), oklch(0.48 0.28 294), oklch(0.55 0.3 264 / 0.1), oklch(0.55 0.3 264))",
                padding: "2px",
              }}
            />
            <div
              className="relative w-52 h-52 lg:w-64 lg:h-64 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.16 0.06 264), oklch(0.12 0.04 294))",
                boxShadow:
                  "0 0 40px oklch(0.55 0.3 264 / 0.4), inset 0 0 40px oklch(0.55 0.3 264 / 0.1)",
              }}
            >
              {/* Avatar SVG placeholder */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Ravi's profile avatar"
                role="img"
              >
                <defs>
                  <linearGradient
                    id="avatarGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="oklch(0.55 0.3 264)" />
                    <stop offset="100%" stopColor="oklch(0.48 0.28 294)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="78"
                  r="36"
                  fill="url(#avatarGrad)"
                  opacity="0.9"
                />
                <ellipse
                  cx="100"
                  cy="155"
                  rx="55"
                  ry="40"
                  fill="url(#avatarGrad)"
                  opacity="0.7"
                />
              </svg>
            </div>
            {/* Status badge */}
            <div
              className="absolute bottom-3 right-3 glass rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-medium"
              style={{ border: "1px solid oklch(0.55 0.3 264 / 0.4)" }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "oklch(0.65 0.25 145)" }}
              />
              <span className="text-foreground/80">Open to Work</span>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span
              className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-4"
              style={{
                background: "oklch(0.55 0.3 264 / 0.12)",
                border: "1px solid oklch(0.55 0.3 264 / 0.3)",
                color: "oklch(0.75 0.25 264)",
              }}
            >
              👋 Welcome to my Portfolio
            </span>
            <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight text-foreground">
              Hi, I'm <span className="gradient-text">Ravi</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-2xl lg:text-3xl font-display min-h-[2.5rem] flex items-center justify-center lg:justify-start gap-2"
          >
            <TypingText />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-muted-foreground text-lg max-w-xl leading-relaxed"
          >
            Transforming raw data into actionable insights. Specializing in
            machine learning, predictive modeling, and data storytelling that
            drives real business decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            <Button
              data-ocid="hero-cta-projects"
              onClick={() => scrollTo("projects")}
              className="px-6 py-3 font-semibold rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.3 264), oklch(0.48 0.28 294))",
                boxShadow: "0 0 20px oklch(0.55 0.3 264 / 0.4)",
                border: "none",
                color: "white",
              }}
            >
              View My Work
            </Button>
            <Button
              data-ocid="hero-cta-contact"
              onClick={() => scrollTo("contact")}
              variant="outline"
              className="px-6 py-3 font-semibold rounded-xl transition-smooth"
              style={{
                borderColor: "oklch(0.55 0.3 264 / 0.5)",
                color: "oklch(0.75 0.25 264)",
                background: "transparent",
              }}
            >
              Contact Me
            </Button>
            <Button
              data-ocid="hero-cta-resume"
              variant="ghost"
              className="px-6 py-3 font-semibold rounded-xl transition-smooth"
              style={{ color: "oklch(0.65 0 0)" }}
              asChild
            >
              <a href="/resume.pdf" download>
                <Download className="w-4 h-4 mr-2" />
                Resume
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex gap-8 justify-center lg:justify-start pt-2"
          >
            {[
              { label: "Projects", value: "20+" },
              { label: "ML Models", value: "15+" },
              { label: "Datasets", value: "50+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-display font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        data-ocid="hero-scroll-down"
        onClick={() => scrollTo("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground cursor-pointer"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.button>
    </section>
  );
}
