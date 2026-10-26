const fs = require("fs");
for (const id of ["index", "index-2"]) {
    const path = `pages/${id}.html`;
    let html = fs.readFileSync(path, "utf8");
    html = html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, (section) => {
        if (section.includes("Why Choose Terravelle")) {
            section = section.replace(
                /<section class="([^"]*)"/,
                (_, classes) =>
                    `<section class="${classes.includes("benefits-section") ? classes : classes + " benefits-section"}"`,
            );
            const icons = ["shield-check", "gem", "armchair", "handshake"];
            let i = 0;
            if (!section.includes("benefit-icon"))
                section = section.replace(
                    /(<article class="benefit">)\s*(<svg[\s\S]*?<\/svg>)/g,
                    (_, start, svg) =>
                        start +
                        `<span class="benefit-icon">${svg.replace(/lucide.svg#[^" ]+/, `lucide.svg#${icons[i++]}`)}</span>`,
                );
        }
        if (section.includes("home-1/seasonal.webp"))
            section = section.replace(
                'class="container split',
                'class="container seasonal-split split',
            );
        if (section.includes('class="quote"')) {
            section = section.replace(
                /<section class="([^"]*)"/,
                (_, classes) =>
                    `<section class="${classes.includes("testimonials-section") ? classes : classes + " testimonials-section"}"`,
            );
            const portraits = ["maya", "daniel-emma", "jordan"];
            let i = 0;
            if (!section.includes("testimonial-avatar"))
                section = section.replace(
                    /<figcaption>/g,
                    () =>
                        `<figcaption><img class="testimonial-avatar" src="../assets/images/testimonials/${portraits[i++]}.webp" width="56" height="56" alt="" loading="lazy">`,
                );
        }
        return section;
    });
    fs.writeFileSync(path, html);
}
require("./icons.cjs");
