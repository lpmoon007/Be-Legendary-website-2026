// Render the one-page research fact sheet to a brand-accurate Letter PDF.
// Usage (from repo root):
//   node docs/fact-sheet/embed-fonts.js docs/fact-sheet   # writes fonts.css (base64 brand fonts)
//   node docs/fact-sheet/render.js docs/fact-sheet         # writes the PDF + preview.png
// The committed fact-sheet.html loads Newsreader + Hanken Grotesk from Google
// Fonts so it opens standalone; this render injects the *local* @fontsource
// woff2 (embedded by embed-fonts.js) so the PDF is pixel-identical offline.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const dir = process.argv[2] || 'docs/fact-sheet';
  let html = fs.readFileSync(path.join(dir, 'fact-sheet.html'), 'utf8');
  const fonts = fs.readFileSync(path.join(dir, 'fonts.css'), 'utf8');
  // Inject embedded fonts last so they win over the Google Fonts <link>.
  html = html.replace('</head>', `<style>${fonts}</style>\n</head>`);
  const tmp = path.join(dir, '_render.html');
  fs.writeFileSync(tmp, html);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(tmp), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(dir, 'Be-Legendary-Research-Fact-Sheet.pdf');
  await page.pdf({ path: out, width: '8.5in', height: '11in', printBackground: true, pageRanges: '1' });
  await page.screenshot({ path: path.join(dir, 'preview.png'), fullPage: true });
  const h = await page.evaluate(() => document.body.scrollHeight);
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('content height (px@96dpi):', h, '/ one-page budget:', Math.round(11 * 96));
  console.log('PDF:', out);
})();
