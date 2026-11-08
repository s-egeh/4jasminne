# Handover — 4Jasmine Dr website

This site was built by rebranding an existing logistics website onto a new company. Nothing from
the previous company has been carried over as a fact about 4Jasmine Dr: its agencies, clients,
staff, community programmes, milestones, statistics and company profile were removed, not
reworded. Where 4Jasmine Dr has not yet supplied something, the site either shows nothing or shows
copy that describes capability and intent in general terms — never an invented number, name,
client, date or certification.

Everything below is waiting on the client or on whoever deploys the site. Work down the list and
delete rows as they close. Every item is also marked `[TODO-CLIENT]` in the source, so
`grep -rn "TODO-CLIENT" src` finds the place to make each change.

---

## 1. Blocking before launch

| # | Item | Where to change it |
|---|---|---|
| 1 | **Canonical host — apex or www.** The code defaults to `https://4jasminedrive.com` (the apex). Decide which host serves the site, redirect the other one to it, and **set `SITE_URL` and `NEXT_PUBLIC_SITE_URL` on the host to that same value.** If the two variables disagree, or name a host that redirects, every canonical, sitemap URL, `robots.txt` Host line and share-card URL points at a redirect — the mistake that affected the site this codebase came from. If www is chosen, also change the default in both files listed here so a missing variable cannot fall back to the wrong host. | Host env; `DEFAULT_SITE_URL` in `src/lib/utils.ts` and `next-sitemap.config.js` |
| 2 | **Email address.** `info@4jasminedrive.com` was assumed from the domain; it was not supplied. It appears on every page and receives the form enquiries. | `COMPANY.email` in `src/data/company.ts`; `CONTACT_TO_EMAIL` in the host env |
| 3 | **Mail delivery.** Create a Resend account, verify the sending domain, and set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`. Then send one test from each of the three forms. See section 6. | Host env |
| 4 | **Service set sign-off.** The four services — Freight & Haulage, Warehousing & Storage, Distribution, Freight Forwarding — and their slugs were proposed, not supplied. Confirm the set, the names, every capability, and both columns of every "what's included / what isn't" block. | `src/data/services.ts` |
| 5 | **Customs and forwarding position.** The freight-forwarding page describes coordination and documentation *support* only, and lists customs declarations as a licensed broker under "not included". Confirm whether 4Jasmine Dr holds a customs broker licence, works through a partner, or neither, before the page is published. | `src/data/services.ts`, `src/data/faq.ts` |
| 6 | **Copy review.** All marketing copy is drafted, not supplied. Every block marked `[TODO-CLIENT: review wording]` must be read and approved, or replaced, by the client: vision, mission, governance, company overview, core values, the "why us" points, the hero slides, the FAQ, safety and compliance, the fleet page and coverage. | See the files listed in section 3 |
| 7 | **Legal review of `/privacy` and `/terms`.** Both are readable, specific documents, but neither has been checked by a lawyer. Check the privacy policy against Ghana's Data Protection Act, 2012 (Act 843), confirm whether the business must register with the Data Protection Commission, and set a retention period. Set `COMPANY.policiesUpdated` to the date the reviewed versions are published. | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/data/company.ts` |

---

## 2. What the client must supply

Numbered in the order they matter for launch.

