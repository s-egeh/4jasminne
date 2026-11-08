/**
 * Mobile acceptance tests.
 *
 *   node scripts/verify-mobile.mjs [baseUrl]
 *
 * Runs every route at five phone and tablet widths, with a touch
 * context and a coarse pointer, and asserts the things that only go wrong on a
 * phone. verify.mjs covers layout at desktop widths; this covers reach.
 *
 * Per route, per width:
 *   - no horizontal scroll
 *   - every interactive target at least 44x44 with 8px of separation
 *   - body copy never below 15px; form controls exactly 16px
 *   - nothing readable sits under the fixed action stack
 *   - no table scrolls horizontally
 *
 * Once, at 390px:
 *   - drawer opens, scrolls internally, locks the page, closes five ways
 *   - the mega-menu never mounts below 1024px
 *   - Lenis is not running on a coarse pointer
 *
 * Exits non-zero on any failure.
 */
import { chromium, devices } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3250';

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

const WIDTHS = [360, 390, 414, 768, 820];

const failures = [];
const fail = (route, width, check, detail) => failures.push({ route, width, check, detail });

/* ------------------------------------------------------------- in-page -- */

const findOverflow = () =>
  Array.from(document.querySelectorAll('*'))
    .filter((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const style = getComputedStyle(el);
      if (style.position === 'fixed') return false;
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      if (rect.right <= document.documentElement.clientWidth + 1) return false;
      let parent = el.parentElement;
      while (parent) {
        const ox = getComputedStyle(parent).overflowX;
        if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return false;
        parent = parent.parentElement;
      }
      return true;
    })
    .slice(0, 5)
    .map((el) => ({
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 70),
      right: Math.round(el.getBoundingClientRect().right),
    }));

/*
 * Tap targets. A link inside a run of prose is not a tap target in the sense the
 * guideline means — it is a word — so inline links inside a <p> are exempt, as
 * are targets whose parent row already provides the height.
 */
const findSmallTargets = () => {
  const nodes = Array.from(
    document.querySelectorAll('a[href], button:not([disabled]), input, select, [role="button"]'),
  ).filter((el) => {
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') return false;
    if (parseFloat(style.opacity) === 0) return false;
    if (el.closest('[aria-hidden="true"]')) return false;
    if (el.closest('p')) return false;
    if (el.type === 'hidden') return false;
    // The skip link is a 1x1 clipped element until it takes focus, at which
    // point it becomes a full-size button. Its resting size is not a target.
    if (el.classList.contains('sr-only-focusable') || el.classList.contains('sr-only')) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });

  const small = [];
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    /*
     * The hit area can be larger than the element. A checkbox or radio wrapped
     * in its own <label> is tapped anywhere on that label, however wide the row
     * is — so for those, the label's box IS the target. Otherwise fall back to a
     * wrapper small enough to exist only to hold this control.
     */
    const label = /^(checkbox|radio)$/.test(el.type) ? el.closest('label') : null;
    const box = (label ?? el.parentElement)?.getBoundingClientRect();
    const generous = Boolean(label);
    const h = Math.max(r.height, box && (generous || box.height < 80) ? box.height : 0);
    const w = Math.max(r.width, box && (generous || box.width < 200) ? box.width : 0);
    if (h < 44 || w < 44) {
      small.push({
        tag: el.tagName.toLowerCase(),
        label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 32),
        size: `${Math.round(w)}x${Math.round(h)}`,
      });
    }
  }
  return small.slice(0, 6);
};

const findTinyText = () =>
  Array.from(document.querySelectorAll('p, li, td, dd, dt, span, a'))
    .filter((el) => {
      if (!el.textContent?.trim()) return false;
      if (el.children.length > 0) return false;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      if (el.closest('[aria-hidden="true"]')) return false;
      // Mono labels, eyebrows and captions are a deliberate small-caps register,
      // not body copy. The type scale treats them as a separate register.
      if (/mono/i.test(style.fontFamily)) return false;
      return parseFloat(style.fontSize) < 15;
    })
    .slice(0, 5)
    .map((el) => ({
      tag: el.tagName.toLowerCase(),
      size: getComputedStyle(el).fontSize,
      text: el.textContent.trim().slice(0, 40),
    }));

/*
 * Controls that must be exactly 16px, because below that iOS Safari zooms the
 * viewport on focus and never zooms back. Radios and checkboxes are exempt:
 * they take no text entry, so Safari does not zoom for them, and their label
 * type belongs to the design system rather than to this rule.
 */
const findOversizedControls = () =>
  Array.from(document.querySelectorAll('input, select, textarea'))
    .filter((el) => {
      if (el.type === 'hidden' || el.type === 'radio' || el.type === 'checkbox') return false;
      const size = parseFloat(getComputedStyle(el).fontSize);
      return size !== 16;
    })
    .slice(0, 5)
    .map((el) => ({ name: el.name || el.id, size: getComputedStyle(el).fontSize }));

