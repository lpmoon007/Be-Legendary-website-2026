// Ledgebrook brand mark — the three blue waves, redrawn as inline SVG so it
// renders crisply on the dark co-brand header (the official wordmark is dark and
// wouldn't read there; we pair this mark with a knockout-white "Ledgebrook").
// Swap for the official asset by setting `logo` on the partner in lib/partners.ts.
export function LedgebrookMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 48"
      className={className}
      role="img"
      aria-label="Ledgebrook"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 5C18 17 4 31 11 43"
        stroke="#2E90FA"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M27 5C20 17 34 31 27 43"
        stroke="#2E90FA"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M43 5C50 17 36 31 43 43"
        stroke="#2E90FA"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
