/**
 * Image ingest pipeline.
 *
 *   node scripts/ingest-image.mjs <source> <slot> [--alt "…"] [--source-url URL]
 *                                 [--credit "…"] [--licence "…"] [--focus top|bottom|left|right]
 *
 *   node scripts/ingest-image.mjs ./truck.jpg hero/hero-01 \
 *     --alt "A loaded 4Jasmine Dr truck on the Accra–Tema motorway at dawn" \
 *     --source-url https://www.pexels.com/photo/12345 \
 *     --credit "Photographer Name / Pexels" --licence "Pexels licence"
 *
 * `source` may be a local path or an http(s) URL.
 * `slot` is the destination path under /public/images, without extension.
 *
 * The pipeline refuses to upscale. A source below the slot's floor is reported
 * and rejected rather than stretched — a 250px thumbnail blown up to a 2400px
 * hero is the first thing every visitor would see, and no amount of processing
 * makes that acceptable.
 *
 * Provenance is not optional. Every ingested file appends a row to
 * docs/image-credits.md recording where it came from and under what licence.
 * If a licence question is ever raised, that file is the answer.
 */
import { existsSync } from 'node:fs';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/* Slot definitions: ratio and the minimum source width that may be used. */
const SLOTS = {
  hero: { ratio: [12, 7], minWidth: 2000, out: 2400, maxKB: 250 },
  services: { ratio: [16, 10], minWidth: 1400, out: 1600, maxKB: 150 },
  fleet: { ratio: [4, 3], minWidth: 1400, out: 1600, maxKB: 150 },
  team: { ratio: [4, 5], minWidth: 800, out: 1000, maxKB: 150 },
  csr: { ratio: [3, 2], minWidth: 1400, out: 1600, maxKB: 150 },
  gallery: { ratio: [16, 10], minWidth: 1400, out: 1600, maxKB: 150 },
  clients: { ratio: null, minWidth: 200, out: 400, maxKB: 40 },
  textures: { ratio: null, minWidth: 400, out: 1200, maxKB: 80 },
};

const CREDITS = path.join('docs', 'image-credits.md');

const argv = process.argv.slice(2);
const [source, slot] = argv;
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

if (!source || !slot) {
  console.error('usage: node scripts/ingest-image.mjs <source> <slot> [--alt "…"] [--source-url URL] [--credit "…"] [--licence "…"] [--focus …]');
  process.exit(2);
}

const family = slot.split('/')[0];
const spec = SLOTS[family];
if (!spec) {
  console.error(`Unknown slot family "${family}". Known: ${Object.keys(SLOTS).join(', ')}`);
  process.exit(2);
}

/* 1. Fetch, and check the source resolution before doing anything else. */
let input;
if (/^https?:\/\//i.test(source)) {
  const response = await fetch(source);
  if (!response.ok) {
    console.error(`FAIL  ${source} returned ${response.status}`);
    process.exit(1);
  }
  input = Buffer.from(await response.arrayBuffer());
} else {
  if (!existsSync(source)) {
    console.error(`FAIL  no such file: ${source}`);
    process.exit(1);
  }
  input = await readFile(source);
}

const meta = await sharp(input).metadata();
console.log(`source: ${meta.width}x${meta.height} ${meta.format}, ${(input.length / 1024).toFixed(0)}KB`);

if (meta.width < spec.minWidth) {
  console.error(
    `\nREJECTED — ${meta.width}px wide, and the ${family} slot needs at least ${spec.minWidth}px.\n` +
      `Short by ${spec.minWidth - meta.width}px. This will not be upscaled: enlarging it would\n` +
      `render as a blurred, blocky smear at the size it is displayed. Supply a larger source.`,
  );
  process.exit(1);
}

