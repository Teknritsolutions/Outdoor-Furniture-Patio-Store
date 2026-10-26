const fs = require("fs");
const descriptions = {
    index: "Teak lounge furniture on a peaceful coastal terrace",
    "index-2": "Contemporary outdoor living on a lush rooftop terrace at dusk",
    about: "An artisan inspecting the joinery of a teak outdoor chair",
    products: "A curated collection of dining and lounge furniture in an architectural courtyard",
    "materials-guide": "Teak, woven rattan, performance fabric and metal material samples",
    "inspiration-gallery": "A layered garden courtyard with lounge and dining spaces",
    "bulk-orders": "Coordinated loungers and parasols on a boutique hotel pool terrace",
    contact: "A welcoming showroom consultation table with design and material samples",
    404: "A garden path leading to a welcoming outdoor bench",
    "coming-soon": "A new teak lounge chair collection preview in a design studio",
    "product-details": "Precision teak joinery and a lounge chair in a minimal stone courtyard",
};
for (const [id, alt] of Object.entries(descriptions)) {
    const file = `pages/${id}.html`;
    let html = fs.readFileSync(file, "utf8");
    const src = `../assets/images/heroes/${id}.webp`;
    if (!fs.existsSync(`assets/images/heroes/${id}.webp`)) throw new Error(`Missing hero: ${id}`);
    const image = `<img class="hero-backdrop" src="${src}" srcset="../assets/images/heroes/${id}-600.webp 600w, ${src} 1600w" sizes="100vw" alt="${alt}" width="1600" height="900" fetchpriority="high" decoding="async">`;
    html = html.replace(
        /(<main[^>]*>\s*<section[^>]*>)([\s\S]*?)(<\/section>)/,
        (_, start, content, end) => {
            if (id === "product-details") {
                content = content.replace(/<img\b[^>]*class="hero-backdrop"[^>]*>/g, "");
                return start + image + content + end;
            }
            if (content.includes('class="hero-image"'))
                content = content.replace(
                    /(<div class="hero-image">\s*)<img\b[^>]*>/,
                    "$1" + image.replace('class="hero-backdrop"', ""),
                );
            else content = content.replace(/<img\b[^>]*class="hero-backdrop"[^>]*>/, image);
            return start + content + end;
        },
    );
    fs.writeFileSync(file, html);
}
