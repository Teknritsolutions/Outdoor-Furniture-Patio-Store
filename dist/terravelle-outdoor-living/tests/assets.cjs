const fs = require("fs");
const path = require("path");
const { HtmlValidate } = require("html-validate");
const failures = [];
const sprite = fs.readFileSync("assets/icons/lucide.svg", "utf8");
for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
    const html = fs.readFileSync("pages/" + file, "utf8");
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const value = match[1];
        if (/^(https?:|mailto:|tel:|data:)/.test(value)) continue;
        const [resource, hash] = value.split("#");
        const clean = resource.split("?")[0];
        const target = clean ? path.resolve("pages", clean) : path.resolve("pages", file);
        if (!fs.existsSync(target)) {
            failures.push(`${file}: missing ${value}`);
            continue;
        }
        if (
            hash &&
            target.endsWith(".html") &&
            !fs.readFileSync(target, "utf8").includes(`id="${hash}"`)
        )
            failures.push(`${file}: missing anchor ${value}`);
        if (hash && target.endsWith("lucide.svg") && !sprite.includes(`id="${hash}"`))
            failures.push(`${file}: missing icon ${hash}`);
    }
}
const inventory = JSON.parse(fs.readFileSync("documentation/image-inventory.json"));
for (const image of inventory) {
    if (!fs.existsSync("assets/images/" + image.file)) failures.push(`Missing image ${image.file}`);
    if (!fs.existsSync("assets/images/" + image.file.replace(/\.webp$/, "-600.webp")))
        failures.push(`Missing responsive image ${image.file}`);
}
fs.writeFileSync(
    "tests/assets-report.json",
    JSON.stringify({ assets: inventory.length, failures }, null, 2),
);
console.log(`${inventory.length} image placements; ${failures.length} asset/link failures.`);
if (failures.length) console.log(failures.join("\n"));
process.exitCode = failures.length ? 1 : 0;
