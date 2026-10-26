const fs = require("fs");
const path = require("path");
const inventory = [];
const cats = [
    "Garden Chairs",
    "Dining Sets",
    "Hammocks",
    "Sun Loungers",
    "Umbrellas",
    "Outdoor Lighting",
    "Planters",
];
const slug = (s) =>
    s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-$/, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
function image(page, key, subject, hero = false) {
    const file = `${page}/${key}.webp`;
    inventory.push({
        file,
        page,
        section: key,
        subject,
        ratio: hero ? "3:2" : "4:3",
    });
    return `<img src="../assets/images/${file}" alt="${esc(subject)}" width="1200" height="900" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
const icon = (name) =>
    `<svg class="icon" aria-hidden="true"><use href="../assets/icons/lucide.svg#${name}"></use></svg>`;
const link = (label, url = "products.html", secondary = false) =>
    `<a class="button ${secondary ? "button-outline" : ""}" href="${url}">${label}${icon("arrow-up-right")}</a>`;
function heading(title, tag = "Considered outdoor living", text = "") {
    return `<div class="section-heading"><p class="eyebrow">${tag}</p><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
}
function section(title, body, cls = "", tag, text) {
    return `<!-- ${title} -->\n<section class="section ${cls}"><div class="container">${heading(title, tag, text)}${body}</div></section>`;
}
function split(
    page,
    key,
    title,
    text,
    subject,
    reverse = false,
    url = "about.html",
    label = "Discover our story",
) {
    return `<section class="section ${reverse ? "soft" : ""}"><div class="container split ${reverse ? "reverse" : ""}"><div class="editorial-image">${image(page, key, subject)}</div><div class="editorial-copy"><p class="eyebrow">The Terravelle perspective</p><h2>${title}</h2><p>${text}</p><p>Natural textures. Useful details. Room to slow down. Every choice begins with the way you want to live outdoors.</p>${link(label, url)}</div></div></section>`;
}
function cta(
    title = "Experience Outdoor Living in Person",
    text = "Find your comfortable place. Explore finishes, feel the materials, and plan a space that feels like you.",
) {
    return `<section class="section closing"><div class="container closing-inner"><div><p class="eyebrow">A little closer to your perfect outdoors</p><h2>${title}</h2><p>${text}</p></div>${link("Book a Showroom Visit", "contact.html#booking")}</div></section>`;
}
const benefits = [
    [
        "sun",
        "Weather-Ready Materials",
        "Selected for outdoor use, with practical care guidance for every finish.",
    ],
    [
        "hammer",
        "Timeless Craftsmanship",
        "Beautiful proportions and thoughtful construction, down to the last joint.",
    ],
    [
        "armchair",
        "Thoughtful Comfort",
        "Supportive shapes and inviting cushions for longer afternoons outdoors.",
    ],
    [
        "messages-square",
        "Expert Showroom Guidance",
        "Explore your options with a team who understands space, style, and daily life.",
    ],
];
function blocks(items, cls = "four-grid") {
    return `<div class="${cls}">${items.map(([i, t, d]) => `<article class="benefit">${icon(i)}<h3>${t}</h3><p>${d}</p></article>`).join("")}</div>`;
}
function steps() {
    return `<ol class="steps">${[
        ["Share Your Vision", "Tell us about your space, style, and priorities."],
        ["Explore Collections", "Compare materials and sit comfortably with your options."],
        ["Select Your Pieces", "Choose the scale, finishes, and fabrics that suit you."],
        ["Complete Your Space", "Plan placement and enquire about delivery arrangements."],
    ]
        .map(([t, d], i) => `<li><span>0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`)
        .join("")}</ol>`;
}
const names = [
    ["Solana Teak Lounge Chair", "Arlo Aluminum Armchair", "Cove Woven Garden Chair"],
    ["Sienna Six Seat Dining Set", "Linea Bistro Dining Set", "Porto Iron Dining Set"],
    ["Drift Cotton Hammock", "Dune Rope Hammock", "Haven Hammock with Stand"],
    ["Riva Teak Sun Lounger", "Aero Reclining Lounger", "Isla Woven Chaise"],
    ["Luna Cantilever Umbrella", "Sole Market Umbrella", "Vista Balcony Parasol"],
    ["Aura Portable Lantern", "Ember Solar Path Lights", "Halo Outdoor Wall Light"],
    ["Forma Ceramic Planter", "Terra Tall Clay Planter", "Arc Fiberstone Bowl"],
];
const materials = [
    "Teak",
    "Powder-coated aluminum",
    "Synthetic rattan",
    "Teak",
    "Aluminum",
    "Wrought iron",
    "Cotton and hardwood",
    "Cotton rope",
    "Cotton and steel",
    "Teak",
    "Aluminum",
    "Synthetic rattan",
    "Aluminum and canopy fabric",
    "Hardwood and canopy fabric",
    "Aluminum and canopy fabric",
    "Aluminum and acrylic",
    "Aluminum and glass",
    "Aluminum and glass",
    "Glazed ceramic",
    "Terracotta",
    "Fiberstone",
];
const prices = [
    495, 285, 375, 2495, 695, 1195, 185, 220, 425, 895, 595, 745, 1095, 395, 245, 145, 95, 165, 125,
    195, 155,
];
const dimensions = [
    "78 × 82 × 76 cm",
    "62 × 64 × 80 cm",
    "71 × 75 × 78 cm",
    "220 × 100 × 75 cm table",
    "70 × 70 × 74 cm table",
    "180 × 90 × 75 cm table",
    "280 × 140 cm",
    "300 × 150 cm",
    "320 × 120 × 115 cm",
    "200 × 72 × 35 cm",
    "195 × 70 × 34 cm",
    "205 × 75 × 38 cm",
    "300 cm canopy",
    "270 cm canopy",
    "180 cm canopy",
    "18 × 18 × 32 cm",
    "12 × 12 × 48 cm",
    "16 × 14 × 28 cm",
    "35 × 35 × 40 cm",
    "42 × 42 × 65 cm",
    "58 × 58 × 26 cm",
];
const products = names.flatMap((list, c) =>
    list.map((name, j) => {
        let i = c * 3 + j;
        return {
            id: slug(name),
            name,
            category: cats[c],
            price: prices[i],
            material: materials[i],
            dimensions: dimensions[i],
            finish: ["Natural warm finish", "Matte bronze finish", "Soft sand finish"][j],
            description: [
                `A considered ${cats[c].toLowerCase().replace(/s$/, "")} with ${materials[i].toLowerCase()} construction for inviting outdoor spaces.`,
                `Easy proportions and refined details bring everyday comfort to your terrace.`,
                `An understated outdoor essential, designed to complement natural surroundings.`,
            ][j],
            image: `products/${slug(name)}.webp`,
        };
    }),
);
function productCard(p, page = "products", key = p.id) {
    return `<article class="product-card">${image(page, key, `${p.name}: ${p.material} ${p.category.toLowerCase()} on a neutral architectural terrace`)}<div class="product-body"><p class="eyebrow">${p.category}</p><h3>${p.name}</h3><p class="price">$${p.price.toLocaleString("en-US")}</p><p>${p.description}</p>${link("View Details", `product-details.html?id=${p.id}`, true)}</div></article>`;
}
function productGrid(list, page, key = "feature") {
    return `<div class="product-grid ${list.length === 4 ? "four-product-grid" : ""}">${list.map((p, i) => productCard(p, page, `${key}-${i + 1}`)).join("")}</div>`;
}
function hero(page, title, text, subject, full = false) {
    return `<section class="hero ${full ? "hero-full" : ""}"><div class="${full ? "" : "container "}hero-grid"><div class="hero-copy"><p class="eyebrow">Thoughtfully designed. Beautifully outdoors.</p><h1>${title}</h1><p>${text}</p><div class="actions">${link("Explore Collection")}${link("Visit Our Showroom", "contact.html#booking", true)}</div><div class="hero-note"><span>Natural materials</span><span>Lasting comfort</span><span>Considered design</span></div></div><div class="hero-image">${image(page, "hero", subject, true)}</div></div></section>`;
}
function pageHero(title, text) {
    return `<section class="page-hero"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span>${title}</span></nav><p class="eyebrow">Terravelle Outdoor Living</p><h1>${title}</h1><p>${text}</p></div></section>`;
}
function editorialCards(page, items, cls = "three-grid") {
    return `<div class="${cls}">${items.map(([title, subject, url], i) => `<a class="collection-card" href="${url || "products.html"}">${image(page, `collection-${i + 1}`, subject)}<div><h3>${title}</h3><span>Explore collection ${icon("arrow-up-right")}</span></div></a>`).join("")}</div>`;
}
function galleryStrip(page, count = 5) {
    const scenes = [
        "modern stone patio with teak lounge furniture",
        "garden dining terrace with long timber table",
        "poolside with ivory cushioned loungers",
        "rooftop lounge with city skyline",
        "cozy balcony with woven chairs",
    ];
    return `<div class="inspiration-grid">${scenes
        .slice(0, count)
        .map(
            (s, i) =>
                `<a href="inspiration-gallery.html">${image(page, `inspiration-${i + 1}`, s)}<span>${["The modern patio", "Dining in the garden", "Poolside pauses", "Above the city", "Small space, big comfort"][i]}</span></a>`,
        )
        .join("")}</div>`;
}
function testimonials() {
    return `<p class="demo-label">Illustrative customer stories · Sample testimonials</p><div class="three-grid">${[
        [
            "Maya R.",
            "Austin, Texas",
            "The dining set made our small terrace feel like a room we actually wanted to spend time in.",
        ],
        [
            "Daniel & Emma",
            "Residential project",
            "We loved being able to compare the textures and finishes before choosing our lounge pieces.",
        ],
        [
            "Jordan L.",
            "Boutique hospitality",
            "The collection helped us bring a calm, welcoming feeling to our outdoor guest space.",
        ],
    ]
        .map(
            ([n, l, q]) =>
                `<figure class="quote"><span aria-hidden="true">“</span><blockquote>${q}</blockquote><figcaption><strong>${n}</strong><small>${l}</small></figcaption></figure>`,
        )
        .join("")}</div>`;
}
function newsletter() {
    return `<form class="demo-form newsletter" data-form="newsletter"><label for="newsletter-email">Email address</label><div class="input-action"><input id="newsletter-email" name="email" type="email" placeholder="you@example.com" required><button class="button" type="submit">Keep me inspired ${icon("arrow-right")}</button></div><p class="form-status" role="status"></p><small>Demo signup. Your details stay here until an endpoint is configured.</small></form>`;
}
function field(label, type = "text", required = true, options = null) {
    const id = slug(label);
    return `<div class="field"><label for="${id}">${label}${required ? ' <span aria-hidden="true">*</span>' : ""}</label>${options ? `<select id="${id}" name="${id}" ${required ? "required" : ""}><option value="">Choose an option</option>${options.map((o) => `<option>${o}</option>`).join("")}</select>` : type === "textarea" ? `<textarea id="${id}" name="${id}" rows="4" ${required ? "required" : ""}></textarea>` : `<input id="${id}" name="${id}" type="${type}" ${required ? "required" : ""} ${type === "number" ? 'min="1" max="10000"' : ""} ${type === "tel" ? 'pattern="[+0-9() .-]{7,25}" title="Use 7–25 phone characters: digits, spaces, +, parentheses, periods, or hyphens."' : ""}>`}</div>`;
}
function form(kind, fields, title) {
    return `<form class="demo-form form-panel" data-form="${kind}"><div class="form-heading"><h3>${title}</h3><p>Integration-ready demo. This form does not send an enquiry or reserve an appointment.</p></div><div class="form-grid">${fields.join("")}</div><button class="button" type="submit">${kind === "booking" ? "Review visit request" : "Submit enquiry"} ${icon("arrow-right")}</button><p class="form-status" role="status"></p></form>`;
}
const pages = {};
pages.index =
    hero(
        "home-1",
        "Beautiful Living,<br>Beyond Your Walls",
        "Considered furniture for open-air moments. Create a space to gather, unwind, and make every day feel a little more beautiful.",
        "Elegant teak patio sofa with ivory cushions on a travertine terrace",
    ) +
    section(
        "Explore Outdoor Essentials",
        `<div class="category-grid">${cats.map((c, i) => `<a href="products.html?category=${encodeURIComponent(c)}">${image("home-1", `category-${i + 1}`, `Premium ${c.toLowerCase()} in a tasteful outdoor setting`)}<h3>${c} ${icon("arrow-up-right")}</h3></a>`).join("")}</div>`,
        "",
        "Your outdoors, thoughtfully furnished",
    ) +
    split(
        "home-1",
        "story",
        "Made for the moments that matter",
        "Terravelle brings natural materials and quiet contemporary design together. Our demo collection is built around the simple pleasure of being outdoors.",
        "Warm outdoor furniture showroom displaying teak lounge sets",
    ) +
    section(
        "A collection to come home to",
        productGrid(products.slice(0, 6), "home-1"),
        "soft",
        "Selected favorites",
        "Six considered pieces, each with a place in your everyday outdoors.",
    ) +
    split(
        "home-1",
        "seasonal",
        "Make Every Season an Outdoor Season",
        "Layer texture, add warm light, and let your outdoor space grow with the seasons.",
        "Autumn terrace with outdoor sofa textured cushions and glowing lanterns",
        false,
        "products.html?category=Outdoor%20Lighting",
        "Shop Seasonal Collection",
    ) +
    section("Why Choose Terravelle", blocks(benefits), "soft", "Details that make a difference") +
    section(
        "Honest materials. Enduring character.",
        `<div class="material-grid">${["Teak", "Aluminum", "Rattan", "Wrought Iron"].map((m, i) => `<article>${image("home-1", `material-${i + 1}`, `Detailed ${m.toLowerCase()} outdoor furniture craftsmanship`)}<span>0${i + 1}</span><h3>${m}</h3><p>${["Warm grain that develops a beautiful silver patina.", "Lightweight structure with a refined protective finish.", "A tactile weave for a relaxed, inviting atmosphere.", "Classic strength with expressive, crafted details."][i]}</p><a class="text-link" href="materials-guide.html#${slug(m)}">Meet the material ${icon("arrow-right")}</a></article>`).join("")}</div>`,
        "",
        "The foundations of comfort",
    ) +
    section(
        "A little inspiration goes a long way",
        galleryStrip("home-1") +
            `<div class="section-actions">${link("View Inspiration Gallery", "inspiration-gallery.html", true)}</div>`,
        "soft",
        "Spaces with a point of view",
    ) +
    section("Life, beautifully outside", testimonials(), "", "From our sample community") +
    cta();
