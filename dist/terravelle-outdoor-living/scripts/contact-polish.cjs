const fs = require('fs');
const file = 'pages/contact.html';
let html = fs.readFileSync(file, 'utf8');
const icon = name => `<svg class="icon" aria-hidden="true"><use href="../assets/icons/lucide.svg#${name}"></use></svg>`;
html = html.replace(/<form class="demo-form form-panel" data-form="(contact|booking)">[\s\S]*?<\/form>/g, (form, type) => {
    if (html.includes(`data-contact-panel="${type}"`)) return form;
    const contact = type === 'contact';
    const title = contact ? 'A little detail makes a difference.' : 'Make the most of your visit.';
    const items = contact
        ? [['ruler', 'Your space', 'Share dimensions or a simple description of your patio, garden, or balcony.'], ['layers', 'Your style', 'Tell us which materials, colors, and collections caught your eye.'], ['messages-square', 'Your questions', 'Ask about proportions, finishes, or how to bring your outdoor setting together.']]
        : [['ruler', 'Bring your measurements', 'A few dimensions and photos help you compare pieces with confidence.'], ['armchair', 'Find your comfort', 'Explore seating shapes, cushions, and layouts for your everyday outdoors.'], ['leaf', 'Explore the details', 'Compare natural textures and finishes, and discuss practical care.']];
    const aside = `<aside class="contact-companion"><img src="../assets/images/about/${contact ? 'story' : 'craft'}.webp" alt="${contact ? 'Welcoming outdoor furniture setting' : 'Outdoor furniture craftsmanship'}" width="1200" height="900" loading="lazy"><div class="companion-content"><p class="eyebrow">${contact ? 'Let’s plan your outdoors' : 'Your showroom experience'}</p><h3>${title}</h3>${items.map(([glyph, heading, text]) => `<div class="companion-tip">${icon(glyph)}<div><h4>${heading}</h4><p>${text}</p></div></div>`).join('')}<a class="text-link" href="${contact ? 'inspiration-gallery' : 'materials-guide'}.html">${contact ? 'Find your inspiration' : 'Explore our materials'} ${icon('arrow-up-right')}</a></div></aside>`;
    return `<div class="contact-form-layout" data-contact-panel="${type}">${form}${aside}</div>`;
});
html = html.replace(/<div class="map-placeholder">[\s\S]*?<div id="showroom-map"><\/div>\s*<\/div>/,
    `<div class="location-layout"><div id="showroom-map"><iframe title="Sample location map: Bryant Park, New York" src="https://maps.google.com/maps?q=Bryant%20Park%20New%20York&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><aside class="location-card">${icon('map-pin')}<p class="eyebrow">Sample map location</p><h3>Bryant Park, New York</h3><address>West 40th Street &amp; Fifth Avenue<br>New York, NY 10018, USA</address><p>A real location used to demonstrate the map. Terravelle’s showroom address can be added here when available.</p><a class="button" href="https://www.google.com/maps/search/?api=1&amp;query=Bryant+Park+New+York" target="_blank" rel="noopener">Open directions ${icon('arrow-up-right')}</a></aside></div>`);
let companionIndex = 0;
html = html.replace(/<aside class="contact-companion">/g, () =>
    `<aside class="contact-companion" aria-label="${companionIndex++ === 0 ? 'Enquiry preparation' : 'Visit preparation'}">`);
html = html.replace('<aside class="location-card">', '<aside class="location-card" aria-label="Sample location details">');
fs.writeFileSync(file, html);
