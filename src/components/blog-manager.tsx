"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Trash2, Plus, Key, X, Lock, AlertTriangle, GitBranch } from "lucide-react";
import { Reveal } from "./reveal";
import { createPostAction, deletePostAction, verifyPasscodeAction } from "@/app/blog/actions";

type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
};

type BlogManagerProps = {
  initialPosts: PostMeta[];
  storageMode?: "github" | "filesystem";
};

export function BlogManager({ initialPosts, storageMode = "filesystem" }: BlogManagerProps) {
  const [posts, setPosts] = useState<PostMeta[]>(initialPosts);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInput, setAuthInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  // Client-safe Date formatter
  const formatDateClient = (iso: string): string => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (!slug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 50)
      );
    }
  }, [title, slug]);

  // Load admin session on mount
  useEffect(() => {
    const saved = localStorage.getItem("blog_admin_passcode");
    if (saved) {
      verifyPasscodeAction(saved).then((res) => {
        if (res.success) {
          setPasscode(saved);
          setIsAdmin(true);
        } else {
          localStorage.removeItem("blog_admin_passcode");
        }
      });
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await verifyPasscodeAction(authInput);
    if (res.success) {
      setPasscode(authInput);
      setIsAdmin(true);
      localStorage.setItem("blog_admin_passcode", authInput);
      setShowAuthModal(false);
      setAuthInput("");
    } else {
      setAuthError("Invalid passcode.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPasscode("");
    localStorage.removeItem("blog_admin_passcode");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setIsSubmitting(true);

    const cleanTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const postData = {
      title,
      slug,
      date: date || new Date().toISOString().split("T")[0],
      excerpt,
      tags: cleanTags,
      content,
    };

    const res = await createPostAction(passcode, postData);
    setIsSubmitting(false);

    if (res.success) {
      // Optimistic update
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      const newPost: PostMeta = {
        slug,
        title,
        date: postData.date,
        excerpt,
        tags: cleanTags,
        readingTime: `${Math.max(1, Math.round(words / 200))} min read`,
      };
      setPosts([newPost, ...posts].sort((a, b) => (a.date < b.date ? 1 : -1)));

      // Reset form & close
      setTitle("");
      setSlug("");
      setDate("");
      setExcerpt("");
      setTags("");
      setContent("");
      setShowCreateModal(false);
    } else {
      setCreateError(res.error || "Failed to create post.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, postSlug: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete post "${postSlug}"?`)) {
      return;
    }

    const res = await deletePostAction(passcode, postSlug);
    if (res.success) {
      setPosts(posts.filter((p) => p.slug !== postSlug));
    } else {
      alert(res.error || "Failed to delete post.");
    }
  };

  return (
    <div>
      {/* Admin Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface2/40 p-4">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
          <Lock className="h-3.5 w-3.5" />
          <span>Author Tools</span>
          <span>·</span>
          <span className={isAdmin ? "text-crimson-bright font-bold" : "text-dim"}>
            {isAdmin ? "Admin Mode Active" : "ReadOnly Mode"}
          </span>
        </div>

        <div className="flex gap-3">
          {isAdmin ? (
            <>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-crimson to-violet px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5"
              >
                <Plus className="h-3.5 w-3.5" /> New Post
              </button>
              <button
                onClick={handleLogout}
                className="rounded border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-dim hover:border-line2 hover:text-ink"
              >
                Exit
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-1.5 rounded border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-dim hover:border-line2 hover:text-ink"
            >
              <Key className="h-3.5 w-3.5" /> Manage
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <Reveal>
          {storageMode === "github" ? (
            <div className="mb-6 flex gap-3 rounded-xl border border-violet/20 bg-violet/5 p-4 text-[13px] leading-relaxed text-muted">
              <GitBranch className="h-5 w-5 shrink-0 text-violet-bright" />
              <div>
                <span className="font-display font-bold text-violet-bright">GitHub-backed storage:</span> Create and delete actions commit the post&apos;s <code className="font-mono text-ink">.mdx</code> file to your repository and go live on the next deployment. Safe on serverless hosts like Vercel.
              </div>
            </div>
          ) : (
            <div className="mb-6 flex gap-3 rounded-xl border border-crimson/20 bg-crimson/5 p-4 text-[13px] leading-relaxed text-muted">
              <AlertTriangle className="h-5 w-5 shrink-0 text-crimson-bright" />
              <div>
                <span className="font-display font-bold text-crimson-bright">Filesystem storage:</span> Create and delete actions write to the local filesystem — fully supported locally and on VPS/Node hosts with a persistent disk (Railway, Render, Fly). Changes <span className="font-semibold text-ink">will not persist on serverless platforms like Vercel</span>. To enable persistent editing there, set <code className="font-mono text-ink">GITHUB_TOKEN</code> and <code className="font-mono text-ink">GITHUB_REPO</code>.
              </div>
            </div>
          )}
        </Reveal>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Admin Authorization</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-dim hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="mt-6">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-dim">
                Enter Admin Passcode
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                className="mt-2 w-full rounded-md border border-line bg-surface2 px-3 py-2 font-mono text-sm text-ink placeholder:text-dim/60 focus:border-violet-bright focus:outline-none"
              />
              {authError && <p className="mt-2 font-mono text-[11px] text-crimson-bright">{authError}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="rounded px-4 py-2 font-mono text-xs text-dim hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-violet px-4 py-2 font-mono text-xs text-white hover:bg-violet-bright"
                >
                  Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 px-6 py-12 backdrop-blur-sm">
          <div className="flex h-full max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-line bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="font-display text-lg font-bold">Create New Blog Post</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-dim hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-1 flex-col overflow-hidden px-6 py-4">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-dim">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Wazuh vs Elastic: A detection engineering comparison"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-md border border-line bg-surface2 px-3 py-2 text-sm text-ink placeholder:text-dim/50 focus:border-violet-bright focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-dim">Slug</label>
                    <input
                      type="text"
                      required
                      placeholder="wazuh-vs-elastic-detection"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="mt-1 w-full rounded-md border border-line bg-surface2 px-3 py-2 font-mono text-xs text-ink placeholder:text-dim/50 focus:border-violet-bright focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-dim">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 w-full rounded-md border border-line bg-surface2 px-3 py-2 font-mono text-xs text-ink focus:border-violet-bright focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-dim">Excerpt</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the article..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="mt-1 w-full rounded-md border border-line bg-surface2 px-3 py-2 text-sm text-ink placeholder:text-dim/50 focus:border-violet-bright focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-dim">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Wazuh, SIEM, Detection"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="mt-1 w-full rounded-md border border-line bg-surface2 px-3 py-2 font-mono text-xs text-ink placeholder:text-dim/50 focus:border-violet-bright focus:outline-none"
                  />
                </div>

                <div className="flex flex-col flex-1 min-h-[220px]">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-dim mb-1">MDX Content</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Write your article in MDX format here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full flex-1 rounded-md border border-line bg-surface2 p-3 font-mono text-xs text-ink placeholder:text-dim/50 focus:border-violet-bright focus:outline-none resize-none"
                  />
                </div>
              </div>

              {createError && <p className="mt-3 font-mono text-[11px] text-crimson-bright">{createError}</p>}

              <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded px-4 py-2 font-mono text-xs text-dim hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-gradient-to-r from-crimson to-violet px-5 py-2 font-mono text-xs text-white hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Posts list */}
      {posts.length === 0 ? (
        <p className="font-mono text-sm text-dim">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <div className="relative group">
                <Link
                  href={`/blog/${p.slug}`}
                  className="group block rounded-2xl border border-line bg-surface/50 p-6 transition-all hover:-translate-y-0.5 hover:border-line2 pr-16"
                >
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-dim">
                    <span>{formatDateClient(p.date)}</span>
                    <span>·</span>
                    <span>{p.readingTime}</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-semibold leading-tight group-hover:text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded border border-line2 px-2.5 py-1 font-mono text-[11px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-crimson-bright">
                    Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Delete overlay button in Admin mode */}
                {isAdmin && (
                  <button
                    onClick={(e) => handleDelete(e, p.slug)}
                    title="Delete Post"
                    className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-crimson/20 bg-surface/80 text-crimson-bright transition-colors hover:bg-crimson/15 hover:text-white"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
