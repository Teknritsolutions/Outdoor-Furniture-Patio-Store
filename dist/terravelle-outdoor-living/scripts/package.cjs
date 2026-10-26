const fs = require("fs");
const path = require("path");
require("./sync-home.cjs");
const destination = path.resolve("dist");
fs.mkdirSync(destination, { recursive: true });
const output = path.join(destination, "terravelle-outdoor-living");
fs.mkdirSync(output, { recursive: true });
for (const entry of [
    "pages",
    "assets",
    "documentation",
    "scripts",
    "tests",
    "index.html",
    "README.md",
    "robots.txt",
    "sitemap.xml",
    "package.json",
    "package-lock.json",
    ".prettierrc.json",
]) {
    const target = path.join(output, entry);
    fs.cpSync(entry, target, {
        recursive: true,
        filter: (source) =>
            !source.includes(`${path.sep}screenshots`) &&
            !source.includes(`${path.sep}references`) &&
            !source.includes(`${path.sep}visual`) &&
            !/\.(png|jpg)$/i.test(source),
    });
}
console.log(`Reviewable template copied to ${output}`);
