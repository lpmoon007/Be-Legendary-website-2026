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
  const results: { user_id: string; type: string; ok: boolean }[] = [];

  for (const row of due) {
    const body =
      row.message_type === "morning"
        ? messages.morning(row.commitment)
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
      console.error(`Send failed for ${row.user_id} (${row.message_type}):`, err);
      results.push({ user_id: row.user_id, type: row.message_type, ok: false });
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

  return NextResponse.json({ processed: results.length, results });
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