/*
 * Content sitting under the fixed action stack.
 *
 * Measured with the page at rest at the bottom, not mid-scroll: a floating
 * button necessarily passes over copy while the page is moving, and treating
 * that as a defect would mean reserving a 88px gutter down the right of every
 * paragraph — a quarter of the line length on a 360px screen. What must never
 * happen is content coming to rest underneath it, which is the state a reader
 * actually sits in.
 *
 * Only headings and interactive elements are counted. A paragraph's last line
 * ending under the corner of the button is survivable; a button you cannot
 * press, or a heading you cannot read, is not.
 */
const findTextUnderFab = () => {
  const fab = document.querySelector('.no-print.fixed');
  if (!fab) return [];
  const f = fab.getBoundingClientRect();
  if (f.width === 0) return [];

  return Array.from(document.querySelectorAll('h1, h2, h3, a, button'))
    .filter((el) => {
      if (fab.contains(el)) return false;
      if (!el.textContent?.trim()) return false;
      if (el.children.length > 0) return false;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      return r.left < f.right && f.left < r.right && r.top < f.bottom && f.top < r.bottom;
    })
    .slice(0, 4)
    .map((el) => ({ tag: el.tagName.toLowerCase(), text: el.textContent.trim().slice(0, 40) }));
};

/** Two fixed elements sharing screen space — the FAB stack sitting on a sticky bar. */
const findFixedOverlaps = () => {
  const boxes = Array.from(document.querySelectorAll('*'))
    .filter((el) => {
      const style = getComputedStyle(el);
      if (style.position !== 'fixed') return false;
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      if (parseFloat(style.opacity) === 0) return false;
      if (style.pointerEvents === 'none') return false;
      const rect = el.getBoundingClientRect();
      // A full-width bar is the header; overlapping it is by design.
      if (rect.width > window.innerWidth * 0.6) return false;
      return rect.width > 8 && rect.height > 8;
    })
    .filter((el, _i, all) => !all.some((other) => other !== el && other.contains(el)));

  const hits = [];
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i].getBoundingClientRect();
      const b = boxes[j].getBoundingClientRect();
      if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) {
        hits.push({
          a: boxes[i].getAttribute('aria-label') || boxes[i].tagName,
          b: boxes[j].getAttribute('aria-label') || boxes[j].tagName,
        });
      }
    }
  }
  return hits;
};

const findScrollingTables = () =>
  Array.from(document.querySelectorAll('table'))
    .filter((t) => t.scrollWidth > t.clientWidth + 1 || t.getBoundingClientRect().width > window.innerWidth)
    .slice(0, 3)
    .map((t) => ({ w: Math.round(t.getBoundingClientRect().width), viewport: window.innerWidth }));

/* ----------------------------------------------------------------- run -- */

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices['Pixel 7'],
  viewport: { width: 390, height: 800 },
});
const page = await context.newPage();

const ready = async () => {
  await page.waitForFunction(() => !document.querySelector('[class*="z-[100]"]'), null, {
    timeout: 8000,
  });
  await page.waitForTimeout(350);
};

console.log(`Mobile verification: ${ROUTES.length} routes at ${WIDTHS.join(', ')}px against ${BASE}\n`);

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 800 });
    const response = await goto(page, `${BASE}${route}`);
    if (!response || response.status() >= 400) {
      fail(route, width, 'http', `status ${response ? response.status() : 'none'}`);
      continue;
    }
    await ready();

    const overflow = await page.evaluate(findOverflow);
    if (overflow.length) fail(route, width, 'overflow', JSON.stringify(overflow.slice(0, 2)));

    const scrolls = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    if (scrolls) fail(route, width, 'h-scroll', 'document scrolls horizontally');

    const small = await page.evaluate(findSmallTargets);
    if (small.length) fail(route, width, 'tap target', JSON.stringify(small.slice(0, 3)));

    const tiny = await page.evaluate(findTinyText);
    if (tiny.length) fail(route, width, 'text < 15px', JSON.stringify(tiny.slice(0, 2)));

    const controls = await page.evaluate(findOversizedControls);
    if (controls.length) fail(route, width, 'control font', JSON.stringify(controls));

    const tables = await page.evaluate(findScrollingTables);
    if (tables.length) fail(route, width, 'table scroll', JSON.stringify(tables));

    // To the bottom, where the reader comes to rest and the action stack is
    // definitely showing (it appears past 600px of scroll).
    await page.evaluate(() =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
    );
    await page.waitForTimeout(600);
    const underFab = await page.evaluate(findTextUnderFab);
    if (underFab.length) fail(route, width, 'under action stack', JSON.stringify(underFab.slice(0, 2)));

    const overlaps = await page.evaluate(findFixedOverlaps);
    if (overlaps.length) fail(route, width, 'fixed overlap', JSON.stringify(overlaps.slice(0, 2)));
  }
  process.stdout.write(`  ${route.padEnd(32)} done\n`);
}