pages["index-2"] =
    hero(
        "home-2",
        "Create Your Perfect<br>Outdoor Escape",
        "From intimate balconies to open terraces, discover a calmer way to live outside.",
        "Wide luxury terrace with cream outdoor sectional pool and Mediterranean architecture",
        true,
    ) +
    section(
        "Good design makes room for life.",
        `<div class="intro"><p>We believe an outdoor space should feel as considered as the rooms inside. Warm materials, quiet lines, and comfort you can settle into — this is the Terravelle approach.</p><span class="divider"></span></div>`,
        "centered",
        "Welcome to Terravelle",
    ) +
    section(
        "Three ways to find your outdoors",
        editorialCards("home-2", [
            [
                "Relaxed Garden Living",
                "Lush garden lounge with woven chairs and soft cushions",
                "products.html?category=Garden%20Chairs",
            ],
            [
                "Outdoor Dining Moments",
                "Elegant outdoor dining table set beneath a pergola",
                "products.html?category=Dining%20Sets",
            ],
            [
                "Poolside Comfort",
                "Resort pool with modern sun loungers",
                "products.html?category=Sun%20Loungers",
            ],
        ]),
        "",
        "Curated collections",
    ) +
    section(
        "Favorites for everyday escapes",
        productGrid([products[2], products[4], products[9], products[15]], "home-2"),
        "soft",
        "Bestselling demo collection",
    ) +
    split(
        "home-2",
        "showcase",
        "One terrace. Endless possibilities.",
        "A comfortable seating area, a place to share a meal, and just enough green. Thoughtful zoning turns a terrace into your favorite room.",
        "Styled contemporary patio with lounge and dining zones",
        false,
        "inspiration-gallery.html",
        "Explore outdoor spaces",
    ) +
    split(
        "home-2",
        "craft",
        "Beauty begins with the details.",
        "From the feel of teak grain to the precision of a woven seat, our material choices balance character with practical outdoor care.",
        "Close-up furniture artisan sanding a teak outdoor chair",
        true,
        "materials-guide.html",
        "Explore materials",
    ) +
    section("Your space, in four thoughtful steps", steps(), "", "A personal approach") +
    section(
        "Fresh ideas for slower days",
        galleryStrip("home-2", 4),
        "soft",
        "Seasonal inspiration",
    ) +
    split(
        "home-2",
        "customer",
        "A balcony becomes a favorite room.",
        "“A compact table, two comfortable chairs, and warm lighting changed the way we used our home.” — Avery & Sam, sample customer story.",
        "Cozy apartment balcony with bistro furniture and evening lighting",
        false,
        "inspiration-gallery.html",
        "Find your inspiration",
    ) +
    section(
        "Stay inspired. Come say hello.",
        `<div class="split"><div><p>Fresh spaces, material stories, and ideas for your next outdoor chapter.</p>${newsletter()}</div><div class="newsletter-visit"><h3>Feel the difference in person.</h3><p>Explore our demo showroom experience and plan a visit.</p>${link("Visit Our Showroom", "contact.html#booking")}</div></div>`,
        "closing",
        "Your next outdoor chapter",
    );
