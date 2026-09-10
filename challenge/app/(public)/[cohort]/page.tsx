import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SignupFlow } from "@/components/SignupFlow";
import { SnailMark } from "@/components/Logo";
import { LedgebrookMark } from "@/components/partners/LedgebrookMark";
import { PARTNERS, getPartner } from "@/lib/partners";

// Custom brand lockups for partners whose logo is drawn inline (vs. an uploaded
// image at partner.logo). Rendered on the dark co-brand header.
const PARTNER_MARKS: Record<string, ReactNode> = {
  ledgebrook: (
    <div className="flex items-center gap-3">
      <LedgebrookMark className="h-8 w-auto" />
      <span className="font-sans text-2xl font-800 leading-none tracking-tight text-ink-light">
        Ledgebrook
      </span>
    </div>
  ),
};

// Branded "skin" of the challenge for a specific client event — one route,
// generated from the partner registry (lib/partners.ts). /ledgebrook, etc.
// Only known slugs are valid; anything else 404s. The static /terms and /privacy
// routes take precedence over this dynamic segment.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PARTNERS).map((cohort) => ({ cohort }));
}

export function generateMetadata({
  params,
}: {
  params: { cohort: string };
}): Metadata {
  const p = getPartner(params.cohort);
  if (!p) return {};
  return {
    title: p.event,
    description: `Carry one leadership habit out of the ${p.event}. One small rep a day for thirty days, held to it by text.`,
    // A private cohort landing page — keep it out of search.
    robots: { index: false, follow: false },
    alternates: { canonical: `/${p.slug}` },
  };
}

export default function CohortPage({ params }: { params: { cohort: string } }) {
  const p = getPartner(params.cohort);
  if (!p) notFound();

  return (
    <div className="min-h-screen bg-page">
      {/* ── Co-branded header ──────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-white/5"
        style={{
          background: "var(--bg-dark-nav)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-4">
          {PARTNER_MARKS[p.slug] ? (
            PARTNER_MARKS[p.slug]
          ) : p.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.logo} alt={p.name} className="h-8 w-auto" />
          ) : (
            <span className="font-serif text-lg font-500 tracking-wide text-ink-light">
              {p.name}
            </span>
          )}
          <div className="flex items-center gap-2 text-ink-light/55">
            <span className="text-xs font-600 uppercase tracking-wide">with</span>
            <SnailMark className="h-5 w-7 text-accent-light" />
            <span className="font-serif text-sm text-ink-light/80">
              Be Legendary
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 pb-14 pt-14 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{p.event}</p>
          <h1 className="mt-4 font-serif text-[40px] font-400 leading-[1.06] text-ink-light sm:text-[60px]">
            {p.headline}{" "}
            <span className="italic text-accent-light">{p.headlineAccent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-light/70">
            {p.intro}
          </p>
          <div className="mt-8">
            <a href="#signup" className="btn-cta text-lg">
              Choose your habit →
            </a>
          </div>
          <p className="mt-4 text-sm text-ink-light/50">
            One text a day for thirty days. Reply STOP anytime. We never share your
            number.
          </p>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="bg-card">
        <div className="mx-auto max-w-shell px-6 py-16">
          <h2 className="text-center font-serif text-3xl font-500 text-ink-heading sm:text-4xl">
            How the next thirty days work
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <HowCard
              time="Each morning"
              title="The commitment"
              body="One text names today's rep — the behavior you chose. No reply needed. Just a nudge to go do it."
            />
            <HowCard
              time="Each afternoon"
              title="The rating"
              body="How'd today go? Reply with a number, 1–10. Ten seconds. That's the whole check-in."
            />
            <HowCard
              time="When it counts"
              title="The reflection"
              body="A strong day or a hard one earns one more question — what made it land, or what got in the way. One line back."
            />
          </div>
        </div>
      </section>

      {/* ── Sign-up flow (seeded with the partner's commitments) ───────────── */}
      <section className="bg-page">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="mb-8 text-center">
            <p className="eyebrow">Start now</p>
            <h2 className="mt-3 font-serif text-3xl font-500 text-ink-light sm:text-4xl">
              Choose the habit you&apos;ll carry forward.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-light/60">
              Pick one of the three below — or write your own. It becomes your
              daily rep, starting tomorrow morning.
            </p>
          </div>

          <SignupFlow presets={p.presets} initialSource={p.source} />

          {/* Always-visible SMS opt-in disclosure (A2P / carrier verification). */}
          <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-relaxed text-ink-light/45">
            Text messaging is optional. If you opt in, you agree to receive
            recurring automated SMS messages from Be Legendary (approximately 30
            messages over 30 days). Consent is not required to use Be Legendary or
            to complete the form, and is not a condition of any purchase. Msg &amp;
            data rates may apply. Reply STOP to cancel, HELP for help. See our{" "}
            <a href="/terms" className="text-accent-light underline">
              SMS Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-accent-light underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-page">
        <div className="mx-auto flex max-w-shell flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink-light/50 sm:flex-row">
          <div className="flex items-center gap-3 text-ink-light/70">
            <span className="font-serif">{p.name}</span>
            <span aria-hidden className="text-ink-light/30">
              ×
            </span>
            <SnailMark className="h-6 w-8 text-accent-light" />
            <span className="font-serif">Be Legendary</span>
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <p className="text-ink-light/40">Reply STOP to cancel, HELP for help.</p>
            <nav className="flex items-center gap-4 text-ink-light/60">
              <a href="/terms" className="hover:text-ink-light">
                SMS Terms
              </a>
              <span aria-hidden>·</span>
              <a href="/privacy" className="hover:text-ink-light">
                Privacy
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HowCard({
  time,
  title,
  body,
}: {
  time: string;
  title: string;
  body: string;
}) {
  return (
    <div className="surface bg-card-light p-6 shadow-card">
      <span className="pill bg-accent/10 text-accent">{time}</span>
      <h3 className="mt-3 font-serif text-xl font-500 text-ink-heading">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-body/80">{body}</p>
    </div>
  );
}
