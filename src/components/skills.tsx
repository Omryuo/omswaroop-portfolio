import { Shield, Cloud, Code2, BrainCircuit, Wrench, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { skillGroups } from "@/lib/data";

const icons: Record<string, LucideIcon> = {
  security: Shield,
  cloud: Cloud,
  languages: Code2,
  ai: BrainCircuit,
  development: Wrench,
};

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading num="04" label="Expertise" title="Skills & stack" />
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g) => {
          const Icon = icons[g.key] ?? Wrench;
          return (
            <Reveal key={g.key}>
              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-line2 bg-surface text-crimson-bright">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[.16em] text-dim">
                    {g.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-md border border-line2 bg-surface px-3 py-1.5 font-mono text-[12.5px] text-muted transition-colors hover:border-violet-bright hover:text-ink"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
