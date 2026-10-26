const fs = require("fs");
const sprite = fs.readFileSync("node_modules/lucide-static/sprite.svg", "utf8");
const html = fs
    .readdirSync("pages")
    .map((file) => fs.readFileSync("pages/" + file, "utf8"))
    .join("\n");
const names = [
    ...new Set(
        [...html.matchAll(/lucide\.svg#([^"\s]+)/g)]
            .map((match) => match[1])
            .concat(["sun", "moon"]),
    ),
];
const custom = {
    instagram:
        '<symbol id="instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/></symbol>',
    facebook:
        '<symbol id="facebook" viewBox="0 0 24 24"><path d="M14 21V12h3l.5-4H14V6c0-1 .5-2 2-2h2V1h-3c-3 0-5 2-5 5v2H7v4h3v9"/></symbol>',
    linkedin:
        '<symbol id="linkedin" viewBox="0 0 24 24"><rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="4" r="2"/><path d="M11 21V9h4v2c1-2 6-3 6 3v7h-4v-7c0-2-2-2-2 0v7"/></symbol>',
};
const symbols = names
    .map((name) => {
        if (custom[name]) return custom[name];
        const sourceName = name === "building-2" ? "building" : name;
        const symbol = sprite.match(
            new RegExp(`<symbol id="${sourceName}"[\\s\\S]*?<\\/symbol>`),
        )?.[0];
        if (!symbol) throw new Error(`Missing icon: ${name}`);
        return symbol.replace(`id="${sourceName}"`, `id="${name}"`);
    })
    .join("\n");
fs.writeFileSync(
    "assets/icons/lucide.svg",
    `<svg xmlns="http://www.w3.org/2000/svg"><!-- Lucide ISC; custom social glyphs -->\n<defs>${symbols}</defs></svg>`,
);
