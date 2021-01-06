require('dotenv').config()

// When you open up a slack channel, copy paste up to this point and paste it here.
const slackURL = 'https://app.slack.com/client/T01HPDM5Z4H/'
const channelToInvite = 'penny-chat-testing'
const chatTitle = 'This is a test Penny Chat.'
const chatDescription = "Do I show up correctly?"
const botChannelSlug = 'D01HB1CNY9H'

// Create the cookies based off integration environment variable

const cookies = process.env.INTEGRATION;
const split_cookies = cookies.split('\n');
for (let index = 0; index < split_cookies.length; index++) {
    const element = array[index];
    let variable = element.split('=');
    eval(`var ${variable[0]} = ${variable[0]};`)
}

describe('/penny chat', () => {
    it('creates a new chat', () => {

        cy.setCookie('b', COOKIE_B)
        cy.setCookie('d-s', COOKIE_DS)
        cy.setCookie('d', COOKIE_D)
        cy.setCookie('ec', COOKIE_EC)
        cy.setCookie('iap2', COOKIE_IAP2)
        cy.setCookie('OptanonConsent', COOKIE_OPTANONCONSENT);
        cy.setCookie('x', COOKIE_X)

        // TEST CODE BEGINS
        cy.visit(slackURL)
        cy.contains(channelToInvite).click();
        cy.get('div.ql-editor').type('/penny chat')
        cy.get('i.c-icon--paperplane-filled').click()
        cy.get('#penny_chat_title-penny_chat_title').type(chatTitle);
        cy.get('#penny_chat_description-penny_chat_description').type(chatDescription)
        cy.get('input[aria-label="Select Channels"]').type(`${channelToSend} {enter}`, { delay: 100, force: true })
        cy.wait(1000)
        cy.get('.c-button--primary').click()
    })
    it('checks penny chat result', () => {
 
        cy.setCookie('b', COOKIE_B)
        cy.setCookie('d-s', COOKIE_DS)
        cy.setCookie('d', COOKIE_D)
        cy.setCookie('ec', COOKIE_EC)
        cy.setCookie('iap2', COOKIE_IAP2)
        cy.setCookie('OptanonConsent', COOKIE_OPTANONCONSENT);
        cy.setCookie('x', COOKIE_X)

        cy.visit(`${slackURL}/${botChannelSlug}`)

        // Assertions
        cy.contains(chatTitle)
        cy.contains(chatDescription)
        cy.contains('You just shared this invitation with')
        cy.contains('Edit Details')
        cy.contains('Date and Time')
    })
})