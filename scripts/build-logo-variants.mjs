/**
 * Generates every brand asset from the single supplied logo file.
 *
 * Run: node scripts/build-logo-variants.mjs
 * Source: assets/brand/4jasmine-logo-source.jpg   Output: public/brand/, src/app/
 *
 * Committed so it can be re-run when the client supplies revised artwork. The
 * share card is built separately by scripts/build-og-image.mjs, because it sets
 * type and needs a browser to do that in the site's own typeface.
 *
 * THE SOURCE
 * ----------
 * The client supplied a 1408x768 JPEG: a stacked lockup on an off-white ground.
 * Top to bottom it holds three bands of ink, separated by empty rows:
 *
 *   1. the mark — a gold truck over a grey leaf, with a grey route line
 *   2. the "4Jasmine Dr" wordmark, navy
 *   3. the "LOGISTICS & DISTRIBUTION" descriptor, a lighter navy
 *
 * Nothing below is hardcoded to pixel positions. The bands are found by
 * scanning for empty rows, and each band's ink colours are measured from its
 * own solid pixels, so a revised file with the same stacked layout re-runs
 * without edits.
 *
 * WHY A KNOWN-COLOUR MATTE AND NOT A COLOUR-TO-ALPHA FILTER
 * ---------------------------------------------------------
 * A JPEG has no transparency, so the artwork has to be lifted off its ground.
 * The generic colour-to-alpha method makes every pixel as transparent as it can
 * be, which turns the solid gold of the truck into 70%-opaque brown and lets
 * the background bleed through the whole mark on a dark surface.
 *
 * Here each band's ink colours are known, so each pixel is unmixed against the
 * one ink that explains it best: P = a·F + (1 − a)·B, solved for `a` along the
 * line from the ground B to the ink F. Interior pixels come out at a = 1 in the
 * exact measured brand colour; only the anti-aliased edges carry partial alpha.
 * JPEG noise is absorbed by snapping a ≥ 0.9 to fully opaque and a ≤ 0.06 to
 * fully transparent, with a linear ramp between.
 *
 * RESOLUTION
 * ----------
 * The mark is about 245x257px in the source. Every output at or below that
 * size is a downscale. icon-512.png and the maskable icon need the mark at
 * ~410px and ~307px, so those two are upscaled from a clean flat-colour matte:
 * the edges are soft at full size. A vector master (SVG, AI or PDF) from the
 * client removes this limit — see HANDOVER.md.
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = path.join('assets', 'brand', '4jasmine-logo-source.jpg');
const BRAND_DIR = path.join('public', 'brand');
const APP_DIR = path.join('src', 'app');

/** Logo navy. Every icon plate and dark surface uses it. */
const INK = { r: 14, g: 44, b: 78, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * The grey leaf and route line measure about #686C6F, which is 2.66:1 against
 * the navy header, footer and icon plate — visible, but muddy, and at favicon
 * size the leaf disappears into the plate. The dark-surface variants lift that
 * one grey to the site's --slate-400 (#9AA0A4, 5.33:1 on navy). The gold is
 * left exactly as drawn: at 5.77:1 on navy it already reads, and it is what
 * carries the brand. On light surfaces the original greys are used unchanged.
 */
const GREY_ON_DARK = [154, 160, 164];
const WHITE = [255, 255, 255];

if (!existsSync(SOURCE)) {
  console.error(`Source not found: ${SOURCE}`);
  process.exit(1);
}

await mkdir(BRAND_DIR, { recursive: true });

/* ------------------------------------------------------------------ *
 * 1. Read the source and find the ground and the three bands.
 * ------------------------------------------------------------------ */

const { data: rgb, info } = await sharp(SOURCE)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const at = (x, y) => {
  const i = (y * W + x) * 3;
  return [rgb[i], rgb[i + 1], rgb[i + 2]];
};
const median = (values) => values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)];

/*
 * The ground has a faint vignette — about 243 at the corners, 251 around the
 * artwork. The matte is computed against the ground immediately around the ink,
 * so the ring sampled here is the ink's own bounding box grown by 24px.
 */
const INK_THRESHOLD = 40;
const roughGround = [0, 1, 2].map((c) => {
  const ring = [];
  for (let x = 0; x < W; x += 4) ring.push(at(x, 8)[c], at(x, H - 9)[c]);
  return median(ring);
});
const isInk = (p, ground) =>
  Math.max(ground[0] - p[0], ground[1] - p[1], ground[2] - p[2]) > INK_THRESHOLD;

