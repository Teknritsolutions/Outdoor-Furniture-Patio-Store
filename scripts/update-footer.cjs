const fs = require("fs");
const footer = require("./footer.cjs");
for (const file of fs.readdirSync("pages").filter((f) => f.endsWith(".html"))) {
    const path = `pages/${file}`;
    const html = fs
        .readFileSync(path, "utf8")
        .replace(/<footer class="site-footer[^"]*">[\s\S]*?<\/footer>/, footer());
    fs.writeFileSync(path, html);
}
const path = "scripts/build.cjs";
const build = fs
    .readFileSync(path, "utf8")
    .replace(
        /function footer\(\) \{[\s\S]*?\n\}/,
        'function footer() { return require("./footer.cjs")(); }',
    );
fs.writeFileSync(path, build);
