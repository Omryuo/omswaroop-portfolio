import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { research } from "@/lib/data";
import { PublicationCard } from "@/components/publication-card";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Peer-reviewed IEEE publications by Omswaroop T M — efficient deep learning and applied machine learning, with abstracts and citations.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research — Omswaroop T M",
    description: "IEEE publications with abstracts, BibTeX and citations.",
    url: "/research",
  },
};

export default function ResearchIndex() {
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
          <div className="font-mono text-[11px] uppercase tracking-[.2em] text-dim">Publications</div>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Research</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Peer-reviewed IEEE work in efficient deep learning and applied machine learning. Each
            entry has the abstract plus ready-to-paste BibTeX and citation.
          </p>
        </div>
      </Reveal>
      <div className="space-y-4">
        {research.map((r, i) => (
          <Reveal key={r.slug} delay={i * 0.05}>
            <PublicationCard r={r} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
