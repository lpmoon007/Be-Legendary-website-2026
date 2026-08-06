# Be Legendary — 30-Day Challenge · Setup

Everything is built. This is the exact, ordered checklist to take it live. It
assumes you already have the Supabase project and Twilio number (you do). Where I
need a value **from you**, it's marked **→ SEND ME**. Where you paste a value
**into a service**, it's marked **⌦ PASTE**.

Total time: ~30–40 minutes.

---

## What you'll need open
- Supabase dashboard (your project)
- Twilio console
- Vercel dashboard
- This repo (`challenge/` folder)

---

## Step 1 — Run the database migrations (5 min)

1. Supabase → **SQL Editor** → **New query**.
2. Run **every file in `challenge/supabase/migrations/` in order** (`001` →
   `010`): open each, copy the whole file, paste, **Run**. Each returns "Success.
   No rows returned." They're additive and re-runnable.
   - `001` creates the 4 tables, indexes, RLS, `due_messages()`.
   - `002`–`008` add: nudges, the 8 a.m. default, workout enrollment, private
     mode, configurable check-in time, the "why" field, and the accountability
     partner (buddy) + `due_buddy_nudges()`.
   - `009` adds deep-link attribution: `source` (channel) + `source_ref` (opaque
     id round-tripped back to the source, e.g. a TeamLFS completion webhook).
   - `010` adds the completion round-trip: `completion_notified_at` +
     `due_completions()` (inert until the webhook env vars in Step 5 are set).
   - The `pg_cron` schedule block at the bottom of `001` stays **commented** — we
     turn it on in Step 6.
3. Verify: Supabase → **Table editor** → you should see `users`, `checkins`,
   `sms_log`, `conversation_state`.

> The timezone problem is solved inside `due_messages()` / `due_nudges()` /
> `due_buddy_nudges()`: they ask Postgres `now() AT TIME ZONE users.timezone`, so
> DST is always correct and we never store a UTC offset.

---

## Step 2 — Create the single admin (coach) login (2 min)

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your email + a password. Check **Auto Confirm User**.
   - This is the account you'll use at `/admin`.

---

## Step 3 — Collect the credentials (5 min)

Gather these. You'll paste them into Vercel in Step 5. **→ SEND ME** only if you'd
like me to double-check them; otherwise you can enter them yourself.

From **Supabase → Settings → API**:
- `Project URL`            → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key      → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key       → `SUPABASE_SERVICE_ROLE_KEY`  *(secret — server only)*

From **Twilio → Console home**:
- `Account SID`            → `TWILIO_ACCOUNT_SID`
- `Auth Token`            → `TWILIO_AUTH_TOKEN`
- Your Twilio number (E.164, e.g. `+13035551234`) → `TWILIO_PHONE_NUMBER`

Generate one shared secret for the scheduler (run locally, or use any long random string):
```bash
openssl rand -hex 32          #  → CRON_SECRET
```

Also decide your final URL:
- `NEXT_PUBLIC_APP_URL = https://challenge.belegendary.org`

---

## Step 4 — Deploy to Vercel (10 min)

The app lives in the `challenge/` subfolder of this repo; the existing Astro
marketing site at the repo root is untouched.

1. Vercel → **Add New… → Project** → import `lpmoon007/be-legendary-website-2026`.
2. **Root Directory**: click **Edit** and set it to **`challenge`**. (Critical —
   this is what keeps it separate from the Astro site.)
3. Framework preset auto-detects **Next.js**. Leave build/output defaults.
4. Don't deploy yet — add env vars first (Step 5), then deploy.

---

## Step 5 — Set environment variables in Vercel (5 min)

Vercel → your project → **Settings → Environment Variables**. Add each of these
(**⌦ PASTE** the values from Step 3), for **Production** (and Preview if you want):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_MESSAGING_SERVICE_SID` | your A2P Messaging Service SID (`MG…`) — **required for 10DLC** |
| `TWILIO_PHONE_NUMBER` | your Twilio number, E.164 (fallback if no Messaging Service) |
| `NEXT_PUBLIC_APP_URL` | `https://challenge.belegendary.org` |
| `CRON_SECRET` | the random string from Step 3 |
| `TEAMLFS_WEBHOOK_URL` | *(optional)* source's completion endpoint — leave unset to keep the round-trip off |
| `TEAMLFS_WEBHOOK_SECRET` | *(optional)* shared secret, sent as the `X-Webhook-Secret` header |
| `TEAMLFS_WEBHOOK_SOURCE` | *(optional)* which channel's completions to send there (default `lfs`) |

> **Completion round-trip (optional).** The last three are for sending a
> participant's 30-day results back to the system that referred them (matched on
> the opaque `ref` from their deep link). Leave them unset and the feature is
> **inert** — nothing fires. Set `TEAMLFS_WEBHOOK_URL` **and**
> `TEAMLFS_WEBHOOK_SECRET` (both required) once the source gives you their
> endpoint + secret, and `/api/send` will POST `{ ref, days_logged, week1_avg,
> week4_avg }` once per participant after day 30.

