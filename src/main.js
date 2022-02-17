//TODO harden
//TODO select client?

const puppeteer = require('puppeteer');

(async () => {

    console.log("Launching headless browser");

    const email = 'admin1@foundationsoft.com';
    const password = 'Foundation#1';
    const url = 'https://app.myprojecthq.com/';
    const emailAddressSelector = 'input[id=signInName]';
    const passwordInputSelector = 'input[id=password]';
    const loginButtonSelector = 'button[id=next]';
    const getClientUrl = 'https://apim-fslenterprise-prod.azure-api.net/myprojecthq/api/Clients/?api-version=1.0';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log(`Navigating to ${url}`);

    await page.goto(url);

    console.log(`Waiting for selector ${emailAddressSelector}`);

    await page.waitForSelector(emailAddressSelector);

    console.log(`Setting selector ${emailAddressSelector}`);

    console.log(`Setting value ${email} for selector ${emailAddressSelector}`);
    await page.$eval(emailAddressSelector, el => el.value = email);

    console.log(`Setting value ${password} for selector ${passwordInputSelector}`);
    await page.$eval(passwordInputSelector, el => el.value = password);

    console.log(`Logging in using selector ${loginButtonSelector}`);

    await page.$eval(loginButtonSelector, el => el.click());

    console.log(`Waiting for getClient call ${getClientUrl}`);
    const firstResponse = await page.waitForResponse(getClientUrl);

    if (firstResponse.ok) {

        console.log(`Extracting accessToken`);

        const localStorage = await page.evaluate(() => Object.assign({}, window.localStorage));

        console.log(`accessToken: ${localStorage.accessToken}`);

        await browser.close();

        return localStorage.accessToken;
    }

})();