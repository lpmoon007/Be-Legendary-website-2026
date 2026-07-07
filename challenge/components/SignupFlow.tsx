"use client";

import { useState } from "react";
import { PRESET_BEHAVIORS } from "@/lib/presets";
import { digitCount } from "@/lib/phone";

type Step = 1 | 2 | 3;

const CUSTOM = "__custom__";

export function SignupFlow() {
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [choice, setChoice] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  // Step 2
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commitment =
    choice === CUSTOM ? custom.trim() : choice ?? "";

  const step1Valid =
    (choice !== null && choice !== CUSTOM) ||
    (choice === CUSTOM && custom.trim().length > 3);

  const step2Valid =
    firstName.trim().length > 0 && digitCount(phone) >= 10 && consent;

  function reset() {
    setStep(1);
    setChoice(null);
    setCustom("");
    setFirstName("");
    setPhone("");
    setConsent(false);
    setError(null);
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Denver";
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName.trim(),
          phone: phone.trim(),
          commitment,
          consent,
          timezone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStep(3);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="signup" className="surface bg-card-light p-6 shadow-card sm:p-8">
      <ProgressRail step={step} />

      {step === 1 && (
        <div className="mt-6">
          <h3 className="font-serif text-2xl font-500 text-ink-heading">
            Choose your lead measure
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            One behavior. The smallest rep that changes who you become.
          </p>

          <div className="mt-5 space-y-3">
            {PRESET_BEHAVIORS.map((b) => (
              <ChoiceCard
                key={b}
                selected={choice === b}
                onSelect={() => setChoice(b)}
                label={b}
              />
            ))}

            <ChoiceCard
              selected={choice === CUSTOM}
              onSelect={() => setChoice(CUSTOM)}
              label="Write my own…"
            />
            {choice === CUSTOM && (
              <input
                autoFocus
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Each day, I will…"
                className="w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
              />
            )}
          </div>

          <button
            className="btn-cta mt-6 w-full"
            disabled={!step1Valid}
            onClick={() => setStep(2)}
          >
            This is my rep →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <h3 className="font-serif text-2xl font-500 text-ink-heading">
            Your number
          </h3>

          <div className="mt-4 rounded-btn border border-accent/30 bg-accent/5 px-4 py-3">
            <span className="text-xs font-700 uppercase tracking-wide text-accent">
              Your rep
            </span>
            <p className="mt-1 text-ink-body">{commitment}</p>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-600 text-ink-body">First name</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
                placeholder="Jordan"
              />
            </label>

            <label className="block">
              <span className="text-sm font-600 text-ink-body">Mobile number</span>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
                placeholder="(303) 555-1234"
              />
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#C04A26]"
              />
              <span className="text-xs leading-relaxed text-ink-muted">
                By checking this box, you agree to receive ~30 SMS messages over
                30 days from Be Legendary. Msg &amp; data rates may apply. Reply
                STOP to cancel, HELP for help. See our{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="text-accent underline"
                >
                  SMS Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="text-accent underline"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {error && (
            <p className="mt-4 text-sm font-600 text-accent">{error}</p>
          )}

          <div className="mt-6 flex gap-3">
            <button className="btn-ghost" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button
              className="btn-cta flex-1"
              disabled={!step2Valid || submitting}
              onClick={submit}
            >
              {submitting ? "Enrolling…" : "Begin →"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
            ✦
          </div>
          <h3 className="mt-4 font-serif text-3xl font-500 text-ink-heading">
            You&apos;re in.
          </h3>
          <p className="mt-2 text-ink-body">
            Day 1 lands tomorrow at 8 a.m.
          </p>

          <div className="mt-5 rounded-btn border border-accent/30 bg-accent/5 px-4 py-3 text-left">
            <span className="text-xs font-700 uppercase tracking-wide text-accent">
              Your rep
            </span>
            <p className="mt-1 text-ink-body">{commitment}</p>
          </div>

          <button
            onClick={reset}
            className="mt-6 text-sm font-600 text-accent underline-offset-4 hover:underline"
          >
            Start a different challenge
          </button>
        </div>
      )}
    </div>
  );
}

function ProgressRail({ step }: { step: Step }) {
  const items = [
    { n: 1, label: "Choose" },
    { n: 2, label: "Your number" },
    { n: 3, label: "Begin" },
  ];
  return (
    <div className="flex items-center gap-2 text-xs font-600">
      {items.map((it, i) => (
        <div key={it.n} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              step >= it.n
                ? "bg-accent text-ink-light"
                : "bg-ink-muted/20 text-ink-muted"
            }`}
          >
            {it.n}
          </span>
          <span
            className={step >= it.n ? "text-ink-body" : "text-ink-muted"}
          >
            {it.label}
          </span>
          {i < items.length - 1 && (
            <span className="mx-1 text-ink-muted">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ChoiceCard({
  selected,
  onSelect,
  label,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-btn border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-accent bg-accent/5"
          : "border-ink-muted/30 bg-white hover:border-ink-muted/60"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-accent" : "border-ink-muted/50"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
      </span>
      <span className="text-ink-body">{label}</span>
    </button>
  );
}
