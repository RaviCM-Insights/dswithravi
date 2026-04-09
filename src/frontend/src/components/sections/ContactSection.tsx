import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact } from "@/hooks/use-backend";
import type { ContactInput } from "@/types";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/dswithravi",
    username: "@dswithravi",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/dswithravi",
    username: "DSWithRavi",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:ravi@dswithravi.tech",
    username: "ravi@dswithravi.tech",
  },
];

export function ContactSection() {
  const { mutateAsync: submitContact, isPending } = useSubmitContact();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>();

  const onSubmit = async (data: ContactInput) => {
    try {
      await submitContact(data);
      toast.success("Message sent! I'll get back to you soon. 🚀");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      style={{
        background: "oklch(0.09 0.01 264)",
        borderTop: "1px solid oklch(0.55 0.3 264 / 0.2)",
        boxShadow: "inset 0 1px 0 oklch(0.55 0.3 264 / 0.1)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.55 0.3 264 / 0.6), oklch(0.48 0.28 294 / 0.6), transparent)",
        }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.55 0.3 264 / 0.07)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: "oklch(0.65 0.25 264)" }}
          >
            Get in touch
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Have a project in mind or want to discuss data science
            opportunities? Drop me a message!
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Social links */}
          <ScrollReveal
            direction="left"
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div
              className="glass rounded-2xl p-7 space-y-5"
              style={{ boxShadow: "0 0 30px oklch(0.55 0.3 264 / 0.08)" }}
            >
              <h3 className="text-xl font-display font-semibold text-foreground">
                Find me on
              </h3>
              <div className="space-y-4">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href, username }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`contact-social-${label.toLowerCase()}`}
                    className="flex items-center gap-4 p-3 rounded-xl transition-smooth group"
                    style={{ background: "oklch(var(--muted) / 0.5)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: "oklch(0.55 0.3 264 / 0.12)",
                        border: "1px solid oklch(0.55 0.3 264 / 0.25)",
                      }}
                    >
                      <Icon
                        className="w-5 h-5 transition-smooth group-hover:scale-110"
                        style={{ color: "oklch(0.7 0.25 264)" }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {username}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div
              className="glass rounded-2xl p-6 text-center"
              style={{
                background: "oklch(0.55 0.3 264 / 0.06)",
                border: "1px solid oklch(0.55 0.3 264 / 0.2)",
              }}
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-3"
                style={{
                  background: "oklch(0.65 0.25 145)",
                  boxShadow: "0 0 10px oklch(0.65 0.25 145 / 0.6)",
                }}
              />
              <p className="text-sm font-medium text-foreground">
                Available for freelance & full-time
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Response within 24 hours
              </p>
            </div>
          </ScrollReveal>

          {/* Contact form */}
          <ScrollReveal direction="right" delay={0.1} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass rounded-2xl p-8 space-y-5"
              style={{ boxShadow: "0 0 40px oklch(0.48 0.28 294 / 0.08)" }}
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    data-ocid="contact-input-name"
                    placeholder="Your name"
                    className="rounded-xl"
                    style={{
                      background: "oklch(var(--input))",
                      borderColor: errors.name
                        ? "oklch(0.55 0.28 28)"
                        : "oklch(var(--border) / 0.5)",
                    }}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.25 28)" }}
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    data-ocid="contact-input-email"
                    placeholder="your@email.com"
                    className="rounded-xl"
                    style={{
                      background: "oklch(var(--input))",
                      borderColor: errors.email
                        ? "oklch(0.55 0.28 28)"
                        : "oklch(var(--border) / 0.5)",
                    }}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.25 28)" }}
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-sm font-medium text-foreground"
                >
                  Subject
                </Label>
                <Input
                  id="subject"
                  data-ocid="contact-input-subject"
                  placeholder="What's this about?"
                  className="rounded-xl"
                  style={{
                    background: "oklch(var(--input))",
                    borderColor: errors.subject
                      ? "oklch(0.55 0.28 28)"
                      : "oklch(var(--border) / 0.5)",
                  }}
                  {...register("subject", { required: "Subject is required" })}
                />
                {errors.subject && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.25 28)" }}
                  >
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  data-ocid="contact-input-message"
                  placeholder="Tell me about your project or opportunity..."
                  rows={5}
                  className="rounded-xl resize-none"
                  style={{
                    background: "oklch(var(--input))",
                    borderColor: errors.message
                      ? "oklch(0.55 0.28 28)"
                      : "oklch(var(--border) / 0.5)",
                  }}
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message too short (min 10 chars)",
                    },
                  })}
                />
                {errors.message && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.25 28)" }}
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                data-ocid="contact-submit"
                disabled={isPending}
                className="w-full rounded-xl py-3 font-semibold transition-smooth"
                style={{
                  background: isPending
                    ? "oklch(0.3 0 0)"
                    : "linear-gradient(135deg, oklch(0.55 0.3 264), oklch(0.48 0.28 294))",
                  border: "none",
                  color: "white",
                  boxShadow: isPending
                    ? "none"
                    : "0 0 20px oklch(0.55 0.3 264 / 0.35)",
                }}
              >
                {isPending ? (
                  "Sending..."
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