> **Why the Messaging Service SID matters:** for A2P 10DLC, outbound must send
> **through the Messaging Service** tied to your approved campaign — sending from
> the raw number gets filtered by carriers. Set `TWILIO_MESSAGING_SERVICE_SID`
> (Twilio → Messaging → Services → your service → the `MG…` at the top) and the
> app routes through it automatically. Confirm your number is in that service's
> **Sender Pool**.

Then **Deploy**. When it's green, you'll have a `*.vercel.app` URL. Test:
- `https://<your>.vercel.app/` → enrollment page
- `https://<your>.vercel.app/admin` → redirects to login → sign in with Step 2 account

---

## Step 6 — Turn on the scheduler (5 min)

Two small pieces: the Edge Function (a thin forwarder) and the pg_cron job.

**6a. Deploy the Edge Function** (needs the [Supabase CLI](https://supabase.com/docs/guides/cli)):
```bash
cd challenge
supabase link --project-ref <YOUR-PROJECT-REF>
supabase functions deploy send-scheduled-messages --no-verify-jwt
supabase secrets set APP_URL=https://challenge.belegendary.org CRON_SECRET=<same CRON_SECRET as Vercel>
```

**6b. Schedule it.** Supabase → **SQL Editor**, paste this (fill the two
placeholders), **Run**:
```sql
select cron.schedule(
  'send-scheduled-messages',
  '* * * * *',
  $$
  select net.http_post(
    url     := 'https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/send-scheduled-messages',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer <YOUR-SERVICE_ROLE_KEY>'
    ),
    body := '{}'::jsonb
  );
  $$
);
```
Check it's registered: `select jobname, schedule, active from cron.job;`

> Prefer no CLI? You can instead point pg_cron straight at
> `https://challenge.belegendary.org/api/send` with header
> `Authorization: Bearer <CRON_SECRET>` and skip 6a entirely. The Edge Function
> just keeps the secret out of the `cron.job` table.

---

## Step 7 — Wire the Twilio inbound webhook (3 min)

⚠️ **Set this on the MESSAGING SERVICE, not the phone number.** Once a number is
attached to a Messaging Service, the service's inbound handler **overrides** the
number's own webhook — a webhook set on the number is silently ignored.

Twilio → **Messaging → Services →** your service → **Integration**:
- Under **Incoming Messages**, choose **"Send a webhook."**
- **Request URL:** `https://challenge.belegendary.org/api/sms/inbound` → **HTTP POST**.
- Save.

Signature validation is enforced on every request, so this must be the exact
public URL (it's checked against `NEXT_PUBLIC_APP_URL`).

> If you're **not** using a Messaging Service, set the same webhook on the number
> instead: Phone Numbers → your number → Messaging → "A message comes in."

---

## Step 8 — Point the domain at Vercel (5 min + DNS propagation)

1. Vercel → project → **Settings → Domains** → add `challenge.belegendary.org`.
2. Vercel shows a **CNAME** target (usually `cname.vercel-dns.com`).
3. In your DNS host, add:  `challenge` **CNAME** → `cname.vercel-dns.com`.
4. Wait for it to verify (minutes to an hour). SSL is automatic.

---

## Step 9 — End-to-end smoke test (5 min)

1. Add yourself: `/admin/users/new` → your name, **your real mobile**, timezone,
   a commitment, and set the **afternoon time to 1–2 minutes from now** (local).
2. Within a minute you should get the 4 p.m. text. Reply `8` → you get the
   "strong / what made it land" prompt. Reply a sentence → "Logged. Keep building."
3. Check `/admin` → your score shows; `/admin/users/[id]` → chart + journal row.
4. Reset the afternoon time back to `16:00` when done.

That's live. 🎉

---

## Reference: what talks to what
```
Participant ─SMS─ Twilio ─POST /api/sms/inbound─ Next.js ─ Supabase
                                                   │
pg_cron (every min) ─ Edge Fn ─POST /api/send─ Next.js ─ due_messages() ─ Twilio ─ Participant
Coach ─ /admin (Supabase Auth) ─ Next.js ─ Supabase
```

## Troubleshooting
- **No scheduled texts?** `select * from cron.job_run_details order by start_time desc limit 5;`
  then hit `/api/send` manually: `curl -X POST -H "Authorization: Bearer <CRON_SECRET>" https://challenge.belegendary.org/api/send`.
- **Inbound 403?** `NEXT_PUBLIC_APP_URL` must match the Twilio webhook URL exactly.
- **Admin 500 / can't log in?** Re-check the three Supabase env vars in Vercel and redeploy.
- **Wrong send time?** Confirm the user's `timezone` is a valid IANA name (e.g. `America/Denver`).
