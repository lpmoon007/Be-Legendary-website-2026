# Integration Brief — Be Legendary 30-Day Challenge (SMS app)

**Audience:** the Claude Code session doing the larger Claude Design update to
belegendary.org. This documents exactly what already exists and is **live in
production**, so you integrate with it instead of breaking or duplicating it.

**Golden rule:** the `challenge/` app is a **separate, working, deployed
system**. Treat its data model, API routes, SMS copy, and scheduler as a
contract. Restyle freely; do **not** change behavior, message strings, DB
schema, or route signatures without reading the "Do-not-break" section below.

---

## 1. Repo & deploy topology (important — two apps, two hosts)

This repo contains **two independent apps**:

| App | Path | Framework | Host | Domain |
|-----|------|-----------|------|--------|
| Marketing site | repo root (`src/`, `astro.config.mjs`) | **Astro** (static) | VPS via GitHub Actions rsync | `www.belegendary.org` |
| **Challenge (SMS)** | **`challenge/`** | **Next.js 14** (App Router) | **Vercel** | `challenge.belegendary.org` |

- They do **not** share a build. Astro ignores `challenge/`; Vercel's **Root
  Directory is `challenge`** so it ignores the Astro root.
- **Default branch is `claude/epic-carson-cjyx09`** (there is no `main`). Both
  Vercel (challenge) and the VPS Action (marketing) deploy from it.
- Vercel framework is pinned in `challenge/vercel.json` (`"framework": "nextjs"`).
  Without it Vercel mis-detects "Other" and fails with *No Output Directory
  "public"*. Leave it.

**If the design update rebuilds the marketing site in Next.js / merges the two:**
that's a big decision. The challenge app can move into a monorepo, but keep its
Root Directory / build separate on Vercel, or migrate its routes wholesale. Do
not half-merge.

---

## 2. Tech stack (challenge app)

Next.js 14 App Router · TypeScript · Tailwind · Supabase (`@supabase/ssr` +
`@supabase/supabase-js`) · Twilio (`twilio`) · Recharts · `date-fns-tz` ·
Supabase pg_cron + `pg_net`.

Node 20+. `npm run build` / `npm run dev` from inside `challenge/`.

---

## 3. Design system (already implemented — reuse verbatim)

Tokens live in `challenge/app/globals.css` (`:root` CSS vars) and
`challenge/tailwind.config.ts` (mapped to Tailwind classes). Fonts loaded via
Google Fonts `@import` in globals.css.

```
--bg-page:#15130E  --bg-card:#F4F0E7  --bg-card-light:#FBF8F1
--bg-dark-nav:rgba(21,19,14,0.85)
--ink-heading:#1B1810  --ink-body:#2E2A22  --ink-muted:#8A7F6C  --ink-light:#F4F0E7
--accent:#C04A26  --accent-hover:#9E3A1C  --accent-light:#E0744A
```
Fonts: **Newsreader** (serif, headings/quotes) · **Hanken Grotesk** (sans, UI).
Tailwind: `font-serif` / `font-sans`; numeric weights registered as
`font-400…font-800`. Radii: `rounded-card` (20px), `rounded-btn` (10px),
`rounded-pill`. Shadows: `shadow-card`, `shadow-cta`. Component classes:
`.btn-cta`, `.btn-ghost`, `.eyebrow`, `.pill`, `.surface`.

The snail mark is an inline SVG at `challenge/components/Logo.tsx` (`<SnailMark/>`,
uses `currentColor`).

**If the Claude Design update ships a new/evolved design system:** the safest
path is to update the tokens in `globals.css` + `tailwind.config.ts` in one place
— all challenge components read from them. Don't hard-code new hex values in
components.

---

## 4. File map (challenge/)

