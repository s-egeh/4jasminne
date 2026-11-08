/**
 * Writes src/data/image-manifest.ts: the list of photographs actually present
 * under public/images.
 *
 *   node scripts/build-image-manifest.mjs
 *
 * Runs automatically before `npm run dev` and `npm run build` (the predev and
 * prebuild scripts), so a build always reflects what is on disk.
 *
 * Why it exists. Every photograph on this site is supplied by the client, and
 * most slots ship empty. The <Figure> component used to find out a file was
 * missing only when the browser's request for it failed: the server-rendered
 * HTML pointed at a 404, the browser showed a broken image until React
 * hydrated and the error handler swapped in the placeholder, and every missing
 * slot cost a wasted request. With this list, a missing file is known at
 * render time, the placeholder is in the HTML from the first byte, and no
 * request is made at all. The runtime error handler stays as a second line of
 * defence for a file that is listed but fails to load.
 *
 * Images added while `npm run dev` is running appear after a restart.
 */
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.join('public', 'images');
const OUT = path.join('src', 'data', 'image-manifest.ts');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [full] : [];
    }),
  );
  return files.flat();
}

const files = (await walk(ROOT))
  .map((file) => `/${path.relative('public', file).split(path.sep).join('/')}`)
  .sort();

const body = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Written by scripts/build-image-manifest.mjs, which runs before every dev
 * server start and every build. Lists the files present under public/images so
 * that a photograph which has not been supplied yet renders its placeholder on
 * the server, with no request for a file that does not exist.
 */
export const AVAILABLE_IMAGES: ReadonlySet<string> = new Set<string>(${
  files.length ? `[\n${files.map((file) => `  '${file}',`).join('\n')}\n]` : '[]'
});
`;

await writeFile(OUT, body);
console.log(`image manifest: ${files.length} file(s) under public/images`);