1. Registered legal name of the business.
2. Email address(es): the public address, and where form enquiries should be delivered.
3. Confirmation that +233 53 771 6237 is the operations line, plus any other numbers and what each is for.
4. Whether the WhatsApp line is the same number (currently assumed).
5. Business hours (the current hours are a placeholder default).
6. Precise directions to the office in the Free Zone Enclave — the gate, the building, a landmark.
7. Social media accounts, if any.
8. Sign-off on the four services and their slugs.
9. Customs broker licence status, or the clearing partner used.
10. Which vehicle and equipment types are actually operated, whether they are owned, hired or subcontracted, and any publishable capacities or unit counts.
11. The regular routes, and whether any cross-border routes are actively served.
12. The goods handled, and any refused (for example chilled, frozen or hazardous goods).
13. Whether vehicle tracking is offered to clients.
14. Typical lead time for a consignment.
15. Any minimum storage period or quantity.
16. Insurance and liability position — for goods in transit and goods in storage — and what cover may be named publicly.
17. Payment terms and accepted payment methods.
18. Whether cash-on-delivery collection is offered.
19. Whether ports or airports other than Tema are handled.
20. Which compliance documents can be offered to procurement teams.
21. Confirmation of every safety and maintenance practice described on `/safety-compliance` and `/fleet`.
22. The documentation a client receives (quote, goods-received record, delivery documents, records, invoice) — confirm or correct the list.
23. Approval of all drafted copy (section 1, item 6).
24. Department contact routing (operations, warehouse, accounts), if enquiries should go to different people.
25. The management team: names, roles, biographies, credentials, portraits, and each person's permission to publish. Optionally a chief executive's statement in their own words.
26. Company structure: departments and what each owns.
27. Clients that may be named publicly, with their permission; logos only if supplied by the client.
28. Testimonials with named people, companies and written permission.
29. Community and sustainability work, with photographs.
30. Company milestones with dates.
31. Strategic pillars, market drivers and future plans, if the client wants those sections.
32. Careers: roles hired for and how to apply.
33. Photography — see section 4. Reconcile the slot list in section 4 against the client's own shot list.
34. A vector master of the logo (SVG, AI, EPS or PDF) — see section 4.
35. A company profile PDF, if one should be downloadable. The download button was removed and returns only when a real file exists.
36. Standard terms of carriage or storage, if they exist, so `/terms` can link to them.
37. Registration details (business registration number, TIN), if the client wants them shown.

Where each one goes:

| Item(s) | File |
|---|---|
| 1–7 | `src/data/company.ts` (the hours in `COMPANY.hours`), and flip the matching flag in `CONFIRMED` in `src/lib/schema.ts` once email, legal name and hours are confirmed |
| 8, 9, 15 | `src/data/services.ts`, `src/data/faq.ts` |
| 10 | `src/data/fleet.ts` |
| 11 | `COMPANY.routes` in `src/data/company.ts` and `CORRIDORS` in `src/data/coverage.ts`; for a new place, add it to `PLACES` in both `src/data/coverage.ts` and `scripts/build-coverage-map.mjs`, then run `npm run build:map` |
| 12–22 | `src/data/faq.ts`, `src/data/safety.ts`, `src/data/operations.ts` (each has a `pending` note naming the question — never rendered) |
| 24 | `src/app/contact/page.tsx` |
| 25 | `TEAM` and `CEO_STATEMENT` in `src/data/team.ts` |
| 26 | `DIVISIONS`, `ORG_INTRO` and `GOVERNANCE_PRACTICE` in `src/data/org.ts` |
| 27, 28 | `CLIENTS` and `TESTIMONIALS` in `src/data/clients.ts`; logos in `public/images/clients/` |
| 29 | `src/data/csr.ts` |
| 30 | `src/data/milestones.ts` |
| 31 | `STRATEGIC_PILLARS`, `MARKET_DRIVERS` and `FUTURE_PLANS` in `src/data/company.ts` |
| 32 | `CAREERS_COPY` and `CAREERS_BLOCKS` in `src/data/org.ts` |

---

## 3. Sections and pages switched off until the content exists

The codebase renders nothing when a list is empty, so each of these switches back on by supplying
its data — no component needs editing.

