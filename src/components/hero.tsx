import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import { NetworkCanvas } from "./network-canvas";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="home" className="relative mx-auto flex min-h-[92vh] max-w-6xl items-center px-6 pb-16 pt-28">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[.18em] text-muted">
            <span>Cybersecurity Engineer</span>
            <span className="text-dim">/</span>
            <span>Detection Engineering</span>
            <span className="text-dim">/</span>
            <span>AI Security Research</span>
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Detecting threats.
            <br />
            <span className="bg-gradient-to-r from-crimson-bright to-violet-bright bg-clip-text text-transparent">
              Engineering resilient systems.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted">
            I work where security operations meet machine-learning research — SIEM-driven
            detection in a SOC, and published IEEE work on efficient, robust ML. B.Tech CSE
            graduate, KPMG Cyber MDR apprentice, and IEEE author.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-crimson to-violet px-6 py-3 font-mono text-sm uppercase tracking-wide text-white shadow-[0_8px_30px_-10px_rgba(255,35,66,.5)] transition-transform hover:-translate-y-0.5"
            >
              View projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line2 px-6 py-3 font-mono text-sm uppercase tracking-wide transition-colors hover:border-violet-bright hover:text-violet-bright"
            >
              Resume ↓
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-[#141019]">
            <div className="scan-stripes" />
            <NetworkCanvas />
            <div className="graph-vignette" />
            <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 font-mono text-[11px] text-dim">
              <span className="graph-dot" />
              threat-graph · live
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
