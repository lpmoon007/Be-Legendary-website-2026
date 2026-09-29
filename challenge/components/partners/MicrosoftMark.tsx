// Microsoft brand mark — the four-color squares, inline SVG so it renders crisply
// on the dark co-brand header. Paired with a knockout-white "Microsoft" wordmark
// in the header lockup (the official wordmark is dark and wouldn't read there).
// Colors are Microsoft's brand values.
export function MicrosoftMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Microsoft"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="22" height="22" fill="#F25022" />
      <rect x="26" y="0" width="22" height="22" fill="#7FBA00" />
      <rect x="0" y="26" width="22" height="22" fill="#00A4EF" />
      <rect x="26" y="26" width="22" height="22" fill="#FFB900" />
    </svg>
  );
}
