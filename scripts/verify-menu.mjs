/**
 * Mega-menu acceptance tests.
 *
 *   node scripts/verify-menu.mjs [baseUrl]
 *
 * These exist because the dead-zone bug was invisible to every other check in
 * this repo: the panel rendered, the markup was correct, the audit passed, and
 * the menu was still unusable. Only driving a real pointer across the boundary
 * catches it.
 *
 * The root cause, for anyone who breaks it again: `overflow-x: clip` on the
 * <header> left the panel painted but outside Chromium's hit-testing, so the
 * pointer registered as leaving the header the moment it crossed y = header
 * bottom. Test 1 is the regression guard.
 *
 * Exits non-zero on any failure.
 */
import { chromium } from 'playwright';

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

const CLOSE_DELAY = 280;

const results = [];
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`  ${pass ? 'ok  ' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();

/* ---------------------------------------------------------------- desktop -- */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await goto(page, `${BASE}/services`);

/*
 * Open state is read from aria-hidden, not from computed opacity. The panel
 * fades over 260ms, so an opacity test samples the transition rather than the
 * state and reports a panel that is opening as closed. Test 7e checks the
 * rendered result separately, so an aria-only pass cannot hide a panel that
 * never actually appears.
 */
const panelOpen = (id) =>
  page.evaluate((pid) => document.getElementById(pid)?.getAttribute('aria-hidden') === 'false', id);

/*
 * Rects come from evaluate(), never from locator.boundingBox(): boundingBox
 * scrolls the element into view, and this header closes an open panel once the
 * page has scrolled 40px. The measurement would have caused the failure it was
 * measuring.
 */
const rectOf = (selector) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left };
  }, selector);

const centre = async (selector) => {
  const b = await rectOf(selector);
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, box: b };
};

const TRIGGER = { About: '#trigger-about', Services: '#trigger-services' };

/*
 * The preloader is a full-viewport overlay for ~1s after load and swallows
 * every pointer event underneath it. Nothing can be driven until it unmounts.
 */
const ready = async (target = page) => {
  await target.waitForFunction(() => !document.querySelector('[class*="z-[100]"]'), null, {
    timeout: 8000,
  });
  await target.waitForTimeout(150);
};

const park = async () => {
  await page.mouse.move(20, 700);
  await page.waitForTimeout(CLOSE_DELAY + 250);
};

console.log(`\nMega-menu acceptance tests against ${BASE}\n`);

// 1. Straight down, then diagonally to the far corner of the panel.
{
  await ready();
  await park();
  const c = await centre(TRIGGER.About);
  await page.mouse.move(c.x, c.y, { steps: 10 });
  await page.waitForTimeout(300);

  const panelBox = await rectOf('#mega-about');
  let survivedVertical = true;
  for (let y = c.y; y <= panelBox.y + 60; y += 4) {
    await page.mouse.move(c.x, y);
    await page.waitForTimeout(16);
    if (!(await panelOpen('mega-about'))) {
      survivedVertical = false;
      record('1a. straight down into the panel', false, `closed at y=${Math.round(y)}`);
      break;
    }
  }
  if (survivedVertical) record('1a. straight down into the panel', true);

  // Diagonal to the far-right feature card.
  const target = await centre('#mega-about .col-span-4 a');
  await page.mouse.move(target.x, target.y, { steps: 25 });
  await page.waitForTimeout(120);
  const stillOpen = await panelOpen('mega-about');
  record('1b. diagonal to the far-right card', stillOpen);

  // And the link is genuinely clickable — the hit-testing regression guard.
  const clickable = await page.evaluate(() => {
    const link = document.querySelector('#mega-about a[href="/safety-compliance"]');
    const r = link.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return document.getElementById('mega-about').contains(hit);
  });
  record('1c. panel links are hit-testable', clickable);
}

// 2. Cross to the neighbouring trigger: switches immediately, no empty flicker.
{
  await park();
  const a = await centre(TRIGGER.About);
  await page.mouse.move(a.x, a.y, { steps: 8 });
  await page.waitForTimeout(300);

  const s = await centre(TRIGGER.Services);
  await page.mouse.move(s.x, s.y, { steps: 6 });
  await page.waitForTimeout(40);
  const servicesOpen = await panelOpen('mega-services');
  const aboutClosed = !(await panelOpen('mega-about'));
  record('2. switching triggers is immediate', servicesOpen && aboutClosed, `services=${servicesOpen} about-closed=${aboutClosed}`);
}

// 3. Fast sweep across the whole nav opens nothing.
{
  await park();
  const nav = await rectOf('nav[aria-label="Primary"]');
  await page.mouse.move(nav.x - 40, nav.y + nav.height / 2);
  await page.mouse.move(nav.x + nav.width + 40, nav.y + nav.height / 2, { steps: 6 });
  await page.waitForTimeout(60);
  const anyOpen = (await panelOpen('mega-about')) || (await panelOpen('mega-services'));
  record('3. fast sweep opens nothing', !anyOpen);
}

// 4. Leaving into the page body closes after the grace period, and stays closed.
{
  await park();
  const c = await centre(TRIGGER.About);
  await page.mouse.move(c.x, c.y, { steps: 8 });
  await page.waitForTimeout(300);
  await page.mouse.move(c.x, 700, { steps: 4 });

  await page.waitForTimeout(120);
  const openDuringGrace = await panelOpen('mega-about');
  await page.waitForTimeout(CLOSE_DELAY + 400);
  const closedAfter = !(await panelOpen('mega-about'));
  record('4. closes after the grace period', openDuringGrace && closedAfter, `held=${openDuringGrace} closed=${closedAfter}`);
}

// 5. Keyboard: open, focus moves in, Escape closes and returns focus.
{
  await park();
  await page.locator(TRIGGER.About).focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  const opened = await panelOpen('mega-about');
  const focusInPanel = await page.evaluate(() =>
    document.getElementById('mega-about').contains(document.activeElement),
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const closed = !(await panelOpen('mega-about'));
  const focusBack = await page.evaluate(() => document.activeElement?.id === 'trigger-about');
  record('5. keyboard open, focus in, escape, focus back', opened && focusInPanel && closed && focusBack,
    `open=${opened} focusIn=${focusInPanel} closed=${closed} returned=${focusBack}`);
}

// 6. Exactly one active underline, matching the route.
{
  for (const [route, expected] of [
    ['/services', 'Services'],
    ['/services/freight-haulage', 'Services'],
    ['/safety-compliance', 'About'],
    ['/fleet', 'Fleet'],
  ]) {
    await goto(page, `${BASE}${route}`);
    await ready();
    const current = await page.evaluate(() =>
      [...document.querySelectorAll('nav[aria-label="Primary"] [aria-current="page"]')].map((e) =>
        e.textContent.trim().replace(/▾$/, '').trim(),
      ),
    );
    record(`6. ${route} marks exactly one item`, current.length === 1 && current[0] === expected, current.join(', ') || 'none');
  }
}

// 7. Panel geometry and alignment (brief B1/B2).
{
  await goto(page, `${BASE}/services`);
  await ready();
  await park();
  const c = await centre(TRIGGER.About);
  await page.mouse.move(c.x, c.y, { steps: 8 });
  await page.waitForTimeout(400);

  const geo = await page.evaluate(() => {
    const panel = document.getElementById('mega-about');
    const r = panel.getBoundingClientRect();
    const header = document.querySelector('header').getBoundingClientRect();
    const links = [...panel.querySelectorAll('ul > li > a')];
    const rows = new Map();
    for (const link of links) {
      const view = link.querySelector('span:last-of-type').getBoundingClientRect();
      const top = Math.round(link.getBoundingClientRect().top);
      if (!rows.has(top)) rows.set(top, []);
      rows.get(top).push(Math.round(view.top));
    }
    const container = panel.querySelector('.container-site').getBoundingClientRect();
    const pageContainer = document.querySelector('main .container-site')?.getBoundingClientRect();
    return {
      height: Math.round(r.height),
      viewportRatio: r.height / window.innerHeight,
      gapToHeader: Math.round(r.top - header.bottom),
      rows: [...rows.values()],
      containerLeft: Math.round(container.left),
      pageLeft: pageContainer ? Math.round(pageContainer.left) : null,
    };
  });

  record('7a. panel is at most 62vh', geo.viewportRatio <= 0.62, `${geo.height}px = ${(geo.viewportRatio * 100).toFixed(1)}vh`);
  record('7b. no gap between header and panel', geo.gapToHeader <= 0, `${geo.gapToHeader}px`);
  const aligned = geo.rows.every((row) => Math.max(...row) - Math.min(...row) <= 1);
  record('7c. VIEW links align per row', aligned, geo.rows.map((r) => r.join('/')).join('  '));
  record('7d. panel content aligns to the page container', geo.pageLeft === null || geo.containerLeft === geo.pageLeft,
    `panel=${geo.containerLeft} page=${geo.pageLeft}`);

  // The open panel is genuinely painted, not merely flagged open.
  await page.waitForTimeout(400);
  const painted = await page.evaluate(() => {
    const cs = getComputedStyle(document.getElementById('mega-about'));
    return { visibility: cs.visibility, opacity: cs.opacity };
  });
  record('7e. open panel is fully painted', painted.visibility === 'visible' && Number(painted.opacity) === 1,
    `visibility=${painted.visibility} opacity=${painted.opacity}`);
}

/* ------------------------------------------------------------------ touch -- */
{
  const touch = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    hasTouch: true,
    isMobile: false,
  });
  const tp = await touch.newPage();
  await tp.addInitScript(() => {
    // Chromium reports `pointer: fine` even with hasTouch, so force the media
    // query the component actually reads.
    const real = window.matchMedia.bind(window);
    window.matchMedia = (q) =>
      q.includes('pointer: coarse') ? { matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} } : real(q);
  });
  await goto(tp, `${BASE}/services`);
  await ready(tp);

  const t = tp.locator('nav[aria-label="Primary"] button:has-text("About")').first();
  await t.tap();
  await tp.waitForTimeout(250);
  const openedByTap = await tp.evaluate(() => getComputedStyle(document.getElementById('mega-about')).visibility === 'visible');
  await tp.tap('main', { position: { x: 200, y: 400 } });
  await tp.waitForTimeout(250);
  const closedByOutsideTap = await tp.evaluate(() => getComputedStyle(document.getElementById('mega-about')).visibility === 'hidden');
  record('8. touch: tap opens, outside tap closes', openedByTap && closedByOutsideTap, `open=${openedByTap} closed=${closedByOutsideTap}`);

  // 9. With every panel closed, a link where the panel would have been is clickable.
  const reachable = await tp.evaluate(() => {
    const panel = document.getElementById('mega-about');
    const r = panel.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + 120);
    return !panel.contains(hit);
  });
  record('9. closed panel does not block the page beneath', reachable);

  await touch.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(
  failed.length
    ? `\nFAIL — ${failed.length} of ${results.length} checks failed.\n`
    : `\nPASS — all ${results.length} mega-menu checks clean.\n`,
);
process.exit(failed.length ? 1 : 0);
