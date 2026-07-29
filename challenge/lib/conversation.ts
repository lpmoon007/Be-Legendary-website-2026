import { messages } from "./messages";

// ─── The inbound conversation state machine (pure, no I/O) ───────────────────
// Given the current state and the raw inbound body, decide what to reply and how
// to mutate state + the day's checkin. The route handler performs the DB writes
// and the Twilio send; keeping this pure makes the whole flow unit-testable.

export type ConversationState = "idle" | "awaiting_score" | "awaiting_journal";

export interface InboundAction {
  reply: string | null; // null → send nothing
  nextState: ConversationState;
  setScore?: number; // upsert onto today's checkin
  setJournal?: string; // update today's checkin
}

/**
 * Parse a 1–10 score. Accepts a bare integer ("8") and is forgiving of a score
 * embedded in a short reply ("I'd say 8", "8/10", "8!"). Anything not resolving
 * to an integer in 1–10 returns null → re-prompt.
 */
export function parseScore(body: string): number | null {
  const trimmed = body.trim();

  if (/^\d+$/.test(trimmed)) {
    const n = parseInt(trimmed, 10);
    return n >= 1 && n <= 10 ? n : null;
  }

  // First standalone 1–10 token anywhere in a short reply.
  const m = trimmed.match(/(?:^|\s)(10|[1-9])(?=$|\s|[.!,?/])/);
  if (m) {
    const n = parseInt(m[1], 10);
    return n >= 1 && n <= 10 ? n : null;
  }

  return null;
}

export function processInbound(
  state: ConversationState,
  rawBody: string
): InboundAction {
  const body = rawBody.trim();

  switch (state) {
    case "awaiting_score": {
      const score = parseScore(body);
      if (score === null) {
        return { reply: messages.reprompt(), nextState: "awaiting_score" };
      }
      if (score >= 1 && score <= 4) {
        return {
          reply: messages.lowPrompt(),
          nextState: "awaiting_journal",
          setScore: score,
        };
      }
      if (score >= 8 && score <= 10) {
        return {
          reply: messages.highPrompt(score),
          nextState: "awaiting_journal",
          setScore: score,
        };
      }
      // 5–7: still invite a one-line reflection. Research (Actionable 2025) shows
      // journaling frequency drives behavior change regardless of sentiment — so
      // every check-in gets a reflection opportunity, not just the highs and lows.
      return {
        reply: messages.midPrompt(),
        nextState: "awaiting_journal",
        setScore: score,
      };
    }

    case "awaiting_journal": {
      // No time limit in v1 — a late reflection still lands on today's checkin.
      return {
        reply: messages.journalAck(),
        nextState: "idle",
        setJournal: body,
      };
    }

    case "idle":
    default:
      return { reply: messages.idle(), nextState: "idle" };
  }
}
