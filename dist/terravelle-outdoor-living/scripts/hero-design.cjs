const fs = require("fs");
const images = {
    "products.html": [
        "home-1/hero.webp",
        "A considered outdoor furniture collection on a sunlit terrace",
    ],
    "inspiration-gallery.html": ["gallery/space-1.webp", "An inviting outdoor living space"],
    "contact.html": [
        "about/hero.webp",
        "Warm timber and natural textures in the Terravelle showroom",
    ],
    "404.html": ["home-1/story.webp", "A peaceful outdoor setting"],
    "coming-soon.html": ["home-2/hero.webp", "A beautifully furnished Mediterranean terrace"],
};
for (const file of fs.readdirSync("pages").filter((f) => f.endsWith(".html"))) {
    const path = `pages/${file}`;
    let html = fs.readFileSync(path, "utf8");
    html = html.replace(/(<main[^>]*>\s*)(<section[\s\S]*?<\/section>)/, (_, start, section) => {
        if (section.includes("photo-hero") || section.includes("product-hero"))
            return start + section;
        if (file === "product-details.html")
            return start + section.replace('class="section"', 'class="section product-hero"');
        section = section.replace(/<section class="([^"]+)"/, '<section class="$1 photo-hero"');
        if (images[file]) {
            let [image, alt] = images[file];
            if (!fs.existsSync(`assets/images/${image}`)) image = "home-1/hero.webp";
            const small = image.replace(".webp", "-600.webp");
            const srcset = fs.existsSync(`assets/images/${small}`)
                ? `srcset="../assets/images/${small} 600w, ../assets/images/${image} 1200w" sizes="100vw"`
                : "";
            section = section.replace(
                /(<section[^>]*>)/,
                `$1<img class="hero-backdrop" src="../assets/images/${image}" ${srcset} alt="${alt}" width="1200" height="900" fetchpriority="high">`,
            );
            section = section.replace('class="container"', 'class="container photo-copy"');
        } else {
            section = section.replace(/sizes="[^"]*"/g, 'sizes="100vw"');
        }
        return start + section;
    });
    fs.writeFileSync(path, html);
}
if (fs.existsSync("assets/images/heroes/index.webp")) require("./unique-heroes.cjs");