/* 2. Crop to the slot ratio. */
let pipeline = sharp(input).rotate();
if (spec.ratio) {
  const [rw, rh] = spec.ratio;
  const outW = Math.min(spec.out, meta.width);
  const outH = Math.round((outW * rh) / rw);
  pipeline = pipeline.resize(outW, outH, {
    fit: 'cover',
    position: flag('focus') ?? 'centre',
  });
} else {
  pipeline = pipeline.resize({ width: Math.min(spec.out, meta.width), withoutEnlargement: true });
}

/*
 * 3. House grade, so a set assembled from mixed sources reads as one set.
 *    Saturation 0.92 and a 6% ink wash. Applied identically to every image,
 *    which is the entire point — consistency, not correction.
 */
const graded = await pipeline
  .modulate({ saturation: 0.92 })
  .toBuffer();

const { width: gw, height: gh } = await sharp(graded).metadata();
const washed = await sharp(graded)
  .composite([
    {
      input: {
        create: {
          width: gw,
          height: gh,
          channels: 4,
          background: { r: 10, g: 16, b: 36, alpha: 0.06 },
        },
      },
      blend: 'over',
    },
  ])
  .toBuffer();

/* 4 & 5. Export AVIF, WebP and a JPG fallback. Metadata is stripped by default
 *        — sharp only carries EXIF through when explicitly asked. */
const dest = path.join('public', 'images', slot);
await mkdir(path.dirname(dest), { recursive: true });

const written = [];
for (const [ext, encode] of [
  ['avif', (p) => p.avif({ quality: 80 })],
  ['webp', (p) => p.webp({ quality: 80 })],
  ['jpg', (p) => p.jpeg({ quality: 82, chromaSubsampling: '4:4:4', mozjpeg: true })],
]) {
  const file = `${dest}.${ext}`;
  const info = await encode(sharp(washed)).toFile(file);
  written.push({ file, kb: info.size / 1024 });
}

console.log('');
let over = false;
for (const { file, kb } of written) {
  const flagged = kb > spec.maxKB;
  if (flagged && file.endsWith('.jpg')) over = true;
  console.log(`  ${flagged ? 'WARN' : 'ok  '}  ${file}  ${kb.toFixed(0)}KB${flagged ? `  (budget ${spec.maxKB}KB)` : ''}`);
}

/* 6 & 7. Alt text and the destination filename. */
const alt = flag('alt');
if (!alt) {
  console.log(
    '\nNOTE  no --alt given. Write alt text describing what the photograph actually\n' +
      '      shows, not the slot it fills, and set it in the matching src/data file.',
  );
} else {
  console.log(`\nalt: "${alt}"`);
}

/* 8. Provenance. */
const url = flag('source-url') ?? (/^https?:\/\//i.test(source) ? source : 'local file');
const credit = flag('credit') ?? 'UNRECORDED';
const licence = flag('licence') ?? 'UNRECORDED';
const today = new Date().toISOString().slice(0, 10);

if (!existsSync(CREDITS)) {
  await mkdir(path.dirname(CREDITS), { recursive: true });
  await writeFile(
    CREDITS,
    '# Image credits\n\n' +
      'Every photograph on this site, where it came from and under what licence.\n' +
      'Written by scripts/ingest-image.mjs. Do not edit by hand.\n\n' +
      '| File | Source | Credit | Licence | Obtained |\n|---|---|---|---|---|\n',
  );
}
await appendFile(CREDITS, `| \`images/${slot}\` | ${url} | ${credit} | ${licence} | ${today} |\n`);
console.log(`recorded in ${CREDITS}`);

if (credit === 'UNRECORDED' || licence === 'UNRECORDED') {
  console.log(
    '\nWARN  credit or licence not supplied, and the row says UNRECORDED.\n' +
      '      Fill it in before launch. An image with no recorded licence is a\n' +
      '      liability that lands on the client, not on whoever added it.',
  );
}

if (over) {
  console.log('\nThe JPG is over budget. Re-run with a tighter crop, or accept it knowingly.');
}
