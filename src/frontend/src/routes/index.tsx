import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  ChevronRight,
  Code2,
  Eye,
  Filter,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { useProjects, useSubmitContact } from "../hooks/use-backend";
import type { ProjectCategory } from "../types";

// Route is registered in App.tsx via createRoute({ component: HomePage })

const TYPING_STRINGS = [
  "Data Scientist",
  "ML Enthusiast",
  "AI Builder",
  "Python Developer",
];

function TypingText() {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const current = TYPING_STRINGS[idx];
    const speed = deleting ? 60 : 110;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1600);
        } else {
          setCharIdx((c) => c + 1);
        }
      } else {
        setText(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % TYPING_STRINGS.length);
          setCharIdx(0);
        } else {
          setCharIdx((c) => c - 1);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx]);

  return (
    <span className="gradient-text font-bold">
      {text}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
}

const skills = [
  { name: "Python", pct: 92 },
  { name: "Machine Learning", pct: 88 },
  { name: "Data Analysis", pct: 90 },
  { name: "Excel / Power BI", pct: 85 },
  { name: "Deep Learning", pct: 78 },
  { name: "SQL & Databases", pct: 82 },
];

const whyHireItems = [
  {
    icon: Brain,
    title: "Problem-Solving Mindset",
    desc: "I break complex data problems into clear hypotheses and test them rigorously.",
  },
  {
    icon: BarChart3,
    title: "Real-World Datasets",
    desc: "Experience with messy, large-scale production datasets — not just clean Kaggle CSVs.",
  },
  {
    icon: Eye,
    title: "Data Storytelling",
    desc: "I turn raw numbers into narratives that drive business decisions.",
  },
  {
    icon: Code2,
    title: "Production-Ready Code",
    desc: "Clean, modular, well-documented Python with proper testing and version control.",
  },
  {
    icon: TrendingUp,
    title: "Insight-Driven",
    desc: "I prioritize business impact — every model I build has a clear ROI story.",
  },
  {
    icon: Target,
    title: "End-to-End Delivery",
    desc: "From data collection to deployed API — I own the full ML pipeline.",
  },
];

const stats = [
  { icon: Star, label: "Projects Completed", value: "20+" },
  { icon: BarChart3, label: "Models Deployed", value: "12+" },
  { icon: Users, label: "Datasets Processed", value: "50+" },
  { icon: Zap, label: "Years Experience", value: "4+" },
];

function AnimatedSkillBar({
  name,
  pct,
  delay,
}: { name: string; pct: number; delay: number }) {
  const [filled, setFilled] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onViewportEnter={() => setTimeout(() => setFilled(true), delay * 1000)}
      className="space-y-1.5"
    >
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{name}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill"
          style={{ width: filled ? `${pct}%` : "0%" }}
        />
      </div>
    </motion.div>
  );
}

function FeaturedProjectCard({
  project,
  index,
}: {
  project: {
    id: bigint;
    title: string;
    description: string;
    tags: string[];
    problemStatement: string;
  };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card
        className="glass-hover p-6 h-full flex flex-col gap-4 group cursor-pointer"
        data-ocid={`project-card-${project.id}`}
      >
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-smooth">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
        <Link
          to="/projects/$id"
          params={{ id: project.id.toString() }}
          className="flex items-center gap-1.5 text-sm text-primary font-medium"
        >
          View Case Study <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Card>
    </motion.div>
  );
}

const sampleFeatured = [
  {
    id: BigInt(1),
    title: "House Price Predictor",
    description:
      "End-to-end ML pipeline predicting housing prices with 94% accuracy using XGBoost.",
    tags: ["Machine Learning", "Python", "XGBoost"],
    problemStatement: "",
  },
  {
    id: BigInt(2),
    title: "Customer Churn Analysis",
    description:
      "Telecom churn prediction reducing customer loss by 23% through proactive interventions.",
    tags: ["Data Analysis", "Sklearn", "Tableau"],
    problemStatement: "",
  },
  {
    id: BigInt(3),
    title: "Sentiment NLP Dashboard",
    description:
      "Real-time Twitter sentiment analysis with interactive visualization dashboard.",
    tags: ["NLP", "BERT", "Streamlit"],
    problemStatement: "",
  },
];

