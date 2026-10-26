/* Run after build: node scripts/configure-seo.cjs https://your-domain.com */
const fs = require("fs");
const origin = process.argv[2];
if (!origin || !/^https:\/\/[a-z0-9.-]+(?::\d+)?\/?$/i.test(origin)) {
    console.error("Provide your real HTTPS origin, without a path.");
    process.exit(1);
}
const base = origin.replace(/\/$/, "");
const files = fs.readdirSync("pages").filter((file) => file.endsWith(".html"));
for (const file of files) {
    let html = fs.readFileSync(`pages/${file}`, "utf8");
    html = html
        .replace(/\s*<link rel="canonical"[^>]*>/g, "")
        .replace(/\s*<meta property="og:url"[^>]*>/g, "");
    html = html.replace(
        "</head>",
        `<link rel="canonical" href="${base}/pages/${file}">\n<meta property="og:url" content="${base}/pages/${file}">\n</head>`,
    );
    fs.writeFileSync(`pages/${file}`, html);
}
fs.writeFileSync(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files
        .filter((file) => !["404.html", "coming-soon.html"].includes(file))
        .map((file) => `  <url><loc>${base}/pages/${file}</loc></url>`)
        .join("\n")}\n</urlset>`,
);
fs.writeFileSync(
    "robots.txt",
    `User-agent: *\nAllow: /\nDisallow: /pages/coming-soon.html\nSitemap: ${base}/sitemap.xml\n`,
);
