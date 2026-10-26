const fs = require("fs");
const inputs = [
    "bootstrap.min.css",
    "style.css",
    "responsive.css",
    "dark-mode.css",
    "rtl.css",
    "hero.css",
    "footer.css",
    "home-polish.css",
    "typography.css",
    "home-two.css",
    "about-polish.css",
    "buying-guide.css",
    "form-controls.css",
    "product-polish.css",
    "materials-polish.css",
    "gallery-polish.css",
    "bulk-polish.css",
    "contact-polish.css",
];
fs.writeFileSync(
    "assets/css/site.css",
    inputs
        .map((file) => `/* Source: ${file} */\n${fs.readFileSync("assets/css/" + file, "utf8")}`)
        .join("\n\n"),
);
for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
    let html = fs.readFileSync("pages/" + file, "utf8");
    const first = '<link rel="stylesheet" href="../assets/css/bootstrap.min.css"';
    html = html.replace(
        /<link\s+rel="stylesheet"\s+href="\.\.\/assets\/css\/bootstrap.min.css"\s*\/?>/,
        '<link rel="stylesheet" href="../assets/css/site.css">',
    );
    html = html.replace(
        /\s*<link\s+rel="stylesheet"\s+href="\.\.\/assets\/css\/(?:style|responsive|dark-mode|rtl).css"\s*\/?>/g,
        "",
    );
    html = html.replace(
        /<script src="\.\.\/assets\/js\/(data|main|products|gallery|forms).js"/g,
        '<script defer src="../assets/js/$1.js"',
    );
    fs.writeFileSync("pages/" + file, html);
}
console.log("Stylesheet bundle and deferred feature scripts prepared.");