export function HomePage() {
  const { data: allProjects } = useProjects();

  // Search + filter state
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");

  const CATEGORIES: ProjectCategory[] = [
    "All",
    "Machine Learning",
    "Data Analysis",
    "NLP",
    "Visualization",
  ];

  const projectPool =
    allProjects && allProjects.length > 0 ? allProjects : sampleFeatured;

  const filteredProjects = useMemo(() => {
    return projectPool.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        activeCategory === "All" ||
        p.tags.some((t) =>
          t.toLowerCase().includes(activeCategory.toLowerCase()),
        );
      return matchesSearch && matchesCategory;
    });
  }, [projectPool, search, activeCategory]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="w-full">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
        data-ocid="hero-section"
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.08] blur-3xl"
            style={{ background: "oklch(0.48 0.28 294 / 0.15)" }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mb-6 w-28 h-28 rounded-full neon-border overflow-hidden animate-pulse-glow"
          >
            <img
              src="/assets/generated/ravi-avatar.dim_200x200.png"
              alt="Ravi – Data Scientist"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-primary font-medium tracking-widest uppercase mb-3"
          >
            👋 Hi, I'm Ravi
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-4"
          >
            Data Scientist & <br className="hidden sm:block" />
            <TypingText />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Turning raw data into actionable insights. Building ML models that
            actually ship. Open to exciting data science opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="gap-2 animate-pulse-glow"
              style={{
                background: "var(--gradient-primary)",
                border: "none",
                color: "oklch(var(--foreground))",
              }}
              onClick={() => scrollTo("projects")}
              data-ocid="hero-cta-projects"
            >
              View Projects <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => scrollTo("contact")}
              data-ocid="hero-cta-contact"
            >
              Get In Touch <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section
        className="py-12 border-y border-border/20"
        style={{ background: "oklch(var(--card) / 0.4)" }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, label, value }, i) => (
              <ScrollReveal key={label} delay={i * 0.1} variant="scaleIn">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-2xl font-display font-bold gradient-text">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT + SKILLS ───────────────────────────────────────────── */}
      <section
        id="about"
        className="py-20 bg-background"
        data-ocid="about-section"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* About */}
            <div>
              <ScrollReveal variant="slideRight">
                <Badge
                  variant="outline"
                  className="mb-4 text-primary border-primary/30"
                >
                  About Me
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
                  Passionate about turning{" "}
                  <span className="gradient-text">data into decisions</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I'm a data scientist with 4+ years of experience working
                    with Python, ML frameworks, and business intelligence tools.
                    I specialize in building end-to-end machine learning
                    pipelines — from raw data ingestion to deployed production
                    models.
                  </p>
                  <p>
                    My work spans predictive analytics, natural language
                    processing, and interactive dashboards. I believe the best
                    models are useless without clear communication — so I invest
                    heavily in data storytelling.
                  </p>
                  <p>
                    Currently exploring MLOps, LLM fine-tuning, and real-time
                    data pipelines.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Skills */}
            <div id="skills" data-ocid="skills-section">
              <ScrollReveal variant="slideLeft">
                <Badge
                  variant="outline"
                  className="mb-4 text-primary border-primary/30"
                >
                  Skills
                </Badge>
                <h2 className="text-3xl font-display font-bold text-foreground mb-8">
                  Technical <span className="gradient-text">Expertise</span>
                </h2>
              </ScrollReveal>
              <div className="space-y-5">
                {skills.map((skill, i) => (
                  <AnimatedSkillBar
                    key={skill.name}
                    {...skill}
                    delay={i * 0.08}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ────────────────────────────────────────── */}
      <section
        id="projects"
        className="py-20"
        style={{ background: "oklch(var(--muted) / 0.15)" }}
        data-ocid="projects-section"
      >
        <div className="container mx-auto px-4">
          <ScrollReveal variant="fadeIn" className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary/30"
            >
              Portfolio
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Featured <span className="gradient-text">Case Studies</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Deep-dive projects with full problem-to-insight breakdowns,
              interactive charts, and live demos.
            </p>
          </ScrollReveal>

          {/* Search + Filter */}
          <ScrollReveal variant="fadeIn" className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects by title, description, or tag…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-input border-border/50"
                  data-ocid="project-search"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                      activeCategory === cat
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={
                      activeCategory === cat
                        ? { background: "var(--gradient-primary)" }
                        : {
                            background: "oklch(var(--muted) / 0.5)",
                            border: "1px solid oklch(var(--border) / 0.4)",
                          }
                    }
                    data-ocid={`filter-${cat.toLowerCase().replace(/ /g, "-")}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Showing{" "}
              <span className="text-primary font-medium">
                {filteredProjects.length}
              </span>{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
              {activeCategory !== "All" && (
                <span>
                  {" "}
                  in <em>{activeCategory}</em>
                </span>
              )}
              {search.trim() !== "" && (
                <span>
                  {" "}
                  matching "<em>{search}</em>"
                </span>
              )}
            </p>
          </ScrollReveal>

          {filteredProjects.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="projects-no-results"
            >
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No projects match your search.</p>
              <button
                type="button"
                className="mt-3 text-sm text-primary underline"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredProjects.map((p, i) => (
                <FeaturedProjectCard
                  key={p.id.toString()}
                  project={p}
                  index={i}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              asChild
              data-ocid="view-all-projects"
            >
              <Link to="/" onClick={() => scrollTo("projects")}>
                Browse All Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMOS ───────────────────────────────────────────────── */}
      <section
        id="demos"
        className="py-20 bg-background"
        data-ocid="demos-section"
      >
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary/30"
            >
              Interactive
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Live Project <span className="gradient-text">Demos</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Try real ML predictions and interactive dashboards — no setup
              required.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal variant="slideRight">
              <Card
                className="glass p-8 flex flex-col gap-4 neon-border"
                data-ocid="demo-house-price"
              >
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  House Price Predictor
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Input property features and get an instant price estimate
                  powered by our XGBoost model trained on 50K+ real estate
                  transactions.
                </p>
                <div className="flex gap-3 flex-wrap">
                  {["XGBoost", "Python", "Sklearn"].map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                <Button
                  className="self-start gap-2"
                  style={{
                    background: "var(--gradient-primary)",
                    border: "none",
                  }}
                  onClick={() =>
                    toast.info("Live demo coming soon! Check back soon.")
                  }
                  data-ocid="demo-house-btn"
                >
                  Try Demo <ChevronRight className="w-4 h-4" />
                </Button>
              </Card>
            </ScrollReveal>

            <ScrollReveal variant="slideLeft">
              <Card
                className="glass p-8 flex flex-col gap-4 neon-border"
                data-ocid="demo-sales-dashboard"
              >
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  Sales Analytics Dashboard
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Explore interactive sales data with real-time filters, trend
                  analysis, and regional breakdowns across multiple product
                  categories.
                </p>
                <div className="flex gap-3 flex-wrap">
                  {["Recharts", "Python", "Pandas"].map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="self-start gap-2"
                  onClick={() =>
                    toast.info("Live demo coming soon! Check back soon.")
                  }
                  data-ocid="demo-sales-btn"
                >
                  Explore Dashboard <BarChart3 className="w-4 h-4" />
                </Button>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── WHY HIRE ME ──────────────────────────────────────────────── */}
      <section
        id="why-me"
        className="py-20"
        style={{ background: "oklch(var(--card) / 0.3)" }}
        data-ocid="why-hire-section"
      >
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary/30"
            >
              Recruiter Spotlight
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Why Hire <span className="gradient-text">Me?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six reasons why data teams choose Ravi for their next data science
              challenge.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyHireItems.map(({ icon: Icon, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.08} variant="scaleIn">
                <Card
                  className="glass-hover p-6 flex flex-col gap-4 group"
                  data-ocid={`why-card-${i}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-smooth"
                    style={{
                      background: "oklch(var(--primary) / 0.1)",
                      border: "1px solid oklch(var(--primary) / 0.2)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-smooth">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-20 bg-background"
        data-ocid="contact-section"
      >
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <ScrollReveal>
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary/30"
            >
              Contact
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Let's <span className="gradient-text">Work Together</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Open to full-time roles, freelance data science projects, and
              consulting. Drop a message and I'll respond within 24 hours.
            </p>
            <Button
              size="lg"
              className="gap-2"
              style={{
                background: "var(--gradient-primary)",
                border: "none",
                color: "oklch(var(--foreground))",
              }}
              onClick={() => {
                const el = document.getElementById("contact-form");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              data-ocid="contact-cta"
            >
              Send a Message <ArrowRight className="w-4 h-4" />
            </Button>
          </ScrollReveal>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </section>
    </div>
  );
}

function ContactForm() {
  const submitContact = useSubmitContact();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    try {
      await submitContact.mutateAsync(form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      // silent
    }
  };

  return (
    <div id="contact-form" className="container mx-auto px-4 max-w-xl mt-12">
      <ScrollReveal>
        <Card className="glass p-8">
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Message Sent!
              </h3>
              <p className="text-muted-foreground text-sm">
                I'll get back to you within 24 hours.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSent(false)}
              >
                Send Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                    data-ocid="contact-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                    data-ocid="contact-email"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-foreground"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's it about?"
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                  data-ocid="contact-subject"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell me about your project or opportunity…"
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
                  data-ocid="contact-message"
                />
              </div>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={submitContact.isPending}
                style={{
                  background: "var(--gradient-primary)",
                  border: "none",
                  color: "oklch(var(--foreground))",
                }}
                data-ocid="contact-submit"
              >
                {submitContact.isPending ? "Sending…" : "Send Message"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
        </Card>
      </ScrollReveal>
    </div>
  );
}
