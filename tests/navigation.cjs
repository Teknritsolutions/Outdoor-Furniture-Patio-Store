const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    for (const home of ["index.html", "index-2.html"]) {
        await page.goto(`http://localhost:4173/pages/${home}`);
        await page.locator(".home-trigger").hover();
        assert.equal(await page.locator("#home-menu").isVisible(), true);
        assert.equal(await page.locator("#home-menu a[aria-current]").getAttribute("href"), home);
        assert.notEqual(
            await page
                .locator("#home-menu a[aria-current]")
                .evaluate((el) => getComputedStyle(el).backgroundColor),
            "rgba(0, 0, 0, 0)",
        );
        await page.locator("#home-menu a").last().hover();
        assert.equal(await page.locator("#home-menu").isVisible(), true);
        const order = await page.locator(".primary-nav > a").allTextContents();
        assert.equal(order[0].trim(), "About Us");
        assert.equal(
            await page.locator(".header-actions > button").first().getAttribute("class"),
            "theme-toggle icon-button",
        );
        assert.equal(await page.locator(".direction-toggle").innerText(), "RTL");
        await page.locator(".direction-toggle").click();
        assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
        assert.equal(await page.locator(".direction-toggle").innerText(), "LTR");
        await page.locator(".direction-toggle").click();
        assert.equal(await page.locator("html").getAttribute("dir"), "ltr");
        assert.equal(await page.locator(".direction-toggle").innerText(), "RTL");
    }
    await page.locator(".home-trigger").hover();
    await page.screenshot({ path: "tests/navigation-desktop.png" });
    for (const width of [320, 390, 768, 1280, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
        const logo = await page.locator(".site-header .brand").boundingBox();
        const actions = await page.locator(".header-actions").boundingBox();
        assert.ok(Math.abs(logo.y - actions.y) < 20, `Header wraps at ${width}`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: "tests/navigation-mobile.png" });
    for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.locator(".site-footer").scrollIntoViewIfNeeded();
        await page.locator(".site-footer").screenshot({ path: `tests/footer-${width}.png` });
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
        if (width === 1440) {
            const tops = await page
                .locator(".footer-grid h3")
                .evaluateAll((items) => items.map((el) => el.getBoundingClientRect().top));
            assert.ok(Math.max(...tops) - Math.min(...tops) < 1);
            const links = await page
                .locator(".footer-grid > .footer-links")
                .evaluateAll((items) =>
                    items.map((el) => el.querySelector("a").getBoundingClientRect().top),
                );
            assert.ok(Math.max(...links) - Math.min(...links) < 1);
        }
    }
    for (const theme of ["light", "dark"]) {
        for (const dir of ["ltr", "rtl"]) {
            for (const width of [320, 390, 768, 1440]) {
                await page.setViewportSize({ width, height: 900 });
                await page.evaluate(
                    ({ theme, dir }) => {
                        document.documentElement.dataset.theme = theme;
                        document.documentElement.dir = dir;
                    },
                    { theme, dir },
                );
                assert.equal(
                    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
                    true,
                    `${theme} ${dir} ${width}`,
                );
            }
        }
    }
    await page.evaluate(() => {
        document.documentElement.dir = "ltr";
        document.documentElement.dataset.theme = "light";
        document.activeElement.blur();
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addStyleTag({
        content: ".site-header,.skip-link { visibility:hidden !important; }",
    });
    await page.locator(".site-footer").screenshot({ path: "tests/footer-390.png" });
    await browser.close();
    console.log(
        "Navigation hover, active states, RTL toggle, order and responsive header checks passed.",
    );
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
