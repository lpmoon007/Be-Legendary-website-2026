import { defineConfig } from 'astro/config';

// Be Legendary — marketing & SEO/AEO site.
// Static output: the entire SEO/AEO strategy depends on crawlers and AI engines
// seeing fully-rendered markup + JSON-LD without executing client JS.
export default defineConfig({
  site: 'https://www.belegendary.org',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // We hand-author sitemap.xml / robots.txt / llms.txt in /public so they exactly
  // match the intended production slugs and AI-crawler rules.
});
