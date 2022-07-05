const puppeteer = require('puppeteer');

(async () => {

    console.log("Launching headless browser");
    const url = 'https://app.myprojecthq.com/';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`Navigating to ${url}`);

    await page.goto(url);

})();
