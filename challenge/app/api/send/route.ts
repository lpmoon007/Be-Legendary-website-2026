import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSms } from "@/lib/twilio";
import { messages } from "@/lib/messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DueRow {
  user_id: string;
  phone: string;
  name: string;
  commitment: string;
  timezone: string;
  is_private: boolean;
  message_type: "morning" | "afternoon";
  local_date: string;
}

interface NudgeRow {
  user_id: string;
  phone: string;
  name: string;
  timezone: string;
  local_date: string;
}

interface BuddyNudgeRow {
  user_id: string;
  participant_name: string;
  buddy_name: string | null;
  buddy_phone: string;
  nudge_type: "week1" | "atrisk";
  local_date: string;
}

// Internal endpoint. The Supabase scheduler (Edge Function / pg_cron) calls this
// every minute with `Authorization: Bearer <CRON_SECRET>`. It asks Postgres who
// is due *right now in their own timezone* (due_messages()), sends each text,
// logs it, and flips conversation_state for afternoon check-ins.
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("due_messages");
  if (error) {
    console.error("due_messages RPC failed:", error);
    return NextResponse.json({ error: "Scheduler query failed" }, { status: 500 });
  }

  const due = (data ?? []) as DueRow[];
  const results: {
    user_id: string;
    type: string;
    ok: boolean;
    error?: string;
  }[] = [];

  for (const row of due) {
    const body =
      row.message_type === "morning"
        ? row.is_private
          ? messages.morningPrivate()
          : messages.morning(row.commitment)
        : messages.afternoon();

    try {
      const sid = await sendSms(row.phone, body);

      await supabase.from("sms_log").insert({
        user_id: row.user_id,
        direction: "outbound",
        body,
        twilio_sid: sid,
      });

      // Afternoon check-in opens the score window.
      if (row.message_type === "afternoon") {
        await supabase.from("conversation_state").upsert(
          {
            user_id: row.user_id,
            state: "awaiting_score",
            checkin_date: row.local_date,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }

      results.push({ user_id: row.user_id, type: row.message_type, ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Send failed for ${row.user_id} (${row.message_type}):`, err);
      results.push({
        user_id: row.user_id,
        type: row.message_type,
        ok: false,
        error: message,
      });
    }
  }

  // ── Auto-nudge silent participants (noon local, 3+ days quiet, once/streak) ──
  const { data: nudgeData, error: nudgeError } = await supabase.rpc("due_nudges");
  if (nudgeError) {
    console.error("due_nudges RPC failed:", nudgeError);
  } else {
    for (const row of (nudgeData ?? []) as NudgeRow[]) {
      const body = messages.nudge(row.name?.split(" ")[0]);
      try {
        const sid = await sendSms(row.phone, body);
        await supabase.from("sms_log").insert({
          user_id: row.user_id,
          direction: "outbound",
          body,
          twilio_sid: sid,
        });
        results.push({ user_id: row.user_id, type: "nudge", ok: true });
      } catch (err) {
        console.error(`Nudge failed for ${row.user_id}:`, err);
        results.push({ user_id: row.user_id, type: "nudge", ok: false });
      }
    }
  }

  // ── Accountability-partner nudges (week-1 + at-risk, confirmed buddies) ─────
  const { data: buddyData, error: buddyError } = await supabase.rpc(
    "due_buddy_nudges"
  );
  if (buddyError) {
    console.error("due_buddy_nudges RPC failed:", buddyError);
  } else {
    for (const row of (buddyData ?? []) as BuddyNudgeRow[]) {
      const body =
        row.nudge_type === "week1"
          ? messages.buddyWeek1(row.participant_name)
          : messages.buddyAtRisk(row.participant_name);
      try {
        const sid = await sendSms(row.buddy_phone, body);
        // Logged under the participant's user_id (the buddy isn't a user).
        await supabase.from("sms_log").insert({
          user_id: row.user_id,
          direction: "outbound",
          body,
          twilio_sid: sid,
        });
        results.push({
          user_id: row.user_id,
          type: `buddy_${row.nudge_type}`,
          ok: true,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`Buddy nudge failed for ${row.user_id}:`, err);
        results.push({
          user_id: row.user_id,
          type: `buddy_${row.nudge_type}`,
          ok: false,
          error: message,
        });
      }
    }
  }

  return NextResponse.json({
    due: due.length,
    processed: results.length,
    results,
  });
}

// Allow GET for a quick "is it wired?" health check (still secret-gated).
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, service: "send-scheduled-messages" });
}