| Content | Empty today | What is hidden while empty |
|---|---|---|
| `TEAM` (`src/data/team.ts`) | Yes | `/team` (404 page, `noindex`), its nav and footer links, the homepage leadership preview, the "Meet the management team" link on `/about` |
| `CEO_STATEMENT` + a featured team member | Yes | The chief executive statement on `/about` |
| `CLIENTS` (`src/data/clients.ts`) | Yes | `/clients` (404 page, `noindex`), the Clients nav item and footer link, the homepage clients marquee |
| `TESTIMONIALS` | Yes | The testimonial rail on `/clients` |
| `CSR_INITIATIVES` (`src/data/csr.ts`) | Yes | `/csr` (404 page, `noindex`), its nav and footer links, the homepage CSR band |
| `DIVISIONS` (`src/data/org.ts`) | Yes | The structure diagram on `/about` and `/team` |
| `STRATEGIC_PILLARS`, `FUTURE_PLANS` | Yes | Those two sections on `/about` |
| `MARKET_DRIVERS` | Yes | The market-outlook band on the homepage |
| `MILESTONES` | Yes | The timeline on `/about` |
| `COMPANY.socials` | Yes | Social links in the top bar, footer and drawer; `sameAs` in the structured data |
| `GALLERY_PUBLISHED` (`src/data/gallery.ts`) | `false` | `/gallery` builds and renders but is unlinked and `noindex` |

**One manual step per page.** The sitemap config is CommonJS and cannot read the TypeScript data,
so `/team`, `/clients`, `/csr` and `/gallery` are listed in the `exclude` array of
`next-sitemap.config.js`. When one of them is published, delete it from that array. The browser
test scripts (`scripts/audit.mjs`, `verify.mjs`, `verify-mobile.mjs`) leave the three 404 routes
out of their route lists for the same reason — add each back when it goes live.

**A note on the 404 status.** While switched off, `/team`, `/clients` and `/csr` render the 404
page with `noindex`, but the HTTP status is 200, not 404. The root `src/app/loading.tsx` wraps every
page in a Suspense boundary, so Next.js starts streaming before the page calls `notFound()` and the
status can no longer change. Unknown service slugs (`/services/anything`) behave the same way, as
they did before the rebrand. The routes are not linked, not in the sitemap and marked `noindex`, so
this is a soft 404, not a crawlable page. Removing `loading.tsx` would give a true 404 at the cost
of the navigation skeleton.

---

## 4. Assets

### Brand — `/public/brand/` and `/src/app/` — generated, one thing outstanding

Every brand file is generated from the client's logo by two committed scripts, so nothing is
hand-made and everything can be regenerated when the artwork changes:

```bash
npm run build:brand   # = node scripts/build-logo-variants.mjs && node scripts/build-og-image.mjs
```

The source is `assets/brand/4jasmine-logo-source.jpg` — the 1408×768 JPEG the client supplied,
kept outside `public/` so it is never served.

| File | What it is |
|---|---|
| `4jasmine-logo-full.png` | Full stacked lockup — mark, "4Jasmine Dr", "LOGISTICS & DISTRIBUTION" — in its original navy, transparent. For light surfaces and print; also the logo in the structured data. |
| `4jasmine-logo-full-white.png` | The same lockup with the wordmark and descriptor in white. Used in the ink footer and on the share card. |
| `4jasmine-logo-mark.png` | The truck-and-leaf mark alone, square, transparent, original colours. |
| `4jasmine-logo-mark-dark.png` | The mark for dark surfaces — the grey leaf and route line lifted from #686C6F (2.66:1 on navy, muddy) to #9AA0A4 (5.33:1). The gold truck is unchanged. Used in the header, drawer, preloader and icons. |
| `4jasmine-wordmark-white.png` | "4Jasmine Dr" alone in white, for the horizontal header lockup. The descriptor is left out because at header width it would render under six pixels tall. |
| `icon-192.png`, `icon-512.png` | PWA icons: the dark-surface mark on an opaque #0E2C4E plate at 80%. |
| `icon-maskable.png` | 512px, mark at 60% so it survives Android's launcher crop. |
| `og-image.jpg` | 1200×630 share card: #0E2C4E ground, white lockup centred, gold rule, the tagline set in Archivo. Rendered in Chrome by `scripts/build-og-image.mjs` so the type is the site's own font, not a fallback. |
| `src/app/favicon.ico` | A real ICO holding 16, 32 and 48px frames. The 16px frame draws the mark at 92% so the truck keeps every pixel it can. |
| `src/app/icon.png`, `src/app/apple-icon.png` | 192 and 180px, Next file-convention names, so Next emits the `<link>` tags itself. |

