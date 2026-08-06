# Change-spec → challenge session: finish the MwCommitment deep-link conversion

**From:** design/marketing session · **For:** challenge/app session
**File:** `src/components/MwCommitment.astro` (your reference implementation — I did **not** touch it)
**Status:** the conversion is half-done and shipping a bug. Details + exact cuts below.

## The problem

Step 1's `[data-continue]` handler already redirects correctly to the one main
signup:

```js
window.location.href = base + '/?rep=' + encodeURIComponent(this.state.commit)
                            + '&workout_id=' + encodeURIComponent(id) + '#signup';
```

But the **entire old embedded form is still in the file underneath it**, creating a
second enrollment path that bypasses the main signup and has **no buddy, no privacy,
no why, no timezone**:

1. **Dead Step 2 / Step 3 markup** — phone + time + consent inputs and a "done"
   screen that the Continue redirect means a new user never reaches.
2. **`[data-begin]` handler** — POSTs straight to `/api/enroll` with only
   `{ workout_id, lead_measure, reminder_time, phone, consent, timezone }`.
   Misses `private`, `buddy_name`, `buddy_phone`, `why`.
3. **`localStorage` "done" resurrection** — `connectedCallback` restores a saved
   `bl_challenge_commit` and jumps returning enrollees to the **old** Step-3
   screen, so they never see the handoff at all.

Net effect James is seeing: workouts "look the same" and don't carry the new
features — because the visible Step-1 UI is unchanged and the fallback flow is the
pre-conversion form.

## The fix — make MwCommitment *only* Step 1 → hand off

**Keep** (this is the whole intended job of the component):
- The frontmatter + `<mw-commitment>` element.
- Step 1 "choose your rep" markup (the option buttons + the "write my own"
  When/Instead of/I will box).
- The `[data-sel]`, `[data-custom]`, and `[data-continue]` handlers.
- The `[data-continue]` redirect above — this is the entire enrollment action now.

**Remove:**
| What | Current lines (approx) | Why |
|---|---|---|
| Step 2 "setup" markup (time / phone / consent) | ~178–202 | Enrollment moved to the main signup. |
| Step 3 "done" markup | ~204–214 | Same — completion happens on the main signup. |
| `[data-begin]` handler (the direct `/api/enroll` POST) | ~240–269 | This is the second, feature-less enrollment path. Delete it entirely. |
| `[data-back]` / `[data-restart]` handlers | ~271–278 | They only drove Step 2/3. |
| `localStorage` restore in `connectedCallback` | ~68–71 | Always start at `step:'choose'`; never resurrect the old flow. |
| `readAll` / `writeAll` + the `KEY` const | ~52–54 | Only the removed POST path used them. |
| `fmtTime()` | ~57–64 | Only the removed Step-3 screen used it. |
| The 3-step rail (`choose / setup / begin`) | ~125–132, 153 | There's one step on this page now. Drop it, or relabel to a single "Build your rep → continue" line. |

**Base-URL note:** the redirect currently derives `base` from `data-enroll`:
`(this.getAttribute('data-enroll')||'').replace(/\/api\/enroll$/, '')`. Once
`/api/enroll` is no longer POSTed from here, cleaner to drop `enrollEndpoint` /
`data-enroll` and build the redirect from `CHALLENGE_URL` directly (already
imported), e.g. pass `data-challenge={CHALLENGE_URL}` and use that as `base`.

## Resulting behavior
Workout page shows the rep-builder → **Continue** → `challenge.belegendary.org/?rep=<rep>&workout_id=<id>#signup`
→ the one signup form (which already has private mode, accountability buddy, why,
timezone, and reads the deep-link into step 2). One form, all features, every source.

## Two small extras while you're in there
- **Canonical name:** line ~151 still says "The 30-day challenge". Per the brief's
  §0 the product name is **"Your 30-Day Challenge"** — I aligned the rest of the
  marketing site to that; this label is in your file so it's yours to update.
- **Verify** after the cut: `grep -nE 'type="tel"|data-begin|/api/enroll|localStorage'
  src/components/MwCommitment.astro` should return nothing.

## Ownership
This is your reference implementation and you're actively editing it, so I'm
leaving the file to you rather than re-colliding. Ping if you'd rather I take the
cut — otherwise the marketing side needs no further change; the handoff contract
(`?rep=&workout_id=&source=#signup`) is already what the workouts emit.
