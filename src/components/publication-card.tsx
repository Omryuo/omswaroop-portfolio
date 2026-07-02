import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Publication } from "@/lib/data";

export function PublicationCard({ r }: { r: Publication }) {
  return (
    <article className="rounded-2xl border border-line bg-surface/50 p-6">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
        <span className="inline-flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />
          {r.status} · {r.year}
        </span>
        <span className="text-dim">{r.venue}</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold leading-snug">{r.title}</h3>
      <div className="mt-1 font-mono text-xs text-violet-bright">{r.authors}</div>
      <p className="mt-3 line-clamp-3 max-w-3xl text-[15px] text-muted">{r.abstract}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link
          href={`/research/${r.slug}`}
          className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-crimson-bright transition-colors hover:text-ink"
        >
          Read &amp; cite <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <a
          href={`https://doi.org/${r.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-violet-bright transition-colors hover:text-crimson-bright"
        >
          DOI <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