```
app/
  (public)/page.tsx          Enrollment page (all sections + 3-step signup flow)
  (public)/terms/page.tsx    SMS Terms & Conditions (A2P compliance)
  admin/
    layout.tsx               Coach chrome (nav)
    login/page.tsx           Supabase Auth email+password
    error.tsx                Admin error boundary (no white-screens)
    page.tsx                 Roster (score / 7-day avg / streak / at-risk badge)
    actions.ts               Server actions (see §7)
    users/new/page.tsx       Add participant (client form, useFormState)
    users/[id]/page.tsx      Detail: commitment, send-times+tz, metrics, chart,
                             conversation thread + coach send, history table
    users/[id]/ScoreChart.tsx   Recharts (client)
    users/[id]/UserControls.tsx CommitmentEditor, SendTimesEditor, ActiveToggle,
                                MessageSender (all client)
    settings/page.tsx        Admin email/password change + sign out
  api/
    sms/inbound/route.ts     Twilio webhook — signature-validated state machine
    enroll/route.ts          Public signup (service role)
    send/route.ts            Scheduler target — sends due morning/afternoon/nudge
  layout.tsx  globals.css
lib/
  conversation.ts   Pure inbound state machine (unit-tested)
  messages.ts       SINGLE SOURCE OF TRUTH for every SMS body
  timezone.ts  phone.ts  metrics.ts  presets.ts
  supabase/{client,server,admin}.ts   Twilio.ts
middleware.ts       Protects /admin/*
supabase/migrations/001_schema.sql  002_nudges.sql  003_morning_default.sql
supabase/functions/send-scheduled-messages/index.ts  (optional Edge Fn shim)
SETUP.md  README.md  INTEGRATION_BRIEF.md (this file)
```

---

## 5. Database (Supabase project ref `wucvglrpzqdkudvmdmdz`)

Tables: `users`, `checkins`, `sms_log`, `conversation_state`. Full DDL in
`001_schema.sql`. Key points:

- `users`: `phone` UNIQUE E.164, `timezone` IANA, `commitment`, `morning_time`
  (default **08:00**), `afternoon_time` (default 16:00), `active`.
- `checkins`: UNIQUE `(user_id, date)`, `score` 1–10, `journal_entry`,
  timestamps. `date` is the participant's **local** date.
- `sms_log`: every inbound/outbound message (`direction`, `body`, `twilio_sid`).
- `conversation_state`: `state` ∈ `idle | awaiting_score | awaiting_journal`,
  `checkin_date`.
- **RLS**: enabled on all tables. `authenticated` role → full access (single
  coach). `anon` → nothing. Server API routes use the **service_role** key
  (bypasses RLS). So: admin pages read/write as the logged-in coach; public
  routes (`/api/enroll`, `/api/send`, `/api/sms/inbound`) use service role.

**Postgres RPCs (the timezone engine — do not reimplement in JS):**
- `due_messages()` — returns users due for a morning/afternoon send *right now in
  their own timezone*, with a duplicate guard on `sms_log`. Uses
  `now() AT TIME ZONE users.timezone`. DST-safe.
- `due_nudges()` — returns active users 3+ local days silent at their local noon,
  once per silent streak (migration `002`).

Migrations already run in prod: 001, 002, 003.

---

## 6. SMS flow & the message contract (do-not-break)

**All SMS bodies are defined once in `lib/messages.ts`.** Change copy there.
BUT: the duplicate-guard SQL matches on text prefixes/substrings —
`due_messages()` keys on `'Morning.%'` and `'It''s 4 p.m.%'`; `due_nudges()`
keys on `'%quiet days%'`. **If you edit those message strings, update the
matching `LIKE` patterns in the migrations**, or dedup breaks (double-sends).

State machine (`lib/conversation.ts`, pure + unit-tested):
```
awaiting_score + "1–4"   → "What got in the way today?"            → awaiting_journal
awaiting_score + "5–7"   → "Got it. See you tomorrow."            → idle
awaiting_score + "8–10"  → "An {n} — strong. What made it land…"  → awaiting_journal
awaiting_score + non-1–10→ "Reply with a number between 1 and 10." → (unchanged)
awaiting_journal + text  → "Logged. Keep building."               → idle
idle + text              → "Nothing to respond to right now…"     → idle
STOP/UNSUBSCRIBE/…       → user.active=false (mirror carrier opt-out)
```

