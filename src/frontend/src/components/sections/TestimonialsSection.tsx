import { ScrollReveal } from "@/components/ScrollReveal";
import { Skeleton } from "@/components/ui/skeleton";
import { useTestimonials } from "@/hooks/use-backend";
import type { Testimonial } from "@/types";
import { Quote } from "lucide-react";
import { motion } from "motion/react";

const FALLBACK_TESTIMONIALS: Omit<Testimonial, "id" | "approved">[] = [
  {
    name: "Sarah Chen",
    role: "Senior Data Engineer",
    company: "DataFlow Inc.",
    quote:
      "Ravi's ability to transform messy datasets into clean, actionable dashboards is truly impressive. His Power BI reports cut our reporting time by 60%.",
    imageUrl: undefined,
  },
  {
    name: "Marcus Johnson",
    role: "Head of Analytics",
    company: "TechVentures Co.",
    quote:
      "One of the sharpest data scientists I've worked with. Ravi delivered a churn prediction model with 94% accuracy that directly impacted our retention strategy.",
    imageUrl: undefined,
  },
  {
    name: "Priya Nair",
    role: "ML Engineering Lead",
    company: "AI Startup Hub",
    quote:
      "Ravi's code is clean, well-documented, and production-ready. His machine learning pipeline went live in record time with zero issues.",
    imageUrl: undefined,
  },
];

function Avatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
        style={{ border: "2px solid oklch(0.55 0.3 264 / 0.4)" }}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.55 0.3 264), oklch(0.48 0.28 294))",
        color: "white",
      }}
    >
      {initials}
    </div>
  );
}

function TestimonialCard({
  item,
  index,
}: {
  item: Omit<Testimonial, "id" | "approved">;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      data-ocid={`testimonial-card-${index}`}
      className="glass-hover rounded-2xl p-7 flex flex-col gap-5"
    >
      <div className="flex items-start justify-between">
        <Quote
          className="w-8 h-8 flex-shrink-0"
          style={{ color: "oklch(0.55 0.3 264 / 0.5)" }}
        />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={`star-${item.name}-${i}`}
              style={{ color: "oklch(0.7 0.25 80)" }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed text-sm flex-1 italic">
        "{item.quote}"
      </p>
      <div
        className="flex items-center gap-3 pt-2 border-t"
        style={{ borderColor: "oklch(var(--border) / 0.2)" }}
      >
        <Avatar name={item.name} imageUrl={item.imageUrl} />
        <div>
          <div className="font-semibold text-foreground text-sm">
            {item.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {item.role} · {item.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      data-ocid={`testimonial-skeleton-${index}`}
      className="glass rounded-2xl p-7 flex flex-col gap-5"
    >
      <Skeleton className="w-8 h-8 rounded" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useTestimonials();

  const displayItems: Omit<Testimonial, "id" | "approved">[] =
    testimonials && testimonials.length > 0
      ? testimonials.filter((t) => t.approved)
      : FALLBACK_TESTIMONIALS;

  return (
    <section
      id="testimonials"
      className="py-24 relative overflow-hidden"
      style={{ background: "oklch(0.1 0 0)" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.55 0.3 264 / 0.04)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: "oklch(0.65 0.25 264)" }}
          >
            What people say
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
            <span className="gradient-text">Testimonials</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? (["a", "b", "c"] as const).map((key, i) => (
                <SkeletonCard key={key} index={i} />
              ))
            : displayItems.map((item, i) => (
                <TestimonialCard key={item.name} item={item} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
