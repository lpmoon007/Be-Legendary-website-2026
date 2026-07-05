// Supabase Edge Function — invoked every minute by pg_cron.
//
// Thin forwarder: it holds the app URL + shared secret as Supabase secrets and
// pokes the Next.js /api/send endpoint, which owns all the timezone/Twilio/
// logging logic (single source of truth). Keeping the secret here means it isn't
// stored in the cron.job table.
//
// Deploy:   supabase functions deploy send-scheduled-messages --no-verify-jwt
// Secrets:  supabase secrets set APP_URL=https://challenge.belegendary.org CRON_SECRET=...
//
// Deno runtime — this file is intentionally excluded from the Next.js tsconfig.

Deno.serve(async () => {
  const appUrl = Deno.env.get("APP_URL");
  const cronSecret = Deno.env.get("CRON_SECRET");

  if (!appUrl || !cronSecret) {
    return new Response(
      JSON.stringify({ error: "APP_URL / CRON_SECRET not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = await fetch(`${appUrl.replace(/\/$/, "")}/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cronSecret}`,
    },
    body: "{}",
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
});