pages.about =
    hero(
        "about",
        "A thoughtful approach<br>to outdoor living.",
        "We bring together natural character, lasting comfort, and a quieter kind of luxury.",
        "Premium outdoor furniture showroom with warm timber and neutral furnishings",
    ) +
    split(
        "about",
        "story",
        "Our story starts outside.",
        "Terravelle is a fictional showroom brand created to showcase a considered outdoor furniture collection. Its story begins with a simple idea: make everyday outdoor spaces more welcoming.",
        "Sunlit courtyard with handcrafted teak furniture",
    ) +
    section(
        "What we believe in",
        blocks([
            ["leaf", "Natural character", "Materials with texture, warmth, and a story to tell."],
            ["ruler", "Considered design", "Useful proportions and details that serve daily life."],
            ["heart", "Everyday comfort", "Places to linger, connect, and recharge."],
            ["handshake", "Helpful guidance", "Clear choices and honest advice at every step."],
        ]),
        "soft",
        "Mission & values",
    ) +
    split(
        "about",
        "craft",
        "Crafted with care. Chosen with purpose.",
        "Outdoor furniture asks a little more of its materials. We consider construction, finish, maintenance, and how every piece feels in use.",
        "Furniture maker weaving synthetic rattan outdoor chair",
        true,
        "materials-guide.html",
        "Our materials philosophy",
    ) +
    section(
        "Meet the people behind the perspective",
        `<p class="demo-label">Fictional team profiles for template demonstration.</p><div class="three-grid">${[
            [
                "Elena Brooks",
                "Creative Director",
                "professional female interior designer portrait in warm showroom",
            ],
            [
                "Marcus Reed",
                "Materials Specialist",
                "professional male furniture materials specialist portrait",
            ],
            [
                "Nina Patel",
                "Showroom Consultant",
                "professional female showroom consultant portrait",
            ],
        ]
            .map(
                ([n, r, s], i) =>
                    `<article class="team-card">${image("about", `team-${i + 1}`, s)}<h3>${n}</h3><p>${r}</p></article>`,
            )
            .join("")}</div>`,
        "",
        "A shared eye for beautiful living",
    ) +
    cta();
