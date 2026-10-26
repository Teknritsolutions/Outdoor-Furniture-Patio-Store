const { chromium } = require('@playwright/test');
const assert = require('assert/strict');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:4173/pages/products.html');
    await page.locator('[data-category="Dining Sets"]').click();
    assert.equal(new URL(page.url()).searchParams.get('category'), 'Dining Sets');
    assert.equal(await page.locator('#product-catalog > :visible').count(), 3);
    await page.goBack();
    assert.equal(await page.locator('#product-catalog > :visible').count(), 21);
    await page.goForward();
    assert.equal(await page.locator('#product-catalog > :visible').count(), 3);
    await browser.close();
    console.log('Category filtering and Back/Forward navigation passed.');
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
