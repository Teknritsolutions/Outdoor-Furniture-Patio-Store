module.exports = function footer() {
    const icon = (name) =>
        `<svg class="icon" aria-hidden="true"><use href="../assets/icons/lucide.svg#${name}"></use></svg>`;
    const links = (items) =>
        items.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
    const quick = [
        ["Home Page 1", "index.html"],
        ["Home Page 2", "index-2.html"],
        ["About Us", "about.html"],
        ["Products", "products.html"],
        ["Materials Guide", "materials-guide.html"],
        ["Inspiration Gallery", "inspiration-gallery.html"],
        ["Bulk Orders", "bulk-orders.html"],
        ["Contact", "contact.html"],
    ];
    const categories = [
        "Garden Chairs",
        "Dining Sets",
        "Hammocks",
        "Sun Loungers",
        "Umbrellas",
        "Outdoor Lighting",
        "Planters",
    ];
    return `<footer class="site-footer premium-footer"><div class="container footer-grid">
    <div class="footer-brand"><a class="brand" href="index.html"><img src="../assets/icons/logo.svg" width="240" height="60" alt="Terravelle Outdoor Living"></a><p>Thoughtfully crafted outdoor furniture, natural materials and lasting comfort for everyday moments outside.</p><div class="social-links">${["Instagram", "Facebook", "LinkedIn"].map((name) => `<button type="button" class="social-demo icon-button" aria-label="${name} profile — not configured">${icon(name.toLowerCase())}</button>`).join("")}</div><p id="social-status" role="status"></p></div>
    <div class="footer-links"><h3>Quick Links</h3>${links(quick)}</div>
    <div class="footer-links"><h3>Collections</h3>${links(categories.map((name) => [name, `products.html?category=${encodeURIComponent(name)}`]))}</div>
    <div class="footer-contact"><h3>Visit Us</h3><p>24 Terrace Lane, Demo City, USA</p><a href="tel:+12025550148">+1&nbsp;(202)&nbsp;555&#8209;0148</a><a href="mailto:hello@terravelle.example">hello@terravelle.example</a><p>Mon–Sat: 10am–6pm</p><a class="footer-visit" href="contact.html#booking">Plan a showroom visit ${icon("arrow-up-right")}</a></div>
    </div><div class="footer-bottom-wrap"><div class="container footer-bottom"><p>Copyright ${new Date().getFullYear()} Terravelle Outdoor Living. All rights reserved.</p><button type="button" class="back-top">Back to top ${icon("arrow-up")}</button></div></div></footer>`;
};