pages.products =
    pageHero(
        "Find your outdoor essentials.",
        "Explore 21 demonstration products across seven collections. Prices are illustrative, in USD.",
    ) +
    section(
        "Choose your collection",
        `<div class="filters" id="category-filters" aria-label="Product categories"><button class="filter active" data-category="All" aria-pressed="true">All products</button>${cats.map((c) => `<button class="filter" data-category="${c}" aria-pressed="false">${c}</button>`).join("")}</div>`,
        "filter-section",
        "Explore by category",
    ) +
    section(
        "The Terravelle collection",
        `<div class="catalog-tools"><div><label for="product-search">Search products</label><input id="product-search" type="search" placeholder="Find your favorite piece…"></div><div><label for="product-sort">Sort by</label><select id="product-sort"><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A–Z</option></select></div></div><p id="result-count" role="status">21 products</p><div id="product-catalog" class="product-grid">${products.map((p) => productCard(p)).join("")}</div><p id="empty-products" hidden>No pieces found. Try another search or category.</p>`,
        "",
        "Designed for real outdoor moments",
    ) +
    split(
        "products",
        "editorial",
        "A table. A gathering. A good evening.",
        "Bring everyone together with outdoor dining that balances a generous surface with comfortable seating and a warm, natural finish.",
        "Large luxury garden dining table with teak chairs evening meal setting",
        true,
        "products.html?category=Dining%20Sets",
        "Explore Dining Sets",
    ) +
    section(
        "Choose well. Enjoy longer.",
        blocks([
            [
                "ruler",
                "Measure your space",
                "Leave room to move around tables and reclining chairs.",
            ],
            [
                "sun",
                "Consider exposure",
                "Match materials and covers to sun, rain, and coastal conditions.",
            ],
            [
                "armchair",
                "Try the comfort",
                "Seat depth, height, and cushions should suit your daily use.",
            ],
            [
                "sparkles",
                "Plan for care",
                "A little routine maintenance helps finishes look their best.",
            ],
        ]),
        "soft",
        "Furniture buying guide",
    ) +
    cta(
        "Let’s find the right piece.",
        "Have a question about size, material, or a collection? Our demo enquiry flow is ready for your own showroom integration.",
    );
