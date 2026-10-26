import fs from 'node:fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';
const page = process.argv[2] || 'index';
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'] });
try {
    const result = await lighthouse(`http://localhost:4173/pages/${page}.html`, { port: chrome.port, logLevel: 'error', output: ['html', 'json'], onlyCategories: ['performance','accessibility','best-practices','seo'], formFactor:'mobile', screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:1,disabled:false} });
    fs.writeFileSync(`tests/lighthouse-${page}.html`,result.report[0]);
    fs.writeFileSync(`tests/lighthouse-${page}.json`,result.report[1]);
    const report=result.lhr;
    console.log(JSON.stringify({page,scores:Object.fromEntries(Object.entries(report.categories).map(([k,v])=>[k,Math.round(v.score*100)])),LCP:report.audits['largest-contentful-paint'].numericValue,CLS:report.audits['cumulative-layout-shift'].numericValue,TBT:report.audits['total-blocking-time'].numericValue},null,2));
} finally { await chrome.kill(); }
