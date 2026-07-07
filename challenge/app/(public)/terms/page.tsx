import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SnailMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "SMS Terms & Conditions — Be Legendary",
  description:
    "Messaging terms for the Be Legendary 30-Day Challenge SMS program.",
};

// Effective date is fixed at publish time (server components can't use Date.now
// deterministically, and a static date is what a legal doc wants anyway).
const EFFECTIVE = "July 5, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />

      <article className="mx-auto max-w-2xl px-6 py-16 text-ink-light/80">
        <p className="eyebrow">Be Legendary</p>
        <h1 className="mt-3 font-serif text-4xl font-500 text-ink-light">
          SMS Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-ink-light/50">
          Effective {EFFECTIVE}
        </p>

        <div className="mt-10 space-y-8 leading-relaxed">
          <Section title="1. The program">
            The Be Legendary 30-Day Challenge (the “Program”) is a recurring SMS
            text-message program that sends behavioral-accountability messages to
            participants who enroll. When you opt in, you will receive
            approximately 30 messages over 30 days: a morning message with your
            chosen daily commitment, an afternoon check-in asking you to reply
            with a rating from 1 to 10, and occasional brief follow-up or
            check-in messages based on your replies.
          </Section>

          <Section title="2. How you opt in">
            You opt in by entering your mobile number on{" "}
            <Link href="/" className="text-accent-light underline">
              challenge.belegendary.org
            </Link>{" "}
            and checking the SMS consent box. By doing so, you agree to receive
            recurring automated text messages from Be Legendary at the number you
            provide. Consent is not a condition of purchasing any goods or
            services.
          </Section>

          <Section title="3. Cost">
            Message and data rates may apply. Message frequency is approximately
            one to two messages per day for the duration of your challenge. Be
            Legendary does not charge for the messages, but your mobile carrier’s
            standard rates will apply. Check with your carrier for details about
            your plan.
          </Section>

          <Section title="4. Opting out">
            You can cancel at any time by replying <strong>STOP</strong> to any
            message. After you send STOP, you will receive one confirmation
            message and then no further messages, unless you re-enroll. You may
            also reply with UNSUBSCRIBE, CANCEL, END, or QUIT.
          </Section>

          <Section title="5. Help">
            For help, reply <strong>HELP</strong> to any message, or email{" "}
            <a
              href="mailto:hello@belegendary.org"
              className="text-accent-light underline"
            >
              hello@belegendary.org
            </a>
            . You can also reach support through belegendary.org.
          </Section>

          <Section title="6. Supported carriers">
            Carriers are not liable for delayed or undelivered messages. Message
            delivery is subject to effective transmission by your mobile carrier
            and is not guaranteed.
          </Section>

          <Section title="7. Privacy">
            We use your mobile number solely to operate the Program. We do not
            sell, rent, or share your phone number with third parties for their
            marketing purposes. Mobile information is not shared with third
            parties or affiliates for marketing or promotional purposes. See our{" "}
            <Link href="/privacy" className="text-accent-light underline">
              Privacy Policy
            </Link>{" "}
            for how we handle your information.
          </Section>

          <Section title="8. Changes">
            We may update these terms from time to time. Continued participation
            after an update constitutes acceptance of the revised terms. Material
            changes will be communicated through the Program or on this page.
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
