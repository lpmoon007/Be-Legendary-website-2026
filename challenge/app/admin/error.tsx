"use client";

// Safety net for any server exception inside /admin — shows a friendly message
// with the digest (to cross-reference Vercel logs) instead of a raw white screen.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto mt-16 max-w-md text-center">
      <div className="surface bg-card-light p-8 shadow-card">
        <h1 className="font-serif text-2xl font-500 text-ink-heading">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {error.message || "An unexpected error occurred."}
          {error.digest && (
            <span className="mt-2 block text-xs text-ink-muted/70">
              Ref: {error.digest}
            </span>
          )}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="btn-cta !py-2.5">
            Try again
          </button>
          <a href="/admin" className="btn-ghost">
            Back to roster
          </a>
        </div>
      </div>
    </div>
  );
}