// Detail images have separate overview, alternate, and related placements for every item.
for (const p of products) {
    inventory.push({
        file: `products/details/${p.id}-main.webp`,
        page: "product-details",
        section: "overview",
        subject: `${p.name} made of ${p.material}, full product photographed on neutral terrace`,
        ratio: "4:3",
    });
    inventory.push({
        file: `products/details/${p.id}-detail.webp`,
        page: "product-details",
        section: "gallery-detail",
        subject: `Close-up construction detail of ${p.name} ${p.material}`,
        ratio: "4:3",
    });
}
pages["product-details"] =
    `<section class="section"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="products.html">Products</a><span>/</span><span id="detail-crumb">Product</span></nav><div id="product-overview" class="split"></div></div></section>` +
    section(
        "Features & specifications",
        '<dl id="specifications" class="specifications"></dl>',
        "soft",
        "Made for your space",
    ) +
    section(
        "Comfort in every detail",
        blocks(
            [
                [
                    "armchair",
                    "Easy to live with",
                    "A considered shape that brings a comfortable rhythm to your space.",
                ],
                [
                    "shield-check",
                    "Practical construction",
                    "Material-specific care supports everyday outdoor use.",
                ],
                [
                    "ruler",
                    "Balanced proportions",
                    "Check the listed measurements to find the right fit.",
                ],
            ],
            "three-grid",
        ),
        "",
        "Product highlights",
    ) +
    section(
        "A little care goes a long way",
        '<div id="product-care" class="care-panel"></div>',
        "soft",
        "Materials & care",
    ) +
    section(
        "Beautiful together",
        '<div id="related-products" class="product-grid"></div>',
        "",
        "Related pieces",
    ) +
    cta(
        "Make this piece part of your outdoors.",
        "Ask about the selected product, compare finishes, or plan a showroom visit.",
    );
// One distinct related photograph per product, separate from catalog photography.
for (const p of products)
    inventory.push({
        file: `products/related/${p.id}.webp`,
        page: "product-details",
        section: "related",
        subject: `${p.name} styled outdoors from a three-quarter angle`,
        ratio: "4:3",
    });
