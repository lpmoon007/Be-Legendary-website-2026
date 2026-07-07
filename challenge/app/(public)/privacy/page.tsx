import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SnailMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "SMS Privacy Policy — Be Legendary",
  description:
    "How the Be Legendary 30-Day Challenge SMS program collects, uses, and protects your information.",
};

const EFFECTIVE = "July 5, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />

      <article className="mx-auto max-w-2xl px-6 py-16 text-ink-light/80">
        <p className="eyebrow">Be Legendary</p>
        <h1 className="mt-3 font-serif text-4xl font-500 text-ink-light">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-ink-light/50">Effective {EFFECTIVE}</p>

        <div className="mt-10 space-y-8 leading-relaxed">
          <Section title="1. Overview">
            This Privacy Policy explains how Be Legendary (“we,” “us”) collects,
            uses, and protects the information of participants in the Be Legendary
            30-Day Challenge SMS program (the “Program”), available at
            challenge.belegendary.org.
          </Section>

          <Section title="2. Information we collect">
            When you enroll, we collect only what the Program needs to run: your{" "}
            <strong>first name</strong>, your <strong>mobile phone number</strong>,
            your <strong>timezone</strong> (to send messages at the right local
            time), your chosen <strong>daily commitment</strong>, and the{" "}
            <strong>check-in responses</strong> you text back (a 1–10 rating and
            any brief reflection you send).
          </Section>

          <Section title="3. How we use your information">
            We use your information solely to operate the Program: to send your
            morning commitment message and afternoon check-in, to record your
            responses so you and your coach can see your progress, and to provide
            support. We do not use your information for advertising.
          </Section>

          <Section title="4. Text messaging &amp; your mobile data">
            <strong>
              No mobile information will be shared with third parties or affiliates
              for marketing or promotional purposes. Text messaging originator
              opt-in data and consent will not be shared with any third parties.
            </strong>{" "}
            We do not sell, rent, or trade your phone number or any information you
            provide. Message and data rates may apply. Message frequency is
            approximately one to two messages per day for the duration of your
            challenge. Reply STOP at any time to opt out; reply HELP for help.
          </Section>

          <Section title="5. Sharing of information">
            We share your information only with the service providers that make the
            Program work — our SMS carrier (Twilio) to deliver messages, and our
            database/hosting providers to store your progress — and only to the
            extent needed to provide the service. These providers are bound to
            protect your information and may not use it for their own purposes. We
            may disclose information if required by law.
          </Section>

          <Section title="6. Data retention">
            We retain your information for as long as you are enrolled and as needed
            to operate the Program. You may request deletion of your data at any
            time by contacting us.
          </Section>

          <Section title="7. Your choices">
            You can opt out of messages at any time by replying{" "}
            <strong>STOP</strong>. You may request access to, correction of, or
            deletion of your information by emailing{" "}
            <a
              href="mailto:hello@belegendary.org"
              className="text-accent-light underline"
            >
              hello@belegendary.org
            </a>
            .
          </Section>

          <Section title="8. Children’s privacy">
            The Program is intended for adults and is not directed to children
            under 18. We do not knowingly collect information from children.
          </Section>

          <Section title="9. Changes to this policy">
            We may update this policy from time to time. Material changes will be
            posted on this page with a new effective date.
          </Section>

          <Section title="10. Contact">
            Questions about this policy? Email{" "}
            <a
              href="mailto:hello@belegendary.org"
              className="text-accent-light underline"
            >
              hello@belegendary.org
            </a>
            . See also our{" "}
            <Link href="/terms" className="text-accent-light underline">
              SMS Terms &amp; Conditions
            </Link>
            .
          </Section>
        </div>

        <div className="mt-12 flex items-center gap-3 border-t border-white/10 pt-8 text-ink-light/60">
          <SnailMark className="h-6 w-8 text-accent-light" />
          <span className="font-serif">Be Legendary</span>
        </div>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-accent-light underline">
            ← Back to the challenge
          </Link>
        </p>
      </article>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-sans text-lg font-700 text-ink-light">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}
