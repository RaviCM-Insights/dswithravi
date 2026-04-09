import { ScrollReveal } from "@/components/ScrollReveal";
import { BarChart2, Brain, Code2, Database, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface HireCard {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const CARDS: HireCard[] = [
  {
    icon: Brain,
    title: "Problem-Solving Mindset",
    description:
      "I approach every dataset as a puzzle. I break complex business questions into structured analytical frameworks to find the right solution.",
    color: "oklch(0.65 0.28 264)",
  },
  {
    icon: Database,
    title: "Real-World Datasets",
    description:
      "Extensive experience with messy, large-scale production data — from financial transactions to customer behavior to healthcare records.",
    color: "oklch(0.6 0.28 294)",
  },
  {
    icon: BarChart2,
    title: "Data Storytelling",
    description:
      "I translate statistical models and raw numbers into compelling visual narratives that non-technical stakeholders can act on immediately.",
    color: "oklch(0.65 0.25 220)",
  },
  {
    icon: Code2,
    title: "Production-Ready Code",
    description:
      "Clean, documented, and tested Python code that doesn't just work in notebooks — it runs reliably in production environments.",
    color: "oklch(0.62 0.26 270)",
  },
  {
    icon: Lightbulb,
    title: "Data → Insights",
    description:
      "I go beyond reporting metrics. I connect data patterns to business outcomes, uncovering the 'why' behind the numbers.",
    color: "oklch(0.68 0.24 300)",
  },
];

function HireCard({ card, index }: { card: HireCard; index: number }) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      data-ocid={`hire-card-${index}`}
      className="glass-hover rounded-2xl p-7 flex flex-col gap-4 cursor-default"
      style={{
        boxShadow: `0 0 0 1px oklch(${card.color} / 0.15), 0 0 30px ${card.color} / 0.06)`,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: `${card.color}1a`,
          border: `1px solid ${card.color}40`,
          boxShadow: `0 0 16px ${card.color}26`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: card.color }} />
      </div>
      <h3 className="text-lg font-display font-semibold text-foreground">
        {card.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {card.description}
      </p>
    </motion.div>
  );
}

export function RecruiterHookSection() {
  return (
    <section
      id="why-hire-me"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.1 0 0) 0%, oklch(0.09 0.015 264) 50%, oklch(0.1 0 0) 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.55 0.3 264 / 0.08)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.48 0.28 294 / 0.08)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: "oklch(0.65 0.25 264)" }}
          >
            Why choose me
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
            Why <span className="gradient-text">Hire Me?</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            I don't just crunch numbers — I deliver solutions that create
            measurable business value.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <HireCard key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* CTA banner */}
        <ScrollReveal delay={0.5} className="mt-14">
          <div
            className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.3 264 / 0.12), oklch(0.48 0.28 294 / 0.12))",
              border: "1px solid oklch(0.55 0.3 264 / 0.25)",
              boxShadow: "0 0 40px oklch(0.55 0.3 264 / 0.1)",
            }}
          >
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              Ready to turn your data into decisions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Let's build something impactful together.
            </p>
            <button
              type="button"
              data-ocid="recruiter-hook-cta"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-smooth"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.3 264), oklch(0.48 0.28 294))",
                color: "white",
                boxShadow: "0 0 24px oklch(0.55 0.3 264 / 0.4)",
              }}
            >
              Let's Talk
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