pages["materials-guide"] =
    hero(
        "materials",
        "Good materials.<br>Beautiful possibilities.",
        "Know the textures, finishes, and care that make outdoor furniture feel right for your home.",
        "Detailed teak aluminum and woven outdoor furniture material samples",
    ) +
    `<section class="section" id="teak"><div class="container split"><div class="editorial-image">${image("materials", "teak", "Close-up solid teak outdoor dining table with natural wood grain")}</div><div class="editorial-copy">${heading("Teak: warmth that ages gracefully.", "01 / Solid wood")}<p>Dense natural grain and warm tones give teak its enduring appeal. Untreated teak gradually develops a silver patina outdoors.</p><ul class="check-list"><li>Clean gently with mild soap and a soft brush.</li><li>Let the wood dry fully before covering.</li><li>Use a suitable teak protector to retain a warmer tone.</li></ul></div></div></section>` +
    section(
        "Aluminum: light, clean, versatile.",
        `<div class="material-feature" id="aluminum"><div>${image("materials", "aluminum", "Modern powder coated aluminum outdoor chairs bronze finish")}</div><div><p>Lightweight construction makes aluminum easy to rearrange. Powder-coated finishes add color and protect the surface.</p><h3>Easy everyday care</h3><p>Clean lines work well on contemporary terraces and compact balconies. Pair the frame with comfortable cushions and coordinated finishes for a setting that feels relaxed, practical, and easy to refresh.</p><p>Wash with a soft cloth and mild soap. Avoid abrasive cleaners; touch up scratches with the manufacturer’s recommended finish.</p></div></div>`,
        "soft",
        "02 / Modern metal",
    ) +
    `<section class="section" id="rattan"><div class="container"><div class="split"><div class="editorial-copy">${heading("Rattan: texture with a relaxed spirit.", "03 / Beautifully woven")}<p>Natural rattan is best kept in protected areas. Synthetic outdoor weave offers a similar tactile look with greater resistance to the weather.</p><h3>Look after the weave</h3><p>Brush away dust, wash synthetic weave gently, and keep natural rattan away from prolonged moisture.</p></div><div class="editorial-image">${image("materials", "rattan", "Close up synthetic rattan weave on outdoor garden chair")}</div></div></div></section>` +
    section(
        "Wrought iron: strength with character.",
        `<div id="wrought-iron" class="iron-layout">${image("materials", "iron", "Classic wrought iron garden dining furniture detailed protective black finish")}<div><h3>Classic lines, reassuring weight.</h3><p>Decorative curves bring a timeless feel to courtyards and sheltered gardens. Pair the dark metal with soft seat cushions, natural stone, and generous planting to create a welcoming place to gather.</p><p>Wrought iron suits expressive garden settings and stays steady in breezy spaces. A sound protective finish is essential.</p><p>Check for chips, remove small rust spots promptly, and apply appropriate primer and touch-up paint. Store dry or use breathable covers.</p></div></div>`,
        "soft",
        "04 / Crafted metal",
    ) +
    section(
        "Find the material that fits your life.",
        `<div class="table-wrap" tabindex="0" role="region" aria-label="Material comparison"><table><caption>General outdoor material guidance; follow individual manufacturer care instructions.</caption><thead><tr><th>Material</th><th>Character</th><th>Weight</th><th>Care</th><th>Best suited to</th></tr></thead><tbody>${[
            [
                "Teak",
                "Warm, natural grain",
                "Medium",
                "Gentle cleaning; optional protector",
                "Dining and lounge spaces",
            ],
            [
                "Aluminum",
                "Clean, contemporary",
                "Light",
                "Wash and protect finish",
                "Flexible outdoor arrangements",
            ],
            [
                "Synthetic rattan",
                "Relaxed, tactile weave",
                "Light–medium",
                "Soft brushing and mild soap",
                "Comfortable garden seating",
            ],
            [
                "Wrought iron",
                "Classic, decorative",
                "Heavy",
                "Maintain protective coating",
                "Traditional, sheltered gardens",
            ],
        ]
            .map(
                (r) =>
                    `<tr>${r.map((v, i) => `<${i ? "td" : "th"}>${v}</${i ? "td" : "th"}>`).join("")}</tr>`,
            )
            .join(
                "",
            )}</tbody></table></div><div class="section-actions">${link("Talk materials with us", "contact.html#booking")}</div>`,
        "",
        "Compare your options",
    );
const galleryCats = ["Patio", "Garden", "Poolside", "Balcony", "Rooftop"];
const gallery = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    category: galleryCats[i % 5],
    title: [
        "Quiet stone textures",
        "A place to gather",
        "Afternoons by the water",
        "A compact retreat",
        "Above the everyday",
        "Warm timber evenings",
        "Garden table moments",
        "Poolside simplicity",
        "A corner of calm",
        "Skyline conversations",
        "An open-air living room",
        "Among the flowering borders",
        "Sunlit recliners",
        "Small-space dining",
        "The city at dusk",
        "Under the pergola",
        "Room for slow mornings",
        "Cool water, warm materials",
    ][i],
    image: `gallery/space-${i + 1}.webp`,
}));
pages["inspiration-gallery"] =
    pageHero(
        "Spaces to inspire your own.",
        "Explore 18 original outdoor settings, from small balconies to generous garden terraces.",
    ) +
    section(
        "Find your kind of outdoors",
        `<div class="filters" aria-label="Inspiration categories"><button class="filter active" data-gallery-category="All" aria-pressed="true">All spaces</button>${galleryCats.map((c) => `<button class="filter" data-gallery-category="${c}" aria-pressed="false">${c}</button>`).join("")}</div>`,
        "filter-section",
        "Browse by space",
    ) +
    section(
        "The inspiration edit",
        `<p id="gallery-count" role="status">18 spaces</p><div class="gallery-grid">${gallery.map((g) => `<button class="gallery-card" data-gallery-id="${g.id}" data-category="${g.category}" aria-label="Open ${g.title}">${image("gallery", `space-${g.id + 1}`, `${g.category} outdoor space: ${g.title}, styled premium furniture in warm architectural setting`)}<span><strong>${g.title}</strong><small>${g.category} ${icon("expand")}</small></span></button>`).join("")}</div>`,
        "",
        "A fresh perspective",
    ) +
    split(
        "gallery",
        "featured",
        "A terrace made for togetherness.",
        "A generous dining table anchors this stone terrace. Low lounge seating creates a second zone, while planters bring softness without overwhelming the architecture.",
        "Expansive limestone terrace with teak dining furniture lounge zone and ornamental plants",
        true,
        "contact.html#booking",
        "Plan your own space",
    ) +
    section(
        "Four details that transform a space",
        blocks([
            ["ruler", "Leave room to move", "Keep clear routes around furniture and doorways."],
            [
                "layers",
                "Layer natural textures",
                "Combine wood, woven surfaces, and soft outdoor textiles.",
            ],
            ["lamp", "Bring in warm light", "Use a mix of table lanterns and practical lighting."],
            [
                "flower-2",
                "Add a little green",
                "Frame seating with planters suited to your light and climate.",
            ],
        ]),
        "",
        "Outdoor styling tips",
    ) +
    cta(
        "Let’s bring your vision outdoors.",
        "Bring measurements, photographs, and ideas to a showroom consultation.",
    );
