const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const inventory = JSON.parse(fs.readFileSync("documentation/image-inventory.json"));
for (const image of inventory) {
    const file = path.join("assets/images", image.file);
    if (!fs.existsSync(file)) continue;
    const small = file.replace(/\.webp$/, "-600.webp");
    execFileSync("magick", [file, "-resize", "600x>", "-quality", "78", small]);
    if (image.file === "home-1/hero.webp")
        execFileSync("magick", [
            file,
            "-resize",
            "450x>",
            "-quality",
            "78",
            file.replace(/\.webp$/, "-450.webp"),
        ]);
}
// Responsive sources for static markup; detail and lightbox use the large source.
for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
    let html = fs.readFileSync(`pages/${file}`, "utf8");
    html = html.replace(
        /(<img\s+[^>]*?src="(\.\.\/assets\/images\/[^"\s]+\.webp)")(?![^>]*srcset)/g,
        (match, prefix, source) =>
            `${prefix}\n srcset="${source.replace(/\.webp$/, "-600.webp")} 600w, ${source} 1200w"\n sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 50vw, 50vw"`,
    );
    if (file === "index-2.html") html = html.replace(/sizes="[^"]*"/, 'sizes="100vw"');
    if (file === "index.html" && !html.includes("hero-450.webp"))
        html = html.replace(
            /\.\.\/assets\/images\/home-1\/hero-600\.webp\s+600w/,
            "../assets/images/home-1/hero-450.webp 450w, ../assets/images/home-1/hero-600.webp 600w",
        );
    fs.writeFileSync(`pages/${file}`, html);
}
console.log("Responsive WebP variants and markup prepared.");
