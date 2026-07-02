# Omswaroop T M — Portfolio (Next.js)

A dark, premium portfolio for cybersecurity + AI/ML security work. Built with
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion and Lucide.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Deploy

Push to GitHub and import the repo at https://vercel.com/new — zero config.

## What to edit

- **Content** lives in `src/lib/data.ts` (projects, experience, research, skills)
  and `src/lib/site.ts` (name, links, email, etc.). Change these, not the components.
- **Your hosted URL**: set `site.url` in `src/lib/site.ts` (used for canonical,
  Open Graph, and the Person schema).
- **Share image**: add `public/og-image.png` (1200×630) so LinkedIn/Discord/X
  show a card. The resume PDF is already in `public/` and linked from the nav + hero.
- **Theme**: colors and fonts are tokens in `src/app/globals.css` (`@theme` block).

## Built so far

**Phase 1** — Design system, layout, floating blur nav, animated network hero, and the
full landing page: experience timeline, project previews, research, categorized skills,
contact CTA. SEO (canonical, keywords, OG, Twitter card, JSON-LD Person) and an inline
SVG favicon.

**Phase 2** — Projects index at `/projects` and per-project **case-study pages** at
`/projects/[slug]` (problem → approach → what I built → outcome), each with an
architecture/flow diagram, a real-metrics row, tech stack, prev/next navigation, and
per-page SEO. Cards across the site link through to the case studies.

> Case studies lead with a clean architecture diagram. To add screenshots later, drop
> images in `public/` and render them in `src/app/projects/[slug]/page.tsx` (a `<figure>`
> above "The problem" works well).

**Phase 3** — Research index at `/research` and per-paper detail pages at
`/research/[slug]` with the full abstract and one-click **copy** of BibTeX and an IEEE
citation, DOI link, prev/next, and per-page SEO. Nav "Research" now points to `/research`.

> Author lists and page numbers in the generated BibTeX/citations are best-effort — verify
> them against the official IEEE Xplore record. Edit them in `src/lib/data.ts`.

**Phase 4** — Four things:

- **MDX blog** at `/blog` and `/blog/[slug]`. Posts are `.mdx` files in
  `src/content/blog/` with frontmatter (`title`, `date`, `excerpt`, `tags`); the index
  and reading time are derived automatically. Two starter posts are included.
- **Contact form** in the contact section. By default it opens the visitor's email
  client (works with zero setup). Set `NEXT_PUBLIC_FORMSPREE_ID` (see `.env.example`)
  to make it submit asynchronously via Formspree instead.
- **Analytics** via `@vercel/analytics` — active automatically once deployed on Vercel.
- **Dynamic OG images** generated per page with `next/og` for `/projects/[slug]`,
  `/research/[slug]` and `/blog/[slug]`. Index/home pages use the static
  `public/og-image.png`. Fonts are bundled in `src/og-fonts/` so the build works offline.

> The two starter blog posts are drafts written from your domain — **review, edit and
> make them your voice before publishing.** Delete the files in `src/content/blog/` you
> don't want.

**Phase 5** — Interactive visual elements and live administrative tools:

- **Enhanced Dynamic Canvas Background**: Replaced the static background grid with an interactive grid of dots. The dots warp physically towards the cursor (using liquid interpolation) and shift color from violet to crimson on hover. Clicking anywhere on the screen triggers a circular wave propagation ripple across the grid.
- **Security Threat Detection Hero Graph**: Redesigned the hero visualization to simulate a live detection pipeline. Features packet tracer trails, rotating gateway rings, and simulated threat actors triggering alerts (e.g., `[BLOCKED: SQL_INJECTION]`) with expanding red shockwaves on the target nodes.
- **Passcode-Secured Blog CRUD**: Added a client dashboard on the `/blog` page allowing authors to write new blog posts via a form modal, and delete existing posts via trash overlay icons. The filesystem writes/deletes are executed via Next.js Server Actions on disk (secured with a default passcode `"admin123"`, customizable via `ADMIN_PASSCODE` environment variable).

## Possible next steps

- Add real project screenshots (drop in `public/`, render in the case-study pages).
- Swap the bundled OG font for Space Grotesk if you want the cards to match the site 1:1.
- Wire a real analytics/contact provider and a custom domain.

## Notes

- The background and hero visualizations are lightweight Canvases (no Three.js) and respect
  `prefers-reduced-motion` (reverting to static grids/networks).
- Everything is keyboard- and reduced-motion-friendly out of the box.

## Deploying (this build is ready)

1. `npm install`
2. Set environment variables (see `.env.example`):
   - `ADMIN_PASSCODE` — **required in production**; the blog editor is fail-closed without it.
   - For blog editing on a **serverless host (Vercel)**, also set `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` — the editor then commits posts to your repo and they go live on the next deploy.
   - `NEXT_PUBLIC_FORMSPREE_ID` (optional) for the async contact form.
3. Set `site.url` in `src/lib/site.ts` to your real domain (drives canonical + OG + JSON-LD).
4. Deploy:
   - **Vercel** — import the repo, add the env vars above. (Live blog editing needs the GitHub vars here since Vercel's filesystem is read-only.)
   - **Node host (Render / Railway / Fly / VPS)** — `npm run build && npm start`. Blog editing writes to the local disk; no GitHub vars needed.

The blog admin bar shows which storage mode is active (GitHub-backed vs filesystem), so you always know whether live edits will persist.

## License

This project is licensed under the [MIT License] The license covers the source code only; personal content, text, copy, images, and other assets are not licensed for reuse or redistribution.
