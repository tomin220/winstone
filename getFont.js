import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.winstoneprojects.com/', {waitUntil: 'domcontentloaded'});

  const fonts = await page.evaluate(() => {
    const h1 = document.querySelector('h1') ? window.getComputedStyle(document.querySelector('h1')).fontFamily : null;
    const body = window.getComputedStyle(document.body).fontFamily;
    const h2 = document.querySelector('h2') ? window.getComputedStyle(document.querySelector('h2')).fontFamily : null;
    return { h1, body, h2 };
  });

  console.log('FONTS:', JSON.stringify(fonts));
  await browser.close();
})();
