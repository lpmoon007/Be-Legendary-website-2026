# Integration Brief — Your 30-Day Challenge (SMS app)

**Audience:** any Claude Code session working in this repo — especially the
design/marketing session. This documents what's **live in production** so you
integrate with it instead of breaking or duplicating it.

**Golden rule:** the `challenge/` app is a **separate, working, deployed, two-way
SMS system**. Restyle freely; do **not** change its data model, API-route
signatures, SMS copy prefixes, or migrations without reading the "Do-not-break"
section.

---

## 0. Canonical name & session ownership (read first)

- **Product name is "Your 30-Day Challenge"** (personal, brand-neutral — it runs
  across belegendary.org, provecq.com, buildingteams.com, all Be Legendary
  services). Use this everywhere: title, hero, `applicationName`, OpenGraph,
  Twitter, JSON-LD. Do **not** revert to "The 30-Day Challenge."
- **Suggested ownership split** (we kept colliding otherwise):
  - **Design/marketing session** → the Astro site (`src/`, repo root), plus SEO
    metadata and JSON-LD in `challenge/` where it's marketing copy.
  - **Challenge/app session** → `challenge/` app logic: API routes, DB schema +
    migrations, SMS/state-machine, admin dashboard, Twilio wiring.
  - **Shared touch-points to coordinate on:** `challenge/app/api/enroll/route.ts`,
    `challenge/app/layout.tsx`, and the migration numbering.
- **Migrations are numbered sequentially from ONE place.** Highest is currently
  `006`. Next new migration = `007`. Never reuse a number (we already had two
  `004`s collide).

---

## 1. Repo & deploy topology (two apps, two hosts)

| App | Path | Framework | Host | Domain |
|-----|------|-----------|------|--------|
| Marketing site | repo root (`src/`) | Astro (static) | VPS via GitHub Actions | `www.belegendary.org` |
| **Your 30-Day Challenge** | **`challenge/`** | Next.js 14 (App Router) | **Vercel** (Root Directory = `challenge`) | `challenge.belegendary.org` |

- Default/production branch: **`claude/epic-carson-cjyx09`** (there is no `main`).
- Astro build ignores `challenge/`; Vercel (Root Dir = `challenge`) ignores the
  Astro root. `challenge/vercel.json` pins `"framework": "nextjs"` — leave it.

---

## 2. Tech stack (challenge app)

Next.js 14 · TypeScript · Tailwind · Supabase (`@supabase/ssr` + `@supabase/supabase-js`) ·
Twilio (via **Messaging Service**) · Recharts · `date-fns-tz` · pg_cron + `pg_net`.

---

## 3. Design system (reuse, don't rebuild)

Tokens live in `challenge/app/globals.css` (`:root` CSS vars) + `tailwind.config.ts`.
Fonts: Newsreader (serif) / Hanken Grotesk (sans), numeric weights `font-400…800`.
Components: `.btn-cta`, `.btn-ghost`, `.eyebrow`, `.pill`, `.surface`; snail mark
= inline SVG `components/Logo.tsx`. A design refresh should edit the tokens in one
place, not hard-code hex in components.

---

## 4. Database (Supabase project `wucvglrpzqdkudvmdmdz`)

Tables: `users`, `checkins`, `sms_log`, `conversation_state`.

`users` columns of note: `phone` (UNIQUE E.164), `timezone` (IANA), `commitment`,
`morning_time` (default `08:00`), `afternoon_time` (default `16:00`), `active`,
`is_private` (private mode), `workout_id` + `email` (workout-block enrollment;
`name` is nullable).

**Migrations (run in order; all applied in prod):**
- `001_schema.sql` — tables, RLS, indexes, `due_messages()`
- `002_nudges.sql` — `due_nudges()`
- `003_morning_default.sql` — morning default 08:00
- `004_workout_enroll.sql` — `workout_id`, `email`, nullable `name`
- `005_private_mode.sql` — `is_private` + `due_messages()` returns it
- `006_configurable_reflection.sql` — afternoon dedup guard matches new "Check-in%" **and** legacy "It's 4 p.m.%" prefixes

**RLS:** `authenticated` (the coach) = full access; `anon` = nothing; server API
routes use the **service_role** key (bypasses RLS).

