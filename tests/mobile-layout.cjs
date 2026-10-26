const {chromium}=require('@playwright/test');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch(); const page=await browser.newPage(); const results=[];
 fs.mkdirSync('tests/mobile-review',{recursive:true});
 for(const file of fs.readdirSync('pages').filter(f=>f.endsWith('.html'))){
  for(const width of [320,390,480]){
   await page.setViewportSize({width,height:844});await page.goto(`http://localhost:4173/pages/${file}`);
   await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   const issues=await page.evaluate(()=>{
    const issues=[];if(document.documentElement.scrollWidth>innerWidth)issues.push('Page overflow');
    for(const e of document.querySelectorAll('main a,main button,main input,main select,main h1,main h2,main h3')){
     if(!e.getClientRects().length)continue;const r=e.getBoundingClientRect();const s=getComputedStyle(e);
     if(s.visibility==='hidden'||r.width===0)continue;
     if(r.left< -1||r.right>innerWidth+1)issues.push(`Outside viewport: ${e.tagName} ${e.textContent.trim().slice(0,45)}`);
    }
    for(const card of document.querySelectorAll('.steps li')){
     const heading=card.querySelector('h3');const description=card.querySelector('p');
     if(heading&&description&&heading.getBoundingClientRect().bottom>description.getBoundingClientRect().top+1)issues.push('Process heading overlaps description');
     const icon=card.querySelector('.step-icon');
     if(icon&&heading&&icon.getBoundingClientRect().bottom>heading.getBoundingClientRect().top+1)issues.push('Process icon overlaps heading');
    }
    for(const i of document.images)if(!i.naturalWidth)issues.push(`Broken image: ${i.getAttribute('src')}`);
    return issues;
   });
   await page.locator('.menu-toggle').click();await page.locator('.home-trigger').click();
   if(!await page.locator('#home-menu').isVisible())issues.push('Home dropdown hidden');
   await page.locator('.menu-toggle').click();
   results.push({file,width,issues});
   if(width===390)await page.screenshot({path:`tests/mobile-review/${file.replace('.html','')}.png`,fullPage:true});
  }
  console.log(file,results.filter(r=>r.file===file).flatMap(r=>r.issues));
 }
 fs.writeFileSync('tests/mobile-review/report.json',JSON.stringify(results,null,2));
 await browser.close();if(results.some(r=>r.issues.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
