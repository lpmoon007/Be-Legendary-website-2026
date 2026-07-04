# Be Legendary — 30-Day Challenge

An SMS-first behavioral accountability system. Participants get one morning text
with their daily commitment and one afternoon text asking for a 1–10 score;
high/low scores trigger a one-sentence micro-journal prompt. All of it feeds a
coach-only admin dashboard with 30-day trends.

**The primary interface is SMS.** This web app is the public enrollment page and
the coach's admin dashboard.

> Lives in the `challenge/` subfolder so it deploys independently (Vercel) from
> the Astro marketing site at the repo root (VPS). Deploy with **Root Directory =
> `challenge`**.

## Stack
Next.js 14 (App Router) · Supabase (Postgres + Auth) · Twilio · Tailwind ·
Recharts · pg_cron + Edge Function · Vercel.

## Go live
See **[SETUP.md](./SETUP.md)** for the full ordered checklist (migration → deploy
→ scheduler → Twilio webhook → domain → smoke test).

## Local development
```bash
cd challenge
cp .env.example .env.local     # fill in Supabase + Twilio + CRON_SECRET
npm install
npm run dev                    # http://localhost:3000
```

## How the timezone problem is solved
Send scheduling is decided entirely in Postgres. `due_messages()`
(`supabase/migrations/001_schema.sql`) computes each active user's local time via
`now() AT TIME ZONE users.timezone` and returns only those inside their 1-minute
morning/afternoon window that haven't already been sent today (duplicate guard on
`sms_log`, keyed on the **local** date). DST is handled by Postgres' IANA tz
database — no UTC offsets are ever stored or computed in app code.

## Layout
```
app/
  (public)/page.tsx          Enrollment page + 3-step signup flow
  admin/                     Login, roster, user detail (Recharts), add-user, settings
  api/
    sms/inbound/route.ts     Twilio webhook — signature-validated state machine
    enroll/route.ts          Public signup (service role)
    send/route.ts            Scheduler target — calls due_messages(), sends via Twilio
lib/
  conversation.ts            Pure inbound state machine (unit-tested)
  messages.ts                Single source of truth for every SMS body
  timezone.ts  phone.ts  metrics.ts  presets.ts
  supabase/{client,server,admin}.ts
  twilio.ts
components/                   SiteHeader, PhoneMock, SignupFlow, ProgressPreview, Logo
middleware.ts                Protects /admin
supabase/
  migrations/001_schema.sql
  functions/send-scheduled-messages/index.ts
```

## Conversation state machine
`idle → awaiting_score → (awaiting_journal) → idle`

| State | Inbound | Reply | Next |
|-------|---------|-------|------|
| awaiting_score | 1–4 | "What got in the way today?" | awaiting_journal |
| awaiting_score | 5–7 | "Got it. See you tomorrow." | idle |
| awaiting_score | 8–10 | "An [n] — strong. What made it land today?" | awaiting_journal |
| awaiting_score | not 1–10 | "Reply with a number between 1 and 10." | *(unchanged)* |
| awaiting_journal | anything | "Logged. Keep building." | idle |
| idle | anything | "Nothing to respond to right now…" | idle |

`STOP` (and variants) deactivates the user in the DB, mirroring Twilio's
carrier-level opt-out.

## Compliance
- Mandatory SMS consent checkbox with STOP/HELP language on enrollment.
- STOP mirrors to `users.active = false`.
- Phone numbers live only in the database, never in plaintext app logs.
- Twilio signature validated on every inbound webhook request.
