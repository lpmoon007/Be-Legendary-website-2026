// Completion webhook — round-trips a participant's 30-day results back to the
// system that sent them (via the deep-link `ref`, migration 009). It is fully
// INERT until a URL + shared secret are configured, so nothing fires in an
// unconfigured environment.
//
// Configure with env vars (server-only, never NEXT_PUBLIC_):
//   TEAMLFS_WEBHOOK_URL     — the source's endpoint (e.g. https://…/api/challenge/webhook)
//   TEAMLFS_WEBHOOK_SECRET  — shared secret; sent as the X-Webhook-Secret header so
//                             the receiver can verify the call came from us
//   TEAMLFS_WEBHOOK_SOURCE  — which channel's completions to send here (default 'lfs');
//                             a user's `source` must match this to be round-tripped

export interface CompletionRow {
  user_id: string;
  source: string | null;
  source_ref: string;
  days_logged: number;
  week1_avg: number | null;
  week4_avg: number | null;
}

export interface CompletionWebhookConfig {
  url: string;
  secret: string;
  source: string;
}

/**
 * Read the webhook config from the environment. Returns null (→ inert) unless
 * BOTH the URL and the secret are set — this is the switch that keeps the whole
 * feature dormant until the source hands over their endpoint + secret.
 */
export function completionWebhookConfig(): CompletionWebhookConfig | null {
  const url = process.env.TEAMLFS_WEBHOOK_URL?.trim();
  const secret = process.env.TEAMLFS_WEBHOOK_SECRET?.trim();
  if (!url || !secret) return null;
  const source = process.env.TEAMLFS_WEBHOOK_SOURCE?.trim() || "lfs";
  return { url, secret, source };
}

/**
 * POST one participant's completion summary to the source. Keyed on the opaque
 * `ref` the source originally passed in (stored as source_ref). Never throws —
 * returns an ok/error result so the caller decides whether to mark it done.
 */
export async function postCompletion(
  config: CompletionWebhookConfig,
  row: CompletionRow
): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": config.secret,
      },
      body: JSON.stringify({
        ref: row.source_ref,
        days_logged: row.days_logged,
        week1_avg: row.week1_avg,
        week4_avg: row.week4_avg,
      }),
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
