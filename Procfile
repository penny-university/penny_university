release: python manage.py migrate
web: gunicorn penny_university.wsgi
worker: python manage.py process_tasks