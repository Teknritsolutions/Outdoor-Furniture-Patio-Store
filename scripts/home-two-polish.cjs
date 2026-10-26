const fs = require("fs");
const path = "pages/index-2.html";
let html = fs.readFileSync(path, "utf8");
html = html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, (section) => {
    const extra = section.includes("One terrace. Endless possibilities.")
        ? "Start with a comfortable lounge zone, then add a dining spot with enough room to move between the two. Bring the layout together with coordinated finishes, a few generous planters, and lighting that makes the terrace inviting after sunset."
        : section.includes("Beauty begins with the details.")
          ? "Look closely at the joinery, the texture of the weave, and the finish beneath your fingertips. Explore how each material feels, how it settles into your space, and the simple care that helps it stay beautiful through the seasons."
          : "";
    if (extra && !section.includes(extra))
        section = section.replace(
            /(<div class="editorial-copy">[\s\S]*?)(<a class="button)/,
            "$1<p>" + extra + "</p>$2",
        );
    if (
        section.includes('class="newsletter-visit"') &&
        !section.includes("Bring your room dimensions")
    ) {
        section = section.replace(
            "Explore our demo showroom experience and plan a visit.",
            "Explore our demo showroom experience and plan a visit. Bring your room dimensions, compare materials, and discover pieces that suit the way you live outdoors.",
        );
        section = section.replace(
            /(<div class="newsletter-visit">[\s\S]*?<\/a>)/,
            '$1<small class="visit-note">Feel the textures, explore the finishes, and find your comfortable place.</small>',
        );
    }
    if (
        section.includes("A balcony becomes a favorite room.") &&
        !section.includes("Keep the footprint light")
    )
        section = section.replace(
            /(<div class="editorial-copy">[\s\S]*?<\/h2>[\s\S]*?<\/p>)\s*<p>[\s\S]*?<\/p>/,
            "$1<p>Keep the footprint light with a compact bistro table and woven chairs that tuck in easily. A textured outdoor rug defines the seating area, while a tall planter adds privacy without taking away the view.</p><p>Layer soft cushions and warm lantern light to make the space welcoming from morning coffee to the last conversation of the evening. Choose a few thoughtful pieces, leave room to move, and let the balcony become part of everyday life.</p>",
        );
    if (section.includes('class="steps"') && !section.includes("step-icon")) {
        let i = 0;
        const icons = ["compass", "layers", "armchair", "sparkles"];
        section = section.replace(
            /(<li>\s*<span>0\d<\/span>)/g,
            (match) =>
                match +
                `<span class="step-icon"><svg class="icon" aria-hidden="true"><use href="../assets/icons/lucide.svg#${icons[i++]}"></use></svg></span>`,
        );
    }
    return section;
});
fs.writeFileSync(path, html);
require("./icons.cjs");
