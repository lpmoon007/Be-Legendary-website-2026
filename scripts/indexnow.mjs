#!/usr/bin/env node
// IndexNow submitter — notifies Bing, Yandex, Seznam, et al. of new/changed URLs
// so they re-crawl in minutes instead of days. Runs after a successful deploy.
//
// Modes (in priority order):
//   --all / SUBMIT_ALL=true   → submit every canonical URL from dist/sitemap.xml
//   BEFORE + AFTER git SHAs   → submit only the URLs whose page changed in that
//                               range; if a SHARED file (layout/component/lib/
//                               styles/config) changed, submit all (it can alter
//                               every page). All-zero BEFORE (first push) ⇒ all.
//   (neither)                 → submit all
//
// --dry prints the payload instead of sending. IndexNow failures never fail the
// deploy — this is best-effort notification.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SITE = 'https://www.belegendary.org';
const HOST = 'www.belegendary.org';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const DRY = process.argv.includes('--dry');
const ALL = process.argv.includes('--all') || process.env.SUBMIT_ALL === 'true';
const DIST = path.resolve('dist');

// Shared files whose change can affect the rendered HTML of many/all pages.
const GLOBAL_RE = /^src\/(layouts|components|lib|styles)\/|^astro\.config\.mjs$/;

function findKey() {
  for (const dir of [DIST, path.resolve('public')]) {
    if (!fs.existsSync(dir)) continue;
    const f = fs.readdirSync(dir).find((n) => /^[A-Za-z0-9-]{8,}\.txt$/.test(n) && /[a-f0-9]{8}/i.test(n));
    if (f) return { key: fs.readFileSync(path.join(dir, f), 'utf8').trim(), file: f };
  }
  return null;
}

function allUrlsFromSitemap() {
  const sm = path.join(DIST, 'sitemap.xml');
  if (!fs.existsSync(sm)) return [];
  const xml = fs.readFileSync(sm, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// Map a changed src/pages file to its canonical URL, or null if it isn't an
// indexable page (endpoints, 404, and the noindex utility pages).
const NOINDEX = new Set(['/search/', '/book/', '/404/']);
function pageFileToUrl(file) {
  if (!file.startsWith('src/pages/')) return null;
  if (!file.endsWith('.astro')) return null; // .ts endpoints (sitemap, rss) aren't pages
  let rel = file.slice('src/pages/'.length).replace(/\.astro$/, '');
  if (rel === 'index') return `${SITE}/`;
  rel = rel.replace(/\/index$/, '');
  if (/(^|\/)\[/.test(rel)) return null; // dynamic route — skip
  const url = `${SITE}/${rel}/`;
  if (NOINDEX.has(url.replace(SITE, ''))) return null;
  return url;
}

function changedUrls(before, after) {
  let files;
  try {
    files = execSync(`git diff --name-only ${before} ${after}`, { encoding: 'utf8' })
      .split('\n').map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    console.warn('[indexnow] git diff failed, submitting all:', e.message);
    return null; // signal "submit all"
  }
  if (files.some((f) => GLOBAL_RE.test(f))) {
    console.log('[indexnow] a shared file changed → submitting all pages');
    return null;
  }
  const urls = [...new Set(files.map(pageFileToUrl).filter(Boolean))];
  return urls;
}

async function main() {
  const found = findKey();
  if (!found) { console.warn('[indexnow] no key file found in dist/ or public/ — skipping'); return; }
  const { key, file } = found;
  const keyLocation = `${SITE}/${file}`;

  const before = process.env.BEFORE || '';
  const after = process.env.AFTER || 'HEAD';
  const firstPush = !before || /^0+$/.test(before);

  let urlList;
  if (ALL || firstPush) {
    urlList = allUrlsFromSitemap();
  } else {
    const changed = changedUrls(before, after);
    urlList = changed === null ? allUrlsFromSitemap() : changed;
  }

  if (!urlList || urlList.length === 0) {
    console.log('[indexnow] no changed indexable URLs to submit — nothing to do');
    return;
  }
  // IndexNow accepts up to 10,000 URLs per request; we’ll never hit that.
  const payload = { host: HOST, key, keyLocation, urlList };

  if (DRY) {
    console.log('[indexnow] DRY RUN — would POST to', ENDPOINT);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    // 200 OK / 202 Accepted are both success. Others are logged, not fatal.
    if (res.ok) console.log(`[indexnow] submitted ${urlList.length} URL(s) — HTTP ${res.status}`);
    else console.warn(`[indexnow] HTTP ${res.status} ${res.statusText} — ${(await res.text()).slice(0, 200)}`);
  } catch (e) {
    console.warn('[indexnow] request failed (non-fatal):', e.message);
  }
}

main();
