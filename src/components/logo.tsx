export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <polygon points="32,6 54,18.5 54,45.5 32,58 10,45.5 10,18.5" stroke="url(#lg)" strokeWidth="3" />
      <polygon points="32,19 43,25.5 43,38.5 32,45 21,38.5 21,25.5" fill="url(#lg)" />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff5a72" />
          <stop offset="1" stopColor="#b985ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