let minX = W;
let minY = H;
let maxX = 0;
let maxY = 0;
const inkPerRow = new Array(H).fill(0);
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    if (!isInk(at(x, y), roughGround)) continue;
    inkPerRow[y] += 1;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

const groundSamples = [];
for (let x = Math.max(0, minX - 24); x <= Math.min(W - 1, maxX + 24); x += 2) {
  groundSamples.push(at(x, Math.max(0, minY - 24)), at(x, Math.min(H - 1, maxY + 24)));
}
for (let y = Math.max(0, minY - 24); y <= Math.min(H - 1, maxY + 24); y += 2) {
  groundSamples.push(at(Math.max(0, minX - 24), y), at(Math.min(W - 1, maxX + 24), y));
}
const GROUND = [0, 1, 2].map((c) => median(groundSamples.map((p) => p[c])));
console.log(`source ${W}x${H}, ground rgb(${GROUND.join(', ')})`);

// Bands: runs of rows containing ink, ignoring specks under 4 rows tall.
const bands = [];
let open = -1;
for (let y = 0; y <= H; y += 1) {
  const inked = y < H && inkPerRow[y] > 0;
  if (inked && open < 0) open = y;
  if (!inked && open >= 0) {
    if (y - open >= 4) bands.push({ top: open, bottom: y - 1 });
    open = -1;
  }
}
if (bands.length !== 3) {
  console.error(
    `Expected 3 bands (mark, wordmark, descriptor), found ${bands.length}: ` +
      JSON.stringify(bands) +
      '. The source layout has changed; this script needs revisiting.',
  );
  process.exit(1);
}
const [MARK_BAND, WORD_BAND, DESC_BAND] = bands;
console.log(
  `bands: mark ${MARK_BAND.top}-${MARK_BAND.bottom}, wordmark ${WORD_BAND.top}-${WORD_BAND.bottom}, ` +
    `descriptor ${DESC_BAND.top}-${DESC_BAND.bottom}`,
);

/* ------------------------------------------------------------------ *
 * 2. Measure each band's ink colours from its solid pixels.
 * ------------------------------------------------------------------ */

/** Median colour of the strongly-inked pixels in a band matching `filter`. */
function measure(band, filter) {
  const picks = [];
  for (let y = band.top; y <= band.bottom; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const p = at(x, y);
      const depth = Math.max(GROUND[0] - p[0], GROUND[1] - p[1], GROUND[2] - p[2]);
      if (depth < 120 || !filter(p)) continue;
      picks.push(p);
    }
  }
  if (picks.length < 50) throw new Error(`Too few solid pixels to measure in band ${band.top}`);
  return [0, 1, 2].map((c) => median(picks.map((p) => p[c])));
}

