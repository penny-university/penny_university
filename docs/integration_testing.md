# Integration Testing

## Local Setup

Start by going to ./penny_university/tests/integration and running `yarn install`. This will install all the required dependencies to run the tests, primarily Cypress - the testing suite used. 

While that install is running, open up `penny_chat.spec.js` and begin placing in your own variables. The required ones you need to put in are:

- slackURL
- channelToSend
- botChannel

The existing ones in the space are setup for the `Penny U QA Environment` Slack designed for this, feel free to use this data.

You also need to place in your cookies from a normal Slack client. 

### Cookies in Firefox

You can retrieve these cookies in Firefox by signing into your development environment, opening developer tools, and going to the storage tab. There you should find a cookies section where all values you need will be. Place these cookies into the `penny_chat.spec.js` - variable `cookies`.

You only need the cookie with name `d`.
### Cookies in Chrome 

Log into your Slack dev workspace, click the lock to the left of the URL, click cookies, and copy the listed values into the fields for each test.

You only need the cookie with name `d`.
## Running

Once you have all variables + cookies adjusted, you can now run the test.

1. Open Cypress with `yarn run cypress open`.
2. Pick a browser in the top right to run the tests with (Chrome and Firefox have been proven to work).
3. Click `penny_chat.spec.js`, and the tests will automatically begin.

## Github Actions

Integration tests are currently run in a Github Action `test.yml` under the job `test-integration`. The process deploys to Heroku environment `penny-qa` and then uses Cypress's Github Action to run a headless version of the tests. This process uses Electron as a browser environment.

Tests failing due to the bot not being able to sign in? Sign in under `Test Human` with email `colin+qa@c****.me` and update the cookies in the Github Secrets. The login information for this account can be found in the document PennySecrets.