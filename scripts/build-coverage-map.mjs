/**
 * Generates the coverage map geometry.
 *
 *   node scripts/build-coverage-map.mjs
 *
 * Source: Natural Earth admin-0 country boundaries (public domain, cleared for
 * commercial use, no attribution required), fetched at build time.
 * Output: src/data/coverage-map.ts — plain path strings and coordinate pairs.
 *
 * Everything happens here so that nothing happens in the browser. d3-geo is a
 * devDependency and never reaches the client bundle: the component imports
 * finished strings and renders static SVG, which also means no layout shift and
 * no projection cost on a phone.
 *
 * Re-run this after editing PLACES in src/data/coverage.ts. It needs network
 * access for the boundary download; the emitted TypeScript is committed, so a
 * normal build does not.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { geoMercator, geoPath } from 'd3-geo';

/* 1:50m is the right resolution here. 1:110m loses the Volta boundary's shape
 * and rounds the coastline into a diagonal; 1:10m is 25MB for detail that
 * disappears at a 560px render. */
const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';

const OUT = path.join('src', 'data', 'coverage-map.ts');

/* The frame. Ghana spans roughly 4.74°N–11.17°N and 3.26°W–1.20°E; every
 * corridor is domestic, so the frame holds Ghana with a small margin and the
 * country fills the column. If a cross-border destination is added to PLACES,
 * push `north` (or `west`/`east`) out far enough to hold its node and label. */
const FRAME = { west: -3.4, east: 1.35, south: 4.6, north: 11.4 };

const VIEW = { width: 600, height: 760, margin: 24 };

/* Places, mirrored from src/data/coverage.ts. Kept as literal numbers rather
 * than imported because this is a plain .mjs script and that file is
 * TypeScript. checkPlacesMatch() below reads the real file and fails the run if
 * the two ever drift apart, so the duplication cannot go quietly wrong. */
const PLACES = {
  tema: { lon: -0.0166, lat: 5.6698 },
  port: { lon: 0.0167, lat: 5.6333 },
  accra: { lon: -0.187, lat: 5.6037 },
  kumasi: { lon: -1.6244, lat: 6.6885 },
  takoradi: { lon: -1.7554, lat: 4.8845 },
  tamale: { lon: -0.8393, lat: 9.4008 },
};

/**
 * Visvalingam-Whyatt simplification, applied to the PROJECTED ring.
 *
 * Simplifying after projection rather than before means the threshold is an
 * effective area in the same pixel units the map is drawn in, so it can be
 * reasoned about directly: "drop any vertex whose triangle contributes less
 * than N square pixels". Simplifying in degrees would weight the north of the
 * country differently from the coast.
 *
 * Written out rather than pulling in mapshaper, which is a 5MB dependency and a
 * shapefile toolchain for what is forty lines of arithmetic.
 */
function simplifyRing(ring, minArea) {
  if (ring.length < 5) return ring;

  const area = (a, b, c) =>
    Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;

  const points = ring.slice();
  // The ring is closed; keep the first and last point pinned.
  for (;;) {
    let smallest = Infinity;
    let index = -1;
    for (let i = 1; i < points.length - 1; i += 1) {
      const a = area(points[i - 1], points[i], points[i + 1]);
      if (a < smallest) {
        smallest = a;
        index = i;
      }
    }
    if (index === -1 || smallest >= minArea || points.length <= 12) break;
    points.splice(index, 1);
  }
  return points;
}

const round = (n) => Math.round(n * 10) / 10;

/** Rebuild an SVG path from simplified rings. */
function toPath(rings) {
  return rings
    .map(
      (ring) =>
        `M${ring.map(([x, y]) => `${round(x)} ${round(y)}`).join('L')}Z`,
    )
    .join('');
}

/** Project every ring of a feature, simplify, and return a path string. */
function renderFeature(feature, projection, minArea) {
  const geom = feature.geometry;
  const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  const rings = [];

  for (const polygon of polygons) {
    for (const ring of polygon) {
      const projected = ring
        .map((coordinate) => projection(coordinate))
        .filter((point) => point && Number.isFinite(point[0]) && Number.isFinite(point[1]));
      if (projected.length < 4) continue;
      const simplified = simplifyRing(projected, minArea);
      // Islands and slivers that survive simplification but render as a speck.
      const xs = simplified.map((p) => p[0]);
      const ys = simplified.map((p) => p[1]);
      if (Math.max(...xs) - Math.min(...xs) < 3 && Math.max(...ys) - Math.min(...ys) < 3) continue;
      rings.push(simplified);
    }
  }
  return { path: toPath(rings), vertices: rings.reduce((n, r) => n + r.length, 0) };
}

/**
 * Verify the PLACES copy above still matches src/data/coverage.ts.
 *
 * Two copies of a coordinate is a bug waiting to happen: someone corrects a
 * latitude in the TypeScript, nobody re-runs this, and the dot quietly sits in
 * the wrong place forever. Parsing the real file is cheap insurance.
 */
