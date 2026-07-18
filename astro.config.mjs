import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Build-time search index: after the static build, walk the output, pull each
// page's <title>, meta description and URL, and emit /search-index.json. The
// client-side /search/ page fetches it. Always fresh, zero per-page upkeep.
function searchIndex() {
  const decode = (s) =>
    s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–').replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
      .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&middot;/g, '·')
      .replace(/&trade;/g, '™').replace(/&rarr;/g, '→').replace(/&nbsp;/g, ' ');
  const section = (url) => {
    if (url.startsWith('/leaders/')) return 'For Leaders';
    if (url.startsWith('/teams/')) return 'For Teams';
    if (url.startsWith('/lost-disciplines/')) return 'The Book';
    if (url.includes('flag-model-vs-')) return 'Comparison';
    return 'Executive Teams';
  };
  return {
    name: 'bl-search-index',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const items = [];
        const walk = (d) => {
          for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
            const full = path.join(d, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name === 'index.html') {
              const html = fs.readFileSync(full, 'utf-8');
              // noindex pages (e.g. /search/, 404) stay out of the index
              if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) continue;
              let url = '/' + path.relative(outDir, d).split(path.sep).join('/');
              if (!url.endsWith('/')) url += '/';
              if (url === '//') url = '/';
              const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
              const desc = (html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
              items.push({
                url,
                title: decode(title).replace(/\s*\|\s*Be Legendary\s*$/, '').trim(),
                description: decode(desc).trim(),
                section: section(url),
              });
            }
          }
        };
        walk(outDir);
        items.sort((a, b) => a.title.localeCompare(b.title));
        fs.writeFileSync(path.join(outDir, 'search-index.json'), JSON.stringify(items));
        console.log(`[bl-search-index] wrote search-index.json (${items.length} pages)`);
      },
    },
  };
}

// Freshness auditor: after build, read each page's Article `dateModified`,
// compute age, and report pages that have gone stale (> STALE_MONTHS). Prints a
// summary to the build log (so every deploy nudges you) and writes a sortable
// report to reports/content-freshness.md. See docs/CONTENT-REFRESH.md.
function freshnessReport() {
  const STALE_MONTHS = 6;
  const PRIORITY = /\/(flag-model|strategy-execution-gap|how-to-|leadership-team-meeting-agenda|signs-of-a-dysfunctional|state-of-executive-team-execution|leadership-scorecard)/;
  return {
    name: 'bl-freshness',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const now = new Date();
        const rows = [];
        const walk = (d) => {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const full = path.join(d, e.name);
            if (e.isDirectory()) walk(full);
            else if (e.name === 'index.html') {
              const html = fs.readFileSync(full, 'utf-8');
              const m = html.match(/"dateModified":"(\d{4}-\d{2}-\d{2})"/);
              if (!m) continue; // only pages with an Article dateModified
              let url = '/' + path.relative(outDir, d).split(path.sep).join('/');
              if (!url.endsWith('/')) url += '/';
              const title = ((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '')
                .replace(/\s*\|\s*Be Legendary\s*$/, '').trim();
              const ageDays = Math.round((now - new Date(m[1])) / 86400000);
              const ageMonths = +(ageDays / 30.44).toFixed(1);
              rows.push({ url, title, dateModified: m[1], ageMonths, priority: PRIORITY.test(url) });
            }
          }
        };
        walk(outDir);
        rows.sort((a, b) => b.ageMonths - a.ageMonths);
        const stale = rows.filter((r) => r.ageMonths >= STALE_MONTHS);
        const priorityStale = stale.filter((r) => r.priority);
        // Console summary
        console.log(`[bl-freshness] ${rows.length} dated pages · ${stale.length} stale (>${STALE_MONTHS}mo)` +
          (priorityStale.length ? ` · ${priorityStale.length} PRIORITY: ${priorityStale.slice(0, 6).map((r) => r.url).join(', ')}` : ' · no priority pages stale'));
        // Markdown report
        const reportsDir = path.join(path.dirname(outDir), 'reports');
        fs.mkdirSync(reportsDir, { recursive: true });
        const md = [
          `# Content freshness — generated ${now.toISOString().split('T')[0]}`,
          ``,
          `Stale threshold: **${STALE_MONTHS} months**. Refresh priority (★) pages first.`,
          `See \`docs/CONTENT-REFRESH.md\` for the process.`,
          ``,
          `| ★ | Age (mo) | Modified | Page | Title |`,
          `|---|---------:|----------|------|-------|`,
          ...rows.map((r) => `| ${r.priority ? '★' : ''} | ${r.ageMonths} | ${r.dateModified} | ${r.url} | ${r.title} |`),
        ].join('\n');
        fs.writeFileSync(path.join(reportsDir, 'content-freshness.md'), md + '\n');
      },
    },
  };
}