// The mark is gold (warm: red well above blue) and grey (neutral).
const GOLD = measure(MARK_BAND, (p) => p[0] - p[2] > 60);
const GREY = measure(MARK_BAND, (p) => Math.abs(p[0] - p[2]) < 24);
const NAVY = measure(WORD_BAND, () => true);
const DESC_NAVY = measure(DESC_BAND, () => true);
const hex = (c) => `#${c.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
console.log(
  `measured inks: gold ${hex(GOLD)}, grey ${hex(GREY)}, wordmark ${hex(NAVY)}, descriptor ${hex(DESC_NAVY)}`,
);

/* ------------------------------------------------------------------ *
 * 3. The known-colour matte.
 * ------------------------------------------------------------------ */

const ALPHA_FLOOR = 0.06;
const ALPHA_CEIL = 0.9;

/**
 * Unmix one pixel against a set of candidate inks. Returns the ink index and
 * the coverage `a` of the best explanation.
 */
function unmix(p, inks) {
  let best = { index: 0, a: 0, residual: Infinity };
  inks.forEach((ink, index) => {
    const d = [ink[0] - GROUND[0], ink[1] - GROUND[1], ink[2] - GROUND[2]];
    const v = [p[0] - GROUND[0], p[1] - GROUND[1], p[2] - GROUND[2]];
    const dd = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
    let a = (v[0] * d[0] + v[1] * d[1] + v[2] * d[2]) / dd;
    a = Math.min(1, Math.max(0, a));
    const r = [0, 1, 2].reduce((sum, c) => sum + (GROUND[c] + a * d[c] - p[c]) ** 2, 0);
    if (r < best.residual) best = { index, a, residual: r };
  });
  return best;
}

const ramp = (a) => {
  if (a <= ALPHA_FLOOR) return 0;
  if (a >= ALPHA_CEIL) return 1;
  return (a - ALPHA_FLOOR) / (ALPHA_CEIL - ALPHA_FLOOR);
};

/**
 * Lift a band off the ground as RGBA, cropped to the ink's horizontal extent.
 * `paint` maps a measured ink index to the colour it should be written in, so
 * the same matte serves the original, the white and the dark-surface variants.
 */
function lift(band, inks, paint) {
  const left = minX;
  const width = maxX - minX + 1;
  const height = band.bottom - band.top + 1;
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = at(left + x, band.top + y);
      const { index, a } = unmix(p, inks);
      const alpha = ramp(a);
      const o = (y * width + x) * 4;
      if (alpha === 0) continue;
      const colour = paint(index);
      out[o] = colour[0];
      out[o + 1] = colour[1];
      out[o + 2] = colour[2];
      out[o + 3] = Math.round(alpha * 255);
    }
  }
  return { buffer: out, width, height };
}

const toPng = ({ buffer, width, height }) =>
  sharp(buffer, { raw: { width, height, channels: 4 } }).png().toBuffer();

const MARK_INKS = [GOLD, GREY];

const markOriginal = await toPng(lift(MARK_BAND, MARK_INKS, (i) => MARK_INKS[i]));
const markOnDark = await toPng(lift(MARK_BAND, MARK_INKS, (i) => (i === 0 ? GOLD : GREY_ON_DARK)));
const wordOriginal = await toPng(lift(WORD_BAND, [NAVY], () => NAVY));
const wordWhite = await toPng(lift(WORD_BAND, [NAVY], () => WHITE));
const descOriginal = await toPng(lift(DESC_BAND, [DESC_NAVY], () => DESC_NAVY));
const descWhite = await toPng(lift(DESC_BAND, [DESC_NAVY], () => WHITE));

const trim = (buffer) => sharp(buffer).trim({ threshold: 1 }).png().toBuffer();

/* ------------------------------------------------------------------ *
 * 4. Lockups.
 * ------------------------------------------------------------------ */

/**
 * Re-stack the bands with the source's own spacing, centred on one axis. The
 * gaps between bands are taken from the source rather than chosen here.
 */
async function stack(parts, gaps, pad) {
  const metas = await Promise.all(parts.map((p) => sharp(p).metadata()));
  const width = Math.max(...metas.map((m) => m.width)) + pad * 2;
  const height =
    metas.reduce((sum, m) => sum + m.height, 0) + gaps.reduce((s, g) => s + g, 0) + pad * 2;
  let top = pad;
  const layers = parts.map((input, i) => {
    const layer = { input, left: Math.round((width - metas[i].width) / 2), top };
    top += metas[i].height + (gaps[i] ?? 0);
    return layer;
  });
  return sharp({ create: { width, height, channels: 4, background: TRANSPARENT } })
    .composite(layers)
    .png()
    .toBuffer();
}

const parts = {
  mark: await trim(markOriginal),
  markDark: await trim(markOnDark),
  word: await trim(wordOriginal),
  wordWhite: await trim(wordWhite),
  desc: await trim(descOriginal),
  descWhite: await trim(descWhite),
};

const GAP_MARK_WORD = WORD_BAND.top - MARK_BAND.bottom - 1;
const GAP_WORD_DESC = DESC_BAND.top - WORD_BAND.bottom - 1;
const PAD = 8;

const full = await stack([parts.mark, parts.word, parts.desc], [GAP_MARK_WORD, GAP_WORD_DESC], PAD);
await writeFile(path.join(BRAND_DIR, '4jasmine-logo-full.png'), full);

const fullWhite = await stack(
  [parts.markDark, parts.wordWhite, parts.descWhite],
  [GAP_MARK_WORD, GAP_WORD_DESC],
  PAD,
);
await writeFile(path.join(BRAND_DIR, '4jasmine-logo-full-white.png'), fullWhite);

/*
 * The "4Jasmine Dr" wordmark alone, in white, for the header and the mobile
 * drawer, which set the mark and the wordmark side by side.
 *
 * The descriptor is left out on purpose. The header row holds the lockup, the
 * quote button and the menu button in 352px at a 400px viewport, which caps the
 * wordmark at about 132px wide — and at that width "LOGISTICS & DISTRIBUTION"
 * renders under six pixels tall. The full lockups (footer, light contexts,
 * share card) carry the descriptor at a size where it can be read.
 */
await writeFile(path.join(BRAND_DIR, '4jasmine-wordmark-white.png'), parts.wordWhite);

for (const name of [
  '4jasmine-logo-full.png',
  '4jasmine-logo-full-white.png',
  '4jasmine-wordmark-white.png',
]) {
  const meta = await sharp(path.join(BRAND_DIR, name)).metadata();
  console.log(`wrote ${name} (${meta.width} x ${meta.height})`);
}

/* ------------------------------------------------------------------ *
 * 5. The mark alone, square.
 * ------------------------------------------------------------------ */

async function square(input) {
  const meta = await sharp(input).metadata();
  const side = Math.max(meta.width, meta.height);
  return sharp({ create: { width: side, height: side, channels: 4, background: TRANSPARENT } })
    .composite([
      {
        input,
        left: Math.round((side - meta.width) / 2),
        top: Math.round((side - meta.height) / 2),
      },
    ])
    .png()
    .toBuffer();
}

const markSquare = await square(parts.mark);
const markDarkSquare = await square(parts.markDark);
await writeFile(path.join(BRAND_DIR, '4jasmine-logo-mark.png'), markSquare);
await writeFile(path.join(BRAND_DIR, '4jasmine-logo-mark-dark.png'), markDarkSquare);
const markMeta = await sharp(markSquare).metadata();
console.log(`wrote 4jasmine-logo-mark.png, 4jasmine-logo-mark-dark.png (${markMeta.width} x ${markMeta.height})`);

/* ------------------------------------------------------------------ *
 * 6. Icons — the dark-surface mark on an opaque navy plate.
 *
 *    Mark only, never the lockup: squared into a favicon the wordmark is an
 *    illegible smear. The plate is opaque because a transparent favicon
 *    inherits the browser chrome and has to work on light and dark tab bars.
 * ------------------------------------------------------------------ */

const ICON_FILL = 0.8;

async function icon(size, fill = ICON_FILL) {
  const art = Math.round(size * fill);
  const resized = await sharp(markDarkSquare)
    .resize(art, art, { fit: 'contain', background: TRANSPARENT, kernel: 'lanczos3' })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([{ input: resized, left: Math.round((size - art) / 2), top: Math.round((size - art) / 2) }])
    .png()
    .toBuffer();
}

await writeFile(path.join(APP_DIR, 'icon.png'), await icon(192));
await writeFile(path.join(APP_DIR, 'apple-icon.png'), await icon(180));
await writeFile(path.join(BRAND_DIR, 'icon-192.png'), await icon(192));
await writeFile(path.join(BRAND_DIR, 'icon-512.png'), await icon(512));
console.log('wrote src/app/icon.png (192), src/app/apple-icon.png (180), icon-192.png, icon-512.png');

/*
 * Maskable: Android crops to the launcher shape, so the artwork sits inside the
 * safe circle at 60% rather than 80%.
 */
await writeFile(path.join(BRAND_DIR, 'icon-maskable.png'), await icon(512, 0.6));
console.log('wrote icon-maskable.png (512, art at 60%)');

/*
 * favicon.ico — a real ICO container holding 16, 32 and 48px PNG frames.
 *
 * The 16px frame is drawn at 92% rather than 80%: at that size every pixel of
 * margin is a pixel the truck does not get, and the browser tab already frames
 * the icon. PNG-in-ICO is read by every browser in current use, so no BMP
 * encoder is needed.
 */
const frames = [
  { size: 16, png: await icon(16, 0.92) },
  { size: 32, png: await icon(32) },
  { size: 48, png: await icon(48) },
];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(frames.length, 4);
let offset = 6 + frames.length * 16;
const entries = frames.map(({ size, png }) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width
  entry.writeUInt8(size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});
await writeFile(
  path.join(APP_DIR, 'favicon.ico'),
  Buffer.concat([header, ...entries, ...frames.map((f) => f.png)]),
);
console.log('wrote src/app/favicon.ico (16, 32, 48)');

console.log('\nDone. Run scripts/build-og-image.mjs next for the share card.');