async function checkPlacesMatch() {
  const source = await readFile(path.join('src', 'data', 'coverage.ts'), 'utf8');
  const found = {};
  for (const match of source.matchAll(
    /(\w+):\s*\{\s*label:\s*'[^']*',\s*lon:\s*(-?[\d.]+),\s*lat:\s*(-?[\d.]+)/g,
  )) {
    found[match[1]] = { lon: Number(match[2]), lat: Number(match[3]) };
  }

  const problems = [];
  for (const [id, here] of Object.entries(PLACES)) {
    const there = found[id];
    if (!there) {
      problems.push(`${id} is in this script but not in coverage.ts`);
      continue;
    }
    if (Math.abs(there.lon - here.lon) > 1e-4 || Math.abs(there.lat - here.lat) > 1e-4) {
      problems.push(
        `${id}: coverage.ts has ${there.lon}, ${there.lat} — this script has ${here.lon}, ${here.lat}`,
      );
    }
  }
  for (const id of Object.keys(found)) {
    if (!(id in PLACES)) problems.push(`${id} is in coverage.ts but not in this script`);
  }

  if (problems.length) {
    console.error('FAIL  PLACES has drifted from src/data/coverage.ts:');
    problems.forEach((p) => console.error(`  ${p}`));
    process.exit(1);
  }
  console.log(`PLACES matches src/data/coverage.ts (${Object.keys(PLACES).length} places)`);
}

/* ---------------------------------------------------------------- run ---- */

await checkPlacesMatch();

console.log('fetching Natural Earth 1:50m admin-0 boundaries…');
const response = await fetch(SOURCE);
if (!response.ok) {
  console.error(`FAIL  boundary source returned ${response.status}`);
  process.exit(1);
}
const world = await response.json();
console.log(`  ${world.features.length} features`);

const pick = (code) => {
  const feature = world.features.find(
    (f) => f.properties.ADM0_A3 === code || f.properties.ISO_A3 === code,
  );
  if (!feature) {
    console.error(`FAIL  no feature for ${code}`);
    process.exit(1);
  }
  return feature;
};

const ghana = pick('GHA');
const burkina = pick('BFA');

/*
 * Fit the projection to the FRAME rather than to the geometry. The frame is
 * set by hand so that a place outside Ghana can be held inside it when one is
 * added; fitting to Ghana plus Burkina Faso would shrink Ghana to a third of
 * the frame, because Burkina is wider and reaches to 15°N.
 *
 * The frame is a MultiPoint of the four corners, not a Polygon. d3-geo reads
 * polygon rings with spherical winding: a ring wound the wrong way is the
 * complement of the region, so fitting to it fits the whole globe minus the
 * box and everything collapses to a speck. Measured here — the polygon form
 * produced scale 87.9 against the MultiPoint's 4823.9, a 55x difference, and
 * projected the whole of Ghana into a seven-pixel square. Points carry no
 * winding, so this cannot happen.
 */
const frameFeature = {
  type: 'MultiPoint',
  coordinates: [
    [FRAME.west, FRAME.south],
    [FRAME.east, FRAME.south],
    [FRAME.east, FRAME.north],
    [FRAME.west, FRAME.north],
  ],
};

const projection = geoMercator().fitExtent(
  [
    [VIEW.margin, VIEW.margin],
    [VIEW.width - VIEW.margin, VIEW.height - VIEW.margin],
  ],
  frameFeature,
);

// Threshold in square pixels of the projected space. Tuned by eye against a
// reference map: below ~1.5 the coastline keeps noise, above ~4 the Volta
// boundary starts to straighten.
const MIN_AREA = 2.2;

const gh = renderFeature(ghana, projection, MIN_AREA);
const bf = renderFeature(burkina, projection, MIN_AREA * 3); // secondary, can be coarser

console.log(`  Ghana        ${gh.vertices} vertices`);
console.log(`  Burkina Faso ${bf.vertices} vertices`);

const points = Object.fromEntries(
  Object.entries(PLACES).map(([id, { lon, lat }]) => {
    const [x, y] = projection([lon, lat]);
    return [id, [round(x), round(y)]];
  }),
);

for (const [id, [x, y]] of Object.entries(points)) {
  const inside = x > 0 && x < VIEW.width && y > 0 && y < VIEW.height;
  console.log(`  ${id.padEnd(13)} ${String(x).padStart(6)}, ${String(y).padStart(6)}${inside ? '' : '   OUTSIDE FRAME'}`);
  if (!inside) process.exitCode = 1;
}

const bounds = geoPath(projection).bounds(ghana);
console.log(
  `  Ghana bounds  x ${round(bounds[0][0])}–${round(bounds[1][0])}  y ${round(bounds[0][1])}–${round(bounds[1][1])}`,
);

const banner = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Written by scripts/build-coverage-map.mjs from Natural Earth 1:50m admin-0
 * boundaries (public domain). Re-run that script after changing PLACES in
 * ./coverage.ts.
 *
 * Geometry is baked to static strings at build time so d3-geo stays a
 * devDependency and never reaches the browser.
 */`;

const body = `${banner}

/** SVG user-space frame the paths and points are drawn in. */
export const MAP_VIEW_BOX = '0 0 ${VIEW.width} ${VIEW.height}';
export const MAP_WIDTH = ${VIEW.width};
export const MAP_HEIGHT = ${VIEW.height};

/** Ghana, ${gh.vertices} vertices after Visvalingam simplification. */
export const GHANA_PATH =
  '${gh.path}';

/** Burkina Faso — faint context along the northern border, mostly outside the frame. */
export const BURKINA_PATH =
  '${bf.path}';

/** Projected city positions, in the same user space as the paths above. */
export const MAP_POINTS: Record<string, readonly [number, number]> = {
${Object.entries(points)
  .map(([id, [x, y]]) => `  ${id}: [${x}, ${y}],`)
  .join('\n')}
};
`;

await writeFile(OUT, body);
console.log(`\nwrote ${OUT}`);
