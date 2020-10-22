# Integration Testing

*Warning: this solution is very hacky and takes time to get running.*

## Setup

Start by going to /penny_university/tests/integration and running `yarn install`. 

While that is running, open up `penny_chat.spec.js` and begin placing in your own variables. The required ones you need to put in are:

- slackURL
- channelToSend
- botChannel

You also need to place in your cookies from a normal Slack client. 

### Cookies in Firefox

You can retrieve these cookies in Firefox by signing into your development environment, opening developer tools, and going to the storage tab. There you should find a cookies section where all values you need will be.

### Cookies in Chrome 

Log into your Slack dev workspace, click the lock to the left of the URL, click cookies, and copy the listed values into the fields for each test.

## Running

Once you have all variables + cookies adjusted, you can now run the test.

1. Open Cypress with `yarn run cypress open`.
2. Pick a browser in the top right to run the tests with (Chrome and Firefox have been proven to work).
3. Click `penny_chat.spec.js`, and the tests will automatically begin.