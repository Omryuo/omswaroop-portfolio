"use client";

import { useState } from "react";
import { Send, Check, AlertCircle } from "lucide-react";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setError("Please fill in every field.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("That email address doesn't look right.");
      return;
    }

    // No backend configured → fall back to the visitor's email client.
    if (!formspreeId) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("success");
      return;
    }

    try {
      setStatus("submitting");
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setError("Something went wrong sending that. Please email me directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-line bg-bg/50 p-10 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-crimson to-violet text-white">
          <Check className="h-6 w-6" />
        </span>
        <p className="font-display text-lg font-semibold">Thanks — message on its way.</p>
        <p className="font-mono text-xs text-dim">I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-line2 bg-bg/50 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-dim focus:border-violet-bright";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        className={fieldClass}
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Your name"
      />
      <input
        className={fieldClass}
        placeholder="Your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Your email"
      />
      <textarea
        className={`${fieldClass} min-h-[120px] resize-y`}
        placeholder="What's on your mind?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-label="Your message"
      />
      {status === "error" && (
        <div className="flex items-center gap-2 font-mono text-xs text-crimson-bright">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-crimson to-violet px-6 py-3 font-mono text-sm uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
