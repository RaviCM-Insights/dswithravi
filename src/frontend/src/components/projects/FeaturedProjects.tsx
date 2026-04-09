import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedProjects } from "@/hooks/use-backend";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { ProjectCard } from "./ProjectCard";

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl overflow-hidden glass">
          <Skeleton className="h-52 w-full" />
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

export function FeaturedProjects() {
  const { data: projects, isLoading } = useFeaturedProjects();

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-7 w-48" />
        </div>
        <FeaturedSkeleton />
      </section>
    );
  }

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-8" data-ocid="featured-projects">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-6"
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{
            background: "oklch(var(--primary) / 0.15)",
            border: "1px solid oklch(var(--primary) / 0.4)",
            color: "oklch(var(--primary))",
          }}
        >
          <Star className="size-4 fill-current" />
          Top Case Studies
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, oklch(var(--primary) / 0.4), transparent)",
          }}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id.toString()}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ProjectCard project={project} featured />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
