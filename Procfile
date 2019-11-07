release: python manage.py migrate

# MAKE USER TO USE `GUNICORN_CMD_ARGS="--workers=2"` in heroku configs (or whatever number you want) 
web: gunicorn penny_university.wsgi
