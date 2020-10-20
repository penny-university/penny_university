const playwright = require('playwright');

// What do we need to check for?

// - [ ] Are we inviting everyone when inviting a user + a channel?
// (users, organizer, channel)
// - [ ] Are we telling them who the organizer is?
// - [ ] Are we showing them the chat title?
// - [ ] Are we showing them the chat description?
// - [ ] Are we telling them when the chat is?
// - [ ] Are we telling the organizer who we shared the event is?
// - [ ] Are we giving them an accept invitation button?
// - [ ] Are we giving them a decline invitation button?

// Future Environment Variables

const SLACK_URL = 'https://test.slack.com/';
const EMAIL_ADDRESS = 'dont';
const PASSWORD = 'publish';

(async () => {
    for(const browserType of ['chromium']) {
        const browser = await playwright[browserType].launch({ headless: false, slowMo: 100 });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(SLACK_URL);

        // Logging the bot in
        await page.fill('input[id="email"]', EMAIL_ADDRESS)
        await page.fill('input[id="password"]', PASSWORD)
        await page.click('button[id="signin_btn"]')
        await page.goto('https://app.slack.com/client/T41DZFW4T');

        // Run /penny chat
        await page.click('[aria-label="Message #general"]')
        await page.keyboard.type('/penny chat')
        await page.screenshot({ path: `building.png` })

        await browser.close();
    }
})();