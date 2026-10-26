const fs = require("fs");
const file = "scripts/footer.cjs";
let source = fs.readFileSync(file, "utf8");
source = source.replace(
    '<div class="container footer-shell"><div class="footer-grid">',
    '<div class="container footer-shell">',
);
source = source.replace('<span class="footer-kicker">Naturally outdoors</span>', "");
source = source.replace(
    '<p>Considered furniture.<br>Comfort that feels like home.</p><div class="footer-brand-rule"></div><p class="footer-brand-caption">Natural materials. Timeless shapes.<br>Made for moments outside.</p>',
    "<p>Thoughtfully crafted outdoor furniture.<br>Natural materials. Lasting comfort.</p>",
);
source = source.replace(
    '<div class="footer-links"><h3><span>01</span> Explore Terravelle</h3>',
    '<div class="footer-grid"><div class="footer-links"><h3>Explore</h3>',
);
source = source.replace("<h3><span>02</span> The collection</h3>", "<h3>Collections</h3>");
source = source.replace(
    '<div class="footer-contact"><div><span class="footer-kicker">Personal guidance</span>',
    '<div class="footer-contact"><h3>Contact &amp; visits</h3><div><span class="footer-kicker">We’re here to help</span>',
);
fs.writeFileSync(file, source);
