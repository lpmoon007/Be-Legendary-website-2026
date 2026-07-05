// Be Legendary snail mark — inline SVG so it inherits currentColor and needs no
// asset pipeline. The snail (slow, relentless, always arrives) is the brand mark.
export function SnailMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={className}
      role="img"
      aria-label="Be Legendary"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* body */}
      <path
        d="M6 40c6 0 8-3 12-3 3 0 5 3 10 3"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* shell */}
      <circle cx="34" cy="26" r="14" stroke="currentColor" strokeWidth="3.5" />
      <path
        d="M34 26a7 7 0 1 0 7 7"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* head + antenna */}
      <path
        d="M20 40c-3 0-5-2-5-5 0-4 3-6 7-6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M14 33l-4-6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="9" cy="25" r="2.4" fill="currentColor" />
    </svg>
  );
}
