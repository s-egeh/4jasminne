# 4Jasmine Dr

Corporate website for 4Jasmine Dr — logistics and distribution from the Free Zone Enclave, Tema,
Ghana: road freight and haulage, warehousing and storage, scheduled and last-mile distribution, and
freight forwarding.

Pages for the company, its four services, fleet, coverage, safety and compliance, FAQ, contact and
a three-step quote request, with structured data and a static-export deployment path. Content the
client has not yet supplied is either hidden or drafted in general terms, never invented; see
`HANDOVER.md` for everything outstanding.

---

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS 3.4 with a token layer in `src/styles/globals.css` |
| Motion | Framer Motion, Lenis (smooth scroll), Swiper (hero and fleet rail) |
| Forms | React Hook Form with Zod validation, shared client and server |
| Email | Resend |
| Images | `next/image`, AVIF with WebP fallback |
| Fonts | Archivo (display), Inter Tight (body), IBM Plex Mono (labels) — fetched from Google Fonts at build time |

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server (rebuilds the image manifest first) |
| `npm run build` | Image manifest, production build, then `sitemap.xml` and `robots.txt` |
| `npm start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run format` | Prettier with Tailwind class sorting |
| `npm run build:map` | Regenerates the coverage map geometry (needs network) |
| `npm run build:images` | Regenerates the image manifest on its own |
| `npm run build:brand` | Regenerates every logo, icon and the share card from the client's artwork |

---

## Environment variables

All are listed in `.env.example`. None are required for the site to render — each one falls back
to a default or switches its feature off.

| Variable | Purpose | If unset |
|---|---|---|
| `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | Canonical origin, used by metadata, structured data and the sitemap | Falls back to `https://4jasminedrive.com` |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number in international format, digits only | Falls back to `COMPANY.whatsapp` in `company.ts` |
| `RESEND_API_KEY` | Resend API key | The contact API returns 500 and the form shows the phone number and email instead |
| `CONTACT_FROM_EMAIL` | Sending address, on a domain verified in Resend. A bare address is given the display name "4Jasmine Dr website". | As above |
| `CONTACT_TO_EMAIL` | Where enquiries are delivered | Falls back to `COMPANY.email` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID | No analytics and no cookie notice |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Third-party form endpoint, for the static-export target | Forms fall back to `mailto:` |
| `STATIC_EXPORT` | `true` builds a static export for cPanel-style hosting | Vercel/Node target |

`.env.local` is git-ignored. Only `.env.example` is committed, and it holds no secrets.

### Canonical URL

`SITE_URL` and `NEXT_PUBLIC_SITE_URL` **must be set to the same value** in the host's environment,
and that value must be the host that actually serves the site.

Pick one of `https://4jasminedrive.com` and `https://www.4jasminedrive.com`, make the other
redirect to it, and use the one that serves. If the apex and www disagree — the variables naming
one while the host serves the other — every canonical tag, every sitemap URL, the `robots.txt` Host
line and every share card point at a redirect. The code defaults to the apex in two places that must
also agree: `DEFAULT_SITE_URL` in `src/lib/utils.ts` and in `next-sitemap.config.js`.

---

## Where the content lives

Business data is separated from presentation. Nothing a client might change is hardcoded in a
component.

| To change | Edit |
|---|---|
| Phone numbers, address, email, hours, socials, routes | `src/data/company.ts` |
| Vision, mission, values, company overview | `src/data/company.ts` |
| Navigation and footer links | `src/data/nav.ts` |
| The four services and their page content | `src/data/services.ts` |
| Fleet categories and specifications | `src/data/fleet.ts` |
| Coverage routes and map coordinates | `src/data/coverage.ts` (then `npm run build:map`) |
| FAQ questions and groupings | `src/data/faq.ts` |
| Safety and compliance content | `src/data/safety.ts` |
| Process steps, pricing factors, enquiry checklist | `src/data/operations.ts` |
| Homepage hero slides | `src/data/hero.ts` |
| Gallery images and captions | `src/data/gallery.ts` |
| Team, clients, community work, company structure, milestones | `src/data/team.ts`, `clients.ts`, `csr.ts`, `org.ts`, `milestones.ts` — all empty until supplied |

