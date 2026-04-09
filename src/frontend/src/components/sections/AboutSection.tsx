import { ScrollReveal } from "@/components/ScrollReveal";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const SKILLS = [
  { name: "Python", level: 90, icon: "🐍" },
  { name: "Machine Learning", level: 85, icon: "🤖" },
  { name: "Data Analysis", level: 88, icon: "📊" },
  { name: "Excel", level: 80, icon: "📗" },
  { name: "Power BI", level: 75, icon: "📈" },
];

function SkillBar({
  name,
  level,
  icon,
  index,
}: { name: string; level: number; icon: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span>{icon}</span>
          {name}
        </span>
        <motion.span
          className="text-sm font-mono"
          style={{ color: "oklch(0.75 0.25 264)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.12 + 0.4 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1.1,
            delay: index * 0.12,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden"
      style={{ background: "oklch(0.1 0 0)" }}
    >
      {/* Subtle background accent */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.48 0.28 294 / 0.06)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <ScrollReveal className="text-center mb-16">
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: "oklch(0.65 0.25 264)" }}
          >
            Get to know me
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
            About <span className="gradient-text">Me</span>
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Bio column */}
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <div
                className="glass rounded-2xl p-8 space-y-4"
                style={{ boxShadow: "0 0 40px oklch(0.55 0.3 264 / 0.08)" }}
              >
                <h3 className="text-2xl font-display font-semibold gradient-text">
                  Ravi — Data Scientist
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  I'm a passionate data scientist with a strong background in
                  transforming complex datasets into clear, actionable stories.
                  I specialize in building end-to-end ML pipelines — from raw
                  data ingestion to deployed predictive models — with a focus on
                  business impact.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With hands-on experience across Python, scikit-learn, and
                  modern data tools, I bring a problem-first mindset to every
                  project. Whether it's churn prediction, NLP, or interactive
                  dashboards, I love making data accessible and meaningful.
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "Pandas",
                  "scikit-learn",
                  "TensorFlow",
                  "SQL",
                  "Power BI",
                  "Tableau",
                  "NumPy",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full font-mono"
                    style={{
                      background: "oklch(0.55 0.3 264 / 0.1)",
                      border: "1px solid oklch(0.55 0.3 264 / 0.25)",
                      color: "oklch(0.75 0.22 264)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Skills column */}
          <ScrollReveal direction="right" delay={0.15}>
            <div
              className="glass rounded-2xl p-8 space-y-6"
              style={{ boxShadow: "0 0 40px oklch(0.48 0.28 294 / 0.08)" }}
            >
              <h3 className="text-xl font-display font-semibold text-foreground">
                Core Skills
              </h3>
              <div className="space-y-5">
                {SKILLS.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} index={i} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
