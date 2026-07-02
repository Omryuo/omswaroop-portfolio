import { Hero } from "@/components/hero";
import { Timeline } from "@/components/timeline";
import { FeaturedProjects } from "@/components/featured-projects";
import { ResearchPreview } from "@/components/research-preview";
import { Skills } from "@/components/skills";
import { ContactCta } from "@/components/contact-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Timeline />
      <FeaturedProjects />
      <ResearchPreview />
      <Skills />
      <ContactCta />
    </>
  );
}
