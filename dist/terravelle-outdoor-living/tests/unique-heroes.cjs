const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert/strict");
const pages = fs.readdirSync("pages").filter((f) => f.endsWith(".html"));
const hashes = new Set();
for (const file of pages) {
    const id = file.replace(".html", "");
    const source = `../assets/images/heroes/${id}.webp`;
    const html = fs.readFileSync(`pages/${file}`, "utf8");
    const hero = html.match(/<main[^>]*>\s*<section[\s\S]*?<\/section>/)[0];
    assert.ok(hero.includes(`src="${source}"`), `Hero missing for ${file}`);
    for (const other of pages) {
        const references = [
            ...fs.readFileSync(`pages/${other}`, "utf8").matchAll(/src="([^"]+)"/g),
        ].filter((m) => m[1] === source);
        assert.equal(references.length, other === file ? 1 : 0, `Repeated hero ${source}`);
    }
    const hash = crypto
        .createHash("sha256")
        .update(fs.readFileSync(`assets/images/heroes/${id}.webp`))
        .digest("hex");
    assert.ok(!hashes.has(hash), `Duplicate image ${id}`);
    hashes.add(hash);
    assert.ok(fs.existsSync(`assets/images/heroes/${id}-600.webp`));
}
console.log(`${pages.length} unique, exclusive hero images and mobile variants verified.`);
