import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { toE164, digitCount } from "@/lib/phone";
import { isValidTimezone } from "@/lib/timezone";
import { inviteBuddy } from "@/lib/buddy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The marketing site (belegendary.org) posts here cross-origin from the Mindset
// Workout commitment block, so we allow those origins for browser fetches.
const ALLOWED_ORIGINS = new Set([
  "https://www.belegendary.org",
  "https://belegendary.org",
]);
function corsHeaders(origin: string | null): Record<string, string> {
  const allow =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://www.belegendary.org";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

interface EnrollBody {
  name?: string;
  phone?: string;
  // The daily rep / lead measure. `commitment` = landing page; `lead_measure` = workout block.
  commitment?: string;
  lead_measure?: string;
  timezone?: string;
  consent?: boolean;
  // Private mode (challenge landing page): keep the behavior + reflections private.
  private?: boolean;
  // Optional "why this matters" motivation (Actionable Factor #1).
  why?: string;
  // Optional accountability partner (Actionable Factor #3).
  buddy_name?: string;
  buddy_phone?: string;
  // Workout-block extras (additive; require the workout-enroll migration).
  workout_id?: string;
  email?: string;
  // The chosen daily nudge time (HH:MM). Replaces the fixed 8 a.m. morning nudge.
  reminder_time?: string;
  // The chosen afternoon check-in time (HH:MM). Replaces the fixed 4 p.m. check-in.
  reflection_time?: string;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  const json = (body: unknown, status?: number) =>
    NextResponse.json(body, { status: status ?? 200, headers: cors });

  let payload: EnrollBody;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const name = payload.name?.trim() || null;
  const rawPhone = payload.phone?.trim() ?? "";
  const isPrivate = payload.private === true;
  // Accept either field name; the two flows use different keys for the same thing.
  // In private mode the real behavior never leaves the browser — store a
  // placeholder so the coach (and the DB) never sees it; the morning nudge is generic.
  const commitment = isPrivate
    ? "(private)"
    : (payload.commitment ?? payload.lead_measure)?.trim();
  const consent = payload.consent === true;
  const timezone =
    payload.timezone && isValidTimezone(payload.timezone)
      ? payload.timezone
      : "America/Denver";
  const workoutId = payload.workout_id?.trim() || null;
  const email = payload.email?.trim() || null;
  // Not stored in private mode (it may itself be personal).
  const why = isPrivate ? null : payload.why?.trim() || null;
  const buddyName = payload.buddy_name?.trim() || null;
  const buddyPhoneRaw = payload.buddy_phone?.trim() || null;
  // The user's chosen times replace the fixed 8 a.m. nudge and 4 p.m. check-in.
  const morningTime =
    payload.reminder_time && TIME_RE.test(payload.reminder_time)
      ? payload.reminder_time
      : "08:00";
  const afternoonTime =
    payload.reflection_time && TIME_RE.test(payload.reflection_time)
      ? payload.reflection_time
      : "16:00";

  // ── Validation (name is optional — the workout block doesn't collect it) ───
  if (!commitment) {
    return json({ error: "Choose a lead measure." }, 400);
  }
  if (!consent) {
    return json({ error: "SMS consent is required to enroll." }, 400);
  }
  if (digitCount(rawPhone) < 10) {
    return json({ error: "Enter a valid mobile number." }, 400);
  }

  const phone = toE164(rawPhone);
  if (!phone) {
    return json({ error: "That mobile number doesn't look right." }, 400);
  }

  const supabase = createAdminClient();

  // Already enrolled? Reactivate + update their rep rather than erroring out.
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    const update: Record<string, unknown> = {
      commitment,
      timezone,
      morning_time: morningTime,
      afternoon_time: afternoonTime,
      active: true,
    };
    if (name) update.name = name;
    if (workoutId) update.workout_id = workoutId;
    if (email) update.email = email;
    if (why) update.why = why;
    // Only reference the private column when it's set (works pre-migration for
    // the common non-private flows).
    if (isPrivate) update.is_private = true;
    await supabase.from("users").update(update).eq("id", existing.id);
    await supabase
      .from("conversation_state")
      .upsert(
        { user_id: existing.id, state: "idle", updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    // Optional accountability partner (non-fatal — never blocks enrollment).
    if (buddyPhoneRaw) {
      await inviteBuddy(supabase, existing.id, name, buddyName, buddyPhoneRaw);
    }
    return json({ ok: true, id: existing.id, reactivated: true });
  }

  // Build the insert conditionally so a flow never references a column that its
  // migration hasn't added yet (workout columns, private flag).
  const insert: Record<string, unknown> = {
    name,
    phone,
    commitment,
    timezone,
    morning_time: morningTime,
    afternoon_time: afternoonTime,
    active: true,
  };
  if (workoutId) insert.workout_id = workoutId;
  if (email) insert.email = email;
  if (why) insert.why = why;
  if (isPrivate) insert.is_private = true;

  const { data: user, error } = await supabase
    .from("users")
    .insert(insert)
    .select("id")
    .single();

  if (error || !user) {
    console.error("Enroll insert failed:", error);
    return json({ error: "Could not complete enrollment. Please try again." }, 500);
  }

  await supabase.from("conversation_state").insert({
    user_id: user.id,
    state: "idle",
  });

  // Optional accountability partner (non-fatal — never blocks enrollment).
  if (buddyPhoneRaw) {
    await inviteBuddy(supabase, user.id, name, buddyName, buddyPhoneRaw);
  }

  return json({ ok: true, id: user.id });
}