**Timezone engine (do NOT reimplement in JS):** `due_messages()` and
`due_nudges()` decide who's due using `now() AT TIME ZONE users.timezone`.
DST-safe. Send scheduling lives in Postgres.

---

## 5. SMS flow & message contract (do-not-break)

All SMS bodies live in `lib/messages.ts`. **The SQL duplicate guards match on
text prefixes** — change a prefix and you must update the migration guards:
- morning → `'Morning.%'` (both `morning()` and `morningPrivate()` start with it)
- afternoon → `'Check-in%'` OR legacy `'It''s 4 p.m.%'` (migration 006)
- nudge → `'%quiet days%'` (in `due_nudges()`)

Afternoon check-in rates **effort** 1–10, time-neutral wording (participants pick
their own check-in time). State machine (`lib/conversation.ts`, pure + tested):
`awaiting_score` → 1–4 / 5–7 / 8–10 branches → `awaiting_journal` → `idle`.
STOP → `active=false`.

**Scheduler:** pg_cron every minute → `POST /api/send` (Bearer `CRON_SECRET`) →
calls `due_messages()` + `due_nudges()` → sends via Twilio Messaging Service.

**Private mode:** if `is_private`, the morning nudge is generic, the commitment is
stored as `(private)`, reflections are never stored, inbound free-text is redacted
in `sms_log`, and the coach UI shows 🔒 (effort score only).

---

## 6. API routes & server actions (signatures = contract)

| Route | Method | Auth |
|-------|--------|------|
| `/api/sms/inbound` | POST | Twilio signature |
| `/api/enroll` | POST + OPTIONS (CORS for belegendary.org) | none (service role inside) |
| `/api/send` | POST/GET | `Bearer CRON_SECRET` |

`/api/enroll` accepts both flows: `commitment` **or** `lead_measure`; optional
`name`, `timezone`, `private`, `workout_id`, `email`, `reminder_time`,
`reflection_time`. Inserts are built conditionally so a flow never references a
column its migration hasn't added.

Server actions (`app/admin/actions.ts`): `createUser`, `updateCommitment`,
`updateSchedule(userId,morning,afternoon,tz)`, `toggleActive`, `sendCoachMessage`
(returns `{error?}`, never throws).

---

## 7. Env vars (Vercel; never commit)

```
NEXT_PUBLIC_SUPABASE_URL   NEXT_PUBLIC_SUPABASE_ANON_KEY   SUPABASE_SERVICE_ROLE_KEY
TWILIO_ACCOUNT_SID   TWILIO_AUTH_TOKEN   TWILIO_MESSAGING_SERVICE_SID   TWILIO_PHONE_NUMBER
NEXT_PUBLIC_APP_URL=https://challenge.belegendary.org   CRON_SECRET
```

**Twilio A2P 10DLC (hard-won):**
- Send **through the Messaging Service** — set `TWILIO_MESSAGING_SERVICE_SID`
  (`MG…`). Sending from the raw number gets carrier-filtered.
- The **inbound webhook goes on the Messaging Service → Integration**, NOT the
  phone number (a number in a service ignores its own webhook).
- Number must be in the service's **Sender Pool**.

---

## 8. Compliance (built — keep intact)

Optional SMS consent (checkbox not required to submit), `/terms` + `/privacy`
pages with carrier-required language, STOP → `active=false`, Twilio signature on
every inbound, phone numbers only in the DB. A2P campaign: Low Volume, approved.

---

## 9. Do-NOT-break checklist

1. Keep migrations sequentially numbered from one place (next = `007`).
2. Don't change SMS copy prefixes without updating the SQL `LIKE` dedup guards.
3. Don't rename DB columns / the two RPCs (`due_messages`, `due_nudges`) without updating callers.
4. Keep `challenge/` as Vercel Root Directory + the `vercel.json` framework pin.
5. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
6. Keep timezone math in Postgres — don't reimplement in JS.
7. Keep public API route signatures stable (`/api/enroll`, `/api/send`, `/api/sms/inbound`).
8. Use the canonical name **"Your 30-Day Challenge"** everywhere.

Go-live runbook: `challenge/SETUP.md`. Architecture rationale: `challenge/README.md`.
