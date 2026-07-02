import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { ProjectCard } from "./project-card";
import { projects } from "@/lib/data";

export function FeaturedProjects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading num="02" label="Selected work" title="Featured projects" />
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
      <Reveal>
        <Link
          href="/projects"
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-bright transition-colors hover:text-crimson-bright"
        >
          View all projects <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Reveal>
    </section>
  );
}
