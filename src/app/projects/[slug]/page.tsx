import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { Pipeline } from "@/components/pipeline";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const description = p.study?.tagline ?? p.summary;
  return {
    title: p.title,
    description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      title: `${p.title} — ${site.name}`,
      description,
      url: `/projects/${p.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${p.title} — ${site.name}`, description },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="border-t border-line py-10">
        <div className="font-mono text-[11px] uppercase tracking-[.2em] text-crimson">{label}</div>
        <div className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted">{children}</div>
      </section>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();

  const p = projects[idx];
  const cs = p.study;
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All projects
      </Link>

      <Reveal>
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-crimson-bright">
            <span>{p.category}</span>
            <span className="text-dim">{p.year}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            {p.title}
          </h1>
          {cs && <p className="mt-4 max-w-2xl text-lg text-muted">{cs.tagline}</p>}
          {cs && <p className="mt-2 font-mono text-xs text-dim">{cs.context}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-line2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors hover:border-violet-bright hover:text-violet-bright"
              >
                {l.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </header>
      </Reveal>

      {cs?.metrics && (
        <Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {cs.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-line bg-surface/50 p-5 text-center">
                <div className="bg-gradient-to-r from-crimson-bright to-violet-bright bg-clip-text font-display text-2xl font-bold text-transparent">
                  {m.value}
                </div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-dim">{m.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {cs?.diagram && (
        <Reveal>
          <div className="mt-10">
            <Pipeline title={cs.diagram.title} stages={cs.diagram.stages} />
          </div>
        </Reveal>
      )}

      {cs && (
        <div className="mt-6">
          <Block label="The problem">{cs.problem}</Block>
          <Block label="The approach">{cs.approach}</Block>
          <Reveal>
            <section className="border-t border-line py-10">
              <div className="font-mono text-[11px] uppercase tracking-[.2em] text-crimson">What I built</div>
              <ul className="mt-4 max-w-3xl space-y-2.5">
                {cs.highlights.map((h, i) => (
                  <li key={i} className="relative pl-5 text-[15px] leading-relaxed text-muted">
                    <span className="absolute left-0 text-crimson">▹</span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
          <Block label="Outcome">{cs.outcome}</Block>
        </div>
      )}

      <Reveal>
        <section className="border-t border-line py-10">
          <div className="font-mono text-[11px] uppercase tracking-[.2em] text-crimson">Tech</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(cs?.stack ?? p.tags).map((t) => (
              <span
                key={t}
                className="rounded-md border border-line2 bg-surface px-3 py-1.5 font-mono text-[12.5px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      <nav className="mt-6 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        <Link
          href={`/projects/${prev.slug}`}
          className="group rounded-xl border border-line bg-surface/40 p-5 transition-colors hover:border-line2"
        >
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-dim">← Previous</div>
          <div className="mt-1 font-display text-sm font-semibold text-muted group-hover:text-ink">{prev.title}</div>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="group rounded-xl border border-line bg-surface/40 p-5 text-right transition-colors hover:border-line2"
        >
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-dim">Next →</div>
          <div className="mt-1 font-display text-sm font-semibold text-muted group-hover:text-ink">{next.title}</div>
        </Link>
      </nav>

      <Reveal>
        <div className="mt-12 rounded-2xl border border-line bg-gradient-to-br from-crimson/10 to-violet/10 p-8 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight">Want the deeper walkthrough?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Happy to talk through the architecture, the trade-offs, and what I&apos;d do next.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-crimson to-violet px-6 py-3 font-mono text-sm uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </article>
  );
}
