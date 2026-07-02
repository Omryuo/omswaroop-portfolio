import { Reveal } from "./reveal";

export function SectionHeading({
  num,
  label,
  title,
}: {
  num: string;
  label: string;
  title: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 flex items-baseline gap-4">
        <span className="font-mono text-sm text-crimson">{num}</span>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[.2em] text-dim">{label}</div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        </div>
      </div>
    </Reveal>
  );
}
