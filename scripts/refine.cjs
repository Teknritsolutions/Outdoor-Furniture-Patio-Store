const fs = require("fs");
for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
    let html = fs.readFileSync(`pages/${file}`, "utf8");
    const type =
        file === "about.html"
            ? "AboutPage"
            : file === "contact.html"
              ? "ContactPage"
              : ["products.html", "inspiration-gallery.html"].includes(file)
                ? "CollectionPage"
                : "WebPage";
    const title = html.match(/<title>(.*?)<\/title>/s)[1];
    html = html.replace(
        "</head>",
        `<link rel="canonical" href="./${file}">\n<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": type, name: title, inLanguage: "en", isPartOf: { "@type": "WebSite", name: "Terravelle Outdoor Living" } })}</script>\n</head>`,
    );
    if (file === "index.html") {
        html = html.replace(
            '<a class="button " href="about.html">',
            '<ul class="check-list"><li>Materials selected for outdoor life.</li><li>Comfort considered in every curve.</li><li>Personal guidance for your space.</li></ul><a class="button " href="about.html">',
        );
    }
    if (file === "index-2.html") {
        const featured = html.indexOf("Favorites for everyday escapes");
        const offset = html.indexOf('class="product-grid"', featured);
        if (offset > 0)
            html =
                html.slice(0, offset) +
                html
                    .slice(offset)
                    .replace('class="product-grid"', 'class="product-grid four-product-grid"');
    }
    fs.writeFileSync(`pages/${file}`, html);
}
for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
    let html = fs.readFileSync(`pages/${file}`, "utf8");
    html = html.replace(
        /(<div[^>]*)(aria-label="(?:Product categories|Inspiration categories)")/g,
        '$1role="group" $2',
    );
    html = html.replace(/<thead>([\s\S]*?)<\/thead>/g, (match) =>
        match.replace(/<th>/g, '<th scope="col">'),
    );
    html = html.replace(/<tbody>([\s\S]*?)<\/tbody>/g, (match) =>
        match.replace(/<th>/g, '<th scope="row">'),
    );
    html = html.replace("+1 (202) 555-0148", "+1&nbsp;(202)&nbsp;555&#8209;0148");
    html = html.replace(/<button(?![^>]*\btype=)/g, '<button type="button"');
    html = html.replace('<main id="main">', '<main id="main" tabindex="-1">');
    html = html.replace(
        '</nav><div class="header-actions">',
        '<a class="mobile-showroom" href="contact.html#booking">Visit Our Showroom</a></nav><div class="header-actions">',
    );
    html = html.replace(
        "</head>",
        '<link rel="preload" href="../assets/fonts/dm-serif-display.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="../assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>\n</head>',
    );
    html = html.replace(
        'id="lightbox-image"',
        'id="lightbox-image" src="../assets/images/gallery/space-1.webp" loading="lazy"',
    );
    fs.writeFileSync(`pages/${file}`, html);
}
require("./icons.cjs");
require("./hero-design.cjs");
require("./home-polish.cjs");
require("./home-two-polish.cjs");
require("./bulk-polish.cjs");
require("./form-placeholders.cjs");
require("./contact-polish.cjs");
