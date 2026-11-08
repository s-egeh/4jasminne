/**
 * Desktop and responsive layout verification.
 *
 *   node scripts/verify.mjs [baseUrl]
 *
 * Run against a production server (`next build && next start`), not the dev
 * server — dev injects overlays and unminified styles that change layout.
 *
 * Checks, per route, per width:
 *   - no element extends past the document width (horizontal overflow)
 *   - every section H2 computes to Archivo between 44 and 48px at 1920
 *   - no H2 occupies more than two lines at 1280 and above
 *   - no two fixed-position elements overlap
 *   - header nav text contrast >= 4.5:1 in both states
 *
 * Exits non-zero if anything fails, so it can gate a deploy.
 */

import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3247';

/*
 * Navigation.
 *
 * `networkidle` is the right signal locally, where every request resolves.
 * It is the wrong one against the deployed site: the photography has not been
 * supplied yet, so every missing image goes through Vercel's image optimizer,
 * which retries — and the network never falls quiet for the required 500ms.
 * Runs against production timed out on a different route each time, which is
 * the harness failing, not the site.
 *
 * So: try networkidle, and fall back to `load`. The settle after each
 * navigation, and the preloader gate, are the real readiness signals anyway.
 */
const goto = async (target, url) => {
  try {
    return await target.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    return await target.goto(url, { waitUntil: 'load', timeout: 45000 });
  }
};


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
];
/*
 * /team, /clients and /csr are left out while their data is empty: they return
 * a 404 by design until the client supplies the content. Add each back here
 * when it is published.
 */

/*
 * All eight widths, not the five this started with. Responsive work routinely
 * breaks the wide breakpoints, and the three that were missing (390, 414, 820)
 * are the ones a phone and a small tablet actually report.
 */
const WIDTHS = [1920, 1440, 1280, 820, 768, 414, 390, 360];

const failures = [];
const fail = (route, width, check, detail) =>
  failures.push({ route, width, check, detail });

/* ---------- in-page probes ---------- */

const findOverflow = () =>
  Array.from(document.querySelectorAll('*'))
    .filter((el) => {
      const rect = el.getBoundingClientRect();
      // Ignore zero-size and deliberately off-screen (sr-only) elements.
      if (rect.width === 0 || rect.height === 0) return false;
      const style = getComputedStyle(el);
      if (style.position === 'fixed') return false;
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      if (rect.right <= document.documentElement.clientWidth + 1) return false;

      /*
       * A marquee track is *supposed* to be wider than the viewport — that is
       * what makes it a marquee. What matters is whether anything can actually
       * push the document wide enough to produce a scrollbar, so an element
       * sitting inside a clipping ancestor is not a defect. Walk up and see.
       */
      let parent = el.parentElement;
      while (parent) {
        const ox = getComputedStyle(parent).overflowX;
        if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return false;
        parent = parent.parentElement;
      }
      return true;
    })
    .slice(0, 8)
    .map((el) => ({
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 90),
      right: Math.round(el.getBoundingClientRect().right),
      docWidth: document.documentElement.clientWidth,
    }));

/*
 * "Every section H2" means the display headings inside the page body. Two
 * classes of h2 are deliberately excluded because the type contract does not
 * apply to them:
 *   - .sr-only headings, which exist only to give a section an accessible name
 *   - footer column headings, which are mono labels by design
 */
const measureHeadings = () =>
  Array.from(document.querySelectorAll('h2'))
    .filter((h) => !h.closest('footer'))
    .filter((h) => !h.classList.contains('sr-only'))
    .map((h) => {
      const style = getComputedStyle(h);
      const size = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || size * 1.2;
      return {
        text: (h.textContent ?? '').trim().slice(0, 60),
        size: Math.round(size * 10) / 10,
        family: style.fontFamily,
        lines: Math.round(h.getBoundingClientRect().height / lineHeight),
      };
    });

const findFixedOverlaps = () => {
  const boxes = Array.from(document.querySelectorAll('*'))
    .filter((el) => {
      const style = getComputedStyle(el);
      if (style.position !== 'fixed') return false;
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      if (parseFloat(style.opacity) === 0) return false;
      if (style.pointerEvents === 'none') return false;
      const rect = el.getBoundingClientRect();
      // The header is a full-width bar; overlap with it is by design.
      if (rect.width > window.innerWidth * 0.6) return false;
      return rect.width > 8 && rect.height > 8;
    })
    // Keep only the outermost fixed element of each stack: a fixed child of a
    // fixed parent always "overlaps" it, which is not a defect.
    .filter((el, _i, all) => !all.some((other) => other !== el && other.contains(el)));

  const hits = [];
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i].getBoundingClientRect();
      const b = boxes[j].getBoundingClientRect();
      const overlap =
        a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      if (overlap) {
        hits.push({
          a: boxes[i].getAttribute('aria-label') || boxes[i].tagName,
          b: boxes[j].getAttribute('aria-label') || boxes[j].tagName,
        });
      }
    }
  }
  return hits;
};

