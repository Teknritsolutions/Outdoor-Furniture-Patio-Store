# Customization

## Brand and visual system

CSS variables in `assets/css/style.css` control the light palette, typography, spacing, and component colors. `dark-mode.css` supplies the dark palette. The bronze accent is decorative; text uses the higher-contrast terracotta color. Headings use locally hosted DM Serif Display and body text uses Inter with system fallbacks.

Pages load `assets/css/site.css`, which combines the five source stylesheets into one request. After changing a source CSS file, run `npm run styles` (or `node scripts/styles.cjs`) to refresh this bundle. Feature scripts use `defer` and retain their dependency order.

Responsive behavior lives in `responsive.css`. Grids collapse at content-led breakpoints, and navigation becomes a mobile menu below 1024px. Logical properties and `rtl.css` support RTL without mirroring photos or wordmarks.

The custom logo and favicon are in `assets/icons/`. Icons use a local Lucide SVG sprite. A page generator embeds the same header/footer in each static HTML file so pages work without network-loaded HTML partials.

## Products and imagery

Change product names, prices, materials, dimensions, and descriptions in `scripts/build.cjs`; run `npm run build` and format the source afterward. All catalog links use stable `?id=` product identifiers. Category links use `?category=` and are selected on arrival.

Image paths, descriptions, and placements are listed in `image-inventory.json` and `image-inventory.md`. Each content asset is distinct. Thumbnail controls and lightbox views show the selected source photo on the same page; they are views of an existing image, rather than separate editorial placements. Images are optimized WebP files. Preserve their aspect ratios when replacing them.

## Forms, map, and social profiles

Set `TERRAVELLE_CONFIG.endpoints` in `assets/js/main.js`. Each form POSTs JSON whose keys match field `name` attributes. Your backend should independently validate, protect against spam, apply rate limits, and return a 2xx response only when the request was accepted. Error and pending states are already implemented. Demo submissions do not send, book, subscribe, or save personal data.

The booking form prevents past dates using the visitor's local date. It does not check actual availability. Production appointment confirmation must come from your booking service.

Set `mapEmbedUrl` to your real supported embed URL, and configure Instagram, Facebook, and LinkedIn profile URLs. Until configured, social buttons announce that the profile is unavailable, and the map section explains its integration status. Replace the fictional phone, email, address, and opening hours in the generator.

## SEO

Run `node scripts/configure-seo.cjs https://your-domain.com` after the final build. This configures canonical and Open Graph URLs and generates the sitemap. No fabricated location, rating, or verified review is represented in structured data. Product query variants update their title and description in the browser; for fully server-indexable product-specific metadata, generate separate static product files in your production adaptation.
