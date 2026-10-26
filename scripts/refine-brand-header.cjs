const fs = require("fs");
for (const file of [
    ...fs
        .readdirSync("pages")
        .filter((f) => f.endsWith(".html"))
        .map((f) => `pages/${f}`),
    "scripts/build.cjs",
]) {
    let text = fs.readFileSync(file, "utf8");
    text = text.replace(
        /(<button\b[^>]*class="direction-toggle icon-button"[^>]*>)[\s\S]*?<\/button>/g,
        '$1<span aria-hidden="true">RTL</span></button>',
    );
    text = text.replace(
        /(<button\b[^>]*class="direction-toggle icon-button"[^>]*>[\s\S]*?<\/button>)\s*(<button\b[^>]*class="theme-toggle icon-button"[^>]*>[\s\S]*?<\/button>)/g,
        "$2$1",
    );
    fs.writeFileSync(file, text);
}
for (const file of ["assets/icons/logo.svg", "scripts/update-navigation.cjs"]) {
    let text = fs.readFileSync(file, "utf8");
    text = text.replace(
        'font-size="6.3" letter-spacing="2.6"',
        'font-size="9" font-weight="600" letter-spacing="1.1"',
    );
    fs.writeFileSync(file, text);
}