const bulkFields = [
    field("Full name"),
    field("Company name"),
    field("Email", "email"),
    field("Phone", "tel"),
    field("Business type", "text", true, [
        "Hotel",
        "Resort",
        "Restaurant",
        "Café",
        "Property developer",
        "Other",
    ]),
    field("Product category", "text", true, cats),
    field("Estimated quantity", "number"),
    field("Project timeline", "text", true, [
        "Within 1 month",
        "1–3 months",
        "3–6 months",
        "More than 6 months",
    ]),
    field("Message", "textarea"),
];
pages["bulk-orders"] =
    hero(
        "bulk-orders",
        "Beautiful outdoors.<br>At a larger scale.",
        "Considered furniture for hospitality, dining, and residential projects. Explore a tailored commercial enquiry.",
        "Luxury boutique hotel outdoor terrace with many tasteful lounge seating groups",
    ) +
    section(
        "Spaces we help you imagine",
        blocks(
            [
                [
                    "hotel",
                    "Hotels & resorts",
                    "Comfortable lounge areas that invite guests to linger.",
                ],
                [
                    "utensils",
                    "Restaurants & cafés",
                    "Flexible dining furniture for memorable outdoor moments.",
                ],
                [
                    "building-2",
                    "Property developers",
                    "Welcoming shared spaces with a coherent design language.",
                ],
            ],
            "three-grid",
        ),
        "",
        "Who we serve",
    ) +
    section(
        "Collections for considered projects",
        editorialCards("bulk-orders", [
            [
                "Hospitality lounges",
                "Resort courtyard with commercial outdoor sofas and lounge chairs",
                "products.html?category=Garden%20Chairs",
            ],
            [
                "Open-air dining",
                "Restaurant outdoor terrace with coordinated dining tables and chairs",
                "products.html?category=Dining%20Sets",
            ],
            [
                "Poolside retreats",
                "Hotel pool deck with premium commercial recliners and umbrellas",
                "products.html?category=Sun%20Loungers",
            ],
        ]),
        "soft",
        "Commercial furniture collections",
    ) +
    section("From first conversation to a clear plan", steps(), "", "Our bulk ordering process") +
    section(
        "A thoughtful project partnership",
        blocks(
            [
                [
                    "swatch-book",
                    "Material choices",
                    "Compare finishes and material suitability for your location.",
                ],
                [
                    "pencil-ruler",
                    "Customization enquiries",
                    "Discuss your requirements; availability depends on the supplier.",
                ],
                [
                    "messages-square",
                    "Project support",
                    "Share quantities, dimensions, timing, and priorities for a useful conversation.",
                ],
            ],
            "three-grid",
        ),
        "soft",
        "Why partner with us",
    ) +
    section(
        "Tell us about your project",
        form("bulk", bulkFields, "Commercial enquiry"),
        "",
        "Bulk order enquiry",
    );
pages.contact =
    pageHero(
        "Let’s talk outdoor living.",
        "Ask a question, explore a collection, or prepare a showroom visit request.",
    ) +
    section(
        "A conversation starts here.",
        `<p class="demo-label">All contact details below are fictional template data. Replace before publishing.</p><div class="four-grid contact-cards"><article>${icon("phone")}<h3>Call the showroom</h3><a href="tel:+12025550148">+1 (202) 555-0148</a><p>Demo telephone number</p></article><article>${icon("mail")}<h3>Write to us</h3><a href="mailto:hello@terravelle.example">hello@terravelle.example</a><p>Demo email address</p></article><article>${icon("map-pin")}<h3>Find your way</h3><p>24 Terrace Lane<br>Demo City, USA</p></article><article>${icon("clock")}<h3>Showroom hours</h3><p>Mon–Sat: 10am–6pm<br>Sunday: by appointment</p></article></div>`,
        "",
        "Contact information",
    ) +
    section(
        "How can we help?",
        form(
            "contact",
            [
                field("Name"),
                field("Email", "email"),
                field("Phone", "tel", false),
                field("Subject"),
                field("Message", "textarea"),
            ],
            "Send a showroom enquiry",
        ),
        "soft",
        "Contact form",
    ) +
    `<section class="section" id="booking"><div class="container">${heading("Come and find your comfortable place.", "Showroom visit booking", "Request a preferred time. This demonstration does not check availability or confirm an appointment.")}${form("booking", [field("Full name"), field("Booking email", "email"), field("Booking phone", "tel"), field("Preferred date", "date"), field("Preferred time", "text", true, ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"]), field("Number of visitors", "number"), field("Purpose of visit", "text", true, ["Explore collections", "Material consultation", "Commercial project", "Product enquiry"]), field("Additional message", "textarea", false)], "Prepare your visit request")}</div></section>` +
    section(
        "Your next visit starts here.",
        `<div class="map-placeholder">${icon("map-pin")}<h3>Showroom map — ready to connect</h3><p>Configure your real showroom location and map embed in assets/js/main.js. No fictional location is plotted.</p><div id="showroom-map"></div></div>`,
        "soft",
        "Showroom location",
    ) +
    section(
        "A few helpful answers",
        `<div class="faqs">${[
            [
                "Can I see the furniture before ordering?",
                "Use the visit request form to discuss a preferred showroom time once a booking service is connected.",
            ],
            [
                "Can you help with a small balcony?",
                "Bring your measurements and a photograph. A compact dining set or a pair of lounge chairs can make a thoughtful starting point.",
            ],
            [
                "Do you offer commercial enquiries?",
                "Yes. Use the bulk order form to share quantities, project details, and timing. This template requires an enquiry endpoint.",
            ],
            [
                "How do I care for outdoor furniture?",
                "Explore our materials guide, and always follow the care instructions supplied with your actual furniture.",
            ],
        ]
            .map(([q, a]) => `<details><summary>${q}${icon("plus")}</summary><p>${a}</p></details>`)
            .join(
                "",
            )}</div><div class="section-actions">${link("Explore the collection", "products.html", true)}</div>`,
        "",
        "FAQs & helpful guidance",
    );
