import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { PhoneMock } from "@/components/PhoneMock";
import { SignupFlow } from "@/components/SignupFlow";
import { ProgressPreview } from "@/components/ProgressPreview";
import { SnailMark } from "@/components/Logo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "https://challenge.belegendary.org/" },
};

// Single source for the visible FAQ and the FAQPage schema — they must match.
const faqs = [
  {
    q: "Is the 30-Day Challenge free?",
    a: "Yes — completely free. You pick one behavior, and for thirty days we hold you to it by text. No cost, no catch, no credit card.",
  },
  {
    q: "Do I need to download an app?",
    a: "No app to download. The whole challenge runs over text messages — a morning nudge and a quick evening check-in. If you can reply to a text, you can do it.",
  },
  {
    q: "How does it actually work?",
    a: "You choose one behavior. Each morning you get a one-line reminder to do it; at 4 p.m. you rate the day 1–10; a great day or a hard day earns one short follow-up question. That's it — one text a day for thirty days.",
  },
  {
    q: "What behavior should I choose?",
    a: "One small, daily action you control — a lead measure. Send one note of appreciation. Ten minutes of deep work before email. One honest conversation you've been avoiding. Small enough to do on your worst day, meaningful enough to change something.",
  },
  {
    q: "What if I miss a day?",
    a: "You don't have to be perfect — you have to keep showing up. Replying that you didn't do it still counts, because consistency, not perfection, is what rewires the habit. Missing a day isn't failing; quitting is.",
  },
  {
    q: "How many texts will I get, and can I stop?",
    a: "About one a day — roughly 30 messages over the 30 days. Reply STOP anytime to cancel, or HELP for help. We never sell or share your number.",
  },
];