### Content that switches on when supplied

Every list renders nothing while it is empty. `/team`, `/clients` and `/csr` return a 404 page,
are marked `noindex`, and are left out of the navigation, footer and homepage until their data
files hold real content. Filling the data switches them back on. The one manual step is the
sitemap: remove the path from the `exclude` array in `next-sitemap.config.js`. The full table is
in `HANDOVER.md`, section 3.

### Changing a phone number

Edit `COMPANY.phones` in `src/data/company.ts`. It propagates to the top bar, footer, contact page,
quote page, mobile drawer, every `tel:` link, the error page and the structured data.

### Adding a team member

Append to `TEAM` in `src/data/team.ts` with `name`, `role`, `bio`, `credentials` and a `photo` path
under `/public/images/team/` (4:5, 800×1000). Until the photograph exists, a monogram tile shows.

### Swapping a placeholder for a real photograph

Save the file at the path already referenced in the data file and rebuild. No code changes. Every
slot, its ratio and what it should show is listed in `HANDOVER.md`, section 4.

---

## Images and the build-time manifest

`scripts/build-image-manifest.mjs` runs before every `dev` and `build` and writes
`src/data/image-manifest.ts`, the list of files actually present under `public/images`. Every image
component checks it (`isImageAvailable` in `src/lib/images.ts`):

- a missing photograph renders its branded placeholder in the server HTML, with no request for the
  absent file and no broken-image flash before hydration;
- a missing team portrait renders a monogram, and a missing client logo renders the company name;
- lightboxes skip missing photographs, and a thumbnail is only clickable once its photograph exists;
- a page whose share image is missing falls back to `/brand/og-image.jpg`.

A file that is listed but still fails to load falls back to the same placeholder through `onError`.
Images added while `npm run dev` is running appear after a restart.

### Adding photography

```bash
node scripts/ingest-image.mjs <source> <slot> --alt "…" \
  --source-url <url> --credit "…" --licence "…"
```

It verifies the source resolution and refuses to upscale, crops to the slot's ratio, applies a
consistent grade, exports AVIF/WebP/JPG with metadata stripped, and records each file's provenance
in `docs/image-credits.md`.

---

## Brand assets

The client's logo source is `assets/brand/4jasmine-logo-source.jpg`, outside `public/` so it is
never served. `npm run build:brand` regenerates every derivative:

- `scripts/build-logo-variants.mjs` lifts the artwork off its off-white ground with a known-colour
  matte, then writes the navy and white stacked lockups, the header wordmark, the light and
  dark-surface marks, the PWA icons, `src/app/icon.png`, `src/app/apple-icon.png` and a multi-size
  `src/app/favicon.ico`.
- `scripts/build-og-image.mjs` renders the 1200×630 share card in Chrome (through Playwright, using
  the installed Google Chrome) so the tagline is set in Archivo. It reads the tagline from
  `src/data/company.ts`, and stops rather than ship a card in a fallback font if Archivo does not
  load.

`src/components/layout/Logo.tsx` is the only place a logo variant is chosen. The header is always
dark, so it uses the mark beside the white wordmark; the footer uses the white stacked lockup.

A vector master of the logo is still outstanding — see `HANDOVER.md`.

---

## The coverage map

`/coverage` renders a projected map of Ghana with the regular routes drawn on it. None of that
geometry is computed in the browser.

```bash
npm run build:map
```

`scripts/build-coverage-map.mjs` fetches Natural Earth 1:50m admin-0 boundaries (public domain),
projects them and the place coordinates through one Mercator instance, simplifies the rings in
projected pixel space, and writes finished SVG path strings to `src/data/coverage-map.ts`. That file
is generated — do not edit it. `d3-geo` stays a devDependency and never reaches the browser.

