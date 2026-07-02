# Maintaining this portfolio

A practical guide for updating the site after it's deployed. It's built with
**Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, Framer Motion**, and an
**MDX** blog, deployed on **Vercel**.

---

## The everyday loop

1. Edit files.
2. Preview locally: `npm run dev` → http://localhost:3000
3. Commit and push:
   ```bash
   git add -A
   git commit -m "describe the change"
   git push
   ```
4. Vercel auto-deploys the `main` branch to production. Any other branch gets its own
   preview URL, which is handy for trying something before it goes live.

Commands you'll use:

| Command | When |
| --- | --- |
| `npm install` | After pulling changes or adding a dependency |
| `npm run dev` | Local development with hot reload |
| `npm run build` | **Always run before deploying** — it's your safety net |
| `npm start` | Run the production build (Node hosts only) |

> If `npm run build` fails locally, the Vercel deploy will fail too — and your live site
> just stays on the last good version. So building locally first is the guardrail.

---

## Where content lives (edit data, not layout)

Almost every content change is a small edit to one of these:

| I want to change... | Edit this |
| --- | --- |
| Projects (cards + case-study pages) | `src/lib/data.ts` → `projects` |
| Research / publications | `src/lib/data.ts` → `research` |
| Skills | `src/lib/data.ts` → `skillGroups` |
| Timeline milestones | `src/components/timeline.tsx` → the `milestones` array (inline at the top) |
| Name, role, email, social links, resume path | `src/lib/site.ts` |
| Resume PDF | replace `public/Omswaroop_TM_Resume.pdf` (keep the filename) |
| Colors, fonts, spacing tokens | `src/app/globals.css` → the `@theme` block |
| Share/preview image | replace `public/og-image.png` (1200×630) |
| Site domain (canonical + OG + schema) | `src/lib/site.ts` → `url` |

Note: the timeline section carries `id="experience"`, so the nav's "Experience" link
(`/#experience`) scrolls to it — keep that id if you rename things.

---

## Blog

**Option A — in the site (easiest for quick posts):**
Go to `/blog` → **Manage** → enter your `ADMIN_PASSCODE` → add or delete posts. The admin
bar shows which storage mode is active (see below).

**Option B — by hand (best for longer posts):**
Create a file `src/content/blog/<slug>.mdx` with frontmatter, then commit and push:

```mdx
---
title: "Your Post Title"
date: "2026-07-02"
excerpt: "One-line summary used on the blog index and share cards."
tags: ["Detection Engineering", "SOC"]
---

Write the post body in Markdown / MDX here.
```

The index, reading time, and per-post share image are generated automatically.

**Storage modes:**
- **Filesystem** (default): the Manage editor writes `.mdx` to disk. Works locally and on
  Node hosts with a persistent disk (Render, Railway, Fly, a VPS). It does **not** persist
  on serverless hosts like Vercel.
- **GitHub** (when `GITHUB_TOKEN` + `GITHUB_REPO` are set): the editor commits the `.mdx`
  to your repo via the GitHub API. The post goes live on the auto-triggered redeploy
  (about a minute). This is the mode to use if you edit posts on Vercel.

---

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables (Production), or in a
local `.env` file for development. See `.env.example` for the full notes.

| Variable | Required? | Purpose |
| --- | --- | --- |
| `ADMIN_PASSCODE` | **Yes in production** | Unlocks the blog Manage editor. If unset in production, the editor is fail-closed (disabled). Dev falls back to `admin123`. |
| `GITHUB_TOKEN` | Optional | Fine-grained PAT (Contents: Read and write, this repo only) — enables live blog editing on serverless. |
| `GITHUB_REPO` | Optional | `owner/repo`, e.g. `Omryuo/omswaroop-portfolio`. |
| `GITHUB_BRANCH` | Optional | Usually `main`. |
| `NEXT_PUBLIC_FORMSPREE_ID` | Optional | Makes the contact form submit asynchronously; without it, it opens the visitor's email client. |

Two rules that trip people up:
- Server-only variables have **no** `NEXT_PUBLIC_` prefix (e.g. `GITHUB_TOKEN`). Only
  browser-exposed variables use it (e.g. `NEXT_PUBLIC_FORMSPREE_ID`).
- After adding or changing any env var on Vercel, you must **redeploy** for it to apply.

---

## Updating dependencies

Every month or two:

```bash
npm outdated          # see what's behind
npm update            # safe minor/patch bumps
npm run build         # verify nothing broke
```

Bump major versions deliberately (read the changelog), and always finish with a local
build before pushing.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Vercel deploy fails | Run `npm run build` locally and read the error; fix, then push again. |
| Blog edit says "not found" or doesn't persist on Vercel | Set `GITHUB_TOKEN` + `GITHUB_REPO` (serverless can't write to disk). |
| Manage editor is locked in production | Set `ADMIN_PASSCODE` in Vercel and redeploy. |
| Wrong link/image when sharing on LinkedIn | Set `site.url` in `src/lib/site.ts` to the live domain, then redeploy. |
| Contact form opens an email client instead of submitting | That's the fallback — set `NEXT_PUBLIC_FORMSPREE_ID` to enable async submit. |

---

## Project map

```
src/
  app/
    page.tsx                 Landing page composition
    layout.tsx               Metadata, fonts, analytics, background
    globals.css              Design tokens (@theme), animations
    projects/                /projects and /projects/[slug]
    research/                /research and /research/[slug]
    blog/                    /blog, /blog/[slug], actions.ts (create/delete)
  components/                Hero, timeline, cards, blog-manager, background, etc.
  content/blog/*.mdx         Blog posts
  lib/
    data.ts                  Projects, research, skills
    site.ts                  Identity, links, site.url
    blog.ts                  Reads posts from disk
    og.tsx                   Dynamic OG image card
  og-fonts/                  Fonts bundled for OG generation
public/                      Resume PDF, og-image.png, static assets
.env.example                 Documented environment variables
```
