const moment = require('moment')

// TODO - We need to add in a QA environment Slack setup for the bot to run these tests in. These channels shouldn't change.

//https://join.slack.com/t/cpdev-group/shared_invite/zt-k9zsrjxv-KdaI5M0Xr_zb0DooIPqe4w
// When you open up a slack channel, copy paste up to this point and paste it here.
const slackURL = 'https://app.slack.com/client/T01HPDM5Z4H/'
// Put in a channel to invite here.
const channelToSend = 'penny-chat-testing'
const chatTitle = 'This is a test Penny Chat.'
const chatDescription = "Do I show up correctly?"
// Go to the chat channel with the bot and copy the last part of the url and paste it here.
const botChannel = 'D018S1Y5KSN'

// grabbing every cookie variable
const b = process.env.COOKIE_B
const ds = process.env.COOKIE_DS
const d = process.env.COOKIE_D
const ec = process.env.COOKIE_EC
const iap2 = process.env.COOKIE_IAP2
const optanonconsent = process.env.COOKIE_OPTANONCONSENT
const x = process.env.COOKIE_X

describe('/penny chat', () => {
    it('creates a new chat', () => {

        cy.setCookie('b', b)
        cy.setCookie('d-s', ds)
        cy.setCookie('d', d)
        cy.setCookie('ec', ec)
        cy.setCookie('iap2', iap2)
        cy.setCookie('OptanonConsent', optanonconsent);
        cy.setCookie('x', x)

        // TEST CODE BEGINS
        cy.visit(slackURL)
        cy.contains(channelToSend).click();
        cy.get('div.ql-editor').type('/penny chat')
        cy.get('i.c-icon--paperplane-filled').click()
        cy.get('#penny_chat_title-penny_chat_title').type(chatTitle);
        cy.get('#penny_chat_description-penny_chat_description').type(chatDescription)
        cy.get('input[aria-label="Select Channels"]').type(`${channelToSend} {enter}`, { delay: 100, force: true })
        cy.wait(1000)
        cy.get('.c-button--primary').click()
    })
    it('checks penny chat result', () => {
 
        cy.setCookie('b', b)
        cy.setCookie('d-s', ds)
        cy.setCookie('d', d)
        cy.setCookie('ec', ec)
        cy.setCookie('iap2', iap2)
        cy.setCookie('OptanonConsent', optanonconsent);
        cy.setCookie('x', x)

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