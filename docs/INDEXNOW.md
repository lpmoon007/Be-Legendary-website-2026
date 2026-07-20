# IndexNow — instant re-crawl for Bing, Yandex & others

IndexNow lets us tell participating search engines (Bing, Yandex, Seznam, Naver,
and others — **not** Google, which ignores it) the moment a page changes, so they
re-crawl in minutes instead of days.

## How it's set up

- **Key:** `99b81053f71c72d7c26cfbfa92df77df`
- **Key file:** `public/99b81053f71c72d7c26cfbfa92df77df.txt` → deploys to
  `https://www.belegendary.org/99b81053f71c72d7c26cfbfa92df77df.txt`. IndexNow
  fetches this to prove we own the domain. **Don't delete or rename it.**
- **Submitter:** `scripts/indexnow.mjs`, run automatically as the last step of the
  deploy workflow (`.github/workflows/deploy.yml`), *after* the site is live.

## What gets submitted, when

Every push that deploys triggers a submission:

- **Content-only edit** (one guide's copy, no shared files) → just that page's URL.
- **Shared change** (a component, layout, `src/lib`, styles, or `astro.config.mjs`)
  → the whole sitemap, because that change can alter every page.
- **First push / manual re-seed** → the whole sitemap.

The script reads canonical URLs from the built `dist/sitemap.xml` (so redirects and
noindex pages like `/search/` and `/book/` are already excluded).

## Manual re-seed

To resubmit every URL (e.g. after a big rollout):

```
# Locally, against a fresh build:
npm run build && node scripts/indexnow.mjs --all

# Or from GitHub: Actions → Deploy to VPS → Run workflow → submit_all = true
```

Use `--dry` to print the payload without sending.

## Notes

- Submissions are **best-effort**: the script never exits non-zero, so a failed
  ping can't fail a deploy.
- Don't resubmit unchanged URLs repeatedly — IndexNow treats that as spam. The
  change-detection above is what keeps us honest; prefer it over `--all`.
- Google is not part of IndexNow. It gets freshness from the sitemap's per-page
  `lastmod` (see `docs/CONTENT-REFRESH.md`) and normal crawling.
