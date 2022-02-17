const puppeteer = require('puppeteer');

(async () => {

    console.log("Launching headless browser");

    const username = 'admin1@foundationsoft.com';
    const password = 'Foundation#1';
    const url = 'https://app.myprojecthq.com/';
    const loginInputSelector = 'input[id=signInName]';

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`Navigating to ${url}`);

    await page.goto(url);

    console.log(`Waiting for selector ${loginInputSelector}`);

    await page.waitForSelector(loginInputSelector);

    console.log(`Setting selector ${loginInputSelector}`);

    await page.$eval('input[id=signInName]', el => el.value = 'admin1@foundationsoft.com');
    await page.$eval('input[id=password]', el => el.value = 'Foundation#1');

    await page.$eval('button[id=next]', el => el.click());

    const firstResponse = await page.waitForResponse('https://apim-fslenterprise-prod.azure-api.net/myprojecthq/api/Clients/?api-version=1.0');

    const localStorage = await page.evaluate(() => Object.assign({}, window.localStorage));

    console.log(localStorage.accessToken);

    //await browser.close();

    return localStorage.accessToken;
})();