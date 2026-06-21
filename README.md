# SkyVast Green Initiative — Website

A state-of-the-art, donor-focused marketing site for **SkyVast Green Initiative (SGI)**,
a U.S. 501(c)(3) engineering water resilience across Kenya's arid and semi-arid lands.

Benchmarked against [cewas.org](https://www.cewas.org/) for polish and donor-conversion,
but designed fresh — the messaging, structure and the donor strategy baked in come from
the **SKYGREEN Donor Engine** and [skyvast.org](https://skyvast.org/).

## Stack

- **100% static** — hand-authored HTML, one CSS file, one vanilla-JS file. No build step,
  no dependencies, no framework. Drop it on any host (Netlify, Vercel, GitHub Pages, S3, cPanel).
- **Real field photography** in `assets/img/` (downloaded locally, so the site is
  self-contained and fast), combined with **inline-SVG infographics** for the dashboard
  and Kenya map where data visuals beat photos.
- Google Fonts: *Fraunces* (display) + *Plus Jakarta Sans* (body).

## Photography

The 12 photos in `assets/img/` are authentic East-African / Kenyan field images
(water collection in the drylands, acacia savanna, women farmers, tree-planting,
community portraits) sourced from **Unsplash** under the free Unsplash License.

> **Before public launch:** replace these with SGI's **own field photos** from your
> nine counties wherever possible — your real beneficiaries and projects will always
> out-convert stock. Keep the same filenames (`hero.jpg`, `community.jpg`, etc.) and
> the layout updates automatically. If you keep any Unsplash images, no attribution is
> legally required but crediting the photographers is appreciated.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, verified-impact band, six pillars, value prop, 5-phase model, Packs, testimonials, partners, newsletter |
| `about.html` | Mission/vision, dual US–Kenya presence, 9 counties, timeline |
| `our-work.html` | Deep dive on the six pillars + the Illuminate→Tailor→Build→Empower→Multiply model |
| `impact.html` | Technology-verification engine, headline metrics, "Beans to Trees" ESG story |
| `get-involved.html` | **Interactive donation widget**, the four Packs, Rain Catchers dam campaign, volunteer/ESG/grants, donor FAQ |
| `contact.html` | Routed enquiry form + both office locations |

## Donor-Engine strategy baked into the copy

Directly from the SKYGREEN Donor Engine references:

- **Positioning:** "We don't just deliver water — we engineer resilience at every scale."
- **Six pillars** → Water & Food Security, Health, Education, Biodiversity, Livelihoods, Climate Resilience.
- **Unique value prop:** dual legal presence (US tax-deductibility + Kenya delivery),
  technology-verified impact (real-time dashboards, GPS-tagged trees, AI tracking),
  scalable **four-Pack architecture** (Starter → Community → Golden → Resilience),
  ESG-ready "Beans to Trees".
- **Five-phase delivery model** as a funder-facing process.
- **Verified metrics only:** 3,000+ families, 2M+ trees, 1B+ litres, 9 counties,
  1,999+ farmers, 30,000+ coffee plants, 10+ water pans.

## Going live (wire up the placeholders)

The site ships with safe demo behaviour; connect these to go fully live:

1. **Donations** — the widget on `get-involved.html#donate` builds the gift amount/frequency
   client-side. Point the "Continue to secure checkout" button + the amount logic at
   **Stripe Checkout, Donorbox, or PayPal Giving**.
2. **Forms** — newsletter and contact forms are marked `data-demo` (no backend). Wire them to
   Formspree / your CRM / an email endpoint and remove the `data-demo` attribute.
3. **Social links** — the footer/contact social icons currently all point to
   `https://skyvast.org/` as a safe placeholder (no broken `#` links). When you have the
   official accounts, find each `aria-label="LinkedIn|Instagram|X|YouTube"` anchor and
   replace `href="https://skyvast.org/"` with the real profile URL (or delete platforms
   you're not on). They appear in the footer of all six pages plus the contact card.
4. **Logo** — the real SGI logo (`assets/img/logo-color.png`, pulled from skyvast.org) is
   already wired into every header (full colour) and footer (auto-inverted to white via
   the `brand-logo--invert` CSS class). Swap the file to update it everywhere at once.
5. **Photography** — real field photos live in `assets/img/`; swap any for SGI's own shots
   using the same filenames. The dashboard and Kenya-map infographics remain inline SVG.
6. **Analytics** — add your GA4 / Plausible snippet before `</head>`.

## Local preview

It's pure static — just open `index.html`, or serve the folder:

```bash
npx serve .        # or: python -m http.server
```

© SkyVast Green Initiative — U.S.-registered 501(c)(3).
