const { chromium } = require("@playwright/test");
const fs = require("fs");
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const selections =
        process.argv[2] === "all"
            ? fs
                  .readdirSync("pages")
                  .filter((file) => file.endsWith(".html"))
                  .map((file) => file.replace(".html", ""))
            : [process.argv[2] || "index"];
    for (const selected of selections) {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`http://localhost:4173/pages/${selected}.html`);
        await page.evaluate(async () => {
            document.documentElement.dataset.theme = "light";
            for (const img of document.images) img.loading = "eager";
            await document.fonts.ready;
            await Promise.all(
                [...document.images].map((img) =>
                    img.complete
                        ? Promise.resolve()
                        : new Promise((resolve) => {
                              img.onload = resolve;
                              img.onerror = resolve;
                          }),
                ),
            );
        });
        fs.mkdirSync("tests/visual", { recursive: true });
        await page.evaluate(async () => {
            await Promise.all(
                [...document.images]
                    .filter((img) => img.complete && img.naturalWidth)
                    .map((img) => img.decode().catch(() => {})),
            );
        });
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let top = 0; top < height; top += 700) {
            await page.evaluate((y) => window.scrollTo(0, y), top);
            await page.waitForTimeout(70);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(100);
        console.log(
            await page.evaluate(() =>
                [...document.images]
                    .filter((img) => !img.naturalWidth)
                    .map((img) => img.getAttribute("src")),
            ),
        );
        await page.screenshot({ path: `tests/visual/${selected}-desktop.png`, fullPage: true });
        await page.screenshot({ path: `tests/visual/${selected}-hero.png` });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.evaluate(async () => {
            await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
        });
        await page.screenshot({ path: `tests/visual/${selected}-mobile.png`, fullPage: true });
        await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
        await page.screenshot({ path: `tests/visual/${selected}-dark.png`, fullPage: true });
    }
    await browser.close();
})();
