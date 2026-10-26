const fs = require("fs");
const path = require("path");

// Render Home Page 1 at the deployment root without a redirect.
const root = path.resolve(__dirname, "..");
const homepage = fs.readFileSync(path.join(root, "pages/index.html"), "utf8")
    // Responsive srcset candidates must be rebased too, including multiline values.
    .replace(/\.\.\/assets\//g, "assets/")
    .replace(/(href=["'])(?:\.\/)?([\w-]+\.html(?:[?#][^"']*)?)/g, (_, prefix, target) =>
        prefix + (target === "index.html" ? "index.html" : "pages/" + target),
    );
fs.writeFileSync(path.join(root, "index.html"), homepage);
console.log("Homepage 1 is ready at the site root.");
