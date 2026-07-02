"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const REPO_BLOG_PATH = "src/content/blog";

/* ----------------------------- auth ----------------------------- */
// ADMIN_PASSCODE must be set in production. In local dev it falls back to
// "admin123" for convenience. If it's unset in production, the editor is
// fail-closed: every create/delete is rejected.
function configuredPasscode(): string | null {
  if (process.env.ADMIN_PASSCODE) return process.env.ADMIN_PASSCODE;
  if (process.env.NODE_ENV !== "production") return "admin123";
  return null;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function checkAuth(passcode: string): boolean {
  const correct = configuredPasscode();
  if (!correct) return false;
  return safeEqual(passcode, correct);
}

export async function verifyPasscodeAction(passcode: string) {
  return { success: checkAuth(passcode) };
}

/* --------------------- GitHub persistence (optional) --------------------- */
// When GITHUB_TOKEN + GITHUB_REPO are set, posts are committed to the repo via
// the GitHub Contents API. This works on serverless hosts (e.g. Vercel), where
// the filesystem is read-only; the change goes live on the next deploy.
const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_REPO = process.env.GITHUB_REPO; // "owner/repo"
const GH_BRANCH = process.env.GITHUB_BRANCH || "main";
const usingGitHub = () => Boolean(GH_TOKEN && GH_REPO);

async function ghRequest(repoPath: string, init?: RequestInit) {
  return fetch(`https://api.github.com/repos/${GH_REPO}/contents/${repoPath}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

async function ghGetSha(repoPath: string): Promise<string | null> {
  const res = await ghRequest(`${repoPath}?ref=${GH_BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const json = (await res.json()) as { sha: string };
  return json.sha;
}

async function ghPutFile(repoPath: string, content: string, message: string) {
  const sha = await ghGetSha(repoPath);
  const res = await ghRequest(repoPath, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch: GH_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`);
}

async function ghDeleteFile(repoPath: string, message: string) {
  const sha = await ghGetSha(repoPath);
  if (!sha) throw new Error("File not found");
  const res = await ghRequest(repoPath, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch: GH_BRANCH }),
  });
  if (!res.ok) throw new Error(`GitHub delete failed (${res.status})`);
}

/* ----------------------------- helpers ----------------------------- */
const esc = (s: string) => s.replace(/"/g, '\\"');
const today = () => new Date().toISOString().split("T")[0];

function buildMdx(input: {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}) {
  return `---
title: "${esc(input.title)}"
date: "${input.date || today()}"
excerpt: "${esc(input.excerpt)}"
tags: [${input.tags.map((t) => `"${esc(t.trim())}"`).join(", ")}]
---

${input.content.trim()}
`;
}

/* ----------------------------- actions ----------------------------- */
export async function createPostAction(
  passcode: string,
  data: {
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    tags: string[];
    content: string;
  }
) {
  if (!checkAuth(passcode)) {
    return { success: false, error: "Unauthorized: invalid passcode" };
  }

  const { title, slug, date, excerpt, tags, content } = data;
  if (!title || !slug || !content) {
    return { success: false, error: "Title, slug, and content are required" };
  }

  const cleanSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-");

  const mdx = buildMdx({ title, date, excerpt, tags, content });

  try {
    if (usingGitHub()) {
      await ghPutFile(`${REPO_BLOG_PATH}/${cleanSlug}.mdx`, mdx, `blog: add "${cleanSlug}"`);
    } else {
      if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
      fs.writeFileSync(path.join(BLOG_DIR, `${cleanSlug}.mdx`), mdx, "utf8");
    }
    revalidatePath("/blog");
    revalidatePath(`/blog/${cleanSlug}`);
    return { success: true, viaGitHub: usingGitHub() };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to write post";
    console.error("createPostAction:", message);
    return { success: false, error: message };
  }
}

export async function deletePostAction(passcode: string, slug: string) {
  if (!checkAuth(passcode)) {
    return { success: false, error: "Unauthorized: invalid passcode" };
  }
  if (!slug) {
    return { success: false, error: "Slug is required" };
  }

  const cleanSlug = slug.replace(/[^a-z0-9_-]/g, "");

  try {
    if (usingGitHub()) {
      await ghDeleteFile(`${REPO_BLOG_PATH}/${cleanSlug}.mdx`, `blog: remove "${cleanSlug}"`);
    } else {
      const filePath = path.join(BLOG_DIR, `${cleanSlug}.mdx`);
      if (!fs.existsSync(filePath)) return { success: false, error: "File not found" };
      fs.unlinkSync(filePath);
    }
    revalidatePath("/blog");
    revalidatePath(`/blog/${cleanSlug}`);
    return { success: true, viaGitHub: usingGitHub() };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete post";
    console.error("deletePostAction:", message);
    return { success: false, error: message };
  }
}
