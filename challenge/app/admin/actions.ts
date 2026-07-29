"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toE164, digitCount } from "@/lib/phone";
import { isValidTimezone } from "@/lib/timezone";
import { sendSms } from "@/lib/twilio";
import { inviteBuddy } from "@/lib/buddy";

// All admin mutations run through the request-bound (authenticated) server
// client, which RLS grants full access. The middleware guarantees a session.

export type CreateUserState = { error?: string };

export async function createUser(
  _prev: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const supabase = createClient();

  const name = String(formData.get("name") ?? "").trim();
  const rawPhone = String(formData.get("phone") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim();
  const commitment = String(formData.get("commitment") ?? "").trim();
  // `|| default` (not `??`) so an empty string from a cleared time input still
  // falls back to a valid time instead of hitting the DB as "".
  const morning_time = String(formData.get("morning_time") || "08:00");
  const afternoon_time = String(formData.get("afternoon_time") || "16:00");

  if (!name || !commitment)
    return { error: "Name and commitment are required." };
  if (digitCount(rawPhone) < 10)
    return { error: "Enter a valid phone number." };
  if (!isValidTimezone(timezone))
    return { error: "Choose a valid timezone." };

  const phone = toE164(rawPhone);
  if (!phone)
    return { error: "That phone number couldn't be read. Try a 10-digit US number or +country format." };

  let userId: string;
  try {
    // Friendly guard for the UNIQUE(phone) constraint — the coach may be adding
    // someone who already self-enrolled.
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (existing) {
      return {
        error:
          "A participant with that phone number already exists. Open them from the roster instead.",
      };
    }

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        phone,
        timezone,
        commitment,
        morning_time,
        afternoon_time,
        active: true,
      })
      .select("id")
      .single();

    if (error || !user) {
      return { error: error?.message ?? "Could not create participant." };
    }

    await supabase
      .from("conversation_state")
      .insert({ user_id: user.id, state: "idle" });

    userId = user.id;
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not create participant.",
    };
  }

  revalidatePath("/admin");
  redirect(`/admin/users/${userId}`); // NEXT_REDIRECT — must stay outside try/catch
}

export async function updateCommitment(userId: string, commitment: string) {
  const supabase = createClient();
  const value = commitment.trim();
  if (!value) throw new Error("Commitment cannot be empty.");
  const { error } = await supabase
    .from("users")
    .update({ commitment: value })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/users/${userId}`);
}

/**
 * Coach sends a free-form SMS to a participant; logs it to the thread.
 * Returns { error } (never throws) so the UI can surface the real Twilio reason
 * — Next.js sanitizes thrown server-action errors in production.
 */
export async function sendCoachMessage(
  userId: string,
  body: string
): Promise<{ error?: string }> {
  const supabase = createClient();
  const text = body.trim();
  if (!text) return { error: "Message cannot be empty." };

  const { data: user, error } = await supabase
    .from("users")
    .select("phone")
    .eq("id", userId)
    .maybeSingle();
  if (error || !user) return { error: "Participant not found." };

  let sid: string;
  try {
    sid = await sendSms(user.phone, text);
  } catch (e) {
    const detail = e instanceof Error ? e.message : "Unknown error";
    return { error: `Twilio couldn't send this message — ${detail}` };
  }

  await supabase.from("sms_log").insert({
    user_id: userId,
    direction: "outbound",
    body: text,
    twilio_sid: sid,
  });

  revalidatePath(`/admin/users/${userId}`);
  return {};
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:MM 24-hour

export async function updateSchedule(
  userId: string,
  morning: string,
  afternoon: string,
  timezone: string
) {
  const supabase = createClient();
  if (!TIME_RE.test(morning) || !TIME_RE.test(afternoon)) {
    throw new Error("Enter valid times (HH:MM).");
  }
  if (!isValidTimezone(timezone)) {
    throw new Error("Choose a valid timezone.");
  }
  const { error } = await supabase
    .from("users")
    .update({ morning_time: morning, afternoon_time: afternoon, timezone })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/users/${userId}`);
}

/** Coach adds/changes a participant's accountability partner + sends the invite. */
export async function setBuddy(
  userId: string,
  buddyName: string,
  buddyPhone: string
): Promise<{ error?: string }> {
  const supabase = createClient();
  if (digitCount(buddyPhone) < 10) {
    return { error: "Enter a valid partner mobile number." };
  }
  const { data: u } = await supabase
    .from("users")
    .select("name")
    .eq("id", userId)
    .maybeSingle();

  const res = await inviteBuddy(
    supabase,
    userId,
    u?.name ?? null,
    buddyName.trim() || null,
    buddyPhone
  );
  if (!res.ok) return { error: res.error };
  revalidatePath(`/admin/users/${userId}`);
  return {};
}

export async function toggleActive(userId: string, active: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("users")
    .update({ active })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin");
}
