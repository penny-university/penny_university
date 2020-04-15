# Maintenance

The intent of this file is to provide instructions for maintaining the production Penny University application. This will involve things like observability (logs/stats) and data imports.

## Pull in data from forum or slack
* Pull chats and follow ups from Google Group by getting a dump of the data from https://takeout.google.com, unzipping it, and then running `cat /wherever/topics.mbox | ./manage.py import_google_forum --to_database`. To run it remotely against our Heroku app run `cat /wherever/topics.mbox | heroku run --no-tty -a <your-app> ./manage.py import_google_forum --to_database`.
* Pull users from slack (most importantly their real_name) using `./manage.py import_users_from_slack`
* As stated above, these will only run dry runs. To actually commit the data to the database, add the `--live_run` parameter.

