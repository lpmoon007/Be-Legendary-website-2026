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
  `010`. Next new migration = `011`. Never reuse a number (we already had two
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
`name` is nullable), `why` (motivation), the accountability-partner fields
`buddy_name` / `buddy_phone` / `buddy_status` / `buddy_invited_at`, and the
deep-link attribution fields `source` (channel) / `source_ref` (opaque id).

**Migrations (run in order; all applied in prod):**
- `001_schema.sql` — tables, RLS, indexes, `due_messages()`
- `002_nudges.sql` — `due_nudges()`
- `003_morning_default.sql` — morning default 08:00
- `004_workout_enroll.sql` — `workout_id`, `email`, nullable `name`
- `005_private_mode.sql` — `is_private` + `due_messages()` returns it
- `006_configurable_reflection.sql` — afternoon dedup guard matches new "Check-in%" **and** legacy "It's 4 p.m.%" prefixes
- `007_commitment_why.sql` — `why` (motivation)
- `008_accountability_partner.sql` — buddy columns + `due_buddy_nudges()` (week-1 + at-risk nudges to confirmed buddies)
- `009_source_attribution.sql` — `source` (channel, e.g. `lfs`/`workout`) + `source_ref` (opaque id round-tripped back to the originating system) + index on `source_ref`
- `010_completion_webhook.sql` — `completion_notified_at` marker + `due_completions()` (participants past day 30 who still need their results sent back to the source; summary computed in SQL)

**RLS:** `authenticated` (the coach) = full access; `anon` = nothing; server API
routes use the **service_role** key (bypasses RLS).

**Timezone engine (do NOT reimplement in JS):** `due_messages()`, `due_nudges()`,
and `due_buddy_nudges()` decide who's due using `now() AT TIME ZONE users.timezone`.
DST-safe. Send scheduling lives in Postgres.

---

## 5. SMS flow & message contract (do-not-break)

All SMS bodies live in `lib/messages.ts`. **The SQL duplicate guards match on
text prefixes/phrases** — change one and you must update the migration guards:
- morning → `'Morning.%'` (both `morning()` and `morningPrivate()` start with it)
- afternoon → `'Check-in%'` OR legacy `'It''s 4 p.m.%'` (migration 006)
- nudge → `'%quiet days%'` (in `due_nudges()`)
- buddy week-1 → `'%just started their 30-day%'` (in `due_buddy_nudges()`)
- buddy at-risk → `'%has gone quiet%'` (in `due_buddy_nudges()`)

Afternoon check-in rates **effort** 1–10, time-neutral wording (participants pick
their own check-in time). State machine (`lib/conversation.ts`, pure + tested):
`awaiting_score` → **every** score (1–4 / 5–7 / 8–10) now prompts a reflection →
`awaiting_journal` → `idle`. STOP → `active=false`.

**Scheduler:** pg_cron every minute → `POST /api/send` (Bearer `CRON_SECRET`) →
calls `due_messages()` + `due_nudges()` + `due_buddy_nudges()` → sends via Twilio
Messaging Service.

**Private mode:** if `is_private`, the morning nudge is generic, the commitment is
stored as `(private)`, reflections are never stored, inbound free-text is redacted
in `sms_log`, `why` isn't stored, and the coach UI shows 🔒 (effort score only).

**Accountability partner (buddy):** one per participant, **double opt-in** — the
buddy must reply YES to a one-time invite before any nudge is sent (STOP → opted
out). Buddy sees effort framing only, never the behavior/journal (safe for private
users). Buddy phone numbers are NOT `users` rows: `/api/sms/inbound` looks the
`From` up against `users.buddy_phone` and handles YES/STOP; buddy-directed
outbound is logged in `sms_log` under the **participant's** `user_id`.

---

## 6. API routes & server actions (signatures = contract)

| Route | Method | Auth |
|-------|--------|------|
| `/api/sms/inbound` | POST | Twilio signature |
| `/api/enroll` | POST + OPTIONS (CORS for belegendary.org) | none (service role inside) |
| `/api/send` | POST/GET | `Bearer CRON_SECRET` |

`/api/enroll` accepts both flows: `commitment` **or** `lead_measure`; optional
`name`, `timezone`, `private`, `workout_id`, `email`, `reminder_time`,
`reflection_time`, `why`, `buddy_name`, `buddy_phone`, `source`/`src`,
`source_ref`/`ref`. Inserts are built
conditionally so a flow never references a column its migration hasn't added; a
supplied buddy is invited via `lib/buddy.ts` `inviteBuddy()` (non-fatal — never
blocks enrollment). `/api/sms/inbound` also routes buddy replies (see §5).

Server actions (`app/admin/actions.ts`): `createUser`, `updateCommitment`,
`updateSchedule(userId,morning,afternoon,tz)`, `toggleActive`, `sendCoachMessage`
(returns `{error?}`, never throws), `setBuddy(userId,name,phone)` (invites/re-invites
an accountability partner).

### Deep-link enrollment contract (ONE signup form for all sources)

