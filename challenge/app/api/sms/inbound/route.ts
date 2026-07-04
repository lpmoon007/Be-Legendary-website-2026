import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  EMPTY_TWIML,
  sendSms,
  validateTwilioSignature,
} from "@/lib/twilio";
import { processInbound, type ConversationState } from "@/lib/conversation";
import { isStopKeyword } from "@/lib/phone";
import { localDateISO } from "@/lib/timezone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function twiml(body = EMPTY_TWIML) {
  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(req: NextRequest) {
  // Twilio posts application/x-www-form-urlencoded.
  const form = await req.formData();
  const params: Record<string, string> = {};
  for (const [k, v] of form.entries()) params[k] = String(v);

  // ── Signature validation (required on every inbound request) ──────────────
  // The URL Twilio signed is the public webhook URL. Prefer the configured app
  // URL so validation works behind Vercel's proxy.
  const path = "/api/sms/inbound";
  const base = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get("host")}`;
  const url = `${base.replace(/\/$/, "")}${path}`;
  const signature = req.headers.get("x-twilio-signature");

  if (!validateTwilioSignature(signature, url, params)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const from = params.From;
  const body = (params.Body ?? "").trim();
  if (!from) return twiml();

  const supabase = createAdminClient();

  // ── Look up the participant ───────────────────────────────────────────────
  const { data: user } = await supabase
    .from("users")
    .select("id, timezone")
    .eq("phone", from)
    .maybeSingle();

  // Unknown number: log for the record (no user_id), then ignore. No reply.
  if (!user) {
    await supabase.from("sms_log").insert({
      user_id: null,
      direction: "inbound",
      body,
      twilio_sid: params.MessageSid ?? null,
    });
    return twiml();
  }

  // Always log the inbound message first.
  await supabase.from("sms_log").insert({
    user_id: user.id,
    direction: "inbound",
    body,
    twilio_sid: params.MessageSid ?? null,
  });

  // ── STOP handling (mirror the carrier-level opt-out in our DB) ─────────────
  if (isStopKeyword(body)) {
    await supabase.from("users").update({ active: false }).eq("id", user.id);
    await supabase
      .from("conversation_state")
      .update({ state: "idle", updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    // Twilio sends the carrier opt-out confirmation; we stay silent.
    return twiml();
  }

  // ── Load conversation state (default idle) ────────────────────────────────
  const { data: convo } = await supabase
    .from("conversation_state")
    .select("state, checkin_date")
    .eq("user_id", user.id)
    .maybeSingle();

  const state: ConversationState =
    (convo?.state as ConversationState) ?? "idle";
  // The day a score/journal belongs to: the one set when the 4pm text went out,
  // falling back to the user's local "today".
  const checkinDate = convo?.checkin_date ?? localDateISO(user.timezone);

  const action = processInbound(state, body);

  // ── Apply check-in mutations ──────────────────────────────────────────────
  if (action.setScore !== undefined) {
    await supabase.from("checkins").upsert(
      {
        user_id: user.id,
        date: checkinDate,
        score: action.setScore,
        score_received_at: new Date().toISOString(),
      },
      { onConflict: "user_id,date" }
    );
  }

  if (action.setJournal !== undefined) {
    await supabase
      .from("checkins")
      .update({
        journal_entry: action.setJournal,
        journal_received_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("date", checkinDate);
  }

  // ── Advance conversation state ────────────────────────────────────────────
  await supabase.from("conversation_state").upsert(
    {
      user_id: user.id,
      state: action.nextState,
      checkin_date: checkinDate,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  // ── Send the reply, log it ────────────────────────────────────────────────
  if (action.reply) {
    try {
      const sid = await sendSms(from, action.reply);
      await supabase.from("sms_log").insert({
        user_id: user.id,
        direction: "outbound",
        body: action.reply,
        twilio_sid: sid,
      });
    } catch (err) {
      // Don't fail the webhook if Twilio hiccups — Twilio would otherwise retry.
      console.error("Failed to send reply SMS:", err);
    }
  }

  return twiml();
}