How the cut-out works: the source is a JPEG on an off-white ground, so it has no transparency. A
generic colour-to-alpha filter would have made the solid gold truck semi-transparent. The script
instead measures each band's real ink colour (gold #C99E47, grey #666B6D, navy #0E2B4D, descriptor
#103D5F — matching the site tokens within a step or two) and unmixes every pixel against that
known colour, so interiors are fully opaque in the exact brand colour and only anti-aliased edges
are partial.

**Outstanding — a vector master.** The mark is only about 250px across in the supplied JPEG. Every
output up to that size is a downscale and is sharp; `icon-512.png` and the maskable icon need the
mark at about 410px and 307px, so they are upscaled and their edges are soft at full size. Ask the
client for the logo as SVG, AI, EPS or PDF, export a large transparent PNG from it to the same
path, and re-run `npm run build:brand`.

### Photography — `/public/images/`

Every folder ships empty. Every path below is referenced in code and shows a branded placeholder
until the file lands. Missing photographs are detected **at build time**:
`scripts/build-image-manifest.mjs` runs before every `dev` and `build`, lists what is in
`public/images`, and any slot not on that list renders its placeholder in the server HTML with no
request for the missing file. Lightboxes skip missing photographs, and thumbnails are not
clickable until their photograph exists. Drop a file in and rebuild — no code change.

**The filenames are slot names, kept from the original build.** Some describe the old company's
subject (`fleet-tipper.jpg`, `service-leasing.jpg`). They were deliberately not renamed, so that no
reference, aspect ratio or layout moves. The table says what each slot should now show. The
subjects below are a proposal for 4Jasmine Dr's operations — reconcile them with the client's own
shot list before commissioning.

The ratio is enforced by the layout, so a photograph delivered at the stated ratio drops in without
any cropping decisions being made later.

