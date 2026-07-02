import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";

export function ContactCta() {
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Let&apos;s build{" "}
              <span className="bg-gradient-to-r from-crimson-bright to-violet-bright bg-clip-text text-transparent">
                secure systems
              </span>{" "}
              together.
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Open to roles in cybersecurity, AI/ML and software engineering — in India or abroad.
              Drop a note and I&apos;ll get back to you.
            </p>
            <div className="mt-8 flex flex-col gap-3 font-mono text-sm">
              <a href={`mailto:${site.email}`} className="text-muted transition-colors hover:text-crimson-bright">
                {site.email}
              </a>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted">
                <a href={site.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-crimson-bright">
                  GitHub ↗
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-crimson-bright">
                  LinkedIn ↗
                </a>
                <a href={site.resume} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-crimson-bright">
                  Resume ↓
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface/50 p-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
