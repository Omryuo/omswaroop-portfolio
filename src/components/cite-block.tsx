"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CiteBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg/60">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-dim">{label}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-violet-bright transition-colors hover:text-crimson-bright"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-4 font-mono text-[12.5px] leading-relaxed text-muted">
        {text}
      </pre>
    </div>
  );
}
