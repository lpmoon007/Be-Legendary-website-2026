// ─── Single source of truth for every SMS body ──────────────────────────────
// These exact strings are also matched by the `due_messages()` SQL function's
// duplicate guard (it keys on the "Morning." and "It's 4 p.m." prefixes) and by
// the Edge Function. If you change a prefix here, update supabase/migrations too.

export const messages = {
  morning: (commitment: string) =>
    `Morning. Today's rep: ${commitment}. You've got this.`,

  // Private-mode morning nudge — never names the behavior. Keeps the "Morning."
  // prefix so the duplicate guard in due_messages() still matches.
  morningPrivate: () => `Morning. You know today's rep. Go do it — you've got this.`,

  // Afternoon check-in rates today's EFFORT, 1–10. Keeps the "It's 4 p.m."
  // prefix so the duplicate guard still matches.
  afternoon: () => `It's 4 p.m. — how'd your effort go today? Rate it 1–10.`,

  lowPrompt: () => `What got in the way today?`,

  highPrompt: (score: number) =>
    `An ${score} — strong. What made it land today?`,

  midAck: () => `Got it. See you tomorrow.`,

  journalAck: () => `Logged. Keep building.`,

  reprompt: () => `Reply with a number between 1 and 10.`,

  idle: () =>
    `Nothing to respond to right now. You'll hear from me tomorrow morning.`,

  // Auto-nudge after 3 silent days. Warm, conversational, no pressure.
  // The distinctive phrase "quiet days" is how due_nudges() dedupes (once/streak),
  // so keep those two words if you edit this.
  nudge: (name?: string) =>
    `Hey${name ? ` ${name}` : ""} — it's been a few quiet days, and that's okay. No judgment here. Just checking: everything alright? I'm still in your corner whenever you're ready to pick it back up.`,
} as const;
