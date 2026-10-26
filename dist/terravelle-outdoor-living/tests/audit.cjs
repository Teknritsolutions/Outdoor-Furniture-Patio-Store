const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
const crypto = require("crypto");
const widths = [320, 360, 375, 390, 420, 480, 640, 768, 820, 1024, 1280, 1440, 1920];
const pages = fs.readdirSync("pages").filter((p) => p.endsWith(".html"));
const expected = {
    "index.html": 10,
    "index-2.html": 10,
    "about.html": 6,
    "products.html": 6,
    "product-details.html": 6,
    "materials-guide.html": 6,
    "inspiration-gallery.html": 6,
    "bulk-orders.html": 6,
    "contact.html": 6,
};
const args = process.argv.slice(2);
const allowMissing = args.includes("--layout-only");
const failures = [];
const report = {
    started: new Date().toISOString(),
    widths,
    pages,
    checks: [],
    failures,
};
function check(name, condition, detail = "") {
    report.checks.push({ name, passed: !!condition, detail });
    if (!condition) failures.push(`${name}: ${detail}`);
}
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    fs.mkdirSync("tests/screenshots", { recursive: true });
    for (const file of pages) {
        for (const mode of ["light", "dark"]) {
            await page.goto(`http://localhost:4173/pages/${file}`);
            await page.evaluate((theme) => {
                document.documentElement.dataset.theme = theme;
                localStorage.setItem("terravelle-theme", theme);
            }, mode);
            if (expected[file])
                check(
                    `${file} section count`,
                    (await page.locator("main > section").count()) === expected[file],
                );
            check(`${file} one H1`, (await page.locator("h1").count()) === 1);
            check(
                `${file} no duplicate IDs`,
                await page.evaluate(() => {
                    const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
                    return ids.length === new Set(ids).size;
                }),
            );
            for (const width of widths) {
                await page.setViewportSize({ width, height: 900 });
                await page.evaluate(async () => {
                    await document.fonts.ready;
                    window.scrollTo(0, 0);
                });
                const overflow = await page.evaluate(() => ({
                    body: document.body.scrollWidth,
                    doc: document.documentElement.scrollWidth,
                    width: innerWidth,
                }));
                check(
                    `${file} ${mode} ${width}px no horizontal overflow`,
                    Math.max(overflow.body, overflow.doc) <= width + 1,
                    JSON.stringify(overflow),
                );
                const overlaps = await page.evaluate(() => {
                    const h = document.querySelector(".header-inner");
                    const nodes = [...h.children].filter(
                        (n) =>
                            getComputedStyle(n).display !== "none" &&
                            n.getBoundingClientRect().height > 0,
                    );
                    return nodes.some((a, i) =>
                        nodes.slice(i + 1).some((b) => {
                            const x = a.getBoundingClientRect(),
                                y = b.getBoundingClientRect();
                            return (
                                x.left < y.right - 1 &&
                                x.right > y.left + 1 &&
                                x.top < y.bottom - 1 &&
                                x.bottom > y.top + 1
                            );
                        }),
                    );
                });
                check(`${file} ${mode} ${width}px header alignment`, !overlaps);
                if ([390, 820, 1440].includes(width))
                    await page.screenshot({
                        path: `tests/screenshots/${file.replace(".html", "")}-${mode}-${width}.png`,
                        fullPage: true,
                    });
            }
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.evaluate(() => (document.documentElement.dir = "rtl"));
            check(
                `${file} ${mode} RTL desktop no overflow`,
                await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            );
            await page.setViewportSize({ width: 320, height: 900 });
            check(
                `${file} ${mode} RTL mobile no overflow`,
                await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            );
            if (!allowMissing) {
                await page.evaluate(async () => {
                    for (const img of document.images) img.loading = "eager";
                    await Promise.all(
                        [...document.images].map((img) =>
                            img.complete
                                ? Promise.resolve()
                                : new Promise((r) => {
                                      img.onload = r;
                                      img.onerror = r;
                                  }),
                        ),
                    );
                });
                const broken = await page.evaluate(() =>
                    [...document.images].filter((img) => !img.naturalWidth).map((img) => img.src),
                );
                check(`${file} ${mode} images load`, broken.length === 0, broken.join(", "));
            }
        }
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("http://localhost:4173/pages/index.html");
    await page.locator(".menu-toggle").click();
    check("Mobile menu opens", await page.locator("#primary-nav").isVisible());
    await page.locator(".home-trigger").click();
    check("Home dropdown opens", await page.locator("#home-menu").isVisible());
    await page.keyboard.press("Escape");
    check("Escape closes dropdown", !(await page.locator("#home-menu").isVisible()));
    await page.locator(".theme-toggle").click();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.goto("http://localhost:4173/pages/about.html");
    check(
        "Theme persists across pages",
        (await page.evaluate(() => document.documentElement.dataset.theme)) === theme,
    );
    await page.goto("http://localhost:4173/pages/products.html?category=Dining%20Sets");
    check(
        "Category query selects three products",
        (await page.locator(".product-card:visible").count()) === 3,
    );
    await page.locator("#product-search").fill("nothing-matches");
    check("Catalog empty state", await page.locator("#empty-products").isVisible());
    await page.locator("#product-search").fill("");
    await page.locator('[data-category="All"]').click();
    await page.locator("#product-sort").selectOption("price-asc");
    const sorted = await page.locator(".product-card:visible .price").allTextContents();
    check(
        "Price sorting works",
        sorted.every(
            (v, i) =>
                !i ||
                Number(v.replace(/[^0-9]/g, "")) >= Number(sorted[i - 1].replace(/[^0-9]/g, "")),
        ),
    );
    await page.locator("#product-sort").selectOption("name");
    const names = await page.locator(".product-card:visible h3").allTextContents();
    check(
        "Name sorting works",
        JSON.stringify(names) === JSON.stringify([...names].sort((a, b) => a.localeCompare(b))),
    );
    const data = JSON.parse(fs.readFileSync("documentation/image-inventory.json"));
    const dataContext = { window: {} };
    require("vm").runInNewContext(fs.readFileSync("assets/js/data.js", "utf8"), dataContext);
    for (const item of dataContext.window.TERRAVELLE_PRODUCTS) {
        await page.goto(`http://localhost:4173/pages/product-details.html?id=${item.id}`);
        check(`Details ${item.id}`, (await page.locator("h1").textContent()) === item.name);
        check(
            `Dimensions ${item.id}`,
            (await page.locator("#specifications").textContent()).includes(item.dimensions),
        );
        if (!allowMissing) {
            await page.locator('[aria-label="Show construction detail"]').click();
            await page.waitForFunction(() => document.querySelector("#detail-image").complete);
            check(
                `Detail alternate ${item.id}`,
                await page.locator("#detail-image").evaluate((img) => img.naturalWidth > 0),
            );
        }
    }
    await page.goto("http://localhost:4173/pages/inspiration-gallery.html");
    await page.locator('[data-gallery-category="Poolside"]').click();
    check("Gallery filter", (await page.locator(".gallery-card:visible").count()) === 4);
    await page.locator(".gallery-card:visible").first().click();
    check("Lightbox opens", await page.locator("#lightbox").isVisible());
    const caption = await page.locator("#lightbox-caption").textContent();
    await page.keyboard.press("ArrowRight");
    check(
        "Lightbox keyboard next",
        (await page.locator("#lightbox-caption").textContent()) !== caption,
    );
    await page.keyboard.press("Escape");
    check("Lightbox Escape closes", !(await page.locator("#lightbox").isVisible()));
    check(
        "Lightbox restores focus",
        await page
            .locator(".gallery-card:visible")
            .first()
            .evaluate((el) => el === document.activeElement),
    );
    for (const file of ["contact.html", "bulk-orders.html", "coming-soon.html", "index-2.html"]) {
        await page.goto(`http://localhost:4173/pages/${file}`);
        for (const form of await page.locator(".demo-form").all()) {
            check(`${file} empty form invalid`, !(await form.evaluate((el) => el.checkValidity())));
            for (const input of await form.locator("input,textarea,select").all()) {
                const tag = await input.evaluate((el) => el.tagName);
                const type = await input.getAttribute("type");
                if (tag === "SELECT") await input.selectOption({ index: 1 });
                else
                    await input.fill(
                        type === "email"
                            ? "test@example.com"
                            : type === "tel"
                              ? "+1 202 555 0148"
                              : type === "date"
                                ? "2099-10-09"
                                : type === "number"
                                  ? "3"
                                  : "Demo enquiry",
                    );
            }
            await form.locator('button[type="submit"]').click();
            check(
                `${file} honest demo submission`,
                (await form.locator(".form-status").textContent()).includes(
                    "nothing has been sent",
                ),
            );
        }
    }
    await page.goto("http://localhost:4173/pages/contact.html");
    await page.locator('input[type="date"]').fill("2000-01-01");
    check(
        "Past dates rejected",
        !(await page.locator('input[type="date"]').evaluate((el) => el.checkValidity())),
    );
    await page.locator("summary").first().click();
    check(
        "FAQ accordion works",
        (await page.locator("details").first().getAttribute("open")) !== null,
    );
    check("No JavaScript exceptions", errors.length === 0, errors.join("; "));
    const missing = data.filter((i) => !fs.existsSync(path.join("assets/images", i.file)));
    if (!allowMissing) {
        check("Image inventory complete", missing.length === 0, `${missing.length} missing`);
        const hashes = new Map();
        for (const i of data) {
            if (!fs.existsSync(path.join("assets/images", i.file))) continue;
            const hash = crypto
                .createHash("sha256")
                .update(fs.readFileSync(path.join("assets/images", i.file)))
                .digest("hex");
            if (hashes.has(hash))
                failures.push(`Duplicate image content: ${i.file} and ${hashes.get(hash)}`);
            hashes.set(hash, i.file);
        }
    }
    report.finished = new Date().toISOString();
    fs.writeFileSync(
        `tests/${allowMissing ? "layout-" : " "}audit-report.json`.replace("/ ", "/"),
        JSON.stringify(report, null, 2),
    );
    console.log(`${report.checks.length} checks; ${failures.length} failures.`);
    if (failures.length) console.log(failures.join("\n"));
    await browser.close();
    process.exitCode = failures.length ? 1 : 0;
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
