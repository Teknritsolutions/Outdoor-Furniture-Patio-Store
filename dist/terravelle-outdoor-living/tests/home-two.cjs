const { chromium } = require("@playwright/test");
const assert = require("assert/strict");
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:4173/pages/index-2.html");
    await page.evaluate(() => (document.documentElement.dataset.theme = "light"));
    await page.addStyleTag({ content: ".site-header,.skip-link {visibility:hidden!important}" });
    let i = 0;
    for (const split of await page.locator(".split:has(> .editorial-copy)").all()) {
        const image = await split.locator(".editorial-image").boundingBox();
        const text = await split.locator(".editorial-copy").boundingBox();
        assert.ok(Math.abs(image.y - text.y) < 1);
        assert.ok(Math.abs(image.height - text.height) < 1);
        await split.scrollIntoViewIfNeeded();
        await split.locator("img").evaluate(async (img) => {
            if (!img.complete)
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            await img.decode();
        });
        await split.screenshot({ path: `tests/home-two-split-${i++}.png` });
    }
    await page.locator(".steps").screenshot({ path: "tests/home-two-steps.png" });
    const signupButton = await page.locator(".closing .newsletter button[type='submit']").boundingBox();
    const visitButton = await page.locator(".closing .newsletter-visit .button").boundingBox();
    assert.ok(Math.abs(signupButton.y - visitButton.y) < 1);
    assert.ok(Math.abs(signupButton.height - visitButton.height) < 1);
    await page.locator(".closing .split").screenshot({ path: "tests/home-two-newsletter.png" });
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
    }
    await browser.close();
    console.log(
        "Three editorial panels match top/bottom edges; steps and newsletter responsive checks passed.",
    );
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