| Path | Ratio | Suggested px | What the photograph should show |
|---|---|---|---|
| `hero/hero-01.jpg` | 16:10 | 2400×1500 | A loaded 4Jasmine Dr truck on a Ghanaian highway, shot low, early light. Homepage slide 1, `/about`, `/quote`. |
| `hero/hero-02.jpg` | 16:10 | 2400×1500 | Inside the warehouse: palletised goods in storage. Homepage slide 2, `/coverage`. |
| `hero/hero-03.jpg` | 16:10 | 2400×1500 | Vehicles loading at the warehouse in the Free Zone Enclave. Homepage slide 3, `/services`, the Services mega-menu. |
| `hero/hero-04.jpg` | 16:10 | 2400×1500 | Containers at Tema Port. Homepage slide 4. |
| `services/service-logistics.jpg` | 16:10 | 1600×1000 | **Freight & Haulage** — a loaded truck on a trunk road. |
| `services/service-goods.jpg` | 16:10 | 1600×1000 | **Warehousing & Storage** — racked or stacked pallets in the warehouse. |
| `services/service-leasing.jpg` | 16:10 | 1600×1000 | **Distribution** — a delivery being unloaded at a retail outlet. |
| `services/service-commodity.jpg` | 16:10 | 1600×1000 | **Freight Forwarding** — containers at Tema Port awaiting collection. |
| `fleet/fleet-trailer.jpg` | 4:3 | 1600×1200 | **Articulated truck** loaded for a long-haul delivery. Also the `/fleet` hero. |
| `fleet/fleet-tanker.jpg` | 4:3 | 1600×1200 | **Rigid box or curtain-side truck** being loaded at the warehouse. |
| `fleet/fleet-tipper.jpg` | 4:3 | 1600×1200 | **Light delivery vehicle** at a retail drop. |
| `fleet/fleet-flatbed.jpg` | 4:3 | 1600×1200 | **Container trailer** leaving Tema Port. |
| `fleet/fleet-excavator.jpg` | 4:3 | 1600×1200 | **Warehouse handling equipment** — a forklift moving pallets. |
| `gallery/gallery-01.jpg` | 16:10 | ≥1600 long edge | Trucks lined up in the Free Zone Enclave before morning dispatch. Also beside the homepage introduction. |
| `gallery/gallery-02.jpg` | 4:5 | ≥1600 long edge | A driver checking how a load is secured before departure. Also beside the homepage introduction. |
| `gallery/gallery-03.jpg` | 16:10 | ≥1600 long edge | Palletised goods being loaded for a nationwide delivery. |
| `gallery/gallery-04.jpg` | 4:5 | ≥1600 long edge | A rigid truck on a delivery route in Greater Accra. |
| `gallery/gallery-05.jpg` | 16:10 | ≥1600 long edge | Goods being received into the warehouse. |
| `gallery/gallery-06.jpg` | 4:5 | ≥1600 long edge | Pallets being moved inside the warehouse. |
| `gallery/gallery-07.jpg` | 16:10 | ≥1600 long edge | Goods staged at the loading bay for dispatch. Also the `/faq` hero. |
| `gallery/gallery-08.jpg` | 4:5 | ≥1600 long edge | The operations team planning the day's dispatches. |
| `gallery/gallery-09.jpg` | 16:10 | ≥1600 long edge | Cartons handed over at a retail delivery point. |
| `gallery/gallery-10.jpg` | 4:5 | ≥1600 long edge | A delivery vehicle loaded in drop order for a multi-drop run. |
| `gallery/gallery-11.jpg` | 16:10 | ≥1600 long edge | A delivery being signed for at a trade customer. |
| `gallery/gallery-12.jpg` | 16:10 | ≥1600 long edge | A truck on a national highway at dusk. Also the `/gallery` hero. |
| `gallery/gallery-13.jpg` | 4:5 | ≥1600 long edge | Shipping documents being checked for an import. |
| `gallery/gallery-14.jpg` | 16:10 | ≥1600 long edge | A container being collected at Tema Port. |
| `gallery/gallery-15.jpg` | 4:5 | ≥1600 long edge | Export cargo being prepared for the port. |
| `gallery/gallery-16.jpg` | 16:10 | ≥1600 long edge | Drivers being briefed before departure. Also the `/safety-compliance` hero. |
| `gallery/gallery-17.jpg` | 4:5 | ≥1600 long edge | Stock records being checked in the warehouse. |
| `gallery/gallery-18.jpg` | 16:10 | ≥1600 long edge | A delivery being unloaded at a distributor's warehouse. Also the `/clients` hero. |
| `gallery/gallery-19.jpg` | 16:10 | ≥1600 long edge | Cross-docking: goods moving straight from an inbound to an outbound vehicle. |
| `gallery/gallery-20.jpg` | 4:5 | ≥1600 long edge | Goods being wrapped and secured on a pallet. |
| `gallery/gallery-21.jpg` | 16:10 | ≥1600 long edge | A container being unloaded at the warehouse. |
| `gallery/gallery-22.jpg` | 4:5 | ≥1600 long edge | A light delivery vehicle in Tema. |
| `gallery/gallery-23.jpg` | 16:10 | ≥1600 long edge | The office in the Free Zone Enclave. Also the `/contact` and `/team` heroes and the About mega-menu. |
| `gallery/gallery-24.jpg` | 4:5 | ≥1600 long edge | A loaded truck leaving the Free Zone Enclave at first light. |
| `team/team-<name>.jpg` | 4:5 | 800×1000 | One portrait per team member, path set in `src/data/team.ts`. Until supplied, a monogram tile shows. |
| `csr/…` | 16:10 | 1600×1000 | One per community initiative, path set in `src/data/csr.ts`. |
| `clients/client-*.png` | — | max height 48px | Transparent logos, **supplied by the client only** and only with each company's permission. Never sourced from the web. |
| `textures/truck-silhouette.png` | — | — | Optional faint backdrop for the pre-footer CTA band at 8%. Renders nothing if absent. |