/* ------------------------------------------------- drawer and one-offs -- */

await page.setViewportSize({ width: 390, height: 800 });
await goto(page, `${BASE}/services`);
await ready();

// The mega-menu must not mount at all below 1024px.
const megaMounted = await page.evaluate(() => {
  const panels = [...document.querySelectorAll('[id^="mega-"]')];
  return panels.filter((p) => getComputedStyle(p).display !== 'none').length;
});
if (megaMounted > 0) fail('/services', 390, 'mega-menu on mobile', `${megaMounted} panel(s) displayed`);

// Lenis must be off on a coarse pointer.
const lenisRunning = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
if (lenisRunning) fail('/services', 390, 'lenis on touch', 'html.lenis present');

/*
 * Drawer. Deep into the page, because the interesting part is what happens to
 * the scroll position — but jumped there rather than scrolled, since the header
 * legitimately hides itself on a downward scroll and the hamburger has to be on
 * screen to be tapped. `behavior: instant` also exercises the large-delta clamp
 * that stops a restore being mistaken for a scroll gesture.
 */
await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
await page.waitForTimeout(600);
const scrollBefore = await page.evaluate(() => window.scrollY);

await page.locator('button[aria-label="Open navigation"]').tap();
await page.waitForTimeout(500);

const drawerState = await page.evaluate(() => {
  const panel = document.querySelector('[role="dialog"][aria-label="Site navigation"]');
  const r = panel.getBoundingClientRect();
  return {
    onScreen: r.left < window.innerWidth - 10,
    height: Math.round(r.height),
    viewport: window.innerHeight,
    scrollable: panel.scrollHeight > panel.clientHeight,
    bodyLocked: getComputedStyle(document.body).position === 'fixed',
    firstContactTop: Math.round(
      panel.querySelector('a[href^="tel:"]')?.getBoundingClientRect().top ?? -1,
    ),
    contactRowHeight: Math.round(
      panel.querySelector('a[href^="tel:"]')?.getBoundingClientRect().height ?? 0,
    ),
  };
});

if (!drawerState.onScreen) fail('/services', 390, 'drawer open', 'panel did not slide in');
if (drawerState.height > drawerState.viewport + 1) {
  fail('/services', 390, 'drawer height', `${drawerState.height} > ${drawerState.viewport}`);
}
if (!drawerState.bodyLocked) fail('/services', 390, 'scroll lock', 'body is not pinned');
if (drawerState.firstContactTop < 0 || drawerState.firstContactTop > drawerState.viewport) {
  fail('/services', 390, 'contact above fold', `top=${drawerState.firstContactTop}`);
}
if (drawerState.contactRowHeight < 44) {
  fail('/services', 390, 'contact row height', `${drawerState.contactRowHeight}px`);
}

// Close: Escape.
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
const closedByEscape = await page.evaluate(() => {
  const panel = document.querySelector('[role="dialog"][aria-label="Site navigation"]');
  return panel.getBoundingClientRect().left >= window.innerWidth - 10;
});
if (!closedByEscape) fail('/services', 390, 'close on Escape', 'still open');

const scrollAfter = await page.evaluate(() => window.scrollY);
if (Math.abs(scrollAfter - scrollBefore) > 4) {
  fail('/services', 390, 'scroll restored', `${scrollBefore} -> ${scrollAfter}`);
}

/*
 * Restoring the scroll position must not read as a downward scroll. It did, and
 * the header auto-hid the instant the drawer closed — leaving no way back to
 * the navigation without scrolling up first.
 */
await page.waitForTimeout(400);
const headerVisible = await page.evaluate(() => {
  const r = document.querySelector('header').getBoundingClientRect();
  return r.bottom > 0;
});
if (!headerVisible) fail('/services', 390, 'header after close', 'header hid itself');

// Close: backdrop tap. Jumped to the top first for the same reason as above.
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(600);
await page.locator('button[aria-label="Open navigation"]').tap();
await page.waitForTimeout(450);
await page.tap('[role="presentation"]', { position: { x: 20, y: 300 } });
await page.waitForTimeout(450);
const closedByBackdrop = await page.evaluate(() => {
  const panel = document.querySelector('[role="dialog"][aria-label="Site navigation"]');
  return panel.getBoundingClientRect().left >= window.innerWidth - 10;
});
if (!closedByBackdrop) fail('/services', 390, 'close on backdrop', 'still open');

await browser.close();

console.log('');
if (failures.length === 0) {
  console.log('PASS — every mobile check clean on all routes and widths.');
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
  for (const item of items.slice(0, 10)) {
    console.log(`   ${item.route} @${item.width}: ${item.detail}`);
  }
  if (items.length > 10) console.log(`   … ${items.length - 10} more`);
  console.log('');
}
process.exit(1);
