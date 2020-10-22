const moment = require('moment')

// YOUR VARIABLES

// When you open up a slack channel, copy paste up to this point and paste it here.
const slackURL = 'https://app.slack.com/client/T0181JE5PBJ/'
// Put in a channel to invite here.
const channelToSend = 'botspam'
const chatTitle = 'Test Title'
const chatDescription = "Let's have a chat!"
// Go to the chat channel with the bot and copy the last part of the url and paste it here.
const botChannel = 'D018S1Y5KSN'

describe('/penny chat', () => {
    it('creates a new chat', () => {

        // ------------------------
        // PUT IN YOUR COOKIES HERE
        // ------------------------
        cy.setCookie('b', '')
        cy.setCookie('d-s', '')
        cy.setCookie('d', '')
        cy.setCookie('ec', '')
        cy.setCookie('iap2', '')
        cy.setCookie('OptanonConsent', '');
        cy.setCookie('x', '')

        // TEST CODE BEGINS
        cy.visit(slackURL)
        cy.contains(channelToSend).click();
        cy.get('div.ql-editor').type('/penny chat')
        cy.get('i.c-icon--paperplane-filled').click()
        cy.get('#penny_chat_title-penny_chat_title').type(chatTitle);
        cy.get('#penny_chat_description-penny_chat_description').type(chatDescription)
        cy.get('input[aria-label="Select Channels"]').type(`${channelToSend} {enter}`, { delay: 100, force: true })
        cy.wait(100)
        cy.get('.c-button--primary').click()
    })
    it('checks penny chat result', () => {
        // ------------------------
        // PUT IN YOUR COOKIES HERE
        // ------------------------
        cy.setCookie('b', '')
        cy.setCookie('d-s', '')
        cy.setCookie('d', '')
        cy.setCookie('ec', '')
        cy.setCookie('iap2', '')
        cy.setCookie('OptanonConsent', '');
        cy.setCookie('x', '')

        cy.visit(`${slackURL}/${botChannel}`)

        // Assertions
        cy.contains(chatTitle)
        cy.contains(chatDescription)
        cy.contains('You just shared this invitation with')
        // cy.contains(whoToInvite)
        cy.contains('Edit Details')
        cy.contains(moment().format('MMMM Do'))
    })
})