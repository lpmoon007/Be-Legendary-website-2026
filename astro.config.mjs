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

// Be Legendary — marketing & SEO/AEO site.
// Static output: the entire SEO/AEO strategy depends on crawlers and AI engines
// seeing fully-rendered markup + JSON-LD without executing client JS.
export default defineConfig({
  site: 'https://www.belegendary.org',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [searchIndex()],
  // We hand-author sitemap.xml / robots.txt / llms.txt in /public so they exactly
  // match the intended production slugs and AI-crawler rules.
});
