import type { SupabaseClient } from "@supabase/supabase-js";
import { messages } from "./messages";
import { sendSms } from "./twilio";
import { toE164 } from "./phone";

// Set/replace a participant's accountability partner and send the double-opt-in
// invite. Shared by /api/enroll (service-role client) and the coach action
// (authenticated client). Buddy activation only happens after they reply YES.
export async function inviteBuddy(
  supabase: SupabaseClient,
  userId: string,
  participantName: string | null,
  buddyName: string | null,
  rawBuddyPhone: string
): Promise<{ ok: boolean; error?: string }> {
  const buddyPhone = toE164(rawBuddyPhone);
  if (!buddyPhone) {
    return { ok: false, error: "That partner phone number doesn't look right." };
  }

  await supabase
    .from("users")
    .update({
      buddy_name: buddyName || null,
      buddy_phone: buddyPhone,
      buddy_status: "pending",
      buddy_invited_at: new Date().toISOString(),
    })
    .eq("id", userId);

  const body = messages.buddyInvite(
    participantName || "Someone you know",
    buddyName || undefined
  );

  try {
    const sid = await sendSms(buddyPhone, body);
    await supabase.from("sms_log").insert({
      user_id: userId,
      direction: "outbound",
      body,
      twilio_sid: sid,
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not text the partner.",
    };
  }

  return { ok: true };
}