const SITE = 'https://www.belegendary.org';

// Per-page sitemap lastmod: sitemap.xml.ts emits one build-date lastmod for every
// URL. This rewrites each <lastmod> to that page's real Article `dateModified`
// (when it has one), so Google sees an honest per-page freshness signal that
// tracks the freshness system. Undated pages (hubs, tools) keep the build date.
function sitemapLastmod() {
  return {
    name: 'bl-sitemap-lastmod',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const smPath = path.join(outDir, 'sitemap.xml');
        if (!fs.existsSync(smPath)) return;
        let xml = fs.readFileSync(smPath, 'utf-8');
        let patched = 0;
        xml = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
          const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
          if (!loc) return block;
          const rel = loc.replace(SITE, '').replace(/^\/+/, '');
          const file = path.join(outDir, rel, 'index.html');
          if (!fs.existsSync(file)) return block;
          const html = fs.readFileSync(file, 'utf-8');
          const dm = (html.match(/"dateModified":"(\d{4}-\d{2}-\d{2})"/) || [])[1];
          if (!dm) return block;
          patched++;
          return block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${dm}</lastmod>`);
        });
        fs.writeFileSync(smPath, xml);
        console.log(`[bl-sitemap-lastmod] patched ${patched} URLs with per-page dateModified`);
      },
    },
  };
}

// RSS 2.0 feed: after build, collect every page that carries an Article
// `datePublished`, newest first, and emit /rss.xml. Lets readers and AI crawlers
// discover new guides fast. Title/description reuse the page <title>/meta.
function rssFeed() {
  const xmlEsc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const decode = (s) =>
    s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–').replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
      .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&middot;/g, '·')
      .replace(/&trade;/g, '™').replace(/&rarr;/g, '→').replace(/&nbsp;/g, ' ');
  return {
    name: 'bl-rss',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const items = [];
        const walk = (d) => {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const full = path.join(d, e.name);
            if (e.isDirectory()) walk(full);
            else if (e.name === 'index.html') {
              const html = fs.readFileSync(full, 'utf-8');
              if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) continue;
              const pub = (html.match(/"datePublished":"(\d{4}-\d{2}-\d{2})"/) || [])[1];
              if (!pub) continue; // feed = dated Article pages only
              let url = '/' + path.relative(outDir, d).split(path.sep).join('/');
              if (!url.endsWith('/')) url += '/';
              if (url === '//') url = '/';
              const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '')
                .replace(/\s*\|\s*Be Legendary\s*$/, '').trim();
              const desc = decode((html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '').trim();
              const mod = (html.match(/"dateModified":"(\d{4}-\d{2}-\d{2})"/) || [])[1] || pub;
              items.push({ url, title, desc, pub, mod });
            }
          }
        };
        walk(outDir);
        items.sort((a, b) => (a.pub < b.pub ? 1 : a.pub > b.pub ? -1 : a.title.localeCompare(b.title)));
        const top = items.slice(0, 40);
        const build = new Date().toUTCString();
        const entries = top.map((it) =>
          `    <item>\n` +
          `      <title>${xmlEsc(it.title)}</title>\n` +
          `      <link>${SITE}${it.url}</link>\n` +
          `      <guid isPermaLink="true">${SITE}${it.url}</guid>\n` +
          `      <pubDate>${new Date(it.pub + 'T12:00:00Z').toUTCString()}</pubDate>\n` +
          (it.desc ? `      <description>${xmlEsc(it.desc)}</description>\n` : '') +
          `    </item>`
        ).join('\n');
        const rss =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
          `  <channel>\n` +
          `    <title>Be Legendary — Executive-team performance</title>\n` +
          `    <link>${SITE}/</link>\n` +
          `    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />\n` +
          `    <description>Guides, field notes, and research on executive-team performance, alignment, and the Flag Model — from James Carter and Be Legendary.</description>\n` +
          `    <language>en-us</language>\n` +
          `    <lastBuildDate>${build}</lastBuildDate>\n` +
          `${entries}\n` +
          `  </channel>\n` +
          `</rss>\n`;
        fs.writeFileSync(path.join(outDir, 'rss.xml'), rss);
        console.log(`[bl-rss] wrote rss.xml (${top.length} items)`);
      },
    },
  };
}

// Be Legendary — marketing & SEO/AEO site.
// Static output: the entire SEO/AEO strategy depends on crawlers and AI engines
// seeing fully-rendered markup + JSON-LD without executing client JS.
export default defineConfig({
  site: 'https://www.belegendary.org',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [searchIndex(), freshnessReport(), sitemapLastmod(), rssFeed()],
  // We hand-author sitemap.xml / robots.txt / llms.txt in /public so they exactly
  // match the intended production slugs and AI-crawler rules.
});
