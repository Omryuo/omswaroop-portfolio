import { PointerGlow } from "./pointer-glow";
import { InteractiveGrid } from "./interactive-grid";

export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <InteractiveGrid />
      <div className="bg-aurora">
        <span
          className="bg-blob bg-blob-a"
          style={{ background: "radial-gradient(closest-side, rgba(255,35,66,0.5), transparent)" }}
        />
        <span
          className="bg-blob bg-blob-b"
          style={{ background: "radial-gradient(closest-side, rgba(155,77,255,0.45), transparent)" }}
        />
        <span
          className="bg-blob bg-blob-c"
          style={{ background: "radial-gradient(closest-side, rgba(83,92,255,0.34), transparent)" }}
        />
      </div>
      <PointerGlow />
    </div>
  );
}

