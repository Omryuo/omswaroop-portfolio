import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 transition-all hover:-translate-y-1 hover:border-line2">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
        style={{ background: p.accent === "violet" ? "rgba(155,77,255,.18)" : "rgba(255,35,66,.18)" }}
      />
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-crimson-bright">
        <span>{p.category}</span>
        <span className="text-dim">{p.year}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-semibold leading-tight">{p.title}</h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{p.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span key={t} className="rounded border border-line2 px-2.5 py-1 font-mono text-[11px] text-muted">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link
          href={`/projects/${p.slug}`}
          className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-crimson-bright transition-colors hover:text-ink"
        >
          Case study <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {p.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-violet-bright transition-colors hover:text-crimson-bright"
          >
            {l.label} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </article>
  );
}
