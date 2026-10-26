const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");

(async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.goto("http://127.0.0.1:4173/");
        await page.waitForLoadState("networkidle");
        assert.equal(new URL(page.url()).pathname, "/");
        assert.equal(await page.locator("body").getAttribute("data-page"), "index");
        assert.equal(await page.locator("main > section").count(), 10);
        assert(await page.locator(".hero img").first().evaluate(img => img.complete && img.naturalWidth > 0));
        for (const href of await page.locator('a[href]').evaluateAll(links => links.map(a => a.href))) {
            const url = new URL(href);
            if (url.origin === "http://127.0.0.1:4173" && url.pathname.endsWith(".html")) {
                assert.equal((await page.request.get(href)).status(), 200, href);
            }
        }
        await page.locator(".theme-toggle").click();
        assert((await page.locator('.theme-toggle use').getAttribute('href')).includes('/assets/icons/lucide.svg#'));
        assert.deepEqual(errors, []);
        console.log("Root renders Homepage 1 directly; hero, navigation, and theme controls pass.");
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
