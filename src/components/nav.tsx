"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { site } from "@/lib/site";

const links = [
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Blog", href: "/blog" },
  { label: "Skills", href: "/#skills" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="font-display text-sm font-semibold tracking-wide">{site.name}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wider text-violet-bright transition-colors hover:text-crimson-bright"
          >
            Resume ↓
          </a>
          <Link
            href="/#contact"
            className="rounded-md border border-line2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors hover:border-crimson hover:text-crimson-bright"
          >
            Let&apos;s connect
          </Link>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="text-ink md:hidden" aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-bg/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col px-6 py-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-t border-line py-3 font-mono text-xs uppercase tracking-wider text-muted"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="border-t border-line py-3 font-mono text-xs uppercase tracking-wider text-violet-bright"
            >
              Resume ↓
            </a>
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="border-t border-line py-3 font-mono text-xs uppercase tracking-wider text-crimson-bright"
            >
              Let&apos;s connect
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