Adding a place means adding it to `PLACES` in `src/data/coverage.ts` **and** to the mirror in the
script, then re-running it. The script refuses to run if the two copies disagree. A place too close
to the Tema hub to draw (Tema Port) is marked `onMap: false`: it keeps its row in the route list
but gets no node. Legs shorter than 24 units (Tema–Accra, the port transfer) are listed, not drawn.

---

## Deploying

### Vercel

The default target. Connect the repository and set the environment variables in the project
settings, including `SITE_URL` and `NEXT_PUBLIC_SITE_URL` (see "Canonical URL"). `/api/contact`
runs as a serverless function. The build fetches the three Google fonts, so the build host needs
access to `fonts.googleapis.com`.

### Static export (cPanel or any static host)

```bash
STATIC_EXPORT=true npm run build
```

Emits `out/`. The contact API route is dropped, since `output: 'export'` cannot serve a POST
handler, and the forms fall back to `NEXT_PUBLIC_FORM_ENDPOINT` or to `mailto:`. Image optimisation
is off, so keep hero photographs at or under 2400px wide and roughly 250KB. Long cache headers on
`/public` are set in `next.config.mjs` for the Vercel target only; on a static host the equivalent
rules belong in `.htaccess`.

---

## Verification

Four scripts check a build. Each takes an optional base URL and exits non-zero on failure. Run them
against a **production** server (`npm run build && npm start`), not the dev server.

```bash
node scripts/audit.mjs         http://localhost:3000   # markup and SEO, no browser needed
node scripts/verify.mjs        http://localhost:3000   # layout at eight widths
node scripts/verify-mobile.mjs http://localhost:3000   # phone and tablet, touch context
node scripts/verify-menu.mjs   http://localhost:3000   # the mega-menu
```

The last three need Chromium: `npx playwright install chromium`.

`audit.mjs` asserts one `<h1>` per route, a unique `<title>` under 60 characters, a meta description
of 140–160 characters, a canonical URL, Open Graph and Twitter tags, at least three in-body internal
links, no `href="#"`, no unresolved placeholder string reaching a visitor and an `alt` on every
`<img>`. `verify.mjs` checks overflow, overlapping fixed elements, the section-heading contract and
header contrast at eight widths. `verify-mobile.mjs` checks tap targets, body-copy size, form-control
size and the mobile drawer. `verify-menu.mjs` covers the desktop mega-menu end to end.

The route lists leave out `/team`, `/clients` and `/csr` while they are switched off; add each back
when it is published.

---

## Notes for anyone editing this codebase

**Colour.** Tokens live in `src/styles/globals.css` and are taken from the logo. Gold is the only
accent: emphasis is gold, solid fills are ink. Use `text-gold-ink` for gold text on light surfaces —
plain `gold` is decorative there (2.28:1 on bone). `danger` exists for form validation only.

**Colour with opacity.** Tailwind cannot apply an opacity modifier to a colour whose value is a
plain `var(--x)` holding a hex — it needs bare channels. The ink scale is therefore built from
`--ink-900-rgb` and friends. Defining it from the hex variables emits no rule at all for
`bg-ink-900/70`, silently.

**Scripted scrolling.** `<html>` carries `scroll-behavior: smooth`. A scripted scroll passing
`behavior: 'auto'` defers to that declaration, so anything that repositions rather than travels must
pass `behavior: 'instant'`.

**The mega-menu panel** must not sit inside an element with `overflow-x: clip`, or nothing in it can
be clicked. `scripts/verify-menu.mjs` guards this.

**The type scale** is component classes (`.t-display-xl`, `.t-h2`, `.t-small` and so on), not
`theme.fontSize` entries: tailwind-merge treats unknown `text-*` names as colours and silently drops
the size.

---

## Style guide

`/styleguide` renders the colour tokens, type scale, buttons, form controls and section patterns on
one page. It is excluded from the sitemap and carries `noindex`.
