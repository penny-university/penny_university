# Product Catalog
The goal of this document is to enumerate all the pieces so that we don't lose track of what we've built.

## Bot 
* Greeting flow - Upon arrival a new member is shown a text snippet about our culture and given the opportunity to fill out a form of interests. Upon filling out the form, their information will be saved to the database and will be shared in the #general channel. Code paths:
    * bot/processors/greeting.py
    * bot/management/commands/onboard_users.py - This command can be used to send the onboarding flow with all the users in Slack.
* `/penny chat` command - Allows users to schedule meetings with others. Code paths:
    * bot/processors/pennychat.py
    * bot/tasks/pennychat.py - background tasks
    
## Web App
* Home Page https://www.pennyuniversity.org/ (see home directory)
* Penny Chat Frontend (see penny_university_frontend directory)
    * For now, mostly a replacement for the google forum. This includes a place to list chats, list followups for each chat, and a capability for people to add/edit/delete content to either of these lists.

## Backend   
* Internal API (see api directory)
* Importing data from forum (pennychat/management/commands/import_google_forum.py)
* Importing users from Slack (users/management/commands/import_users_from_slack.py)
* Email Penny University members (users/management/commands/email_members.py)
* Merge two users using their email (users/management/commands/merge_users.py)
* Notify members of recent activity on chats they have participated in (users/management/commands/tests/test_notify_users_about_activity.py). Run this in the scheduler as `python manage.py notify_users_about_activity --yesterday --live_run` once a day at 9AM UTC.
* Background tasks used to perform periodic tasks that are too slow to do within a request or that are not associated with a request. (penny_university/management/commands/background_tasks.py) Run this in the scheduler as `python manage.py background_tasks --duration 600` once every 10 minutes.
* Request, review, and make matches for users to chat about a topic (matchmaking/management/commands)

## Other
* Bot framework (bot/processors/base.py) This was used to build the greeting and pennychat processors. This file should be treated as if it's a vendored import. Don't include Penny University specific things back in it.
* Automated Matching (largely in the matchmaking package). To set up, run `/penny set-topic` in slack the channels where matches should be made and then run the management command `./manage.py initialize_automated_matching --slack_team_id=<id>` in order to initiate matching for that slack team. The topic channels will be notified periodically (e.g. every couple weeks) that it's time to sign up for the next round of matches. Then a short time later the users that signed up will be matched with other users based upon their preferences. After that, if they have not set up a chat, they will be reminded once.
