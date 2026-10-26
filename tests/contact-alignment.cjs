const { chromium } = require('@playwright/test');
const assert = require('assert/strict');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/pages/contact.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    for (const layout of await page.locator('.contact-form-layout').all()) {
        const form = await layout.locator('form').boundingBox();
        const aside = await layout.locator('aside').boundingBox();
        assert.ok(Math.abs(form.y - aside.y) < 1);
        assert.ok(Math.abs(form.height - aside.height) < 1);
    }
    const sizes = await page.locator('.contact-cards article > a, .contact-cards article > p').evaluateAll(elements =>
        elements.map(element => getComputedStyle(element).fontSize));
    assert.ok(sizes.every(size => size === '16px'));
    await browser.close();
    console.log('Both form pairs align at top and bottom; contact text is consistently 16px.');
})().catch(error => { console.error(error); process.exitCode = 1; });
