const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log("Navigating to home...");
  await page.goto('http://localhost:3008', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  console.log("Waiting for Book Now link...");
  await page.waitForSelector('a[href="/booking"], a[href^="/booking?"]', { timeout: 30000 });
  
  console.log("Clicking book now...");
  await page.evaluate(() => {
    const link = document.querySelector('a[href="/booking"], a[href^="/booking?"]');
    if (link) {
       console.log("Clicking link: " + link.href);
       link.click();
    }
  });

  await page.waitForTimeout(5000);
  console.log("Done checking.");
  await browser.close();
})();
