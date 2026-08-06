"use client";

import { useEffect, useState } from "react";
import { PRESET_BEHAVIORS } from "@/lib/presets";
import { digitCount } from "@/lib/phone";
import { COMMON_TIMEZONES } from "@/lib/timezone";

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
  const [isPrivate, setIsPrivate] = useState(false);
  const [why, setWhy] = useState("");
  const [buddyName, setBuddyName] = useState("");
  const [buddyPhone, setBuddyPhone] = useState("");
  // Delivery times (HH:MM, participant's local zone). Default 8 a.m. nudge / 4 p.m. check-in.
  const [reminderTime, setReminderTime] = useState("08:00");
  const [reflectionTime, setReflectionTime] = useState("16:00");
  // Auto-detected from the browser; shown so the participant can confirm/correct it.
  const [timezone, setTimezone] = useState("America/Denver");
  const [tzEditing, setTzEditing] = useState(false);

  // Carried silently from a CQ report deep-link (/?email=…) so the enrollment
  // can be stitched back to the person's Commitment Quotient result by email.
  const [linkedEmail, setLinkedEmail] = useState<string | null>(null);
  // Attribution tag from a deep-link (?workout_id= or ?source=) — which workout
  // or simulation drove the enrollment.
  const [attribution, setAttribution] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Outcome of step 2: did they opt in to texts or decline?
  const [outcome, setOutcome] = useState<"enrolled" | "declined" | null>(null);

  // Deep-link support: /?rep=<behavior> pre-fills the commitment (from a workout,
  // a leadership-failure simulation, a CQ report, etc.) and drops the person
  // straight into step 2 with their specific rep already set.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rep = params.get("rep");
    if (rep && rep.trim().length > 3) {
      setChoice(CUSTOM);
      setCustom(rep.trim());
      setStep(2); // rep is already chosen — skip "Choose your rep"
      document
        .getElementById("signup")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Not shown in the UI — just remembered for the enroll payload.
    const email = params.get("email");
    if (email && email.includes("@")) setLinkedEmail(email.trim().toLowerCase());

    // Which workout / simulation sent them here (for the coach roll-up).
    const src = params.get("workout_id") || params.get("source");
    if (src && src.trim()) setAttribution(src.trim());

    // Auto-detect the participant's timezone from their device.
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) setTimezone(detected);
  }, []);

  const commitment =
    choice === CUSTOM ? custom.trim() : choice ?? "";

  const step1Valid =
    (choice !== null && choice !== CUSTOM) ||
    (choice === CUSTOM && custom.trim().length > 3);

  // Consent is NOT required to submit — SMS opt-in is optional (A2P compliance).
  // You can complete the form and use Be Legendary without agreeing to texts.
  // The afternoon check-in should land after the morning reminder (string compare
  // works for HH:MM time-of-day ordering).
  const timesValid = reflectionTime > reminderTime;
  const step2Valid =
    firstName.trim().length > 0 && digitCount(phone) >= 10 && timesValid;

  // Show the detected timezone with a friendly label; let them correct it.
  const tzLabel =
    COMMON_TIMEZONES.find((z) => z.value === timezone)?.label ?? timezone;
  const tzOptions = COMMON_TIMEZONES.some((z) => z.value === timezone)
    ? COMMON_TIMEZONES
    : [{ value: timezone, label: timezone }, ...COMMON_TIMEZONES];

  function reset() {
    setStep(1);
    setChoice(null);
    setCustom("");
    setFirstName("");
    setPhone("");
    setConsent(false);
    setIsPrivate(false);
    setWhy("");
    setBuddyName("");
    setBuddyPhone("");
    setReminderTime("08:00");
    setReflectionTime("16:00");
    setTzEditing(false);
    setError(null);
    setOutcome(null);
  }

  async function submit() {
    setError(null);

    // Declined texts → complete the form without enrolling in SMS. No number is
    // stored for messaging; they can still use Be Legendary's other services.
    if (!consent) {
      setOutcome("declined");
      setStep(3);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName.trim(),
          phone: phone.trim(),
          // In private mode the real behavior never leaves the browser.
          commitment: isPrivate ? "(private)" : commitment,
          consent,
          private: isPrivate,
          why: why.trim() || undefined,
          buddy_name: buddyName.trim() || undefined,
          buddy_phone: buddyPhone.trim() || undefined,
          workout_id: attribution ?? undefined,
          timezone,
          reminder_time: reminderTime,
          reflection_time: reflectionTime,
          ...(linkedEmail ? { email: linkedEmail } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setOutcome("enrolled");
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
          <p className="mt-2 text-xs text-ink-muted">
            Pick something you can practice <span className="font-600">every
            day</span> — not just in the big moments. Foundational habits that
            show up in 1:1s, team meetings, even at home are what actually stick.
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
            <p className="mt-1 text-ink-body">
              {isPrivate ? "🔒 Private — only you will see this" : commitment}
            </p>
          </div>

          {/* Private mode */}
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-btn border border-ink-muted/25 bg-white/60 p-3">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#C04A26]"
            />
            <span className="text-xs leading-relaxed text-ink-muted">
              <span className="font-700 text-ink-body">
                Keep this private.
              </span>{" "}
              Some reps are personal — a prayer, a private practice. Check this
              and your coach supports your effort (your daily 1–10) without ever
              seeing the behavior or what you write. We won&apos;t store your
              commitment or your reflections.
            </span>
          </label>

          {!isPrivate && (
            <label className="mt-4 block">
              <span className="text-sm font-600 text-ink-body">
                Why does this matter to you?{" "}
                <span className="font-400 text-ink-muted">(optional)</span>
              </span>
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                rows={2}
                placeholder="The deeper reason you want to keep this up…"
                className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
              />
              <span className="mt-1 block text-xs text-ink-muted">
                A clear &ldquo;why&rdquo; is what gets you to do the rep on the
                hard days.
              </span>
            </label>
          )}

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

            {/* Delivery times — a morning nudge to do the rep, an afternoon check-in to rate it. */}
            <div>
              <span className="text-sm font-600 text-ink-body">When should we text you?</span>
              <p className="mt-0.5 text-xs text-ink-muted">
                A morning nudge to do your rep, and an afternoon check-in to rate
                how it went — in your local time.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-600 text-ink-muted">
                    Morning reminder
                  </span>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-600 text-ink-muted">
                    Afternoon check-in
                  </span>
                  <input
                    type="time"
                    value={reflectionTime}
                    onChange={(e) => setReflectionTime(e.target.value)}
                    className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
                  />
                </label>
              </div>
              {!timesValid && (
                <p className="mt-2 text-xs font-600 text-accent">
                  Your check-in should be later in the day than your reminder.
                </p>
              )}

              {/* Detected timezone — shown so a wrong auto-detect can be corrected. */}
              <div className="mt-2 text-xs text-ink-muted">
                Timezone:{" "}
                <span className="font-600 text-ink-body">{tzLabel}</span>{" "}
                <button
                  type="button"
                  onClick={() => setTzEditing((v) => !v)}
                  className="text-accent underline"
                >
                  {tzEditing ? "done" : "not right? change"}
                </button>
                {tzEditing && (
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="mt-2 block w-full rounded-btn border border-ink-muted/40 bg-white px-3 py-2 text-ink-body outline-none focus:border-accent"
                  >
                    {tzOptions.map((z) => (
                      <option key={z.value} value={z.value}>
                        {z.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Accountability partner (optional) */}
            <div className="rounded-btn border border-ink-muted/25 bg-white/60 p-3">
              <span className="text-sm font-600 text-ink-body">
                Accountability partner{" "}
                <span className="font-400 text-ink-muted">(optional)</span>
              </span>
              <p className="mt-0.5 text-xs text-ink-muted">
                Someone to cheer you on nearly doubles the odds you stick with it.
                We&apos;ll text them once to confirm before anything else.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  value={buddyName}
                  onChange={(e) => setBuddyName(e.target.value)}
                  placeholder="Their name"
                  className="rounded-btn border border-ink-muted/40 bg-white px-3 py-2 text-sm text-ink-body outline-none focus:border-accent"
                />
                <input
                  type="tel"
                  inputMode="tel"
                  value={buddyPhone}
                  onChange={(e) => setBuddyPhone(e.target.value)}
                  placeholder="Their mobile"
                  className="rounded-btn border border-ink-muted/40 bg-white px-3 py-2 text-sm text-ink-body outline-none focus:border-accent"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-btn border border-ink-muted/25 bg-white/60 p-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#C04A26]"
              />
              <span className="text-xs leading-relaxed text-ink-muted">
                <span className="font-700 text-ink-body">
                  Optional — text me my daily challenge.
                </span>{" "}
                I agree to receive recurring automated text messages from Be
                Legendary at the number provided (my daily challenge, about 30
                messages over 30 days). This is optional and not required to use
                Be Legendary or to complete this form. Msg &amp; data rates may
                apply. Reply STOP to cancel, HELP for help. See our{" "}
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
            <p className="text-xs text-ink-muted">
              The challenge is delivered by text, so check the box above if
              you&apos;d like to receive it. You can continue either way.
            </p>
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
              {submitting ? "Enrolling…" : consent ? "Begin →" : "Continue →"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && outcome === "enrolled" && (
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
            ✦
          </div>
          <h3 className="mt-4 font-serif text-3xl font-500 text-ink-heading">
            You&apos;re in.
          </h3>
          <p className="mt-2 text-ink-body">
            Day 1 lands tomorrow at {formatTime(reminderTime)}.
          </p>

          <div className="mt-5 rounded-btn border border-accent/30 bg-accent/5 px-4 py-3 text-left">
            <span className="text-xs font-700 uppercase tracking-wide text-accent">
              Your rep
            </span>
            <p className="mt-1 text-ink-body">
              {isPrivate ? "🔒 Private — kept between you and you" : commitment}
            </p>
          </div>

          <button
            onClick={reset}
            className="mt-6 text-sm font-600 text-accent underline-offset-4 hover:underline"
          >
            Start a different challenge
          </button>
        </div>
      )}

      {step === 3 && outcome === "declined" && (
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-muted/15 text-2xl">
            ✦
          </div>
          <h3 className="mt-4 font-serif text-3xl font-500 text-ink-heading">
            No texts — all good.
          </h3>
          <p className="mt-2 text-ink-body">
            You didn&apos;t opt in to messages, so we won&apos;t text you and
            haven&apos;t saved your number. The challenge is delivered by text —
            if you&apos;d like it, just opt in.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={() => {
                setOutcome(null);
                setStep(2);
              }}
              className="btn-cta"
            >
              ← Opt in and start
            </button>
            <a
              href="https://www.belegendary.org/"
              className="text-sm font-600 text-accent underline-offset-4 hover:underline"
            >
              Explore Be Legendary instead →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// "08:00" → "8 a.m.", "16:30" → "4:30 p.m."
function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h < 12 ? "a.m." : "p.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0
    ? `${h12} ${period}`
    : `${h12}:${String(m).padStart(2, "0")} ${period}`;
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
