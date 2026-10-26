# Terravelle Outdoor Living

A complete, static HTML outdoor furniture and showroom enquiry template. Eleven pages, two distinct ten-section homepages, a 21-product catalog, 18-space inspiration gallery, light/dark themes, and RTL support.

## Preview

Run `npm start`, then open **http://localhost:4173**. The root page displays Homepage 1 directly. You can also open `pages/index.html` directly; all runtime assets are local, and no HTML partials are fetched. After editing Homepage 1, run `node scripts/sync-home.cjs` to update the root page.

## Customize

- Edit page markup directly, or edit `scripts/build.cjs` and run `npm run build`. The generator overwrites pages, product data, and image inventory; it does not overwrite CSS, interaction scripts, or images.
- Set service endpoints, a real map embed, and social profiles in `assets/js/main.js`.
- After editing source CSS, run `npm run styles` to refresh the combined stylesheet.
- Replace all fictional contact details, team profiles, sample testimonials, product specifications, and demonstration prices before a real business deployment.
- Configure your real domain with `node scripts/configure-seo.cjs https://your-domain.com` after the final build. This writes canonical URLs, Open Graph URLs, the sitemap, and robots configuration.
- Activate RTL by adding `?dir=rtl` to any page URL or setting `dir="rtl"` on the HTML element.

## Verify

Run `npm install` once if development dependencies are missing. Install the testing browser using `node node_modules/@playwright/test/cli.js install chromium`. With the preview server running, run `npm test`.

The audit checks all 11 pages in both themes at 13 widths, section counts, overflow, navigation, product filtering/sorting, all 21 product detail variants, gallery controls, form validation, image paths, and distinct image hashes. Reports and screenshots are written to `tests/`.

This is a catalog and showroom enquiry template. Forms validate locally and explicitly state that nothing was transmitted until an endpoint is configured. No checkout, payments, or dashboard are included.

See [installation](documentation/installation.md), [customization](documentation/customization.md), [page inventory](documentation/pages.md), [image inventory](documentation/image-inventory.md), and [credits](documentation/credits.md).
