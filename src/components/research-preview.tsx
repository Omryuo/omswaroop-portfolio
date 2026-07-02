import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { PublicationCard } from "./publication-card";
import { research } from "@/lib/data";

export function ResearchPreview() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading num="03" label="Publications" title="Research" />
      <div className="space-y-4">
        {research.map((r) => (
          <Reveal key={r.slug}>
            <PublicationCard r={r} />
          </Reveal>
        ))}
      </div>
      <Reveal>
        <Link
          href="/research"
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-bright transition-colors hover:text-crimson-bright"
        >
          View all research <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Reveal>
    </section>
  );
}
