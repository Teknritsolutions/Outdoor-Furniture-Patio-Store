const fs = require("fs");
const direction =
    '<button type="button" class="direction-toggle icon-button" aria-label="Switch to right-to-left layout" aria-pressed="false"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 5H7a3 3 0 0 0 0 6h3M10 5v14M15 5v14M7 15H3m0 0 2-2m-2 2 2 2"/></svg></button>';
for (const file of fs.readdirSync("pages").filter((f) => f.endsWith(".html"))) {
    const path = `pages/${file}`;
    let html = fs.readFileSync(path, "utf8");
    html = html.replace(/(<nav\b[\s\S]*?<\/nav>)/, (nav) => {
        const about = nav.match(/<a\s+href="about.html"[^>]*>\s*About Us\s*<\/a>/);
        if (!about) throw new Error(`About link missing: ${file}`);
        return nav.replace(about[0], "").replace(/(<a\s+href="products.html")/, `${about[0]}$1`);
    });
    if (!html.includes('class="direction-toggle'))
        html = html.replace(/(<div class="header-actions">)/, `$1${direction}`);
    fs.writeFileSync(path, html);
}
let build = fs.readFileSync("scripts/build.cjs", "utf8");
build = build
    .replace('    ["About Us", "about"],\n', "")
    .replace("const nav = [\n", 'const nav = [\n    ["About Us", "about"],\n');
if (!build.includes('class="direction-toggle'))
    build = build.replace(
        '<div class="header-actions">',
        `<div class="header-actions">${direction}`,
    );
fs.writeFileSync("scripts/build.cjs", build);
fs.writeFileSync(
    "assets/icons/logo.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="48" viewBox="0 0 192 48"><g fill="none" stroke="#8B5946" stroke-width="1"><rect x="2" y="3" width="38" height="42" rx="19"/><path d="M6 25c8-4 22-4 30 0" stroke-opacity=".35"/></g><g fill="#8B5946"><path d="M10 13h22v5h-1l-1-3h-7v18l3 1v1H16v-1l3-1V15h-7l-1 3h-1z"/><path d="m12 24 9 16 9-16h-3l-6 11-6-11z"/></g><text x="48" y="27" fill="#29241F" font-family="Georgia,serif" font-size="25" letter-spacing="-.5">Terravelle</text><text x="50" y="40" fill="#8B5946" font-family="Arial,sans-serif" font-size="9" font-weight="600" letter-spacing="1.1">OUTDOOR LIVING</text></svg>`,
);
fs.writeFileSync(
    "assets/icons/favicon.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#FAF8F5"/><rect x="7" y="3" width="34" height="42" rx="17" fill="none" stroke="#8B5946"/><g fill="#8B5946"><path d="M13 12h22v5h-1l-1-3h-7v19l3 1v1H19v-1l3-1V14h-7l-1 3h-1z"/><path d="m15 24 9 16 9-16h-3l-6 11-6-11z"/></g></svg>`,
);
