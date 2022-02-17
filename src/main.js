//TODO harden
//TODO select client?
//TODO move variables to text file/console input

const puppeteer = require('puppeteer');

(async () => {

    console.log("Launching browser");

    const email = 'admin1@foundationsoft.com'; //temp input
    const password = 'Foundation#1'; //temp input
    const url = 'https://app-dev.myprojecthq.com/';
    const emailAddressSelector = 'input[id=signInName]';
    const passwordInputSelector = 'input[id=password]';
    const loginButtonSelector = 'button[id=next]';
    const getClientUrl = 'https://apim-myprojecthq-dev.azure-api.net/setup/v1/Clients/?api-version=1.0';
    const clientName = 'VoltWork Electric';
    const showBrowser = true;

    const browser = await puppeteer.launch({ headless: !showBrowser });
    const page = await browser.newPage();

    console.log(`Navigating to ${url}`);

    await page.goto(url);

    console.log(`Waiting for selector ${emailAddressSelector}`);

    console.log(`Setting selector ${emailAddressSelector}`);

    console.log(`Setting value ${email} for selector ${emailAddressSelector}`);
    const emailInput = await page.waitForSelector(emailAddressSelector);
    await emailInput.type(email);

    console.log(`Setting value ${password} for selector ${passwordInputSelector}`);
    const passwordInput = await page.waitForSelector(passwordInputSelector);
    await passwordInput.type(password);

    console.log(`Logging in using selector ${loginButtonSelector}`);

    await page.$eval(loginButtonSelector, el => el.click());

    console.log(`Waiting for getClient call ${getClientUrl}`);
    const firstResponse = await page.waitForResponse(getClientUrl);

    if (firstResponse.ok) {

        console.log(`Waiting for client buttons`);

        //Wait for the first client button to show
        await page.waitForXPath('//*[@id="app"]/div/div[2]/div/div/div/div/div[2]/div/div[1]/button');

        console.log(`Client buttons loaded`);

        //Find the span with the client name supplied in it, then grab its parent which will be the button to click
        const button = await page.$x(`//span[text() = '${clientName}']/parent::*`); //button

        //Even with waitForXPath above, sometimes the click happens too fast, so delay it for a second here
        await new Promise(x => setTimeout(x, 1000));

        await button[0].click();

        console.log(`Waiting for page to load`);

        await page.waitForNavigation()

        console.log(`Page loaded`);

        const localStorage = await page.evaluate(() => Object.assign({}, window.localStorage));

        console.log(`accessToken: ${localStorage.accessToken}`);

        if (!showBrowser) {
            await browser.close();
        }

        return localStorage.accessToken;
    }

})();