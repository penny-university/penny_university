release: python manage.py migrate
web: gunicorn penny_university.wsgi


# We also have a scheduled task to run `python manage.py process_tasks --duration 600` every 10 minutes
# this runs background tasks that are too expensive to perform during the request cycle
# see django-background-tasks documentation here https://django-background-tasks.readthedocs.io/en/latest/
# see heroku scheduler tasks here https://devcenter.heroku.com/articles/scheduler
# to edit tasks run `heroku addons:open scheduler`