### `/gallery` is built but unpublished

The route renders but is not linked anywhere and carries `noindex`; `GALLERY_PUBLISHED` is
`false`. A grid of placeholders undersells the business, and a grid of other companies' vehicles
misrepresents it. To publish once real photographs exist: set `GALLERY_PUBLISHED` to `true` in
`src/data/gallery.ts` and delete `'/gallery'` from the `exclude` array in `next-sitemap.config.js`.

### Bringing in photography

`scripts/ingest-image.mjs` takes a supplied file to a live image:

```bash
node scripts/ingest-image.mjs <source> <slot> --alt "…" \
  --source-url <url> --credit "…" --licence "…"
```

It checks the source resolution and **refuses to upscale**, crops to the slot's ratio, applies the
house grade, exports AVIF, WebP and a JPG fallback with metadata stripped, and records the
provenance in `docs/image-credits.md`. Minimum source widths: hero 2000px; service, fleet, CSR and
gallery 1400px; team portraits 800px. **Every image needs a recorded licence.**

### Documents and video

`/public/docs/` is empty. The company-profile download was removed with the previous company's
content and returns only with a real file. `/public/video/` is unused; ask before adding a hero
video, since it is a meaningful data cost on Ghanaian mobile connections.

---

## 5. Answers drafted for the client to confirm

Every FAQ answer and safety block whose truth depends on information not yet supplied carries a
`pending` note in its data file. The drafted answer is what renders, so a visitor never sees a
placeholder. Where a fact such as a lead time or minimum is not known, the copy says what is true —
that it is agreed case by case — rather than inventing a number. The questions to put to the client
are items 9–22 in section 2; find each one with:

```bash
grep -rn "pending:" src/data
```

---

## 6. Email delivery

The contact, enquiry and quote forms POST to `/api/contact`, which validates server-side with the
same Zod schemas the client uses, checks a honeypot field and a two-second timing floor,
rate-limits by IP (8 per hour) and sends a plain-text email through Resend with every field
labelled.

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | From the Resend dashboard |
| `CONTACT_FROM_EMAIL` | An address on a domain **verified in Resend**, for example `website@4jasminedrive.com`. A bare address is sent with the display name "4Jasmine Dr website". |
| `CONTACT_TO_EMAIL` | Where enquiries are delivered. Falls back to `COMPANY.email` if unset. |

Without the key and sender, the route returns a 500 and the visitor sees a failure message that
always includes the operations phone number and email, so nobody hits a dead end — but the enquiry
is lost. **After setting them, send one test from each of the three forms and confirm it arrives.**

The rate limiter holds its state in memory, which is correct for a single Vercel region. If the
site is ever scaled across regions, move it to a shared store (Upstash or Vercel KV); the comment
marking this is in `src/app/api/contact/route.api.ts`.

On the static-export target there is no API route; the forms post to `NEXT_PUBLIC_FORM_ENDPOINT`
(Web3Forms or Formspree) instead. See the README.

---

## 7. Analytics and consent

`NEXT_PUBLIC_GA_ID` is empty, so there is no analytics and no cookie notice. Set the measurement ID
and both switch on together: the analytics script loads only after the visitor accepts, and
Decline stores the choice and loads nothing. Five events are wired: `quote_submit`,
`contact_submit`, `enquiry_submit`, `phone_click` and `whatsapp_click`.

---

## 8. Colour and accessibility

The palette is taken from the logo: navy `#0E2C4E`, gold `#CB9F46`, leaf grey `#686C6F` and the
off-white ground `#F7F7F4`. The previous palette's crimson accent was removed — the logo has no
red — and every use was remapped: emphasis to gold, solid fills to ink.

Every text and background pair was measured against WCAG AA. Two adjustments came out of it:

