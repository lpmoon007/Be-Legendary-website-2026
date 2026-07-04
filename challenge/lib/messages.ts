// ─── Single source of truth for every SMS body ──────────────────────────────
// These exact strings are also matched by the `due_messages()` SQL function's
// duplicate guard (it keys on the "Morning." and "It's 4 p.m." prefixes) and by
// the Edge Function. If you change a prefix here, update supabase/migrations too.

export const messages = {
  morning: (commitment: string) =>
    `Morning. Today's rep: ${commitment}. You've got this.`,

  afternoon: () => `It's 4 p.m. — how'd today go, 1–10?`,

  lowPrompt: () => `What got in the way today?`,

  highPrompt: (score: number) =>
    `An ${score} — strong. What made it land today?`,

  midAck: () => `Got it. See you tomorrow.`,

  journalAck: () => `Logged. Keep building.`,

  reprompt: () => `Reply with a number between 1 and 10.`,

  idle: () =>
    `Nothing to respond to right now. You'll hear from me tomorrow morning.`,
} as const;