There is exactly **one** enrollment UI: the main signup at
`https://challenge.belegendary.org/` (`challenge/components/SignupFlow.tsx`). Any
marketing-site source that has its own specific commitment — the Mindset Workouts,
the leadership-failure simulations, CQ reports, future campaigns — must **hand off
to it via a deep link**, never build its own enrollment form.

**Link format:**
```
https://challenge.belegendary.org/?rep=<URL-ENCODED COMMITMENT>&src=<channel>&ref=<opaque id>#signup
```
- `rep` (required to pre-fill) — the exact commitment text. `encodeURIComponent()`
  it. If length > 3 the form pre-selects it and jumps **straight to step 2**.
  Parsed via `URLSearchParams`, so **param order doesn't matter** and the trailing
  `#signup` fragment (it lives in `location.hash`, not the query) is ignored.
- `src` (alias `source`) **or** `workout_id` (optional) — the **channel** that sent
  them (e.g. `lfs`, `workout`, `go-for-it`). Stored as `users.source` for the coach
  roll-up. `workout_id` is the older per-workout tag and still works.
- `ref` (optional) — an **opaque id** the source owns (a run/session id). Stored as
  `users.source_ref` and never interpreted — it exists purely to round-trip back to
  the originating system (e.g. a TeamLFS completion webhook keyed on `ref`).
- `email` (optional) — stitches the enrollment to a CQ/HubSpot record by email.
- Keep the `#signup` hash so the page scrolls to the form.

The signup form reads `rep`/`src`/`source`/`ref`/`email`/`workout_id` on load and
passes `source`/`source_ref` through to `/api/enroll` (migration 009). The enroll
route also accepts the short `src`/`ref` aliases for direct API callers.

**Completion round-trip (optional, migration 010).** When a deep-link participant
(one with a `source_ref`) finishes their 30 days, `/api/send` can POST a results
summary back to the source, keyed on that `ref`. It is **inert** until the env
vars below are set, so nothing fires without configuration:
- `TEAMLFS_WEBHOOK_URL` — the source's endpoint.
- `TEAMLFS_WEBHOOK_SECRET` — bearer token; sent as `Authorization: Bearer <token>`.
- `TEAMLFS_WEBHOOK_SOURCE` — which channel's completions go to that URL (default `lfs`).

`due_completions()` finds who's past day 30 (timezone-safe) and computes
`days_logged`, `week1_avg`, `week4_avg`; the POST body is `{ ref, days_logged,
week1_avg, week4_avg }`. A user is stamped `completion_notified_at` on a 2xx and
never re-fired; a failed POST is retried on the next scheduler tick.

**Reference implementation:** `src/components/MwCommitment.astro` — its rep-builder
(Step 1) computes the commitment, then its Continue handler redirects with the link
above instead of collecting phone/time/consent itself. Copy that pattern for any
new source. **Do NOT** rebuild the signup form in Astro — it drifts and loses
features (timezone, afternoon time, private mode, why, accountability partner).

---

## 7. Env vars (Vercel; never commit)

```
NEXT_PUBLIC_SUPABASE_URL   NEXT_PUBLIC_SUPABASE_ANON_KEY   SUPABASE_SERVICE_ROLE_KEY
TWILIO_ACCOUNT_SID   TWILIO_AUTH_TOKEN   TWILIO_MESSAGING_SERVICE_SID   TWILIO_PHONE_NUMBER
NEXT_PUBLIC_APP_URL=https://challenge.belegendary.org   CRON_SECRET
# Optional — completion round-trip (migration 010). Unset = feature is inert.
TEAMLFS_WEBHOOK_URL   TEAMLFS_WEBHOOK_SECRET   TEAMLFS_WEBHOOK_SOURCE (default 'lfs')
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
pages with carrier-required language, STOP → `active=false` (and buddy STOP →
`buddy_status='stopped'`), Twilio signature on every inbound, phone numbers only
in the DB. Accountability partners are a distinct opt-in recipient class (double
opt-in) — the A2P campaign description should mention them. A2P campaign: Low
Volume, approved.

---

## 9. Do-NOT-break checklist

1. Keep migrations sequentially numbered from one place (next = `011`).
2. Don't change SMS copy prefixes/phrases without updating the SQL `LIKE` dedup
   guards (morning, afternoon, nudge, **buddy week-1 "just started their 30-day",
   buddy at-risk "has gone quiet"**).
3. Don't rename DB columns / the RPCs (`due_messages`, `due_nudges`, `due_buddy_nudges`, `due_completions`) without updating callers.
4. Keep `challenge/` as Vercel Root Directory + the `vercel.json` framework pin.
5. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
6. Keep timezone math in Postgres — don't reimplement in JS.
7. Keep public API route signatures stable (`/api/enroll`, `/api/send`, `/api/sms/inbound`).
8. Use the canonical name **"Your 30-Day Challenge"** everywhere.
9. One enrollment UI only. New commitment sources **deep-link** to the main signup
   (`?rep=…&source=…#signup`, see §6) — never rebuild the signup form.

Go-live runbook: `challenge/SETUP.md`. Architecture rationale: `challenge/README.md`.
