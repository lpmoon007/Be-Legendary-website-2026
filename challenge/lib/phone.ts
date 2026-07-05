// Lightweight E.164 normalization for US/CA numbers, with a graceful fallback
// for numbers the enroller typed with an explicit "+" country code.

/** Digit count of the raw input, used for the ">= 10 digits" enrollment gate. */
export function digitCount(raw: string): number {
  return (raw.match(/\d/g) || []).length;
}

/**
 * Normalize to E.164 (+1XXXXXXXXXX). Returns null if it can't be made valid.
 *  - 10 digits            → assume US/CA, prefix +1
 *  - 11 digits, leads 1   → prefix +
 *  - already +CC...       → strip spacing/punctuation, keep
 */
export function toE164(raw: string): string | null {
  const trimmed = raw.trim();

  if (trimmed.startsWith("+")) {
    const digits = trimmed.slice(1).replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15 ? `+${digits}` : null;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

const STOP_KEYWORDS = new Set([
  "STOP",
  "STOPALL",
  "UNSUBSCRIBE",
  "CANCEL",
  "END",
  "QUIT",
]);

/** Twilio also enforces these at the carrier level; we mirror them in the DB. */
export function isStopKeyword(body: string): boolean {
  return STOP_KEYWORDS.has(body.trim().toUpperCase());
}
