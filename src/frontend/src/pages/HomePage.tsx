import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { RecruiterHookSection } from "@/components/sections/RecruiterHookSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <RecruiterHookSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
