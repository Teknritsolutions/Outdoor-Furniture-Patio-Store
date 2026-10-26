const fs = require("fs");
const { HtmlValidate } = require("html-validate");
(async () => {
    const validator = new HtmlValidate({
        extends: ["html-validate:recommended"],
        rules: {
            "svg-focusable": "off",
            "no-inline-style": "off",
            "wcag/h32": "off",
            "prefer-native-element": "off",
            "no-implicit-button-type": "off",
            "doctype-style": "off",
            "void-style": "off",
            "no-trailing-whitespace": "off",
            "long-title": "off",
            "no-raw-characters": "off",
        },
    });
    const report = [];
    for (const file of [
        "index.html",
        ...fs
            .readdirSync("pages")
            .filter((f) => f.endsWith(".html"))
            .map((f) => "pages/" + f),
    ]) {
        const result = await validator.validateFile(file);
        report.push({
            file,
            valid: result.valid,
            messages: result.results.flatMap((r) => r.messages),
        });
    }
    fs.writeFileSync("tests/html-report.json", JSON.stringify(report, null, 2));
    const failed = report.filter((r) => !r.valid);
    console.log(`${report.length} HTML files; ${failed.length} invalid.`);
    if (failed.length) console.log(JSON.stringify(failed, null, 2));
    process.exitCode = failed.length ? 1 : 0;
})();