pages["404"] =
    `<section class="special-page"><div class="container"><p class="eyebrow">A little off the garden path</p><span class="error-number">404</span><h1>This space hasn’t been furnished yet.</h1><p>The page you’re looking for may have moved. Let’s find your way back.</p><div class="actions">${link("Back to Home", "index.html")}${link("Explore Products", "products.html", true)}</div></div></section>`;
pages["coming-soon"] =
    `<section class="special-page coming"><div class="container"><p class="eyebrow">Something considered is on its way</p><h1>A new chapter<br>in outdoor living.</h1><p>Our next collection is taking shape. Leave your email to try the demo newsletter signup.</p>${newsletter()}<div class="actions">${link("Back to Home", "index.html", true)}</div><p class="demo-label">Social profiles are not connected. Configure your brand links before publishing.</p></div></section>`;
const nav = [
    ["About Us", "about"],
    ["Products", "products"],
    ["Materials Guide", "materials-guide"],
    ["Inspiration Gallery", "inspiration-gallery"],
    ["Bulk Orders", "bulk-orders"],
    ["Contact", "contact"],
];
function header(key) {
    return `<a class="skip-link" href="#main">Skip to content</a><div class="announcement">Considered comfort. Naturally outdoors. <span>Discover the Terravelle collection</span></div><header class="site-header"><div class="header-inner"><a class="brand" href="index.html" aria-label="Terravelle Outdoor Living home"><img src="../assets/icons/logo.svg" width="192" height="48" alt="Terravelle Outdoor Living"></a><button class="menu-toggle icon-button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav">${icon("menu")}</button><nav id="primary-nav" class="primary-nav" aria-label="Main navigation"><div class="home-dropdown"><button class="home-trigger ${key.startsWith("index") ? "current" : ""}" aria-expanded="false" aria-controls="home-menu">Home ${icon("chevron-down")}</button><div id="home-menu" class="dropdown-menu-custom" hidden><a href="index.html" ${key === "index" ? 'aria-current="page"' : ""}>Home Page 1</a><a href="index-2.html" ${key === "index-2" ? 'aria-current="page"' : ""}>Home Page 2</a></div></div>${nav.map(([l, k]) => `<a href="${k}.html" ${key === k ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav><div class="header-actions"><button class="theme-toggle icon-button" aria-label="Switch to dark mode">${icon("moon")}</button><button type="button" class="direction-toggle icon-button" aria-label="Switch to right-to-left layout" aria-pressed="false"><span aria-hidden="true">RTL</span></button><a class="button header-cta" href="contact.html#booking">Visit Our Showroom ${icon("arrow-up-right")}</a></div></div></header>`;
}
function footer() { return require("./footer.cjs")(); }
fs.writeFileSync(
    "assets/js/data.js",
    `window.TERRAVELLE_PRODUCTS = ${JSON.stringify(products, null, 2)};\nwindow.TERRAVELLE_GALLERY = ${JSON.stringify(gallery, null, 2)};\n`,
);
fs.writeFileSync("documentation/image-inventory.json", JSON.stringify(inventory, null, 2));
fs.writeFileSync(
    "documentation/image-inventory.md",
    "# Image inventory\n\nEvery image placement uses a distinct photograph. Detail gallery and related-product assets are separate from catalog assets.\n\n| File | Page | Section | Subject | Ratio |\n|---|---|---|---|---|\n" +
        inventory
            .map((i) => `| ${i.file} | ${i.page} | ${i.section} | ${i.subject} | ${i.ratio} |`)
            .join("\n"),
);
fs.writeFileSync(
    "index.html",
    '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=pages/index.html"><title>Terravelle Outdoor Living</title></head><body><p><a href="pages/index.html">Explore Terravelle Outdoor Living</a></p></body></html>',
);
console.log(`Built ${Object.keys(pages).length} pages; ${inventory.length} distinct image assets.`);