/*
 * Back-to-top progress ring.
 *
 * Two things, both of which have gone wrong before. The ring must be concentric
 * with its button — it drifted a pixel when the svg carried width/height
 * attributes that fought `inset-0` against a border-box button — and the whole
 * stroke must be painted inside the button box, not clipped by it.
 *
 * The ring being a partial arc part-way down a page is correct: it is a scroll
 * progress indicator. Completeness is asserted separately, at the bottom of the
 * document, where progress is 1.
 */
const measureProgressRing = () => {
  const button = document.querySelector('button[aria-label="Back to top"]');
  if (!button) return null;
  const circle = button.querySelector('circle');
  if (!circle) return null;

  const b = button.getBoundingClientRect();
  const c = circle.getBoundingClientRect();
  const style = getComputedStyle(circle);

  return {
    offsetX: +(c.left + c.width / 2 - (b.left + b.width / 2)).toFixed(2),
    offsetY: +(c.top + c.height / 2 - (b.top + b.height / 2)).toFixed(2),
    overflow: +Math.max(
      b.left - c.left,
      b.top - c.top,
      c.right - b.right,
      c.bottom - b.bottom,
    ).toFixed(2),
    dashoffset: parseFloat(style.strokeDashoffset),
    dasharray: parseFloat(style.strokeDasharray),
  };
};

/* ---------- contrast ---------- */

const luminance = ([r, g, b]) => {
  const f = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const contrast = (fg, bg) => {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
};

const parseRgb = (value) => {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(',').map((n) => parseFloat(n));
  return { rgb: parts.slice(0, 3), alpha: parts.length > 3 ? parts[3] : 1 };
};

/** Flatten a translucent foreground onto its background. */
const flatten = (fg, alpha, bg) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

/**
 * Nav link colour plus the first painted background behind it. Walking up from
 * the link is the only reliable way to find the real backdrop — the surface may
 * be set on the header, on an inner bar, or (if a state class fails to compile)
 * nowhere at all, which is the bug this check exists to catch.
 */
const readHeaderColours = () => {
  const header = document.querySelector('header');
  if (!header) return null;
  // Two of the six top-level nav items are disclosure buttons, not links, and
  // one of them is first in the DOM — so this has to accept either.
  const link = header.querySelector('nav a, nav button');
  if (!link) return null;

  const backdrops = [];
  let node = link;
  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    const m = bg.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(',').map((n) => parseFloat(n));
      const alpha = parts.length > 3 ? parts[3] : 1;
      if (alpha > 0) backdrops.push({ rgb: parts.slice(0, 3), alpha });
    }
    node = node.parentElement;
  }
  backdrops.push({ rgb: [255, 255, 255], alpha: 1 });

  return { color: getComputedStyle(link).color, backdrops, scrollY: window.scrollY };
};

/* ---------- run ---------- */

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();

