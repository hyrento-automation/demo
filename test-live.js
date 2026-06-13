const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.stack || error.message);
  });

  console.log("Navigating to live home...");
  try {
    await page.goto('https://carehireos.shop', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (err) {
    console.log("Failed to navigate to home:", err.message);
  }

  const homeText = await page.evaluate(() => document.body.innerText);
  console.log("Home page visible text length:", homeText.length);
  
  console.log("Waiting for Book Now link...");
  try {
    await page.waitForSelector('a[href="/booking"], a[href^="/booking?"]', { timeout: 15000 });
  } catch (err) {
    console.log("Could not find booking link selector:", err.message);
  }
  
  console.log("Clicking book now...");
  await page.evaluate(() => {
    const link = document.querySelector('a[href="/booking"], a[href^="/booking?"]');
    if (link) {
       console.log("Found link: " + link.href + " with text: " + link.textContent.trim());
       link.click();
    } else {
       console.log("Link not found in page evaluate!");
    }
  });

  console.log("Waiting 10 seconds for client-side navigation...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  console.log("Current URL after click:", page.url());
  
  const bookingText = await page.evaluate(() => document.body.innerText);
  console.log("Booking page visible text length:", bookingText.length);
  console.log("Booking page visible text:", bookingText.slice(0, 2000));

  console.log("Done checking.");
  await browser.close();
})();
