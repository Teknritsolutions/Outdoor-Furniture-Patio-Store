# Installation and deployment

The production site consists of `index.html`, `pages/`, `assets/`, `robots.txt`, and `sitemap.xml`. No build step is necessary for hosting. All assets, icons, and fonts are local. JavaScript is vanilla ES6; Bootstrap 5 provides the responsive foundation.

For local HTTP preview, run `npm start` and visit http://localhost:4173. Runtime HTML also supports file opening without fetching partials. Use HTTP for reliable SEO and deployment behavior.

Upload the production files to any static host. Preserve folder structure. Configure the host's not-found document to `pages/404.html`; the bundled Node preview server already returns this page for unknown paths.

Before publishing, replace fictional business data and run `node scripts/configure-seo.cjs https://your-domain.com`. An absolute domain was not invented for this demo. The initial sitemap is intentionally empty until configured. Re-run SEO configuration after regenerating the pages.

Development dependencies are only needed for rebuilding, formatting, or testing. Run `npm install` to restore them. On Windows, use `npm.cmd` if PowerShell blocks npm's script shim. On a path containing an ampersand, invoke development command files with Node directly if npm script resolution fails.

After rebuilding, run `node scripts/optimize-images.cjs` to refresh responsive image markup and 600px WebP variants. This optional development step requires ImageMagick on PATH. Preserve the already supplied variants if you are only deploying the template. Enable gzip or Brotli for HTML, CSS, JavaScript, and SVG on your production host; the included preview server uses gzip when supported.

Use `node scripts/server.cjs`, `node scripts/build.cjs`, `node tests/audit.cjs`, and `node node_modules/prettier/bin/prettier.cjs --write pages/*.html` as direct equivalents.
