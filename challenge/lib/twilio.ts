import twilio from "twilio";

// Server-only Twilio helper. Lazily constructed so a missing env var during a
// build/prerender doesn't crash — it only throws when an SMS is actually sent.

let cached: ReturnType<typeof twilio> | null = null;

function client() {
  if (cached) return cached;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error("Twilio credentials are not configured.");
  }
  cached = twilio(sid, token);
  return cached;
}

export async function sendSms(to: string, body: string): Promise<string> {
  const raw = process.env.TWILIO_PHONE_NUMBER;
  if (!raw) throw new Error("TWILIO_PHONE_NUMBER is not configured.");
  // Twilio requires the From number in E.164 (+15551234567). Tolerate a value
  // set without the leading "+" (or with spaces/dashes) rather than failing.
  const from = raw.trim().startsWith("+")
    ? raw.trim()
    : `+${raw.replace(/[^\d]/g, "")}`;
  const msg = await client().messages.create({ to, from, body });
  return msg.sid;
}

/**
 * Validate the X-Twilio-Signature header on an inbound webhook. Guards the
 * /api/sms/inbound route against forged requests.
 */
export function validateTwilioSignature(
  signature: string | null,
  url: string,
  params: Record<string, string>
): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token || !signature) return false;
  return twilio.validateRequest(token, signature, url, params);
}

/** Empty TwiML — the correct "we handled it, send nothing more" webhook reply. */
export const EMPTY_TWIML = '<?xml version="1.0" encoding="UTF-8"?><Response/>';
