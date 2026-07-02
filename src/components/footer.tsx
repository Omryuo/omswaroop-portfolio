import { site } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-7" />
          <span className="font-display text-sm font-semibold tracking-wide">{site.name}</span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-dim">
          © {new Date().getFullYear()} {site.name} · Detect · Defend · Research
        </div>
      </div>
    </footer>
  );
}
