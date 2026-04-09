import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-backend";
import type { ProjectCategory } from "@/types";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { FeaturedProjects } from "../projects/FeaturedProjects";
import { ProjectCard } from "../projects/ProjectCard";

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Machine Learning",
  "Data Analysis",
  "NLP",
  "Visualization",
];

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-xl overflow-hidden glass">
          <Skeleton className="h-44 w-full" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");

  const filtered = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        activeCategory === "All" || p.tags.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [projects, search, activeCategory]);

  return (
    <section id="projects" className="py-20 px-4" data-ocid="projects-section">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "oklch(var(--primary))" }}
          >
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
            Projects & Case Studies
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real-world data science projects with deep case study breakdowns —
            from problem to insight.
          </p>
        </motion.div>

        {/* Featured projects */}
        <FeaturedProjects />

        {/* Divider */}
        <div className="my-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-sm font-medium text-muted-foreground px-3">
            All Projects
          </span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 glass"
              data-ocid="search-input"
            />
          </div>

          <fieldset
            className="flex flex-wrap gap-2"
            aria-label="Filter by category"
            style={{ border: "none", padding: 0, margin: 0 }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-smooth border ${
                  activeCategory === cat
                    ? "border-primary text-primary"
                    : "border-border/40 text-muted-foreground"
                }`}
                style={
                  activeCategory === cat
                    ? {
                        background: "oklch(var(--primary) / 0.15)",
                        boxShadow: "0 0 10px oklch(var(--primary) / 0.2)",
                      }
                    : {
                        background: "oklch(var(--card) / 0.4)",
                      }
                }
                data-ocid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </fieldset>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <GridSkeleton />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="empty-state"
          >
            <div
              className="size-20 rounded-full flex items-center justify-center mb-6 text-4xl"
              style={{
                background: "oklch(var(--primary) / 0.1)",
                border: "1px solid oklch(var(--primary) / 0.2)",
              }}
            >
              🔍
            </div>
            <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-6">
              {search
                ? `No results for "${search}".`
                : "No projects in this category yet."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-smooth"
              style={{
                background: "oklch(var(--primary) / 0.15)",
                border: "1px solid oklch(var(--primary) / 0.4)",
                color: "oklch(var(--primary))",
              }}
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, index) => (
              <motion.div
                key={project.id.toString()}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 6) * 0.07 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
