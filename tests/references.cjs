const { chromium } = require("@playwright/test");
const fs = require("fs");
const urls = [
    "https://teknritsolutions-2.github.io/Local-Farm-or-Community-Supported-Agriculture-CSA-/pages/public/index.html",
    "https://teknrit-maker.github.io/High-End-Event-Planning/pages/index.html",
    "https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/index.html",
    "https://teknrit-maker.github.io/FoodTruck/Pages/menu.html",
    "https://ravivarmaadepu123.github.io/boutique-yarn-and-craft-supply/pages/",
];
(async () => {
    const browser = await chromium.launch();
    const results = [];
    fs.mkdirSync("tests/references", { recursive: true });
    for (const [index, url] of urls.entries()) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        try {
            const response = await page.goto(url, {
                timeout: 25000,
                waitUntil: "domcontentloaded",
            });
            await page.screenshot({
                path: `tests/references/reference-${index + 1}-desktop.png`,
                fullPage: true,
            });
            const observations = await page.evaluate(() => ({
                title: document.title,
                navigation: [...document.querySelectorAll("header a,nav a")].map((a) =>
                    a.textContent.trim(),
                ),
                headings: [...document.querySelectorAll("h1,h2")].map((e) => e.textContent.trim()),
                typography: [...document.querySelectorAll("h1,h2,p")]
                    .slice(0, 12)
                    .map((e) => ({
                        tag: e.tagName,
                        size: getComputedStyle(e).fontSize,
                        lineHeight: getComputedStyle(e).lineHeight,
                    })),
                containers: [...document.querySelectorAll(".container")]
                    .slice(0, 5)
                    .map((e) => ({
                        width: e.getBoundingClientRect().width,
                        padding: getComputedStyle(e).paddingInline,
                    })),
            }));
            await page.setViewportSize({ width: 390, height: 844 });
            await page.screenshot({
                path: `tests/references/reference-${index + 1}-mobile.png`,
                fullPage: true,
            });
            results.push({ url, status: response.status(), ...observations });
        } catch (error) {
            results.push({ url, error: error.message });
        }
        await page.close();
    }
    fs.writeFileSync("documentation/reference-analysis.json", JSON.stringify(results, null, 2));
    console.log(results.map((r) => `${r.status || "Unavailable"}: ${r.url}`).join("\n"));
    await browser.close();
})();