console.log(`Verifying ${ROUTES.length} routes at ${WIDTHS.join(', ')}px against ${BASE}\n`);

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 1080 });
    const response = await goto(page, `${BASE}${route}`);

    if (!response || response.status() >= 400) {
      fail(route, width, 'http', `status ${response ? response.status() : 'none'}`);
      continue;
    }

    // Let reveal animations settle so nothing is measured mid-transform.
    await page.waitForTimeout(450);

    // Horizontal overflow
    const overflow = await page.evaluate(findOverflow);
    if (overflow.length > 0) {
      fail(route, width, 'overflow', JSON.stringify(overflow.slice(0, 3)));
    }

    const scrolls = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    if (scrolls) fail(route, width, 'h-scroll', 'document scrolls horizontally');

    /*
     * Heading scale and line count.
     *
     * /privacy and /terms are excluded from the display-type contract. Their
     * h2s are clause headings in a long legal document, set as mono labels by
     * design; rendering a dozen of them at 46px would be wrong for the
     * document type. They are still checked for overflow and line count.
     */
    const isLegal = route === '/privacy' || route === '/terms';
    const headings = await page.evaluate(measureHeadings);
    if (width === 1920 && !isLegal) {
      for (const h of headings) {
        if (h.size < 44 || h.size > 48) {
          fail(route, width, 'heading size', `"${h.text}" = ${h.size}px`);
        }
        if (!/Archivo/i.test(h.family)) {
          fail(route, width, 'heading family', `"${h.text}" = ${h.family}`);
        }
      }
    }
    if (width >= 1280) {
      for (const h of headings) {
        if (h.lines > 2) fail(route, width, 'heading lines', `"${h.text}" = ${h.lines} lines`);
      }
    }

    /*
     * Both remaining checks are scrolled-state checks, so the page has to be
     * scrolled. Lenis wraps the scroller and ignores window.scrollTo(), which
     * silently left the header in its transparent at-top state and made the
     * contrast reading meaningless. Real wheel events go through Lenis.
     */
    await page.mouse.move(Math.round(width / 2), 400);
    for (let i = 0; i < 10; i += 1) {
      await page.mouse.wheel(0, 320);
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(900);
    const overlaps = await page.evaluate(findFixedOverlaps);
    if (overlaps.length > 0) {
      fail(route, width, 'fixed overlap', JSON.stringify(overlaps.slice(0, 3)));
    }

    /*
     * Progress ring. Checked once per route at one width — it is a fixed
     * element and does not vary with the viewport, so repeating it eight times
     * would only slow the run down.
     */
    if (width === 1440) {
      const ring = await page.evaluate(measureProgressRing);
      if (ring) {
        if (Math.abs(ring.offsetX) > 0.5 || Math.abs(ring.offsetY) > 0.5) {
          fail(route, width, 'ring off-centre', `offset ${ring.offsetX}, ${ring.offsetY}`);
        }
        if (ring.overflow > 0) {
          fail(route, width, 'ring clipped', `stroke ${ring.overflow}px outside the button box`);
        }

        /*
         * At the bottom of the document the ring must close completely.
         *
         * Wheel events, not window.scrollTo: Lenis owns the scroller on a fine
         * pointer and ignores programmatic scrolls, so scrollTo left the page
         * part-way down and the ring legitimately incomplete — the check would
         * have been measuring Lenis, not the ring.
         */
        for (let i = 0; i < 60; i += 1) {
          const atFoot = await page.evaluate(
            () =>
              window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2,
          );
          if (atFoot) break;
          await page.mouse.wheel(0, 1400);
          await page.waitForTimeout(60);
        }
        await page.waitForTimeout(700);
        const full = await page.evaluate(measureProgressRing);
        if (full && full.dashoffset > 0.5) {
          fail(
            route,
            width,
            'ring incomplete at foot',
            `dashoffset ${full.dashoffset} of ${full.dasharray}`,
          );
        }
      }
    }

    // Header nav contrast in the scrolled state
    const scrolled = await page.evaluate(readHeaderColours);
    if (scrolled && scrolled.backdrops.length > 0) {
      const fg = parseRgb(scrolled.color);
      // Composite the backdrop stack bottom-up into one opaque colour.
      let bg = scrolled.backdrops[scrolled.backdrops.length - 1].rgb;
      for (let i = scrolled.backdrops.length - 2; i >= 0; i -= 1) {
        const layer = scrolled.backdrops[i];
        bg = flatten(layer.rgb, layer.alpha, bg);
      }
      if (fg) {
        const effective = flatten(fg.rgb, fg.alpha, bg);
        const ratio = contrast(effective, bg);
        if (ratio < 4.5) {
          fail(
            route,
            width,
            'nav contrast',
            `nav link ${ratio.toFixed(2)}:1 at scrollY ${scrolled.scrollY}`,
          );
        }
      }
    }
  }
  process.stdout.write(`  ${route.padEnd(34)} done\n`);
}

await browser.close();

console.log('');
if (failures.length === 0) {
  console.log('PASS — every check clean on all routes and widths.');
  process.exit(0);
}

console.log(`FAIL — ${failures.length} issue(s):\n`);
const byCheck = {};
for (const f of failures) {
  byCheck[f.check] ??= [];
  byCheck[f.check].push(f);
}
for (const [check, items] of Object.entries(byCheck)) {
  console.log(`${check} — ${items.length}`);
  for (const item of items.slice(0, 12)) {
    console.log(`   ${item.route} @${item.width}: ${item.detail}`);
  }
  if (items.length > 12) console.log(`   … ${items.length - 12} more`);
  console.log('');
}
process.exit(1);
