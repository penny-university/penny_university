require('dotenv').config()

// When you open up a slack channel, copy paste up to this point and paste it here.
const slackURL = 'https://app.slack.com/client/T01HPDM5Z4H/'
const channelToInvite = 'penny-chat-testing'
const chatTitle = 'This is a test Penny Chat.'
const chatDescription = "Do I show up correctly?"
const botChannelSlug = 'D01HB1CNY9H'

// Add in a user auth cookie here

const COOKIE_D = `iBbiv1a2Ixu14A7O7CeranbsfNmGX%2FcWQmzUAJSVrIASzxy6LJpkLVSzbeVrn4cztStibH7N7Ia5KAHpTvTmw%2FeoTol8LVMuJiYp7eE5ftiRdYZmIjJS8YAfJU3J9UAL%2BYbZZo3Hb0kGbq1aS2p8AOedMe7BMcp5zg78bQuHG7TNnCmvb9z2G1JowA%3D%3D`

describe('/penny chat', () => {
    it('creates a new chat', () => {
        
        cy.setCookie('d', COOKIE_D)
        
        // TEST CODE BEGINS
        cy.visit(slackURL)
        cy.contains(channelToInvite).click();
        cy.get('div.ql-editor').type('/penny chat{enter}')
        cy.get('#penny_chat_title-penny_chat_title').type(chatTitle);
        cy.get('#penny_chat_description-penny_chat_description').type(chatDescription)
        cy.get('input[aria-label="Select Channels"]').type(`${channelToInvite} {enter}`, { delay: 100, force: true })
        cy.wait(1000)
        cy.get('.c-wizard_modal__footer').click()
    })
    it('checks penny chat result', () => {
        
        cy.setCookie('d', COOKIE_D)
        
        cy.visit(`${slackURL}/${botChannelSlug}`)
        
        // Assertions
        cy.contains(chatTitle)
        cy.contains(chatDescription)
        cy.contains('You just shared this invitation with')
        cy.contains('Edit Details')
        cy.contains('Date and Time')
    })
})