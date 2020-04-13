# Product Catalog
The goal of this document is to enumerate all the pieces so that we don't lose track of what we've built.

# Bot 
* Greeting flow - Upon arrival a new member is shown a text snippet about our culture and given the opportunity to fill out a form of interests. Upon filling out the form, their information will be saved to the database and will be shared in the #general channel. Code paths:
    * bot/processors/greeting.py
    * bot/management/commands/onboard_users.py - This command can be used to send the onboarding flow with all the users in Slack.
* `/penny chat` command - Allows users to schedule meetings with others. Code paths:
    * bot/processors/pennychat.py
    * bot/tasks/pennychat.py - background tasks
    
# Web App
* Home Page https://www.pennyuniversity.org/ (see home directory)
* Penny Chat Frontend (see penny_university_frontend directory)
    * For now, mostly a replacement for the google forum. This includes a place to list chats, list followups for each chat, and a capability for people to add/edit/delete content to either of these lists.

# Backend   
* Internal API (see api directory)
* Importing data from forum (pennychat/management/commands/import_google_forum.py)
* Importing users from Slack (users/management/commands/import_users_from_slack.py)

# Other
* Bot framework (bot/processors/base.py) This was used to build the greeting and pennychat processors. This file should be treated as if it's a vendored import. Don't include Penny University specific things back in it.
