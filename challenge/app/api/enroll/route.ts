import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { toE164, digitCount } from "@/lib/phone";
import { isValidTimezone } from "@/lib/timezone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface EnrollBody {
  name?: string;
  phone?: string;
  commitment?: string;
  timezone?: string;
  consent?: boolean;
}

export async function POST(req: NextRequest) {
  let payload: EnrollBody;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const rawPhone = payload.phone?.trim() ?? "";
  const commitment = payload.commitment?.trim();
  const consent = payload.consent === true;
  const timezone =
    payload.timezone && isValidTimezone(payload.timezone)
      ? payload.timezone
      : "America/Denver";

  // ── Validation (mirrors the client-side gate) ─────────────────────────────
  if (!name) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }
  if (!commitment) {
    return NextResponse.json({ error: "Choose a lead measure." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "SMS consent is required to enroll." },
      { status: 400 }
    );
  }
  if (digitCount(rawPhone) < 10) {
    return NextResponse.json(
      { error: "Enter a valid mobile number." },
      { status: 400 }
    );
  }

  const phone = toE164(rawPhone);
  if (!phone) {
    return NextResponse.json(
      { error: "That mobile number doesn't look right." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Already enrolled? Reactivate + update their rep rather than erroring out.
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("users")
      .update({ name, commitment, timezone, active: true })
      .eq("id", existing.id);
    await supabase
      .from("conversation_state")
      .upsert(
        { user_id: existing.id, state: "idle", updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    return NextResponse.json({ ok: true, id: existing.id, reactivated: true });
  }

  const { data: user, error } = await supabase
    .from("users")
    // Morning 8:00 AM matches the enrollment page's "Day 1 lands at 8 a.m."
    // promise; afternoon uses the 16:00 (4 p.m.) column default.
    .insert({
      name,
      phone,
      commitment,
      timezone,
      morning_time: "08:00",
      active: true,
    })
    .select("id")
    .single();

  if (error || !user) {
    console.error("Enroll insert failed:", error);
    return NextResponse.json(
      { error: "Could not complete enrollment. Please try again." },
      { status: 500 }
    );
  }

  await supabase.from("conversation_state").insert({
    user_id: user.id,
    state: "idle",
  });

  return NextResponse.json({ ok: true, id: user.id });
}