| Pair | Measured | Change |
|---|---|---|
| `--gold-ink` (text-safe gold) on bone / paper | 5.93 / 6.36:1 | None needed — `#7A5A14` passes as specified. |
| `--slate-400` on `--ink-800` (CTA band, placeholders) | 4.37:1 — fails | Lifted from `#9AA0A4` to `#A0A6AA` (4.69:1). Visually indistinguishable. |
| Primary button hover — ink on `--gold-d` | 3.86:1 — fails | Hover inverts to an ink fill with a white label (14.1:1) inside a gold border instead. |
| Focus ring — gold on bone | 2.28:1 — under the 3:1 minimum | Two-tone ring: an ink ring tight to the element and a gold outline outside it, so one is always visible on light and dark surfaces. |

Plain gold (`--gold`) is 2.28:1 on bone, so it is used on light surfaces only for decoration
(rules, `aria-hidden` icons, underlines), never for text.

**Form validation uses a red, `--danger` (`#B3261E`, 6.09:1 on bone).** It is not a brand colour
and appears only on invalid fields, error messages and the form-failure alert. Errors are the one
place where a conventional red does real work for the reader. If the client prefers no red
anywhere, point `danger` at `var(--gold-ink)` in `tailwind.config.ts` — it passes AA as text.

---

## 9. Verification status

Run on the rebranded build (Next.js 14.2.35, Node 24):

| Check | Scope | Result |
|---|---|---|
| `npm run typecheck` | Whole codebase | Clean |
| `npm run lint` | Whole codebase | Clean |
| `npm run build` | 27 static outputs incl. 4 service pages | Clean |
| `scripts/audit.mjs` | 17 routes | Pass |
| `scripts/verify.mjs` | 16 routes × 8 widths | Pass after one fix (a heading that wrapped to three lines) |
| `scripts/verify-mobile.mjs` | 16 routes × 5 widths, touch | Pass |
| `scripts/verify-menu.mjs` | 18 mega-menu checks | Pass |

The sitemap generates 15 URLs on `https://4jasminedrive.com`; `/styleguide`, `/gallery`, `/team`,
`/clients` and `/csr` are excluded.

One build attempt failed inside `next/font` while fetching Google Fonts and passed on an identical
re-run. The fonts are fetched at build time, so a build host without access to
`fonts.googleapis.com` will fail the same way.

**Not yet done:** a Lighthouse run (meaningless until the photography is in place, since
placeholders weigh nothing); testing on real iOS Safari and Android Chrome devices; a static-export
build (`STATIC_EXPORT=true`) of the rebranded site; a live test of the contact form against Resend.

---

## 10. Known constraints

These describe the codebase and still apply.

**The mega-menu panel must not sit inside an element with `overflow-x: clip`.** Chromium paints an
overflowing descendant of a clipped box but excludes it from hit testing, so the panel renders and
nothing in it can be clicked. `scripts/verify-menu.mjs` guards this.

**Scripted scrolls must state their behaviour.** `<html>` carries `scroll-behavior: smooth`, and a
scripted scroll passing `behavior: 'auto'` defers to it. Anything that repositions rather than
travels must pass `behavior: 'instant'`.

**Tailwind opacity modifiers need channel values.** A colour defined as a plain `var(--x)` holding a
hex emits no rule at all for `bg-ink-900/70`. The ink scale is built from `--ink-900-rgb` and
friends for this reason; plain CSS uses `rgb(var(--ink-900-rgb) / 0.96)` so the palette has one
source.

**`src/data/coverage-map.ts` and `src/data/image-manifest.ts` are generated.** Edit `PLACES` in
`coverage.ts` (and its mirror in the script) and run `npm run build:map`; the script refuses to run
if the two copies of the coordinates disagree. The image manifest is rewritten on every dev start
and build.

**Lenis owns the scroller on a fine pointer** and ignores `window.scrollTo`. Tests that need the
page to move must use wheel events.
