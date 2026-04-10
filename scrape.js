import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://www.winstoneprojects.com/', {waitUntil: 'networkidle0'});

    // Extract images
    const images = await page.evaluate(() => {
      const results = {};
      document.querySelectorAll('img').forEach(img => {
        // Find src URLs, specifically check alt/class/id for partners
        if (img.src) {
           results[img.src] = img.alt || img.className || 'image';
        }
      });
      return results;
    });

    // Extract Partner & Impact styling
    const headings = await page.evaluate(() => {
      const results = [];
      const getStyles = (el) => {
         const s = window.getComputedStyle(el);
         return {
            tag: el.tagName,
            text: el.innerText.substring(0, 50),
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            letterSpacing: s.letterSpacing,
            color: s.color,
            margin: s.margin,
            padding: s.padding
         };
      };

      document.querySelectorAll('h1, h2, h3, h4, p, span').forEach(el => {
         const t = (el.innerText || '').toLowerCase();
         if (t.includes('global impact') || t.includes('strategic partners') || t.includes('trusted by')) {
            results.push(getStyles(el));
         }
      });
      return results;
    });

    const output = { images, headings };
    fs.writeFileSync('C:/Users/HP/winstone/winstone_scraping.json', JSON.stringify(output, null, 2));
    console.log('Scraping completed');
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
})();
