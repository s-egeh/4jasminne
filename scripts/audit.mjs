/**
 * Structural audit of the rendered HTML of every route.
 *
 *   node scripts/audit.mjs [baseUrl]
 *
 * This is the no-browser half of the verification pass: it parses markup
 * rather than measuring layout, so it runs anywhere and catches the class of
 * mistake that survives a visual review — a duplicated H1, a placeholder
 * string that shipped, an image with no alt text.
 *
 * Asserts, per route:
 *   - exactly one <h1>
 *   - a non-empty <title>, unique across the site
 *   - a non-empty meta description
 *   - no href="#" placeholder links
 *   - no "[TODO-" string anywhere in the rendered output
 *   - every <img> has an alt attribute (empty alt is fine — it means decorative)
 *   - no inline style containing 100vw
 *   - no unresolved template artefacts ("undefined", "[object Object]", "NaN")
 *
 * Exits non-zero on any failure.
 */

const BASE = process.argv[2] ?? 'http://localhost:3250';

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/freight-haulage',
  '/services/warehousing-storage',
  '/services/distribution',
  '/services/freight-forwarding',
  '/fleet',
  '/coverage',
  '/safety-compliance',
  '/gallery',
  '/faq',
  '/contact',
  '/quote',
  '/privacy',
  '/terms',
  '/styleguide',
];
/*
 * /team, /clients and /csr are left out while their data is empty: they return
 * a 404 by design until the client supplies the content. Add each back here
 * when it is published.
 */

const failures = [];
const fail = (route, detail) => failures.push({ route, detail });

const titles = new Map();
const descriptions = new Map();

/** Metadata arrives HTML-escaped; length has to be measured on the real text. */
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');

const countTags = (html, tag) => {
  const matches = html.match(new RegExp(`<${tag}[\\s>]`, 'gi'));
  return matches ? matches.length : 0;
};

/** All attribute values for a given tag, as raw tag strings. */
const tagsOf = (html, tag) => html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) ?? [];

for (const route of ROUTES) {
  let html;
  try {
    const response = await fetch(`${BASE}${route}`);
    if (!response.ok) {
      fail(route, `HTTP ${response.status}`);
      continue;
    }
    html = await response.text();
  } catch (error) {
    fail(route, `fetch failed: ${error.message}`);
    continue;
  }

  // Exactly one H1.
  const h1s = countTags(html, 'h1');
  if (h1s !== 1) fail(route, `expected 1 <h1>, found ${h1s}`);

  // Title present, unique, and short enough not to be truncated in a result.
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
  if (!title) {
    fail(route, 'missing or empty <title>');
  } else if (titles.has(title)) {
    fail(route, `duplicate <title> "${title}" (also on ${titles.get(title)})`);
  } else {
    titles.set(title, route);
    if (decode(title).length > 60) {
      fail(route, `<title> is ${decode(title).length} chars, over 60: "${decode(title)}"`);
    }
  }

  // Meta description: present, unique, and in the 140-160 range that survives a
  // result snippet without being padded out to hit a number.
  const description = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
  )?.[1];
  if (!description || description.trim().length === 0) {
    fail(route, 'missing or empty meta description');
  } else {
    const text = decode(description.trim());
    if (descriptions.has(text)) {
      fail(route, `duplicate meta description (also on ${descriptions.get(text)})`);
    } else {
      descriptions.set(text, route);
    }
    // /styleguide is noindex — it has no snippet to fit.
    if (route !== '/styleguide' && (text.length < 140 || text.length > 160)) {
      fail(route, `meta description is ${text.length} chars, want 140-160`);
    }
  }

  // Canonical URL.
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1];
  if (!canonical) fail(route, 'missing canonical link');

  // Share tags.
  for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!new RegExp(`property=["']${property}["']`, 'i').test(html)) {
      fail(route, `missing ${property}`);
    }
  }
  if (!/name=["']twitter:card["']/i.test(html)) fail(route, 'missing twitter:card');

  // Placeholder links.
  if (/href=["']#["']/i.test(html)) fail(route, 'contains href="#"');

  /*
   * Internal linking (E3). Links inside <main> only: navigation and the footer
   * link everything to everything, so counting them would make the check pass
   * on a page with no cross-links in its actual content.
   */
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
  const bodyLinks = new Set(
    (main.match(/href=["'](\/[^"'#?]*)["']/g) ?? [])
      .map((m) => m.match(/href=["'](\/[^"'#?]*)["']/)[1].replace(/\/$/, '') || '/')
      .filter((href) => href !== route.replace(/\/$/, '')),
  );
  if (bodyLinks.size < 3) {
    fail(route, `only ${bodyLinks.size} in-body internal link(s), want 3+`);
  }

  // Unshipped placeholders. The site carries plenty of [TODO-CLIENT] notes in
  // source comments and data files, but none of them may reach the page.
  const todo = html.match(/\[TODO-[A-Z]+[^\]]*\]/);
  if (todo) fail(route, `rendered placeholder: ${todo[0]}`);

  // Image alt text. An explicit alt="" is valid and means decorative.
  for (const img of tagsOf(html, 'img')) {
    if (!/\balt=/.test(img)) {
      fail(route, `<img> without alt: ${img.slice(0, 110)}`);
    }
  }

  // Viewport units in inline styles — the A1 overflow trap.
  for (const el of html.match(/style=["'][^"']*["']/gi) ?? []) {
    if (/100vw/.test(el)) fail(route, `inline style uses 100vw: ${el.slice(0, 90)}`);
  }

  // Template artefacts that mean a value did not resolve.
  for (const artefact of ['[object Object]', '>undefined<', '>NaN<']) {
    if (html.includes(artefact)) fail(route, `rendered "${artefact}"`);
  }

  process.stdout.write(`  ${route.padEnd(34)} ok\n`);
}

console.log('');
if (failures.length === 0) {
  console.log(`PASS — ${ROUTES.length} routes, no structural issues.`);
  process.exit(0);
}

console.log(`FAIL — ${failures.length} issue(s):\n`);
for (const f of failures) console.log(`  ${f.route}: ${f.detail}`);
process.exit(1);
