const { chromium } = require("@playwright/test");
const assert = require("assert/strict");
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:4173/pages/index.html");
    await page.evaluate(() => (document.documentElement.dataset.theme = "light"));
    for (const heading of [
        "A collection to come home to",
        "Why Choose Terravelle",
        "Honest materials. Enduring character.",
        "A little inspiration goes a long way",
        "Life, beautifully outside",
    ]) {
        assert.equal(
            await page
                .getByRole("heading", { name: heading, exact: true })
                .evaluate((el) => getComputedStyle(el.parentElement).textAlign),
            "center",
        );
    }
    for (const [selector, name] of [
        [".benefits-section", "benefits"],
        [".testimonials-section", "testimonials"],
        [".seasonal-split", "seasonal"],
    ]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.addStyleTag({
            content: ".site-header,.skip-link {visibility:hidden!important}",
        });
        await page.locator(selector).screenshot({ path: `tests/${name}-polish.png` });
    }
    assert.equal(await page.locator(".testimonial-avatar").count(), 3);
    for (const avatar of await page.locator(".testimonial-avatar").all()) {
        assert.equal(await avatar.evaluate((el) => el.naturalWidth > 0), true);
        const bounds = await avatar.boundingBox();
        assert.equal(bounds.width, 56);
        assert.equal(bounds.height, 56);
    }
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
    }
    await browser.close();
    console.log(
        "Centered headings, benefit cards, seasonal image, portrait sizing and responsive layout passed.",
    );
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
