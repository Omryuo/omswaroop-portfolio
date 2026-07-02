import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { research } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { CiteBlock } from "@/components/cite-block";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return research.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = research.find((x) => x.slug === slug);
  if (!r) return {};
  const description = r.abstract.slice(0, 180);
  return {
    title: r.title,
    description,
    alternates: { canonical: `/research/${r.slug}` },
    openGraph: {
      title: `${r.title} — ${site.name}`,
      description,
      url: `/research/${r.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${r.title} — ${site.name}`, description },
  };
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = research.findIndex((r) => r.slug === slug);
  if (idx === -1) notFound();

  const r = research[idx];
  const prev = research[(idx - 1 + research.length) % research.length];
  const next = research[(idx + 1) % research.length];

  return (
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <Link
        href="/research"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All research
      </Link>

      <Reveal>
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
            <span className="inline-flex items-center gap-2 text-muted">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />
              {r.status} · {r.year}
            </span>
            <span className="text-dim">{r.venue}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
            {r.title}
          </h1>
          <div className="mt-3 font-mono text-sm text-violet-bright">{r.authors}</div>
          <div className="mt-6">
            <a
              href={`https://doi.org/${r.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-line2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors hover:border-violet-bright hover:text-violet-bright"
            >
              Read on IEEE Xplore (DOI) <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </header>
      </Reveal>

      <Reveal>
        <section className="mt-10 border-t border-line py-10">
          <div className="font-mono text-[11px] uppercase tracking-[.2em] text-crimson">Abstract</div>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted">{r.abstract}</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-line py-10">
          <div className="font-mono text-[11px] uppercase tracking-[.2em] text-crimson">Cite this paper</div>
          <div className="mt-5 space-y-5">
            <CiteBlock label="BibTeX" text={r.bibtex} />
            <CiteBlock label="IEEE citation" text={r.citation} />
          </div>
          <p className="mt-4 font-mono text-[11px] text-dim">
            Author list and page numbers should be verified against the official IEEE Xplore record.
          </p>
        </section>
      </Reveal>

      <nav className="mt-6 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        <Link
          href={`/research/${prev.slug}`}
          className="group rounded-xl border border-line bg-surface/40 p-5 transition-colors hover:border-line2"
        >
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-dim">← Previous</div>
          <div className="mt-1 font-display text-sm font-semibold text-muted group-hover:text-ink">{prev.title}</div>
        </Link>
        <Link
          href={`/research/${next.slug}`}
          className="group rounded-xl border border-line bg-surface/40 p-5 text-right transition-colors hover:border-line2"
        >
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-dim">Next →</div>
          <div className="mt-1 font-display text-sm font-semibold text-muted group-hover:text-ink">{next.title}</div>
        </Link>
      </nav>

      <Reveal>
        <div className="mt-12 rounded-2xl border border-line bg-gradient-to-br from-crimson/10 to-violet/10 p-8 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight">Discuss the research?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Happy to go deeper on the method, results, or where it goes next.
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
