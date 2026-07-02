import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected cybersecurity and AI/ML projects by Omswaroop T M — case studies with architecture, approach and impact.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Omswaroop T M",
    description: "Cybersecurity and AI/ML case studies: architecture, approach and impact.",
    url: "/projects",
  },
};

export default function ProjectsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-ink mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
      </Link>
      <Reveal>
        <div className="mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[.2em] text-dim">Selected work</div>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Projects</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Case studies across security operations and machine-learning research — each with the
            architecture, the approach, and what came out of it.
          </p>
        </div>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
