const { chromium } = require("@playwright/test");
const assert = require("assert/strict");
(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    let status = 500;
    let requests = 0;
    let payload;
    await page.route("**/api/enquiry", (route) => {
        requests++;
        payload = route.request().postDataJSON();
        return route.fulfill({
            status,
            contentType: "application/json",
            body: JSON.stringify({ accepted: status === 200 }),
        });
    });
    await page.goto("http://localhost:4173/pages/contact.html?product=solana-teak-lounge-chair");
    assert.match(await page.locator("#subject").inputValue(), /Solana Teak Lounge Chair/);
    await page.evaluate(() => (window.TERRAVELLE_CONFIG.endpoints.contact = "/api/enquiry"));
    const form = page.locator('[data-form="contact"]');
    await form.locator('button[type="submit"]').click();
    assert.equal(requests, 0);
    await form.locator("#name").fill("Test Visitor");
    await form.locator("#email").fill("test@example.com");
    await form.locator("#message").fill("Please send dimensions and material information.");
    await form.locator('button[type="submit"]').click();
    await page.waitForFunction(() =>
        document.querySelector('[data-form="contact"] .form-status').classList.contains("error"),
    );
    assert.match(await form.locator(".form-status").textContent(), /could not be processed/);
    assert.equal(payload.name, "Test Visitor");
    assert.equal(await form.locator("#name").inputValue(), "Test Visitor");
    status = 200;
    await form.locator('button[type="submit"]').click();
    await page.waitForFunction(() =>
        document
            .querySelector('[data-form="contact"] .form-status')
            .textContent.includes("received"),
    );
    assert.equal(requests, 2);
    assert.match(await form.locator(".form-status").textContent(), /confirmed only when/);
    assert.equal(await form.locator("#name").inputValue(), "");
    await browser.close();
    console.log(
        "Form integration tests passed: invalid requests blocked, JSON payload correct, service errors retain input, successful service response clears input.",
    );
})();
