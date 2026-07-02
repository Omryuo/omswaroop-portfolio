import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import type { Stage } from "@/lib/data";

export function Pipeline({ title, stages }: { title?: string; stages: Stage[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface/50 p-6">
      {title && (
        <div className="mb-5 font-mono text-[11px] uppercase tracking-[.2em] text-dim">{title}</div>
      )}
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        {stages.map((s, i) => (
          <Fragment key={i}>
            <div
              className={`flex w-full flex-col rounded-xl border p-4 md:flex-1 ${
                s.highlight
                  ? "border-crimson/50 bg-gradient-to-br from-crimson/10 to-violet/10"
                  : "border-line2 bg-bg/40"
              }`}
            >
              <span className="font-display text-sm font-semibold leading-tight">{s.label}</span>
              {s.sub && <span className="mt-1 font-mono text-[11px] text-dim">{s.sub}</span>}
            </div>
            {i < stages.length - 1 && (
              <div className="flex items-center justify-center text-dim">
                <ChevronRight className="h-5 w-5 rotate-90 md:rotate-0" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
