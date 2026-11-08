/**
 * Builds the 1200x630 share card: public/brand/og-image.jpg.
 *
 * Run after scripts/build-logo-variants.mjs:
 *   node scripts/build-og-image.mjs
 *
 * Why a browser and not sharp: the card sets the tagline in type, and sharp's
 * bundled text renderer cannot load the Archivo webfont the site uses — any text
 * drawn there falls back to a system face and ships off-brand. Chrome renders
 * it with the real font, exactly as the site does.
 *
 * Uses the installed Google Chrome through Playwright (`channel: 'chrome'`), so
 * no Playwright browser download is needed. Needs network access to Google
 * Fonts; if Archivo does not load, the script stops rather than shipping a card
 * in a fallback face.
 *
 * The tagline is read from src/data/company.ts so the card and the site cannot
 * disagree.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const OUT = path.join('public', 'brand', 'og-image.jpg');
const LOCKUP = path.join('public', 'brand', '4jasmine-logo-full-white.png');

const companySource = await readFile(path.join('src', 'data', 'company.ts'), 'utf8');
const match = companySource.match(/^\s*tagline:\s*'([^']+)'/m);
if (!match) {
  console.error('Could not read COMPANY.tagline from src/data/company.ts');
  process.exit(1);
}
const tagline = match[1];

const lockup = (await readFile(LOCKUP)).toString('base64');

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600&display=block" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    background: #0E2C4E;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 34px;
  }
  img { height: 330px; width: auto; display: block; }
  .rule { width: 72px; height: 3px; background: #CB9F46; }
  p {
    margin: 0; max-width: 880px; text-align: center;
    font: 600 30px/1.35 'Archivo', sans-serif;
    letter-spacing: -0.005em;
    color: rgba(255, 255, 255, 0.88);
    text-wrap: balance;
  }
</style>
</head>
<body>
  <img src="data:image/png;base64,${lockup}" alt="">
  <span class="rule"></span>
  <p>${tagline.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>
</body>
</html>`;

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => document.fonts.check("600 30px 'Archivo'"));
  if (!loaded) {
    throw new Error('Archivo did not load from Google Fonts. Refusing to render the card in a fallback face.');
  }
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await sharp(png).jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true }).toFile(OUT);
  console.log(`wrote ${OUT} (1200 x 630) — "${tagline}"`);
} finally {
  await browser.close();
}
