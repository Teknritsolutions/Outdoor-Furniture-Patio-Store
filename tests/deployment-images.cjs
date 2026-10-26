const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = new URL('https://example.test/Outdoor-Furniture-Patio-Store/');
const files = ['index.html', ...fs.readdirSync('pages').filter(f => f.endsWith('.html')).map(f => `pages/${f}`)];
let checked = 0;
for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
        const sources = [];
        const src = tag[0].match(/\bsrc="([^"]+)"/);
        if (src) sources.push(src[1]);
        const srcset = tag[0].match(/\bsrcset="([^"]+)"/);
        if (srcset) sources.push(...srcset[1].split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
        for (const source of sources) {
            const url = new URL(source, new URL(file, base));
            if (url.origin !== base.origin) continue;
            assert(url.pathname.startsWith(base.pathname), `${file}: image escapes project folder: ${source}`);
            const local = decodeURIComponent(url.pathname.slice(base.pathname.length));
            assert(fs.existsSync(path.resolve(local)), `${file}: missing image ${source}`);
            checked++;
        }
    }
}
console.log(`Verified ${checked} image sources across ${files.length} pages under the GitHub Pages project path.`);