// Ties the challenge to the same Be Legendary entity as the main site, so search
// and AI answer engines connect the two.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.belegendary.org/#org",
      name: "Be Legendary",
      url: "https://www.belegendary.org/",
      founder: { "@type": "Person", name: "James Carter" },
    },
    {
      "@type": "WebSite",
      "@id": "https://challenge.belegendary.org/#website",
      url: "https://challenge.belegendary.org/",
      name: "The 30-Day Challenge — Be Legendary",
      publisher: { "@id": "https://www.belegendary.org/#org" },
    },
    {
      "@type": "WebPage",
      "@id": "https://challenge.belegendary.org/#webpage",
      url: "https://challenge.belegendary.org/",
      name: "The 30-Day Challenge",
      isPartOf: { "@id": "https://challenge.belegendary.org/#website" },
      description:
        "A free 30-day habit challenge from Be Legendary: pick one behavior and get held to it daily — a morning nudge, a 4 p.m. check-in, and a line on how it went. No app to download.",
    },
    {
      "@type": "FAQPage",
      "@id": "https://challenge.belegendary.org/#faq",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function EnrollPage() {
  return (
    <div className="min-h-screen bg-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="eyebrow">The 30-Day Challenge</p>
            <h1 className="mt-4 font-serif text-[44px] font-400 leading-[1.05] text-ink-light sm:text-[68px]">
              A workout is a rep.{" "}
              <span className="italic text-accent-light">
                Thirty days is who you become.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-light/70">
              Pick one behavior. Get one text a day. For thirty days, we hold
              you to it — a morning nudge, a 4 p.m. check-in, and a line about
              how it went. No app to download. You don&apos;t have to be
              perfect. You have to keep showing up.
            </p>
            <div className="mt-8">
              <a href="#signup" className="btn-cta text-lg">
                Start your challenge →
              </a>
            </div>
            <p className="mt-4 text-sm text-ink-light/50">
              One text a day. Reply STOP anytime. We never share your number.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneMock />
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="bg-card">
        <div className="mx-auto max-w-shell px-6 py-16">
          <h2 className="font-serif text-3xl font-500 text-ink-heading sm:text-4xl">
            How it works
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <HowCard
              time="8:00 a.m."
              title="The commitment"
              body="One text with today's rep — the behavior you chose. No reply needed. Just a nudge to go do it."
            />
            <HowCard
              time="4:00 p.m."
              title="The rating"
              body="How'd today go? Reply with a number, 1–10. Ten seconds. That's the whole check-in."
            />
            <HowCard
              time="When it counts"
              title="The reflection"
              body="An 8–10 or a 1–4 earns one more question — what made it land, or what got in the way. One sentence back."
            />
          </div>
        </div>
      </section>

      {/* ── Sign-up flow (functional core) ────────────────────────────────── */}
      <section className="bg-page">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="mb-8 text-center">
            <p className="eyebrow">Start now</p>
            <h2 className="mt-3 font-serif text-3xl font-500 text-ink-light sm:text-4xl">
              Three steps. Then it&apos;s just texts.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-light/60">
              This starts a live, 30-day commitment. If you have one behavior you
              want to hold yourself to and track every day, you&apos;re in the
              right place — the check-ins begin tomorrow morning.
            </p>
          </div>
          <SignupFlow />

          {/* Always-visible SMS opt-in disclosure (A2P / carrier verification). */}
          <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-relaxed text-ink-light/45">
            Text messaging is optional. If you opt in, you agree to receive
            recurring automated SMS messages from Be Legendary (approximately 30
            messages over 30 days). Consent is not required to use Be Legendary or
            to complete the form, and is not a condition of any purchase. Msg
            &amp; data rates may apply. Reply STOP to cancel, HELP for help. See
            our{" "}
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

      {/* ── What success looks like ───────────────────────────────────────── */}
      <section className="bg-card">
        <div className="mx-auto max-w-shell px-6 py-16">
          <h2 className="font-serif text-3xl font-500 text-ink-heading sm:text-4xl">
            What success looks like
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <MetricCard
              stat="≥ 70%"
              title="Consistency"
              body="Checking in on 21 of 30 days. Replying “didn't do it” still counts — showing up is the win."
            />
            <MetricCard
              stat="W1 → W4"
              title="Momentum"
              body="Compare your week-1 average to your week-4 average. That delta is the transformation story."
            />
            <MetricCard
              stat="30 days"
              title="Completion"
              body="Finishing the full arc. Not perfectly — completely. Thirty days of showing up rewires the default."
            />
          </div>
        </div>
      </section>

      {/* ── Progress views ────────────────────────────────────────────────── */}
      <section className="bg-page">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="mb-8 text-center">
            <p className="eyebrow">See it in motion</p>
            <h2 className="mt-3 font-serif text-3xl font-500 text-ink-light sm:text-4xl">
              Your progress, and your coach&apos;s view
            </h2>
          </div>
          <ProgressPreview />
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="bg-card">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-serif text-3xl font-500 text-ink-heading sm:text-4xl">
            Questions, answered
          </h2>
          <div className="mt-8 flex flex-col gap-5">
            {faqs.map((f) => (
              <div key={f.q} className="surface bg-card-light p-6 shadow-card">
                <h3 className="font-serif text-xl font-500 text-ink-heading">
                  {f.q}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-body/80">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-page">
        <div className="mx-auto flex max-w-shell flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink-light/50 sm:flex-row">
          <div className="flex items-center gap-3 text-ink-light/70">
            <SnailMark className="h-6 w-8 text-accent-light" />
            <span className="font-serif">Be Legendary</span>
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <p className="text-ink-light/70">
              We&apos;ll never sell or give away your number. That just
              wouldn&apos;t <span className="italic text-accent-light">Be Legendary</span>.
            </p>
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

function MetricCard({
  stat,
  title,
  body,
}: {
  stat: string;
  title: string;
  body: string;
}) {
  return (
    <div className="surface bg-card-light p-6 shadow-card">
      <div className="font-serif text-4xl font-500 text-accent">{stat}</div>
      <h3 className="mt-2 font-sans text-lg font-700 text-ink-heading">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-body/80">{body}</p>
    </div>
  );
}
