import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostSlugs, getPostSource, getPostMeta, formatDate } from "@/lib/blog";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

type Frontmatter = { title: string; date: string; excerpt: string; tags?: string[] };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) return {};
  const m = getPostMeta(slug);
  return {
    title: m.title,
    description: m.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${m.title} — ${site.name}`,
      description: m.excerpt,
      url: `/blog/${slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${m.title} — ${site.name}`, description: m.excerpt },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) notFound();

  const meta = getPostMeta(slug);
  const { content } = await compileMDX<Frontmatter>({
    source: getPostSource(slug),
    options: { parseFrontmatter: true },
  });

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All posts
      </Link>

      <Reveal>
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-dim">
            <span>{formatDate(meta.date)}</span>
            <span>·</span>
            <span>{meta.readingTime}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            {meta.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.tags.map((t) => (
              <span key={t} className="rounded border border-line2 px-2.5 py-1 font-mono text-[11px] text-muted">
                {t}
              </span>
            ))}
          </div>
        </header>
      </Reveal>

      <div className="prose prose-invert mt-10 max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-violet-bright prose-a:no-underline hover:prose-a:text-crimson-bright prose-strong:text-ink prose-blockquote:border-l-crimson prose-blockquote:text-dim prose-code:text-crimson-bright">
        {content}
      </div>
    </article>
  );
}
