# Maintenance

The intent of this file is to provide instructions for maintaining the production Penny University application. This will involve things like observability (logs/stats) and data imports.

## Pull in data from forum or slack
* Pull chats and follow ups from Google Group by getting a dump of the data from https://takeout.google.com, unzipping it, and then running `cat /wherever/topics.mbox | ./manage.py import_google_forum --to_database --live_run`. To run it remotely against our Heroku app run `cat /wherever/topics.mbox | heroku run --no-tty -a <your-app> ./manage.py import_google_forum --to_database` and then add `--live_run` when you're satisfied that the dry run is safe to apply.
* Pull users from slack (most importantly their real_name) using `SLACK_API_KEY=$SLACK_API_KEY ./manage.py import_users_from_slack` and then add `--live_run` when you're satisfied that the dry run is safe to apply. Note that if you want the users to match the forum dump then you must use the production `SLACK_API_KEY`.

## Deploy React app to QA
Our React app is a single-page application but we don't commit the contents of the generated build to git. During production deployment we "cheat" by [building the app, and committing it](https://github.com/penny-university/penny_university/blob/d0578ecd0b90499c77c8743d8926dba3de9607c6/.github/workflows/ci.yml#L95-L1100), before deploying it to production. This allows us to avoid hosting the static files elsewhere for now.

To deploy the full app to QA, you must do the same process. This is taken care of with `script/deploy_to_qa`.

## Logging Errors to Sentry
By default, the Django-Sentry plugin logs all errors that bubble up to `Internal Server Error`, so you don't have to worry about wrapping views and logging manually. However if you have a `try/except` block in your code, you should capture the exception with `capture_exception` like so:

```python
from sentry_sdk import capture_exception

try:
    a_potentially_failing_function()
except Exception as e:
    # Alternatively the argument can be omitted
    capture_exception(e)
```

View errors in sentry by running this command in your terminal `heroku addons:open sentry -a penny-university`.
