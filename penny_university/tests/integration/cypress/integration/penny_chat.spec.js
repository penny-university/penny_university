const moment = require('moment')

// TODO - We need to add in a QA environment Slack setup for the bot to run these tests in. These channels shouldn't change.

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
        // TODO - Make these use environment variables.
        cy.setCookie('b', '.2hbaxpq3o2lx0zdj880084ww1')
        cy.setCookie('d-s', '1603406688')
        cy.setCookie('d', 'f07%2F0UjC7lkRDeO8BoyTKB%2BTlx942uP6zgJYi49kLT4FunKPdTPGY0gEZUHRfiufEEWPvCOhMMHi1NUK920f%2B%2FIjCcBnqG3JaHBGpg7p%2BqoB4N3uXdpq1Oxr5w1pAaZiWTtIS1cFNesGA54Mb%2FXL1t6QRcV%2FReVuF1pKirQF77PGUrg1Po9Ya2yB8g%3D%3D')
        cy.setCookie('ec', 'enQtMTQwODY5NjI4MjkzMC03N2U4ODNmOWQ0NmYwMzQwN2ViZmE0MmFjZWRlNjZkYTJkMTFkMDM4ZDVjZWFkNDlkMmI3YWE0NjNmNGViNzQ2')
        cy.setCookie('iap2', 'treatment')
        cy.setCookie('OptanonConsent', 'isIABGlobal=false&datestamp=Thu+Oct+22+2020+17%3A07%3A56+GMT-0500+(Central+Daylight+Time)&version=6.7.0&hosts=&consentId=b7255c06-c6ed-45f3-8954-f19b23022267&interactionCount=1&landingPath=NotLandingPage&groups=C0004%3A0%2CC0002%3A1%2CC0003%3A1%2CC0001%3A1&AwaitingReconsent=false');
        cy.setCookie('x', '2hbaxpq3o2lx0zdj880084ww1.1603848577')

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
        // ------------------------
        // PUT IN YOUR COOKIES HERE
        // ------------------------
        cy.setCookie('b', '.2hbaxpq3o2lx0zdj880084ww1')
        cy.setCookie('d-s', '1603406688')
        cy.setCookie('d', 'f07%2F0UjC7lkRDeO8BoyTKB%2BTlx942uP6zgJYi49kLT4FunKPdTPGY0gEZUHRfiufEEWPvCOhMMHi1NUK920f%2B%2FIjCcBnqG3JaHBGpg7p%2BqoB4N3uXdpq1Oxr5w1pAaZiWTtIS1cFNesGA54Mb%2FXL1t6QRcV%2FReVuF1pKirQF77PGUrg1Po9Ya2yB8g%3D%3D')
        cy.setCookie('ec', 'enQtMTQwODY5NjI4MjkzMC03N2U4ODNmOWQ0NmYwMzQwN2ViZmE0MmFjZWRlNjZkYTJkMTFkMDM4ZDVjZWFkNDlkMmI3YWE0NjNmNGViNzQ2')
        cy.setCookie('iap2', 'treatment')
        cy.setCookie('OptanonConsent', 'isIABGlobal=false&datestamp=Thu+Oct+22+2020+17%3A07%3A56+GMT-0500+(Central+Daylight+Time)&version=6.7.0&hosts=&consentId=b7255c06-c6ed-45f3-8954-f19b23022267&interactionCount=1&landingPath=NotLandingPage&groups=C0004%3A0%2CC0002%3A1%2CC0003%3A1%2CC0001%3A1&AwaitingReconsent=false');
        cy.setCookie('x', '2hbaxpq3o2lx0zdj880084ww1.1603848577')

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