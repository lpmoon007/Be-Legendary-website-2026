import { formatInTimeZone } from "date-fns-tz";

// The scheduler resolves "who is due" entirely in Postgres (see due_messages()),
// so these helpers only handle the app-side pieces: computing a user's *local*
// calendar date when we receive an inbound reply, and validating IANA zones.

/** The user's local calendar date (YYYY-MM-DD) at instant `at`. DST-safe. */
export function localDateISO(timezone: string, at: Date = new Date()): string {
  return formatInTimeZone(at, timezone, "yyyy-MM-dd");
}

/** Is this a valid IANA timezone the runtime knows about? */
export function isValidTimezone(timezone: string): boolean {
  try {
    // Throws RangeError for unknown zones.
    Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

// A pragmatic list of US zones for the admin "add user" dropdown. IANA names —
// never fixed UTC offsets — so DST is handled automatically.
export const COMMON_TIMEZONES: { value: string; label: string }[] = [
  { value: "America/New_York", label: "Eastern (New York)" },
  { value: "America/Chicago", label: "Central (Chicago)" },
  { value: "America/Denver", label: "Mountain (Denver)" },
  { value: "America/Phoenix", label: "Mountain — no DST (Phoenix)" },
  { value: "America/Los_Angeles", label: "Pacific (Los Angeles)" },
  { value: "America/Anchorage", label: "Alaska (Anchorage)" },
  { value: "Pacific/Honolulu", label: "Hawaii (Honolulu)" },
  { value: "Europe/London", label: "UK (London)" },
];
