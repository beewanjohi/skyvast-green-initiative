# Deploying the SkyVast Green Initiative site

This is a **100% static site** — plain HTML, one CSS file, one JS file, and images.
No build step, no server, no database. That means it can be hosted *anywhere* that
serves files. Pick whichever option below is easiest for you.

**Deploy package (ready now):** `C:\Users\admin\skyvast-green-initiative-deploy.zip`
(the whole site, ~3 MB). Or just upload the folder `C:\Users\admin\skyvast-green-initiative`.

> Whatever host you use, **`index.html` must sit at the root** of what you upload
> (don't nest it inside an extra folder), so the site loads at `/`.

---

## Option 1 — Netlify Drop (fastest, ~60 seconds)

1. Go to **https://app.netlify.com/drop**
2. Drag the **folder** `skyvast-green-initiative` (or the unzipped contents) onto the page.
3. It goes live instantly at a `https://<random-name>.netlify.app` URL.
4. Create a free account to keep it permanently and to add a custom domain.

## Option 2 — Cloudflare Pages

1. Sign in at **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** →
   **Upload assets**.
2. Upload the zip (or the folder). Name the project (e.g. `skyvast`).
3. Live at `https://skyvast.pages.dev`. Add a custom domain under the project's settings.

## Option 3 — GitHub Pages (good if you use GitHub)

```bash
cd C:/Users/admin/skyvast-green-initiative
git init
git add .
git commit -m "SkyVast Green Initiative website"
git branch -M main
git remote add origin https://github.com/<your-username>/skyvast-green-initiative.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: `main` / root → Save**.
Live at `https://<your-username>.github.io/skyvast-green-initiative/` within a minute.

## Option 4 — Vercel

1. Push to GitHub (as above), then **https://vercel.com/new** → import the repo.
2. Framework preset: **Other**. No build command, output dir = root. Deploy.

## Option 5 — Traditional web host / cPanel

Upload the folder contents into `public_html` (or your web root) via FTP or the host's
File Manager. Done — it works on any Apache/Nginx server with zero configuration.

---

## Custom domain (e.g. a SkyVast subdomain)

`skyvast.org` already points to your existing WordPress site, so use a **subdomain** for
this one, such as `give.skyvast.org`, `donate.skyvast.org`, or `impact.skyvast.org`:

1. In your host's dashboard, add the custom domain (e.g. `give.skyvast.org`).
2. In your DNS provider, add the **CNAME** record the host gives you
   (e.g. `give` → `<your-site>.netlify.app`).
3. HTTPS is issued automatically by Netlify / Cloudflare / GitHub Pages.

---

## Before you go fully live — quick checklist

- [ ] **Donations:** wire the donation widget's "Continue to secure checkout" button to
      Stripe / Donorbox / PayPal (see `README.md`).
- [ ] **Forms:** connect the newsletter + contact forms to Formspree or your CRM, then
      remove the `data-demo` attribute.
- [ ] **Socials:** the footer icons currently point to `https://skyvast.org/`; swap in real
      Facebook / Instagram / LinkedIn / X / YouTube URLs when ready.
- [ ] **Photos:** replace the Unsplash field photos in `assets/img/` with SGI's own
      photos (keep the same filenames).
- [ ] **Analytics:** add your GA4 / Plausible snippet before `</head>`.
- [ ] Test on a phone — the site is fully responsive.

© SkyVast Green Initiative — U.S.-registered 501(c)(3).
