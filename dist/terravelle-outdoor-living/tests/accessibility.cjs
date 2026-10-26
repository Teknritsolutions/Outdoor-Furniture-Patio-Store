const { chromium } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("fs");
(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const report = [];
    for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
        for (const theme of ["light", "dark"]) {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(`http://localhost:4173/pages/${file}`);
            await page.evaluate((mode) => (document.documentElement.dataset.theme = mode), theme);
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.addStyleTag({
                content:
                    "*, *::before, *::after { transition: none !important; animation: none !important; }",
            });
            const results = await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze();
            report.push({
                file,
                theme,
                violations: results.violations.map((v) => ({
                    id: v.id,
                    impact: v.impact,
                    description: v.description,
                    nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
                })),
            });
        }
    }
    await page.goto("http://localhost:4173/pages/inspiration-gallery.html");
    await page.locator(".gallery-card").first().click();
    const lightbox = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
    report.push({
        file: "gallery open dialog",
        violations: lightbox.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
    });
    fs.writeFileSync("tests/accessibility-report.json", JSON.stringify(report, null, 2));
    const violations = report.reduce((sum, entry) => sum + entry.violations.length, 0);
    console.log(`${report.length} accessibility scans; ${violations} violation groups.`);
    if (violations)
        console.log(
            JSON.stringify(
                report.filter((entry) => entry.violations.length),
                null,
                2,
            ),
        );
    await browser.close();
    process.exitCode = violations ? 1 : 0;
})();
