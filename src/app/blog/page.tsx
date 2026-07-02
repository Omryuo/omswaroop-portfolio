import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { Reveal } from "@/components/reveal";
import { BlogManager } from "@/components/blog-manager";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on detection engineering, SOC operations and AI security by Omswaroop T M.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Omswaroop T M",
    description: "Notes on detection engineering, SOC operations and AI security.",
    url: "/blog",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const storageMode: "github" | "filesystem" =
    process.env.GITHUB_TOKEN && process.env.GITHUB_REPO ? "github" : "filesystem";
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-ink mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
      </Link>
      <Reveal>
        <div className="mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[.2em] text-dim">Writing</div>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Field notes on detection engineering, SOC operations and AI security.
          </p>
        </div>
      </Reveal>

      <BlogManager initialPosts={posts} storageMode={storageMode} />
    </div>
  );
}