Scheduler: **pg_cron runs every minute → POSTs `/api/send`** (Bearer
`CRON_SECRET`). `/api/send` calls the two RPCs and sends via Twilio. (An Edge
Function shim exists but the live setup calls `/api/send` directly.)

---

## 7. API routes & server actions (signatures = contract)

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/sms/inbound` | POST | Twilio signature | Inbound state machine; returns empty TwiML |
| `/api/enroll` | POST | none (service role inside) | `{name,phone,commitment,consent,timezone}` → create user + state |
| `/api/send` | POST | `Bearer CRON_SECRET` | Scheduler; sends due messages + nudges |

Server actions in `app/admin/actions.ts` (used by admin client components):
`createUser`, `updateCommitment`, `updateSchedule(userId,morning,afternoon,tz)`,
`toggleActive`, `sendCoachMessage` (returns `{error?}`, never throws).

---

## 8. Env vars (set in Vercel; never commit)

```
NEXT_PUBLIC_SUPABASE_URL      NEXT_PUBLIC_SUPABASE_ANON_KEY   SUPABASE_SERVICE_ROLE_KEY
TWILIO_ACCOUNT_SID            TWILIO_AUTH_TOKEN               TWILIO_PHONE_NUMBER (E.164, with +)
NEXT_PUBLIC_APP_URL=https://challenge.belegendary.org        CRON_SECRET
```
`NEXT_PUBLIC_APP_URL` must equal the Twilio inbound webhook host — it's used to
reconstruct the URL for signature validation. `TWILIO_PHONE_NUMBER` is
normalized to E.164 in code, but store it with the `+`.

---

## 9. Compliance (already built — keep intact)

- Mandatory SMS consent checkbox on enrollment with STOP/HELP language + links to
  `/terms` and the privacy policy.
- `/terms` page (SMS T&Cs). Footer links Terms + Privacy.
- STOP mirrors to `users.active=false`.
- Twilio signature validated on every inbound request.
- Phone numbers only in the DB, never in plaintext app logs.

Twilio A2P 10DLC campaign: **Low Volume Mixed**, currently *In Review*. Until
Approved, US carriers block outbound — this is external, not an app bug.

---

## 10. Do-NOT-break checklist

1. Don't rename/alter DB columns or the two RPCs without updating callers.
2. Don't change SMS copy prefixes without updating the SQL `LIKE` dedup guards.
3. Don't move `challenge/` without preserving Vercel Root Directory = `challenge`
   + `vercel.json` framework pin.
4. Don't expose `SUPABASE_SERVICE_ROLE_KEY` to the client (server-only in
   `lib/supabase/admin.ts` and API routes).
5. Don't reimplement timezone math in JS — it lives in Postgres (`AT TIME ZONE`).
6. Keep public API route signatures stable (`/api/enroll`, `/api/send`,
   `/api/sms/inbound`) — Twilio and pg_cron point at them.
7. Middleware protects `/admin/*` (except `/admin/login`). Keep it.

---

## 11. Recommended integration approach

- **Restyle, don't rebuild.** Point the design refresh at `globals.css` tokens
  and the shared components (`SiteHeader`, `Logo`, `.btn-cta`, `.surface`, cards).
- **Cross-link the sites:** marketing site → `challenge.belegendary.org` for the
  challenge CTA; challenge header already links back to Mindset Workouts.
- **Shared brand assets:** the snail mark is inline SVG here; if the design
  system ships a canonical logo/token file, mirror it into both apps.
- If unifying under one Next.js app later, migrate the challenge routes and env
  wholesale and keep the Supabase/Twilio wiring exactly as documented above.

Full go-live/runbook detail is in `challenge/SETUP.md`. Architecture rationale in
`challenge/README.md`.
